const Video = require('../models/videoModel');
const fs = require('fs'); // Node.js module to interact with the file system
const path = require('path'); // Node.js module to handle file paths

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No video uploaded' });
    if (!req.userId) return res.status(401).json({ message: 'User not authenticated' });

    const { title, description } = req.body;

    // Create video and attach uploader
    const video = new Video({
      title,
      description,
      videoUrl: '/uploads/' + req.file.filename,
      uploadedBy: req.userId, // attach user ID
    });

    await video.save();

    // Populate uploadedBy with the user's name before sending response
    await video.populate('uploadedBy', 'name');

    res.status(201).json(video); // return the video with uploader's name
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name'); // ✅ populate uploader name
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updatedVideo = await Video.findByIdAndUpdate(id, { title }, { new: true });
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '..', video.videoUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.warn('File not found or already deleted.');
    });

    await video.deleteOne();
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
