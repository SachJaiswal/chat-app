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
const userSocketMap = new Map(); // Map to store userId and socketI

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("setup", (userId) => {
        socket.join(userId);
        socket.userId = userId;
        console.log("User setup completed:", userId);
    });

    socket.on("disconnect", () => {
        if (socket.userId) {
            socket.leave(socket.userId);
        }
    });

    // Handle user setup
    socket.on("setup", (userId) => {
        if (userId) {
            onlineUsers.add(userId);
            console.log("Online users:", Array.from(onlineUsers));
            // Broadcast updated online users list to all clients
            io.emit("getOnlineUsers", Array.from(onlineUsers));
        }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            onlineUsers.delete(userId);
            console.log("User disconnected:", userId);
            // Broadcast updated online users list
            io.emit("getOnlineUsers", Array.from(onlineUsers));
        }
    });

    // Handle logout
    socket.on("logout", () => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            onlineUsers.delete(userId);
            console.log("User logged out:", userId);
            // Broadcast updated online users list
            io.emit("getOnlineUsers", Array.from(onlineUsers));
            socket.disconnect();
        }
    });
});

export { app, server, io };