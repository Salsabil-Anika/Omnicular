const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');

// Route to register a new user
router.post('/signup', signup);

// Route to login an existing user
router.post('/signin', signin);

module.exports = router;
