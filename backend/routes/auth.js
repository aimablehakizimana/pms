const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

router.post('/login', (req, res) => {
  const { UserName, Password } = req.body;
  if (!UserName || !Password) return res.status(400).json({ message: 'All fields required' });

  db.query('SELECT * FROM Users WHERE UserName = ?', [UserName], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const valid = await bcrypt.compare(Password, user.Password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = { UserID: user.UserID, UserName: user.UserName, Role: user.Role };
    res.json({ message: 'Login successful', user: req.session.user });
  });
});

router.post('/register', async (req, res) => {
  const { UserName, Password, Role } = req.body;
  if (!UserName || !Password) return res.status(400).json({ message: 'All fields required' });

  const hashed = await bcrypt.hash(Password, 10);
  const role = Role || 'Staff';
  db.query('INSERT INTO Users (UserName, Password, Role) VALUES (?, ?, ?)', [UserName, hashed, role], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Username already exists' });
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({ message: 'User created successfully' });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json(req.session.user);
});

module.exports = router;
