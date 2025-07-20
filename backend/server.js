const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/videos', videoRoutes);

mongoose.connect('mongodb://localhost:27017/omnicular')
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

app.listen(5000, () => console.log('Server running on port 5000'));
