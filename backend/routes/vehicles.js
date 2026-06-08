const express = require('express');
const router = express.Router();
const db = require('../db');

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  next();
};

// GET all / search
router.get('/', auth, (req, res) => {
  const { q } = req.query;
  let sql = 'SELECT v.*, u.UserName FROM Vehicle v JOIN Users u ON v.UserID = u.UserID';
  const params = [];
  if (q) {
    sql += ' WHERE v.Plate_Number LIKE ? OR v.Brand LIKE ? OR v.Model LIKE ? OR v.Vehicle_Type LIKE ?';
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  sql += ' ORDER BY v.VehicleID DESC';
  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(rows);
  });
});

// GET single
router.get('/:id', auth, (req, res) => {
  db.query('SELECT * FROM Vehicle WHERE VehicleID = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  });
});

// POST create
router.post('/', auth, (req, res) => {
  const { Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status } = req.body;
  if (!Plate_Number || !Brand || !Model || !Year || !Vehicle_Type || !Purchase_Price)
    return res.status(400).json({ message: 'All fields required' });

  db.query(
    'INSERT INTO Vehicle (Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, UserID) VALUES (?,?,?,?,?,?,?,?)',
    [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status || 'Available', req.session.user.UserID],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Plate number already exists' });
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({ message: 'Vehicle created', VehicleID: result.insertId });
    }
  );
});

// PUT update
router.put('/:id', auth, (req, res) => {
  const { Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status } = req.body;
  db.query(
    'UPDATE Vehicle SET Plate_Number=?, Brand=?, Model=?, Year=?, Vehicle_Type=?, Purchase_Price=?, Status=? WHERE VehicleID=?',
    [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Vehicle updated' });
    }
  );
});

// DELETE
router.delete('/:id', auth, (req, res) => {
  db.query('DELETE FROM Vehicle WHERE VehicleID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Vehicle deleted' });
  });
});

module.exports = router;
