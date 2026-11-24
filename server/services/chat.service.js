const mongoose = require("mongoose");
const User = require("../models/user.model");
const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const bad = (message, status = 400) =>
  Object.assign(new Error(message), { status });
const validId = (id) => mongoose.isValidObjectId(id);
const populate = (q) =>
  q
    .populate("members", "name email profileImage")
    .populate({ path: "lastMessage", select: "text sender createdAt" });
async function memberConversation(id, userId) {
  if (!validId(id)) throw bad("Invalid conversation", 400);
  const conversation = await Conversation.findOne({ _id: id, members: userId });
  if (!conversation) throw bad("Conversation not found", 404);
  return conversation;
}
async function list(userId) {
  return populate(
    Conversation.find({ members: userId }).sort({ updatedAt: -1 }),
  );
}
async function direct(userId, otherId) {
  if (!validId(otherId) || String(userId) === String(otherId))
    throw bad("Choose another user");
  if (!(await User.exists({ _id: otherId }))) throw bad("User not found", 404);
  let conversation = await Conversation.findOne({
    type: "direct",
    members: { $all: [userId, otherId], $size: 2 },
  });
  if (!conversation)
    conversation = await Conversation.create({
      type: "direct",
      members: [userId, otherId],
      createdBy: userId,
    });
  return populate(Conversation.findById(conversation._id));
}
async function group(userId, name, memberIds) {
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 80 ||
    !Array.isArray(memberIds) ||
    memberIds.length > 50
  )
    throw bad("Group name and members are required");
  const ids = [...new Set([String(userId), ...memberIds])];
  if (ids.length < 2 || ids.some((id) => !validId(id)))
    throw bad("Choose at least one valid member");
  if ((await User.countDocuments({ _id: { $in: ids } })) !== ids.length)
    throw bad("One or more users do not exist");
  const conversation = await Conversation.create({
    type: "group",
    name: name.trim(),
    members: ids,
    createdBy: userId,
  });
  return populate(Conversation.findById(conversation._id));
}
async function addMember(conversationId, userId, newId) {
  const conversation = await memberConversation(conversationId, userId);
  if (
    conversation.type !== "group" ||
    String(conversation.createdBy) !== String(userId)
  )
    throw bad("Only the group creator can add members", 403);
  if (!validId(newId) || !(await User.exists({ _id: newId })))
    throw bad("User not found", 404);
  await Conversation.updateOne(
    { _id: conversationId },
    { $addToSet: { members: newId } },
  );
  return populate(Conversation.findById(conversationId));
}
async function history(id, userId) {
  await memberConversation(id, userId);
  const messages = await Message.find({ conversation: id })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("sender", "name profileImage");
  return messages.reverse();
}
async function send(id, userId, text) {
  const conversation = await memberConversation(id, userId);
  if (typeof text !== "string" || !text.trim() || text.length > 2000)
    throw bad("Message must contain 1–2000 characters");
  const message = await Message.create({
    conversation: id,
    sender: userId,
    text: text.trim(),
  });
  await Conversation.updateOne(
    { _id: id },
    { lastMessage: message._id, updatedAt: new Date() },
  );
  await message.populate("sender", "name profileImage");
  return { message, members: conversation.members };
}
module.exports = {
  list,
  direct,
  group,
  addMember,
  history,
  send,
  memberConversation,
};
