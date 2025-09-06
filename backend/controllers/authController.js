import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from '../middleware/errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

// SIGNUP
export const signup = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;
  if (email) email = email.trim().toLowerCase();
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Email already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// SIGNIN
export const signin = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  if (email) email = email.trim().toLowerCase();
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});
