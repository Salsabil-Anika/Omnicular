const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadVideo, getAllVideos, updateVideo } = require('../controllers/videoController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', upload.single('video'), uploadVideo);
router.get('/', getAllVideos);
router.put('/:id', updateVideo);

module.exports = router;
