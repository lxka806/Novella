const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
        type: {
            type: String,
            enum: ["review", "bug", "feature", "improvement", "removal"],
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        status: {
            type: String,
            enum: ["pending", "reviewed", "planned", "implemented", "rejected"],
            default: "pending",
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema)
