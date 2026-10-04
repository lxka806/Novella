const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Books",
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)

module.exports = Comment
