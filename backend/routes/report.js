const express = require('express');
const router = express.Router();
const db = require('../db');

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  next();
};

// Summary stats for dashboard — must be BEFORE '/' to avoid shadowing
router.get('/stats', auth, (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM Vehicle) AS totalVehicles,
      (SELECT COUNT(*) FROM Customer) AS totalCustomers,
      (SELECT COUNT(*) FROM Promotion WHERE Status='Active') AS activePromotions,
      (SELECT COUNT(*) FROM Promotion_Vehicle) AS linkedVehicles
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(rows[0]);
  });
});

// Full promotion report
router.get('/', auth, (req, res) => {
  const { q } = req.query;
  let sql = `
    SELECT
      c.CustomerID,
      CONCAT(c.FirstName, ' ', c.LastName) AS CustomerName,
      c.Email,
      c.PhoneNumber,
      c.Status AS CustomerStatus,
      v.VehicleID,
      v.Brand AS VehicleBrand,
      v.Model AS VehicleModel,
      v.Plate_Number,
      v.Vehicle_Type,
      v.Status AS VehicleStatus,
      p.PromotionID,
      p.Title AS PromotionTitle,
      p.Discount_Type,
      p.Discount_Value,
      p.Start_Date,
      p.End_Date,
      p.Status AS PromotionStatus,
      pv.Performance
    FROM Customer c
    CROSS JOIN Promotion_Vehicle pv
    JOIN Vehicle v ON pv.VehicleID = v.VehicleID
    JOIN Promotion p ON pv.PromotionID = p.PromotionID
  `;
  const params = [];
  if (q) {
    sql += ` WHERE CONCAT(c.FirstName,' ',c.LastName) LIKE ? OR v.Brand LIKE ? OR v.Model LIKE ? OR p.Title LIKE ?`;
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  sql += ' ORDER BY p.PromotionID DESC, c.CustomerID ASC';

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    res.json(rows);
  });
});

module.exports = router;
