const express = require('express');
const router = express.Router();
const db = require('../db');

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  next();
};

router.get('/', auth, (req, res) => {
  const { q } = req.query;
  let sql = 'SELECT c.*, u.UserName FROM Customer c JOIN Users u ON c.UserID = u.UserID';
  const params = [];
  if (q) {
    sql += ' WHERE c.FirstName LIKE ? OR c.LastName LIKE ? OR c.Email LIKE ? OR c.PhoneNumber LIKE ?';
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  sql += ' ORDER BY c.CustomerID DESC';
  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(rows);
  });
});

router.get('/:id', auth, (req, res) => {
  db.query('SELECT * FROM Customer WHERE CustomerID = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  });
});

router.post('/', auth, (req, res) => {
  const { FirstName, LastName, Email, PhoneNumber, Status } = req.body;
  if (!FirstName || !LastName || !Email || !PhoneNumber)
    return res.status(400).json({ message: 'All fields required' });

  db.query(
    'INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Status, UserID) VALUES (?,?,?,?,?,?)',
    [FirstName, LastName, Email, PhoneNumber, Status || 'Active', req.session.user.UserID],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Email already exists' });
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({ message: 'Customer created', CustomerID: result.insertId });
    }
  );
});

router.put('/:id', auth, (req, res) => {
  const { FirstName, LastName, Email, PhoneNumber, Status } = req.body;
  db.query(
    'UPDATE Customer SET FirstName=?, LastName=?, Email=?, PhoneNumber=?, Status=? WHERE CustomerID=?',
    [FirstName, LastName, Email, PhoneNumber, Status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Customer updated' });
    }
  );
});

router.delete('/:id', auth, (req, res) => {
  db.query('DELETE FROM Customer WHERE CustomerID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Customer deleted' });
  });
});

module.exports = router;
