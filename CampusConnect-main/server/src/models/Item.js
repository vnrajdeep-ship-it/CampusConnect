import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  status: { type: String, enum: ['open', 'claimed', 'closed'], default: 'open' },
  contact: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
