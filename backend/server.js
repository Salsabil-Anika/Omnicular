// server.js (ESM version)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import videoRoutes from './routes/videoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS setup
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static("uploads"));


// MongoDB connection

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/omnicular', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));


// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
