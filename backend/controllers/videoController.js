import Video from '../models/videoModel.js';
import fs from 'fs'; // Node.js module to interact with the file system
import path from 'path'; // Node.js module to handle file paths
import { fileURLToPath } from 'url';

// __dirname is not available in ES Modules, so we polyfill it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadVideo = async (req, res) => {
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

export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find()
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'name'); // ✅ populate uploader name
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.userId || (req.user && req.user._id);

        // Check if video exists and user owns it
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        if (video.uploadedBy.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to edit this video' });
        }

        const updatedVideo = await Video.findByIdAndUpdate(
            id, 
            { title, description }, 
            { new: true }
        ).populate('uploadedBy', 'name');

        res.json(updatedVideo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId || (req.user && req.user._id);

        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        // Check if user owns the video
        if (video.uploadedBy.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this video' });
        }

        // Delete the video file
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
