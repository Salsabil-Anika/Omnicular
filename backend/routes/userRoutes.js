import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { 
    getCurrentUser, 
    getUserById, 
    updateUserProfile, 
    uploadProfilePicture 
} from "../controllers/userController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profilePictures/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


router.get("/me", protect, getCurrentUser);
router.get("/:id", getUserById);
router.put("/me", protect, updateUserProfile);
router.post("/me/profile-picture", protect, upload.single("profilePicture"), uploadProfilePicture);

export default router;
