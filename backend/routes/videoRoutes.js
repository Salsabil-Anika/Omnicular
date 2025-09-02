// videoRoutes.js (ESM)
import express from 'express';
import multer from 'multer';
import path from 'path';
import Video from '../models/videoModel.js';
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

// ✅ GET video by ID (dynamic route, must come last among GETs)
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

export default router;
