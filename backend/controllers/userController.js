import User from "../models/user.js";
import Video from "../models/videoModel.js";
import { asyncHandler } from '../middleware/errorHandler.js';

// Get own profile
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

// Get other's profile
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Get uploaded videos
  const videos = await Video.find({ uploadedBy: req.params.id })
    .sort({ createdAt: -1 })
    .populate('uploadedBy', 'name');

  // Get liked videos
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
});

// Edit profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
  res.json({ user: updatedUser });
});

// Upload profile picture
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const imagePath = `/uploads/profilePictures/${req.file.filename}`;
  const updatedUser = await User.findByIdAndUpdate(req.user._id, { profilePicture: imagePath }, { new: true }).select("-password");
  res.json({ user: updatedUser });
});
