import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId] || null;
}

// Track connected users
const onlineUsers = new Set();
const userSocketMap = {}; // Changed from Map to plain object for consistency

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("setup", (userId) => {
        socket.join(userId);
        socket.userId = userId;
        userSocketMap[userId] = socket.id; // <-- Map userId to socket.id
        onlineUsers.add(userId);
        console.log("User setup completed:", userId);
        io.emit("getOnlineUsers", Array.from(onlineUsers));
    });

    socket.on("disconnect", () => {
        if (socket.userId) {
            socket.leave(socket.userId);
            delete userSocketMap[socket.userId]; // <-- Clean up mapping
            onlineUsers.delete(socket.userId);
            io.emit("getOnlineUsers", Array.from(onlineUsers));
        }
    });

    socket.on("logout", () => {
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
            delete userSocketMap[socket.userId]; // <-- Clean up mapping
            io.emit("getOnlineUsers", Array.from(onlineUsers));
            socket.disconnect();
        }
    });
});

export { app, server, io };