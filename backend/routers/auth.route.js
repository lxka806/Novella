const express = require("express")

const {
    register,
    login,
    logout,
    profile,
    editProfile
} = require("../controllers/auth.controller")

const protect = require("../middleware/auth.middleware")

const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.get("/profile", protect, profile)
authRouter.patch("/profile", protect, editProfile)

module.exports = authRouter