const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/login');
});
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

function isLoggedIn(req, res, next) {
  if (req.session.userEmail) {
    next();
  } else {
    res.redirect('/login');
  }
}
router.get('/signup', (req, res) => {
  res.render('signup', { errors: [] });
});

router.post('/signup', async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const errors = [];

  if (password !== confirmPassword) errors.push('Passwords do not match');

  const existingUser = await User.findOne({ email });
  if (existingUser) errors.push('Email already exists');

  if (errors.length > 0) return res.render('signup', { errors });

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ email, password: hashedPassword });
  res.redirect('/login');
});


router.get('/login', (req, res) => {
  res.render('login', { errors: [] });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.render('login', { errors: ['Invalid email or password'] });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render('login', { errors: ['Invalid email or password'] });
  req.session.userEmail = user.email;
  res.redirect('/note');
});

router.get('/note', isLoggedIn, (req, res) => {
  res.render('note', { email: req.session.userEmail });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
