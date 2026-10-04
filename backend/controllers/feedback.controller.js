const mongoose = require("mongoose")
const Feedback = require("../models/feedback.model")

const feedbackTypes = ["review", "bug", "feature", "improvement", "removal"]
const feedbackStatuses = ["pending", "reviewed", "planned", "implemented", "rejected"]
const userFields = "name avatar"

const createFeedback = async (req, res) => {
    try {
        const body = req.body && typeof req.body === "object" ? req.body : {}
        const { type, rating } = body
        const title = typeof body.title === "string" ? body.title.trim() : ""
        const message = typeof body.message === "string" ? body.message.trim() : ""

        if (!feedbackTypes.includes(type)) {
            return res.status(400).json({ message: "Choose a valid feedback type" })
        }

        if (!title) {
            return res.status(400).json({ message: "Title is required" })
        }

        if (!message) {
            return res.status(400).json({ message: "Message is required" })
        }

        if (type === "review" && (rating === undefined || rating === null)) {
            return res.status(400).json({ message: "A rating is required for reviews" })
        }

        if (
            rating !== undefined &&
            rating !== null &&
            (!Number.isInteger(rating) || rating < 1 || rating > 5)
        ) {
            return res.status(400).json({ message: "Rating must be a whole number from 1 to 5" })
        }

        const feedback = await Feedback.create({
            user: req.user.id,
            type,
            title,
            message,
            ...(rating !== undefined && rating !== null ? { rating } : {})
        })

        await feedback.populate("user", userFields)

        return res.status(201).json({
            message: "Feedback submitted successfully",
            feedback
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }

        console.error("Create feedback error:", error)
        return res.status(500).json({ message: "Unable to submit feedback" })
    }
}

const getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate("user", userFields)
            .sort({ createdAt: -1 })

        return res.status(200).json({ feedback })
    } catch (error) {
        console.error("Get feedback error:", error)
        return res.status(500).json({ message: "Unable to load feedback" })
    }
}

const getFeedbackById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid feedback ID" })
        }

        const feedback = await Feedback.findById(req.params.id)
            .populate("user", userFields)

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" })
        }

        return res.status(200).json({ feedback })
    } catch (error) {
        console.error("Get feedback by ID error:", error)
        return res.status(500).json({ message: "Unable to load feedback" })
    }
}

const deleteFeedback = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid feedback ID" })
        }

        const feedback = await Feedback.findById(req.params.id)

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" })
        }

        if (String(feedback.user) !== String(req.user.id)) {
            return res.status(403).json({ message: "You can only delete your own feedback" })
        }

        await feedback.deleteOne()

        return res.status(200).json({ message: "Feedback deleted successfully" })
    } catch (error) {
        console.error("Delete feedback error:", error)
        return res.status(500).json({ message: "Unable to delete feedback" })
    }
}

const updateFeedbackStatus = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid feedback ID" })
        }

        const body = req.body && typeof req.body === "object" ? req.body : {}
        const { status } = body
        if (!feedbackStatuses.includes(status)) {
            return res.status(400).json({ message: "Choose a valid feedback status" })
        }

        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate("user", userFields)

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" })
        }

        return res.status(200).json({
            message: "Feedback status updated successfully",
            feedback
        })
    } catch (error) {
        console.error("Update feedback status error:", error)
        return res.status(500).json({ message: "Unable to update feedback status" })
    }
}

module.exports = {
    createFeedback,
    getFeedback,
    getFeedbackById,
    deleteFeedback,
    updateFeedbackStatus
}
