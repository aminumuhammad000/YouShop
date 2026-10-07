const mongoose = require('mongoose');

const chatSchema = mongoose.Schema(
  {
    participants: [String],
    name: { type: String, required: true },
    avatarColor: { type: String, default: '#1F2937' },
    lastMessage: { type: String, default: '' },
    lastMessageTime: { type: Date, default: Date.now },
    unread: { type: Number, default: 0 },
    messages: [
      {
        fromMe: { type: Boolean, default: true },
        text: String,
        isVoice: { type: Boolean, default: false },
        duration: String,
        time: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
