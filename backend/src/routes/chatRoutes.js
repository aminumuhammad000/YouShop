const express = require('express');
const router = express.Router();
const { getChats, getChatById, sendMessage, createChat } = require('../controllers/chatController');

router.route('/').get(getChats).post(createChat);
router.route('/:id').get(getChatById);
router.route('/:id/messages').post(sendMessage);

module.exports = router;
