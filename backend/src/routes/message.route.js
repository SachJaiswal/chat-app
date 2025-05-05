// import express from "express";
// import { protectRoute } from "../middleware/auth.middleware.js";
// import Message from "../models/message.model.js";
// import { uploadToCloudinary } from "../lib/cloudinary.js";
// import { sendMessage } from "../controllers/message.controller.js";

// const router = express.Router();

// // Get messages route
// router.get("/:id", protectRoute, async (req, res) => {
//   try {
//     const { id: otherUserId } = req.params;
//     const userId = req.user._id;

//     const messages = await Message.find({
//       $or: [
//         { senderId: userId, receiverId: otherUserId },
//         { senderId: otherUserId, receiverId: userId },
//       ],
//     })
//     .sort({ createdAt: 1 });

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error("Error in getMessages:", error);
//     res.status(500).json({ error: "Failed to get messages" });
//   }
// });

// // Send message route
// router.post("/send/:id", protectRoute,sendMessage, async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     let imageUrl;
//     if (image) {
//       try {
//         imageUrl = await uploadToCloudinary(image);
//       } catch (uploadError) {
//         console.error("Image upload error:", uploadError);
//         return res.status(400).json({ error: "Failed to upload image" });
//       }
//     }

//     if (!text && !imageUrl) {
//       return res.status(400).json({ error: "Message or image is required" });
//     }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       text: text || "",  // Changed from message to text
//       image: imageUrl
//     });

//     await newMessage.save();

//     const populatedMessage = await Message.findById(newMessage._id)
//       .populate('senderId', '-password')
//       .populate('receiverId', '-password');

//     res.status(201).json(populatedMessage);
//   } catch (error) {
//     console.error("Error in sendMessage:", error);
//     res.status(500).json({ error: error.message || "Failed to send message" });
//   }
// });
// //router.post("/send/:id", protectRoute, sendMessage);

// export default router;

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import Message from "../models/message.model.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

// Get messages route
router.get("/:id", protectRoute, getMessages);

// Send message route
router.post("/send/:id", protectRoute, sendMessage);

export default router;