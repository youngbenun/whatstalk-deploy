require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const attachChat = require("./sockets/chat.socket");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middlewares/rateLimit.middleware");

const usersRoutes = require("./routes/users.routes");

const app = express();

// Deployment: Render יושב מאחורי proxy. בלי זה ה-rate limit רואה לכל המשתמשים אותה כתובת
app.set("trust proxy", 1);

// CORS: מאיזה אתר מותר לפנות לשרת. כמה כתובות מופרדות בפסיק
// לדוגמה: CLIENT_ORIGIN=http://localhost:5173,https://whatstalk.netlify.app
const origin = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",");
app.use(cors({ origin }));
app.use(helmet());
app.use(apiLimiter);
app.use(express.json());
// app.use(logger);

app.use("/users", usersRoutes);
app.use("/chat", require("./routes/chat.routes"));
// Health check: Render ו-UptimeRobot בודקים שהשרת חי
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server Running with MongoDB",
  });
});


app.use((error, req, res, next) => {
  if (error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: error.code === "LIMIT_FILE_SIZE"
        ? "Image must be smaller than 5MB"
        : error.message,
    });
  }

  if (error.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.status ? error.message : "Server error" });
});
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin } });
app.set('io', io);
attachChat(io);
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
