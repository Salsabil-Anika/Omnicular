// videoRoutes.js (ESM)
import express from 'express';
import multer from 'multer';
import path from 'path';
import Video from '../models/videoModel.js';
import User from '../models/user.js';
import { uploadVideo, updateVideo, deleteVideo } from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Upload video (attach user)
router.post('/', protect, upload.single('video'), uploadVideo);

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name'); // populate only name
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Search videos
router.get('/search', async (req, res) => {
  const query = req.query.query || '';
  try {
    const videos = await Video.find({
      $or: [
        { title: { $regex: '^' + query, $options: 'i' } },
        { description: { $regex: '^' + query, $options: 'i' } }
      ]
    });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get logged-in user's videos
router.get('/my-videos', protect, async (req, res) => {
  try {
    const videos = await Video.find({ uploadedBy: req.userId || (req.user && req.user._id) }).populate('uploadedBy', 'name');
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get user's liked videos
router.get('/liked-videos', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId || (req.user && req.user._id)).populate('likedVideos');
    res.json(user.likedVideos || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Like/Dislike video
router.post('/:id/like', protect, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.userId || (req.user && req.user._id);
    const { action } = req.body; // 'like' or 'dislike'

    const video = await Video.findById(videoId);
    const user = await User.findById(userId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (action === 'like') {
      // Remove from dislikes if exists
      video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
      user.dislikedVideos = user.dislikedVideos.filter(id => id.toString() !== videoId);

      // Toggle like
      const likeIndex = video.likes.indexOf(userId);
      if (likeIndex > -1) {
        video.likes.splice(likeIndex, 1);
        user.likedVideos = user.likedVideos.filter(id => id.toString() !== videoId);
      } else {
        video.likes.push(userId);
        user.likedVideos.push(videoId);
      }
    } else if (action === 'dislike') {
      // Remove from likes if exists
      video.likes = video.likes.filter(id => id.toString() !== userId);
      user.likedVideos = user.likedVideos.filter(id => id.toString() !== videoId);

      // Toggle dislike
      const dislikeIndex = video.dislikes.indexOf(userId);
      if (dislikeIndex > -1) {
        video.dislikes.splice(dislikeIndex, 1);
        user.dislikedVideos = user.dislikedVideos.filter(id => id.toString() !== videoId);
      } else {
        video.dislikes.push(userId);
        user.dislikedVideos.push(videoId);
      }
    }

    await video.save();
    await user.save();

    res.json({
      likes: video.likes.length,
      dislikes: video.dislikes.length,
      userLiked: video.likes.includes(userId),
      userDisliked: video.dislikes.includes(userId)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.userId || (req.user && req.user._id);
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const user = await User.findById(userId);
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = {
      user: userId,
      text: text.trim(),
      username: user.name,
      userProfilePicture: user.profilePicture
    };

    video.comments.push(comment);
    await video.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get video with interactions
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploadedBy', 'name profilePicture')
      .populate('comments.user', 'name profilePicture');
    
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    // Increment views
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

export default router;
