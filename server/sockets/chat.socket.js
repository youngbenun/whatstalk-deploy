const jwt = require('jsonwebtoken');
const chat = require('../services/chat.service');
const User = require('../models/user.model');
module.exports = io => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token || !process.env.SECRET_KEY) throw new Error('Authentication required');
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!await User.exists({ _id: decoded.userId })) throw new Error('User not found');
      socket.userId = String(decoded.userId);
      next();
    } catch { next(new Error('Authentication required')); }
  });
  io.on('connection', socket => {
    socket.join(`user:${socket.userId}`);
    socket.on('message:send', async (payload, ack) => {
      try {
        const { message, members } = await chat.send(payload?.conversationId, socket.userId, payload?.text);
        for (const member of members) {
          io.to(`user:${member}`).emit('message:new', message);
          io.to(`user:${member}`).emit('conversation:refresh');
        }
        ack?.({ ok: true, message });
      } catch (error) { ack?.({ ok: false, error: error.message }); }
    });
  });
};
