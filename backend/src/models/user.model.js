import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLENGTH: 6,
    }, 
    profilePicture: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

// Export the User model for use in other parts of the application User first letter is capitalized always
// This is a convention in mongoose and MongoDB to use capitalized names for models
const User = mongoose.model("User",userSchema);

export default User;    
