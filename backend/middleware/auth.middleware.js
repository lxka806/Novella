const jwt = require("jsonwebtoken")

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = {
            id: decoded.id
        }

        next()

    } catch (e) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

module.exports = protect