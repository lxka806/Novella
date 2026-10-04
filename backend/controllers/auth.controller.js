const Auth = require("../models/auth.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All inputs are required"
            })
        }

        const usedEmail = await Auth.findOne({ email })

        if (usedEmail) {
            return res.status(400).json({
                message: "Email is already in use"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await Auth.create({
            name,
            email,
            password: hashedPassword
        })

        const token = createToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bio: user.bio,
                avatar: user.avatar,
                books: user.books
            }
        })

    } catch (e) {
        console.log(e)

        return res.status(500).json({
            message: "Server error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await Auth.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = createToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bio: user.bio,
                avatar: user.avatar,
                books: user.books
            }
        })

    } catch (e) {
        console.log(e)

        return res.status(500).json({
            message: "Server error"
        })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax"
        })

        return res.status(200).json({
            message: "Logged out successfully"
        })

    } catch (e) {
        console.log(e)

        return res.status(500).json({
            message: "Server error"
        })
    }
}

const profile = async (req, res) => {
    try {
        const user = await Auth.findById(req.user.id)
            .select("-password")
            .populate({
                path: "savedBooks",
                populate: { path: "owner", select: "name avatar" }
            })
            .populate({
                path: "readBooks",
                populate: { path: "owner", select: "name avatar" }
            })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            user
        })

    } catch (e) {
        console.log(e)

        return res.status(500).json({
            message: "Server error"
        })
    }
}

const editProfile = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                message: "Profile details must be sent as JSON"
            })
        }

        const { name, email, bio, avatar } = req.body

        const user = await Auth.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    message: "Name must be a non-empty string"
                })
            }
            user.name = name.trim()
        }

        if (email !== undefined) {
            if (typeof email !== "string" || !email.trim()) {
                return res.status(400).json({
                    message: "Email must be a non-empty string"
                })
            }

            const normalizedEmail = email.trim().toLowerCase()
            const emailUsed = await Auth.findOne({
                email: normalizedEmail,
                _id: { $ne: req.user.id }
            })

            if (emailUsed) {
                return res.status(400).json({
                    message: "Email is already in use"
                })
            }

            user.email = normalizedEmail
        }

        if (bio !== undefined) {
            if (typeof bio !== "string") {
                return res.status(400).json({
                    message: "Bio must be a string"
                })
            }
            user.bio = bio
        }

        if (avatar !== undefined) {
            if (typeof avatar !== "string") {
                return res.status(400).json({
                    message: "Avatar must be a URL or image data string"
                })
            }
            user.avatar = avatar
        }

        await user.save()

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bio: user.bio,
                avatar: user.avatar,
                books: user.books
            }
        })

    } catch (e) {
        console.log(e)

        if (e.code === 11000 && e.keyPattern?.email) {
            return res.status(400).json({
                message: "Email is already in use"
            })
        }

        return res.status(500).json({
            message: "Server error"
        })
    }
}

module.exports = {
    register,
    login,
    logout,
    profile,
    editProfile
}