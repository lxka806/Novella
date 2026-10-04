const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL

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

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("MONGODB is connected")
        app.listen(PORT, () => {
            console.log("server is running on port:", PORT)
        })
    })