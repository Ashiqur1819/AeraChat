import 'dotenv/config'
import express from "express" 
import http from "http"
import cors from "cors"

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())

app.use("/api/status", (req, res) => {
    res.send("Server is running!")
})

server.listen(PORT, () => {
    console.log("Server is running successfully on port: ", PORT)
})
