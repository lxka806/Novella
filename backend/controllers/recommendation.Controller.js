const OpenAI = require("openai")
const Book = require("../models/book.model")
const Auth = require("../models/auth.model")

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

const getAIRecommendations = async (req, res) => {
    try {
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({
                message: "Not authenticated"
            })
        }

        const bookFields = "title author genre description rating"

        const user = await Auth.findById(userId)
            .select("savedBooks readBooks")
            .populate({
                path: "savedBooks",
                select: bookFields
            })
            .populate({
                path: "readBooks",
                select: bookFields
            })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const [likedBooks, books] = await Promise.all([
            Book.find({
                likes: userId
            }).select(bookFields),

            Book.find()
                .select(bookFields)
                .limit(100)
        ])

        const savedBooks = user.savedBooks.filter(Boolean)
        const readBooks = user.readBooks.filter(Boolean)

        const excludedBookIds = new Set(
            [...likedBooks, ...savedBooks, ...readBooks].map(
                (book) => String(book._id)
            )
        )

        const prompt = `
You are a book recommendation AI for BookNest.

Analyze the user's reading activity and recommend books from the available BookNest library.

LIKED BOOKS:
${JSON.stringify(likedBooks)}

SAVED BOOKS:
${JSON.stringify(savedBooks)}

READ BOOKS:
${JSON.stringify(readBooks)}

AVAILABLE BOOKS:
${JSON.stringify(books)}

Recommend up to 6 books.

IMPORTANT:
- Only recommend books from AVAILABLE BOOKS.
- Do NOT recommend books the user has already liked.
- Do NOT recommend books the user has already saved.
- Do NOT recommend books the user has already read.
- Use the user's interests to choose the best matches.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not include code fences.

Return exactly this format:

[
    {
        "bookId": "BOOK_ID",
        "reason": "Short explanation of why this book matches the user's interests."
    }
]
`

        const response = await openai.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        })

        let text = response.choices?.[0]?.message?.content

        if (typeof text !== "string" || !text.trim()) {
            throw new Error(
                "The AI provider returned an empty response"
            )
        }

        console.log("AI RESPONSE:")
        console.log(text)

        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim()

        const recommendations = JSON.parse(text)

        if (!Array.isArray(recommendations)) {
            throw new Error(
                "The AI provider returned invalid recommendation data"
            )
        }

        const availableBookIds = new Set(
            books.map((book) => String(book._id))
        )

        const validRecommendations = recommendations
            .filter(
                (recommendation) =>
                    recommendation &&
                    typeof recommendation.bookId === "string" &&
                    typeof recommendation.reason === "string" &&
                    availableBookIds.has(recommendation.bookId) &&
                    !excludedBookIds.has(recommendation.bookId)
            )
            .slice(0, 6)

        const recommendedIds = validRecommendations.map(
            (recommendation) => recommendation.bookId
        )

        const recommendedBooks = await Book.find({
            _id: { $in: recommendedIds }
        })

        const result = validRecommendations
            .map((recommendation) => {
                const book = recommendedBooks.find(
                    (book) =>
                        String(book._id) ===
                        String(recommendation.bookId)
                )

                if (!book) return null

                return {
                    book,
                    reason: recommendation.reason
                }
            })
            .filter(Boolean)

        console.log("FINAL AI RECOMMENDATIONS:")
        console.log(result)

        console.log("LIKED BOOKS:", likedBooks.length)
console.log("SAVED BOOKS:", savedBooks.length)
console.log("READ BOOKS:", readBooks.length)
console.log("AVAILABLE BOOKS:", books.length)
console.log("EXCLUDED BOOKS:", excludedBookIds.size)

        res.json({
            recommendations: result
        })
    } catch (error) {
        console.error("AI Recommendation Error:", error)
        console.error("Error message:", error.message)

        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    getAIRecommendations
}