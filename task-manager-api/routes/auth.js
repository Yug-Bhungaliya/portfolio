const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateBody } = require('../middleware/validate');

const router = express.Router();
const credentialsValidation = validateBody({
  required: ['email', 'password'],
  validate: body => {
    const errors = [];
    if (typeof body.email !== 'string' || !/^\S+@\S+\.\S+$/.test(body.email)) errors.push('email must be valid');
    if (typeof body.password !== 'string' || body.password.length < 6) errors.push('password must be at least 6 characters');
    return errors;
  }
});

function createToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

router.post('/register', credentialsValidation, async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email is already registered' });

    const password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ email, password });
    res.status(201).json({ id: user._id, email: user.email, token: createToken(user) });
  } catch (err) { next(err); }
});

router.post('/login', credentialsValidation, async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email });
    const isMatch = user && await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });
    res.status(200).json({ id: user._id, email: user.email, token: createToken(user) });
  } catch (err) { next(err); }
});

module.exports = router;