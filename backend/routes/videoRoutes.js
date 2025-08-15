const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/videoModel');
const { uploadVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const auth = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Upload video (attach user)
router.post('/', auth, upload.single('video'), uploadVideo);

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

// ✅ Get logged-in user's videos (ONLY ONE ROUTE)
router.get('/my-videos', auth, async (req, res) => {
  try {
    const videos = await Video.find({ uploadedBy: req.userId }).populate('uploadedBy', 'name');
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

module.exports = router;
