const User = require("../models/user.model");

const getAllUsersByQuery = async (query) => {
  const filter = {};

  if (query.name) {
    filter.name = { $regex: query.name, $options: "i" };
  }

  if (query.email) {
    filter.email = { $regex: query.email, $options: "i" };
  }

  return User.find(filter).select("-password").sort({ createdAt: -1 });
};

const getUserById = async (id) => {
  return User.findById(id).select("-password");
};

const createUser = async (userData) => {
  const userCreated = await User.create(userData);
  const userObject = userCreated.toObject();
  delete userObject.password;

  return {
    userCreated: userObject,
    message: "User created successfully",
  };
};

const updateUser = async (id, userData) => {
  const { name, age, phone, city } = userData;
  userData = { name, age, phone, city };

  return User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id).select("-password");
};

const findByEmail = async (email) => {
  return User.findOne({ email: email.toLowerCase() });
};

const updateProfileImage = async (userId, imageData) => {
  return User.findByIdAndUpdate(
    userId,
    {
      profileImage: imageData.url,
      profileImagePublicId: imageData.publicId,
    },
    { new: true, runValidators: true },
  ).select("-password");
};

module.exports = {
  getAllUsersByQuery,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  findByEmail,
  updateProfileImage,
};
