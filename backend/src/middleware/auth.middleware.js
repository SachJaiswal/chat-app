import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        // Get user from token
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        // Set user in request
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute:", error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

