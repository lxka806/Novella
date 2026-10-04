const express = require("express")
const {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getAllUsers,
    updateUserRole
} = require("../controllers/admin.controller")
const protect = require("../middleware/auth.middleware")
const requireAdmin = require("../middleware/admin.middleware")

const adminRouter = express.Router()

adminRouter.use(protect, requireAdmin)

adminRouter.get("/books", getAllBooks)
adminRouter.post("/books", createBook)
adminRouter.get("/books/:id", getBook)
adminRouter.patch("/books/:id", updateBook)
adminRouter.delete("/books/:id", deleteBook)

adminRouter.get("/users", getAllUsers)
adminRouter.patch("/users/:id", updateUserRole)

module.exports = adminRouter
