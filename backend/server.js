require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('./db');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/promotion-vehicles', require('./routes/promotionVehicles'));
app.use('/api/report', require('./routes/report'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`PMS Server running on port ${PORT}`));
