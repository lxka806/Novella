const mongoose = require("mongoose")
const Books = require("../models/book.model")
const Auth = require("../models/auth.model")

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

const invalidBookId = (id) => !mongoose.isValidObjectId(id)

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
            rating: req.body.rating,
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
        if (invalidBookId(req.params.id)) {
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

const updateBook = async (req, res) => {
    try {
        if (invalidBookId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const book = await Books.findById(req.params.id)

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        if (String(book.owner) !== String(req.user.id)) {
            return res.status(403).json({ message: "Only the owner can update this book" })
        }

        const hasChanges = bookFields.some((field) => req.body[field] !== undefined)
        if (!hasChanges) {
            return res.status(400).json({ message: "No book fields provided to update" })
        }

        bookFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                book[field] = req.body[field]
            }
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
        if (invalidBookId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const book = await Books.findById(req.params.id)

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        if (String(book.owner) !== String(req.user.id)) {
            return res.status(403).json({ message: "Only the owner can delete this book" })
        }

        await Books.findByIdAndDelete(book._id)
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

const updateUserBookList = async (req, res, listName, add) => {
    try {
        if (invalidBookId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const book = await Books.findById(req.params.id)

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        const user = await Auth.findByIdAndUpdate(
            req.user.id,
            add
                ? { $addToSet: { [listName]: book._id } }
                : { $pull: { [listName]: book._id } },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            message: add
                ? "Book added to your list"
                : "Book removed from your list",
            [listName]: user[listName]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const saveBook = (req, res) => updateUserBookList(req, res, "savedBooks", true)

const unsaveBook = (req, res) => updateUserBookList(req, res, "savedBooks", false)

const markBookRead = (req, res) => updateUserBookList(req, res, "readBooks", true)

const markBookUnread = (req, res) => updateUserBookList(req, res, "readBooks", false)

const getUserBookList = async (req, res, listName) => {
    try {
        const user = await Auth.findById(req.user.id)
            .select(listName)
            .populate({
                path: listName,
                populate: {
                    path: "owner",
                    select: "name avatar"
                }
            })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ [listName]: user[listName] })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const getSavedBooks = (req, res) => getUserBookList(req, res, "savedBooks")

const getReadBooks = (req, res) => getUserBookList(req, res, "readBooks")

const getLikedBooks = async (req, res) => {
    try {
        const books = await Books.find({ likes: req.user.id })
            .populate("owner", "name avatar")
            .sort({ createdAt: -1 })

        return res.status(200).json({ books })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const likeBook = async (req, res) => {
    try {
        if (invalidBookId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const book = await Books.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { likes: req.user.id } },
            { new: true }
        )

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        return res.status(200).json({
            message: "Book liked successfully",
            likes: book.likes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const unlikeBook = async (req, res) => {
    try {
        if (invalidBookId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const book = await Books.findByIdAndUpdate(
            req.params.id,
            { $pull: { likes: req.user.id } },
            { new: true }
        )

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        return res.status(200).json({
            message: "Book unliked successfully",
            likes: book.likes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const getBookLikes = async (req, res) => {
    try {
        if (invalidBookId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" })
        }

        const book = await Books.findById(req.params.id)
            .populate("likes", "name avatar")

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        return res.status(200).json({
            likes: book.likes,
            count: book.likes.length
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = {
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
}
