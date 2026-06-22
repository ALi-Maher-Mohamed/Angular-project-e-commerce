const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const user = await User.create({ username, password, role: role || 'Customer' });
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username, password, role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { sub: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    );
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
