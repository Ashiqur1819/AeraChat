import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRouter.js";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" }
});

// Store online users { userId: socketId }
export const userSocketMap = {};

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) return;

  console.log("User connected:", userId);

  // Add user to online map
  userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);

    if (userSocketMap[userId]) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

/* ================= MIDDLEWARE ================= */
app.use(express.json({ limit: "4mb" }));
app.use(cors());

/* ================= ROUTES ================= */
app.get("/api/status", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

/* ================= DATABASE ================= */
await connectDB();

/* ================= SERVER LISTEN ================= */
server.listen(PORT, () => {
  console.log(`Server is running successfully on port: ${PORT}`);
});
