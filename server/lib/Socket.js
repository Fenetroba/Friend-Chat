// In Socket.js
import { Server } from "socket.io";

// Store online users
const onlineUsers = new Map();

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    // When a user joins
    socket.on('user_online', (userId) => {
      onlineUsers.set(userId, {
        socketId: socket.id,
        userId,
        lastSeen: new Date()
      });
      
      // Broadcast updated online users list to all clients
      io.emit('online_users', Array.from(onlineUsers.values()));
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Find and remove the disconnected user
      for (const [userId, user] of onlineUsers.entries()) {
        if (user.socketId === socket.id) {
          onlineUsers.delete(userId);
          // Broadcast updated online users list
          io.emit('online_users', Array.from(onlineUsers.values()));
          break;
        }
      }
    });

    // Your existing socket event handlers
    socket.on("SMTS", (data) => {
      io.emit("RMTC", data);
    });
  });

  return io;
};