import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/", protectRoute, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("-password")
      .sort({ fullName: 1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;