import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = "your_jwt_secret_here";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // ✅ attach full user object
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
