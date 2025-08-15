const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const videoRoutes = require('./routes/videoRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/omnicular')
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);
app.use('/videos', videoRoutes);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.listen(5000, () => console.log('Server running on port 5000'));
