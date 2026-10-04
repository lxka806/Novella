const Auth = require("../models/auth.model")

const requireAdmin = async (req, res, next) => {
    try {
        const user = await Auth.findById(req.user.id).select("role")

        if (!user) {
            return res.status(401).json({ message: "Not authenticated" })
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" })
        }

        return next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = requireAdmin
