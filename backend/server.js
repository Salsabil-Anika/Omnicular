const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const videoRoutes = require('./routes/videoRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();

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

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/omnicular')
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
