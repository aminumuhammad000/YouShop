const asyncHandler = require('express-async-handler');
const RealChat = require('../models/Chat');
const { MockChat } = require('../models/mockDb');

const getChatModel = () => {
  return global.isMockDB ? MockChat : RealChat;
};

const getChats = asyncHandler(async (req, res) => {
  const chats = await getChatModel().find({});
  res.json(chats);
});

const getChatById = asyncHandler(async (req, res) => {
  const chat = await getChatModel().findById(req.params.id);
  if (chat) {
    res.json(chat);
  } else {
    res.status(404);
    throw new Error('Chat not found');
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { text, fromMe, attachment, type, isVoice, duration } = req.body;
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const timeStr = `${hours}:${minutes} ${ampm}`;

  const message = {
    fromMe: fromMe !== undefined ? fromMe : true,
    text: text || '',
    attachment: attachment || null,
    type: type || (attachment ? 'attachment' : 'text'),
    isVoice: !!isVoice,
    duration: duration || null,
    time: timeStr,
    timestamp: now,
  };

  const chat = await getChatModel().addMessage(req.params.id, message);
  if (chat) {
    res.status(201).json(message);
  } else {
    res.status(404);
    throw new Error('Chat not found');
  }
});

const createChat = asyncHandler(async (req, res) => {
  const { name, phone, orderNumber, deliveryAddress, role, avatarColor } = req.body;
  const newChat = {
    name: name || 'Customer',
    phone: phone || '',
    orderNumber: orderNumber || '',
    deliveryAddress: deliveryAddress || '',
    role: role || 'Customer',
    avatarColor: avatarColor || '#8B5CF6',
    online: true,
    unread: 0,
    messages: [],
    lastMessage: 'Conversation started',
    lastMessageTime: new Date().toISOString(),
  };

  const model = getChatModel();
  let created = null;
  if (typeof model.create === 'function') {
    created = await model.create(newChat);
  }
  res.status(201).json(created || newChat);
});

module.exports = { getChats, getChatById, sendMessage, createChat };

