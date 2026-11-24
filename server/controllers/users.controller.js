const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  getAllUsersByQuery,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../services/users.service");
const userService = require("../services/users.service");
const { validateUser } = require("../validators/user.validator");
const { uploadImageBuffer } = require("../services/upload.service");

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key_here";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userService.findByEmail(email);

    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const error = validateUser(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const result = await userService.createUser({
      ...req.body,
      role: "user",
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.userCreated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsersByQuery(req.query);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateExistingUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeUser = async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const uploadedImage = await uploadImageBuffer(req.file.buffer);
    const user = await userService.updateProfileImage(req.user.userId, {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  getUsers,
  getUser,
  register,
  updateExistingUser,
  removeUser,
  uploadProfileImage,
};
