import Video from '../models/videoModel.js';
import User from '../models/user.js';
import fs from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url';
import { asyncHandler } from '../middleware/errorHandler.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadVideo = asyncHandler(async (req, res) => {
        if (!req.file) return res.status(400).json({ message: 'No video uploaded' });
        if (!req.userId) return res.status(401).json({ message: 'User not authenticated' });

        const { title, description } = req.body;

        const video = new Video({
            title,
            description,
            videoUrl: '/uploads/' + req.file.filename,
            uploadedBy: req.userId, 
        });

        await video.save();
        await video.populate('uploadedBy', 'name');

        res.status(201).json(video); 
});

export const getAllVideos = asyncHandler(async (req, res) => {
        const videos = await Video.find()
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'name'); 
        res.json(videos);
});

//edit video details
export const updateVideo = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.userId || (req.user && req.user._id);

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
});

export const deleteVideo = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const userId = req.userId || (req.user && req.user._id);

        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        if (video.uploadedBy.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this video' });
        }

        // Delete video
        const filePath = path.join(__dirname, '..', video.videoUrl);
        fs.unlink(filePath, (err) => {
            if (err) console.warn('File not found or already deleted.');
        });

        await video.deleteOne();
        res.status(200).json({ message: 'Video deleted successfully' });
});

export const searchVideos = asyncHandler(async (req, res) => {
    const query = req.query.query || '';
    const videos = await Video.find({
        $or: [
            { title: { $regex: '^' + query, $options: 'i' } },
            { description: { $regex: '^' + query, $options: 'i' } }
        ]
    })
    .sort({ createdAt: -1 })
    .populate('uploadedBy', 'name');
    
    res.json(videos);
});

export const getUserVideos = asyncHandler(async (req, res) => {
    const userId = req.userId || (req.user && req.user._id);
    const videos = await Video.find({ uploadedBy: userId })
        .sort({ createdAt: -1 })
        .populate('uploadedBy', 'name');
    res.json(videos);
});

export const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.userId || (req.user && req.user._id);
    const user = await User.findById(userId).populate('likedVideos');
    res.json(user.likedVideos || []);
});

export const likeVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.id;
    const userId = req.userId || (req.user && req.user._id);
    const { action } = req.body; // like/dislike

    const video = await Video.findById(videoId);
    const user = await User.findById(userId);

    if (!video) {
        return res.status(404).json({ message: 'Video not found' });
    }

    if (action === 'like') {
        video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
        user.dislikedVideos = user.dislikedVideos.filter(id => id.toString() !== videoId);

        const likeIndex = video.likes.indexOf(userId);
        if (likeIndex > -1) {
            video.likes.splice(likeIndex, 1);
            user.likedVideos = user.likedVideos.filter(id => id.toString() !== videoId);
        } else {
            video.likes.push(userId);
            user.likedVideos.push(videoId);
        }
    } else if (action === 'dislike') {
        // Remove from likes 
        video.likes = video.likes.filter(id => id.toString() !== userId);
        user.likedVideos = user.likedVideos.filter(id => id.toString() !== videoId);

        //dislike
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
});

export const addComment = asyncHandler(async (req, res) => {
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
});

export const getVideoById = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id)
        .populate('uploadedBy', 'name profilePicture')
        .populate('comments.user', 'name profilePicture');
    
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    // Increment views
    video.views += 1;
    await video.save();
    
    res.json(video);
});