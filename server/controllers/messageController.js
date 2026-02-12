import cloudinary from "../config/cloudinary.js";
import Message from "../models/message-model.js";
import User from "../models/user-model.js";
import { io, userSocketMap } from "../server.js";


// Get all users for sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    const unseenCounts = await Message.aggregate([
      {
        $match: {
          receiverId: loggedInUserId,
          seen: false
        }
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 }
        }
      }
    ]);

    const unseenMessages = {};
    unseenCounts.forEach(item => {
      unseenMessages[item._id.toString()] = item.count;
    });

    res.json({ 
      success: true, 
      users: filteredUsers, 
      unseenMessages 
    });

  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all messages for selected users
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true },
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.messages });
  }
};

// API to mark messages as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });
    res.send({ success: true });
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.messages });
  }
};

// Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageURL;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
