const express = require("express")
const {
    createFeedback,
    getFeedback,
    getFeedbackById,
    deleteFeedback,
    updateFeedbackStatus
} = require("../controllers/feedback.controller")
const protect = require("../middleware/auth.middleware")
const requireAdmin = require("../middleware/admin.middleware")

const feedbackRouter = express.Router()

feedbackRouter.post("/", protect, createFeedback)
feedbackRouter.get("/", getFeedback)
feedbackRouter.get("/:id", getFeedbackById)
feedbackRouter.delete("/:id", protect, deleteFeedback)
feedbackRouter.patch("/:id/status", protect, requireAdmin, updateFeedbackStatus)

module.exports = feedbackRouter
