const express = require('express');
const router = express.Router();
const db = require('../db');

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  next();
};

// Get all vehicles linked to a promotion
router.get('/:promotionId', auth, (req, res) => {
  const sql = `
    SELECT pv.ID, pv.Performance, v.VehicleID, v.Plate_Number, v.Brand, v.Model, v.Year, v.Vehicle_Type, v.Status
    FROM Promotion_Vehicle pv
    JOIN Vehicle v ON pv.VehicleID = v.VehicleID
    WHERE pv.PromotionID = ?
  `;
  db.query(sql, [req.params.promotionId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(rows);
  });
});

// Link a vehicle to a promotion
router.post('/', auth, (req, res) => {
  const { PromotionID, VehicleID, Performance } = req.body;
  if (!PromotionID || !VehicleID) return res.status(400).json({ message: 'PromotionID and VehicleID required' });

  db.query(
    'INSERT INTO Promotion_Vehicle (PromotionID, VehicleID, Performance) VALUES (?,?,?)',
    [PromotionID, VehicleID, Performance || null],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Vehicle already linked to this promotion' });
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({ message: 'Vehicle linked to promotion', ID: result.insertId });
    }
  );
});

// Update performance note
router.put('/:id', auth, (req, res) => {
  const { Performance } = req.body;
  db.query('UPDATE Promotion_Vehicle SET Performance=? WHERE ID=?', [Performance, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Performance updated' });
  });
});

// Unlink a vehicle from a promotion
router.delete('/:id', auth, (req, res) => {
  db.query('DELETE FROM Promotion_Vehicle WHERE ID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Vehicle unlinked from promotion' });
  });
});

module.exports = router;
