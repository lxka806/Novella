const express = require("express")

const recommendationsRouter = express.Router()

const {
    getAIRecommendations
} = require("../controllers/recommendation.Controller")

const protect = require("../middleware/auth.middleware")


recommendationsRouter.get('/ai', protect, getAIRecommendations)


module.exports = recommendationsRouter