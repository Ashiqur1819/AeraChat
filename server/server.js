import 'dotenv/config'
import express from "express" 
import http from "http"
import cors from "cors"
import { connectDB } from './lib/db.js'

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

app.use(express.json({limit: "4mb"}))
app.use(cors())

app.use("/api/status", (req, res) => {
    res.send("Server is running!")
})

// Connect to MongoDB
await connectDB()

server.listen(PORT, () => {
    console.log("Server is running successfully on port: ", PORT)
})
