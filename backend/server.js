const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
    console.error("MONGO_URI is not set. Add it to backend/.env.")
    process.exit(1)
}

const authRouter = require("./routers/auth.route")
const bookRouter = require("./routes/book.routes")
const commentRouter = require("./routes/comment.routes")
const adminRouter = require("./routes/admin.routes")
const recommendationsRouter = require("./routes/recommendations.route")
const feedbackRouter = require("./routes/feedback.routes")

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json({ limit: "2mb" }))
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use("/api/books", bookRouter)
app.use("/api/comments", commentRouter)
app.use("/api/admin", adminRouter)
app.use("/api/recommendations", recommendationsRouter)
app.use("/api/feedback", feedbackRouter)

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MONGODB is connected")
        app.listen(PORT, () => {
            console.log("server is running on port:", PORT)
        })
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error.message)
        process.exit(1)
    })
