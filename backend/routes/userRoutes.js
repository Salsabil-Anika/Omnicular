import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/user.js";

const router = express.Router();

// Multer config for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profilePictures/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Get logged-in user's profile
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

// ✅ Update user profile (name, birthday, bio)
router.put("/me", protect, async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json({ user: updatedUser }); // wrap in { user }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Upload/update profile picture
router.post("/me/profile-picture", protect, upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imagePath = `/uploads/profilePictures/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { profilePicture: imagePath }, { new: true }).select("-password");
    res.json({ user: updatedUser }); // wrap in { user }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
