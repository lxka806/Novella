const express = require("express")
const { deleteComment } = require("../controllers/comment.controller")
const protect = require("../middleware/auth.middleware")

const commentRouter = express.Router()

commentRouter.delete("/:id", protect, deleteComment)

module.exports = commentRouter
