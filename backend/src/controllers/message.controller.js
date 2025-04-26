import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const LoggedInUserId = req.user._id; 
        const filteredUsers=await User.find({ _id: { $ne: LoggedInUserId } }) // Exclude the logged-in user from the list
        .select("-password -__v") // Exclude password and version field from the response

        res.status(200).json(users); // Send the list of users as a response
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try{

        const {id:userToChatId} = req.params; // Extract user ID from request parameters
        const myId = req.user._id; // Get the logged-in user's ID from the request

        const messages=await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId }, 
                { sender: userToChatId, receiver: myId } 
            ]
        })
        res.status(200).json(messages); // Send the list of messages as a response


    }
    catch(error){
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const sendMessage = async (req, res) => {
    try {
        const { text,image } = req.body;
        const { id: receiverId } = req.params; 
        const senderId = req.user._id; 

        let imageUrl ;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save(); 

        //todo:real time message sending  goes here => socket.emit("message received", newMessage);

        res.status(201).json(newMessage); 
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



