const Video = require('../models/videoModel');

exports.uploadVideo = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No video uploaded' });

    const videoUrl = `/uploads/${req.file.filename}`;
    const video = new Video({ title, videoUrl });
    await video.save();

    res.status(201).json(video);
  } catch (err) {
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
