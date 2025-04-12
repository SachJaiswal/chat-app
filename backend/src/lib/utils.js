import jwt from "jsonwebtoken";
export const generateToken = (userId,res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
        sameSite: "strict", // Prevents CSRF attacks
    });

    return token; // Return the token if needed for further processing
}