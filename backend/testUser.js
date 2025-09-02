import mongoose from 'mongoose';
import User from './models/user.js';

const run = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/omnicular', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const userId = '689eea0a94876cb02865dcf3';
    const user = await User.findById(userId);
    console.log('User found:', user);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

run();
