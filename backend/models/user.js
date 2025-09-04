import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  birthday: { type: Date },
  bio: { type: String },
  likedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  dislikedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

const User = mongoose.model("User", userSchema);
export default User;
