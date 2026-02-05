import mongoose from "mongoose";

// Connect to the MongoDB database
export const connectDB = async() => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Database connected.")
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/aerachatDB`)
    } catch (error) {
        console.log(`ERROR: ${error.message}`)
    }
}