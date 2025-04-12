import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

import dotenv from "dotenv";
dotenv.config({ path: './src/.env' });  // Load environment variables
import jwt from "jsonwebtoken";
import { connectDB } from "../lib/db.js";

export const signup =  async(req,res)=>{
    const {  fullName,email, password} = req.body;
    
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        
        
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt =await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password 1234 =>jdkjjjddhhkakk

        const newUser = new User({
            fullName: fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        if (newUser) {
            // Generate JWT token
            const token = generateToken(newUser._id, res);

            // Save user in DB
            await newUser.save();

            // Send response to client
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            });
        } else {
            return res.status(400).json({ message: "Invalid User Data" });
        }
       
        res.status(201).json({ message: "User created successfully" });
        
    } catch (error) {
        console.error("Error in signup:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
   // res.send("Signup Router")
}

export const login =  (req,res)=>{
    res.send("Login Router")
}

export const logout =  (req,res)=>{
    res.send("Logout Router")
}