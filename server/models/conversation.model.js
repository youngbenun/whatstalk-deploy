const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  type: { type: String, enum: ['direct', 'group'], required: true },
  name: { type: String, trim: true, maxlength: 80 },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
}, { timestamps: true });
schema.index({ members: 1, updatedAt: -1 });
module.exports = mongoose.model('Conversation', schema);
