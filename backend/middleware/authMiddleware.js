import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = "your_jwt_secret_here";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
    console.log("Type of userId:", typeof decoded.userId); // ✅ check this

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    req.userId = user._id; // ensure downstream routes have userId
    next();
  } catch (err) {
    console.log("Middleware error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
