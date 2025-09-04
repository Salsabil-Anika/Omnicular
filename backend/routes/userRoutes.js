import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import Video from "../models/videoModel.js";

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

// ✅ Get user profile by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's uploaded videos
    const videos = await Video.find({ uploadedBy: req.params.id })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');

    // Get user's liked videos
    const likedVideos = await Video.find({ _id: { $in: user.likedVideos } })
      .populate('uploadedBy', 'name');

    res.json({
      user,
      videos: videos || [],
      likedVideos: likedVideos || [],
      stats: {
        uploadedCount: videos.length,
        likedCount: likedVideos.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
