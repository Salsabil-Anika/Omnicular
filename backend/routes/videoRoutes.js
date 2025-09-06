import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
    uploadVideo, 
    getAllVideos, 
    updateVideo, 
    deleteVideo, 
    searchVideos, 
    getUserVideos, 
    getLikedVideos, 
    likeVideo, 
    addComment, 
    getVideoById 
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', protect, upload.single('video'), uploadVideo);
router.get('/', getAllVideos);
router.get('/search', searchVideos);
router.get('/my-videos', protect, getUserVideos);
router.get('/liked-videos', protect, getLikedVideos);
router.post('/:id/like', protect, likeVideo);
router.post('/:id/comment', protect, addComment);
router.get('/:id', getVideoById);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);

export default router;
