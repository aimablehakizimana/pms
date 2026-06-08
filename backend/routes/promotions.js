const express = require('express');
const router = express.Router();
const db = require('../db');

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  next();
};

router.get('/', auth, (req, res) => {
  const { q } = req.query;
  let sql = 'SELECT p.*, u.UserName FROM Promotion p JOIN Users u ON p.UserID = u.UserID';
  const params = [];
  if (q) {
    sql += ' WHERE p.Title LIKE ? OR p.Discount_Type LIKE ? OR p.Status LIKE ?';
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  sql += ' ORDER BY p.PromotionID DESC';
  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(rows);
  });
});

router.get('/:id', auth, (req, res) => {
  db.query('SELECT * FROM Promotion WHERE PromotionID = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  });
});

router.post('/', auth, (req, res) => {
  const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status } = req.body;
  if (!Title || !Discount_Type || !Start_Date || !End_Date)
    return res.status(400).json({ message: 'All fields required' });

  db.query(
    'INSERT INTO Promotion (Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, UserID) VALUES (?,?,?,?,?,?,?,?)',
    [Title, Description, Discount_Type, Discount_Value || 0, Start_Date, End_Date, Status || 'Active', req.session.user.UserID],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.status(201).json({ message: 'Promotion created', PromotionID: result.insertId });
    }
  );
});

router.put('/:id', auth, (req, res) => {
  const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status } = req.body;
  db.query(
    'UPDATE Promotion SET Title=?, Description=?, Discount_Type=?, Discount_Value=?, Start_Date=?, End_Date=?, Status=? WHERE PromotionID=?',
    [Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Promotion updated' });
    }
  );
});

router.delete('/:id', auth, (req, res) => {
  db.query('DELETE FROM Promotion WHERE PromotionID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Promotion deleted' });
  });
});

module.exports = router;
