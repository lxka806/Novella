const mongoose = require("mongoose")

const authSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        bio: {
            type: String,
            default: ""
        },
        avatar: {
            type: String,
            default: ""
        },
        books: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Books"
            }
        ],
        savedBooks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Books"
            }
        ],
        readBooks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Books"
            }
        ]
    },
    {
        timestamps: true
    }
)

const Auth = mongoose.model("Auth", authSchema)

module.exports = Auth