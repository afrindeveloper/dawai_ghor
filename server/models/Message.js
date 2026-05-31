import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false }
});

export const Message = mongoose.model('Message', messageSchema);
