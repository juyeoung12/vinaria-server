import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' }
}, { timestamps: true }); // ✅ createdAt, updatedAt 자동 포함

export default mongoose.model('User', userSchema);
