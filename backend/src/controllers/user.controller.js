import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
    try {
        const { fullName, profilePicture } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (fullName) user.fullName = fullName;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}; 