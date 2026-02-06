import Message from "../models/message-model.js"
import User from "../models/user-model.js"


// Get all user except logged in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password")

        // Count number of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})

            if(messages.length > 0){
                unseenMessages[user._id] = messages.length
            }
        })

        await Promise.all(promises)
        res.json({success: true, users: filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.messages)
        res.json({success: false, message: error.messages})
    }
}


// Get all messages for selected users
export const getMessages = async (req, res) => {
    try {

        const {id: selectedUserId} = req.params
        const myId = req.user._id

        const messages = await  Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        })

        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true})
        res.json({success: true, messages})
        
    } catch (error) {
        console.log(error.messages)
        res.json({success: false, message: error.messages})
    }
}


// API to mark messages as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {

        const {id} = req.params

        await Message.findByIdAndUpdate(id, {seen: true})
        res.send({success: true})
        
    } catch (error) {
        console.log(error.messages)
        res.json({success: false, message: error.messages})
    }
}