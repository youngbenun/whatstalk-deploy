const chat = require('../services/chat.service');
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
exports.users = wrap(async (req, res) => {
  const User = require('../models/user.model');
  res.json(await User.find({ _id: { $ne: req.user.userId } }).select('name email profileImage').sort({ name: 1 }));
});
exports.list = wrap(async (req, res) => res.json(await chat.list(req.user.userId)));
exports.direct = wrap(async (req, res) => {
  const conversation = await chat.direct(req.user.userId, req.body.userId);
  req.app.get('io').to(`user:${req.body.userId}`).emit('conversation:updated', conversation);
  res.json(conversation);
});
exports.group = wrap(async (req, res) => {
  const conversation = await chat.group(req.user.userId, req.body.name, req.body.memberIds);
  for (const member of conversation.members) req.app.get('io').to(`user:${member._id}`).emit('conversation:updated', conversation);
  res.status(201).json(conversation);
});
exports.addMember = wrap(async (req, res) => {
  const conversation = await chat.addMember(req.params.id, req.user.userId, req.body.userId);
  for (const member of conversation.members) req.app.get('io').to(`user:${member._id}`).emit('conversation:updated', conversation);
  res.json(conversation);
});
exports.history = wrap(async (req, res) => res.json(await chat.history(req.params.id, req.user.userId)));
