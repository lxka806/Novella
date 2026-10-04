const mongoose = require("mongoose")
const Books = require("../models/book.model")
const Comment = require("../models/comment.model")

const addComment = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const content = typeof req.body.content === "string"
            ? req.body.content.trim()
            : ""

        if (!content) {
            return res.status(400).json({ message: "Comment content is required" })
        }

        const book = await Books.findById(req.params.id)

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        const comment = await Comment.create({
            content,
            user: req.user.id,
            book: book._id
        })

        book.comments.push(comment._id)
        await book.save()

        await comment.populate("user", "name avatar")

        return res.status(201).json({
            message: "Comment added successfully",
            comment
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }

        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const getBookComments = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const book = await Books.findById(req.params.id)

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        const comments = await Comment.find({ book: book._id })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 })

        return res.status(200).json({ comments })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const deleteComment = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid comment ID" })
        }

        const comment = await Comment.findById(req.params.id)

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }

        if (String(comment.user) !== String(req.user.id)) {
            return res.status(403).json({ message: "Only the comment author can delete it" })
        }

        await Comment.findByIdAndDelete(comment._id)
        await Books.findByIdAndUpdate(comment.book, {
            $pull: { comments: comment._id }
        })

        return res.status(200).json({ message: "Comment deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = {
    addComment,
    getBookComments,
    deleteComment
}
