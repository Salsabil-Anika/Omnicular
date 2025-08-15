const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_here'; // use environment variable in production

// SIGN UP
exports.signup = async (req, res) => {
  try {
const { name, email, password } = req.body;

if (!name || !email || !password) {
  return res.status(400).json({ message: "All fields are required" });
}

const existingUser = await User.findOne({ email });
if (existingUser) return res.status(400).json({ message: "Email already registered" });

// Hash password
const passwordHash = await bcrypt.hash(password, 10);

// Save user
const user = new User({ name, email, password: passwordHash });
await user.save();

// Send token
const token = jwt.sign({ userId: user._id }, JWT_SECRET);
res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SIGN IN
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
