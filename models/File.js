import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String },
  category: { type: String },
  type: { type: String },
  date: { type: Date, default: Date.now },
  uploader: { type: String }
});

export default mongoose.model('File', fileSchema);
