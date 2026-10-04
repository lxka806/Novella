const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        cover: {
            type: String,
            default: ""
        },
        genre: String,
        publishedYear: Number,
        pages: Number,
        language: String,
        rating: {
            type: Number,
            default: 0
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth"
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Auth"
            }
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    },
    {
        timestamps: true
    }
)

const Books = mongoose.models.Books || mongoose.model("Books", bookSchema)

module.exports = Books
