const mongoose = require("mongoose")
const Auth = require("../models/auth.model")
const Books = require("../models/book.model")

const bookFields = [
    "title",
    "author",
    "description",
    "cover",
    "genre",
    "publishedYear",
    "pages",
    "language",
    "rating"
]

const getAllBooks = async (req, res) => {
    try {
        const books = await Books.find()
            .populate("owner", "name avatar")
            .sort({ createdAt: -1 })

        return res.status(200).json({ books })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const getBook = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const book = await Books.findById(req.params.id)
            .populate("owner", "name avatar")

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        return res.status(200).json({ book })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const createBook = async (req, res) => {
    try {
        const book = await Books.create({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            cover: req.body.cover,
            genre: req.body.genre,
            publishedYear: req.body.publishedYear,
            pages: req.body.pages,
            language: req.body.language,
            owner: req.user.id
        })

        await Auth.findByIdAndUpdate(req.user.id, {
            $addToSet: { books: book._id }
        })

        return res.status(201).json({
            message: "Book created successfully",
            book
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }

        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const updateBook = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const fieldsToUpdate = bookFields.filter((field) => req.body[field] !== undefined)
        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: "No book fields provided to update" })
        }

        const book = await Books.findById(req.params.id)
        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        fieldsToUpdate.forEach((field) => {
            book[field] = req.body[field]
        })
        await book.save()

        return res.status(200).json({
            message: "Book updated successfully",
            book
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }

        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const deleteBook = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const book = await Books.findByIdAndDelete(req.params.id)
        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        await Auth.updateMany(
            {
                $or: [
                    { books: book._id },
                    { savedBooks: book._id },
                    { readBooks: book._id }
                ]
            },
            {
                $pull: {
                    books: book._id,
                    savedBooks: book._id,
                    readBooks: book._id
                }
            }
        )

        return res.status(200).json({ message: "Book deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await Auth.find()
            .select("-password")
            .sort({ createdAt: -1 })

        return res.status(200).json({ users })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const updateUserRole = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid user ID" })
        }

        const { role } = req.body
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Role must be user or admin" })
        }

        const user = await Auth.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            message: "User role updated successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getAllUsers,
    updateUserRole
}
