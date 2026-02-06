import 'dotenv/config'
import express from "express" 
import http from "http"
import cors from "cors"
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoutes.js'

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

app.use(express.json({limit: "4mb"}))
app.use(cors())

// Routes setup
app.use("/api/status", (req, res) => {
    res.send("Server is running!")
})
app.use("/api/auth", userRouter)

// Connect to MongoDB
await connectDB()


// Listening the server
server.listen(PORT, () => {
    console.log("Server is running successfully on port: ", PORT)
})
