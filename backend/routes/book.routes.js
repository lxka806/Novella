const express = require("express")
const {
    createBook,
    getAllBooks,
    getBook,
    updateBook,
    deleteBook,
    saveBook,
    unsaveBook,
    getSavedBooks,
    markBookRead,
    markBookUnread,
    getReadBooks,
    getLikedBooks,
    likeBook,
    unlikeBook,
    getBookLikes
} = require("../controllers/book.controller")
const {
    addComment,
    getBookComments
} = require("../controllers/comment.controller")
const protect = require("../middleware/auth.middleware")
const requireAdmin = require("../middleware/admin.middleware")

const bookRouter = express.Router()

bookRouter.post("/", protect, requireAdmin, createBook)
bookRouter.get("/", getAllBooks)
bookRouter.get("/saved", protect, getSavedBooks)
bookRouter.get("/read", protect, getReadBooks)
bookRouter.get("/liked", protect, getLikedBooks)
bookRouter.get("/:id", getBook)
bookRouter.patch("/:id", protect, updateBook)
bookRouter.delete("/:id", protect, deleteBook)

bookRouter.post("/:id/save", protect, saveBook)
bookRouter.delete("/:id/save", protect, unsaveBook)
bookRouter.post("/:id/read", protect, markBookRead)
bookRouter.delete("/:id/read", protect, markBookUnread)

bookRouter.post("/:id/like", protect, likeBook)
bookRouter.delete("/:id/like", protect, unlikeBook)
bookRouter.get("/:id/likes", getBookLikes)

bookRouter.post("/:id/comments", protect, addComment)
bookRouter.get("/:id/comments", getBookComments)

module.exports = bookRouter
