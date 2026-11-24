const router = require("express").Router();

const {
  getUsers,
  getUser,
  // createNewUser,
  updateExistingUser,
  removeUser,
  login,
  register,
  uploadProfileImage,
} = require("../controllers/users.controller");
const { authMiddleware, checkAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  loginLimiter,
  uploadLimiter,
} = require("../middlewares/rateLimit.middleware");

// http://localhost:8000/users/login
router.post("/login", loginLimiter, login);

router.post("/register", register);

// http://localhost:8000/users/list?name=avi
router.get("/list", authMiddleware,checkAdmin, getUsers);

router.get("/single/:id", authMiddleware, getUser);

router.put("/update/:id", authMiddleware, (req, res, next) => req.user.userId === req.params.id ? next() : res.status(403).json({ message: "Access denied" }), updateExistingUser);

router.delete("/delete/:id", authMiddleware, (req, res, next) => req.user.userId === req.params.id ? next() : res.status(403).json({ message: "Access denied" }), removeUser);

router.patch(
  "/profile-image",
  authMiddleware,
  uploadLimiter,
  upload.single("image"),
  uploadProfileImage,
);

// admin 


module.exports = router;
