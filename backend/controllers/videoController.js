const Video = require('../models/videoModel');
const fs = require('fs'); // Node.js module to interact with the file system
const path = require('path'); // Node.js module to handle file paths

exports.uploadVideo = async (req, res) => {
  try {
    console.log('Uploaded file:', req.file);  // Should print file info

    const { title } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No video uploaded' });

    const videoUrl = `/uploads/${req.file.filename}`;
    const video = new Video({ title, videoUrl });

    await video.save();
    console.log('Video saved to DB:', video);

    res.status(201).json(video);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
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
