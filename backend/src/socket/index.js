import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map(); // {userId: socketId}

io.on("connection", async (socket) => {
  const user = socket.user;

  // console.log(`${user.displayName} online với socket ${socket.id}`);

  onlineUsers.set(user._id.toString(), socket.id);

  io.emit("online-users", Array.from(onlineUsers.keys()));

  const conversationIds = await getUserConversationsForSocketIO(user._id);
  conversationIds.forEach((id) => {
    socket.join(id);
  });

  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.join(user._id.toString());

  // ============ CALL EVENTS ============
  socket.on("call-user", ({ userToCall, signal, from, type }) => {
    console.log("📞 Call from", from, "to", userToCall, "type:", type);
    const receiverSocketId = onlineUsers.get(userToCall);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", {
        from,
        signal,
        type,
      });
      console.log("✅ Incoming call sent to", userToCall);
    } else {
      console.log("❌ User not online:", userToCall);
    }
  });

  socket.on("answer-call", ({ signal, to }) => {
    console.log("📞 Call answered, sending to", to);
    const callerSocketId = onlineUsers.get(to);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit("call-answered", { signal });
      console.log("✅ Answer sent to", to);
    }
  });

  socket.on("end-call", (data) => {
    console.log("📞 Call ended by", user._id);
    
    if (data?.to) {
      const targetSocketId = onlineUsers.get(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-ended");
      }
    }
    
    // Broadcast to all sockets of this user (in case multiple tabs)
    socket.broadcast.emit("call-ended");
  });
  // ====================================

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id.toString());
    io.emit("online-users", Array.from(onlineUsers.keys()));
    /* console.log(`socket disconnected: ${socket.id}`); */
  });
});

export { io, app, server };