import { useEffect, useState } from "react"
import api from "../api/axios"
import BookCard from "../components/BookCard"
import useAuth from "../context/useAuth"

const Recommendations = () => {
    const { user } = useAuth()

    const [books, setBooks] = useState([])
    const [aiRecommendations, setAiRecommendations] = useState([])

    const [personalized, setPersonalized] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [aiError, setAiError] = useState("")

    useEffect(() => {
        let active = true

        const loadRecommendations = async () => {
            try {
                const requests = [
                    api.get("/books")
                ]

                if (user) {
                    requests.push(
                        api.get("/books/liked"),
                        api.get("/books/saved"),
                        api.get("/books/read")
                    )
                }

                const responses = await Promise.all(requests)

                if (active) {
                    const allBooks = responses[0].data.books || []

                    let recommendations = allBooks

                    if (user) {
                        const likedBooks = responses[1].data.books || []
                        const savedBooks = responses[2].data.savedBooks || []
                        const readBooks = responses[3].data.readBooks || []

                        const personalBooks = [
                            ...likedBooks.map((book) => ({
                                book,
                                weight: 3
                            })),

                            ...savedBooks.map((book) => ({
                                book,
                                weight: 2
                            })),

                            ...readBooks.map((book) => ({
                                book,
                                weight: 1
                            }))
                        ]

                        const personalBookIds = new Set(
                            personalBooks.map(({ book }) =>
                                String(
                                    typeof book === "object"
                                        ? book._id
                                        : book
                                )
                            )
                        )

                        const genreScores = new Map()

                        personalBooks.forEach(({ book, weight }) => {
                            if (
                                typeof book !== "object" ||
                                !book.genre
                            ) {
                                return
                            }

                            const genre = book.genre
                                .trim()
                                .toLocaleLowerCase()

                            genreScores.set(
                                genre,
                                (genreScores.get(genre) || 0) + weight
                            )
                        })

                        if (genreScores.size > 0) {
                            recommendations = allBooks
                                .filter(
                                    (book) =>
                                        !personalBookIds.has(
                                            String(book._id)
                                        )
                                )
                                .sort((bookA, bookB) => {
                                    const scoreFor = (book) =>
                                        genreScores.get(
                                            book.genre
                                                ?.trim()
                                                .toLocaleLowerCase()
                                        ) || 0

                                    const scoreDifference =
                                        scoreFor(bookB) -
                                        scoreFor(bookA)

                                    if (scoreDifference !== 0) {
                                        return scoreDifference
                                    }

                                    const ratingDifference =
                                        (bookB.rating || 0) -
                                        (bookA.rating || 0)

                                    return (
                                        ratingDifference ||
                                        (bookB.likes?.length || 0) -
                                            (bookA.likes?.length || 0)
                                    )
                                })

                            setPersonalized(true)
                        } else {
                            recommendations = [...allBooks].sort(
                                (bookA, bookB) => {
                                    const ratingDifference =
                                        (bookB.rating || 0) -
                                        (bookA.rating || 0)

                                    return (
                                        ratingDifference ||
                                        (bookB.likes?.length || 0) -
                                            (bookA.likes?.length || 0)
                                    )
                                }
                            )

                            setPersonalized(false)
                        }
                    } else {
                        recommendations = [...allBooks].sort(
                            (bookA, bookB) => {
                                const ratingDifference =
                                    (bookB.rating || 0) -
                                    (bookA.rating || 0)

                                return (
                                    ratingDifference ||
                                    (bookB.likes?.length || 0) -
                                        (bookA.likes?.length || 0)
                                )
                            }
                        )

                        setPersonalized(false)
                    }

                    setBooks(recommendations)
                }
            } catch (requestError) {
                if (active) {
                    setError(
                        requestError.response?.data?.message ||
                            "Something went wrong"
                    )
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        Promise.resolve().then(loadRecommendations)

        return () => {
            active = false
        }
    }, [user])

    const getAIRecommendations = async () => {
        if (!user) {
            return
        }

        try {
            setAiLoading(true)
            setAiError("")

            const response = await api.get(
                "/recommendations/ai"
            )

            setAiRecommendations(
                response.data.recommendations || []
            )
        } catch (requestError) {
            setAiError(
                requestError.response?.data?.message ||
                    "Failed to generate AI recommendations"
            )
        } finally {
            setAiLoading(false)
        }
    }

    if (loading) {
        return (
            <p className="text-center mt-20 text-xl">
                Finding recommendations...
            </p>
        )
    }

    return (
        <main className="min-h-screen px-4 py-28">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-2">
                    Book Recommendations
                </h1>

                <p className="mb-8">
                    {personalized
                        ? "Recommendations are based on genres from books you have liked, saved, or read."
                        : "Books are ordered by rating, then by likes, using the BookNest library."}
                </p>

                {error && (
                    <p
                        role="alert"
                        className="text-red-600 mb-6"
                    >
                        {error}
                    </p>
                )}

                {/* AI SECTION */}

                {user && (
                    <section className="mb-16">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                            <div>
                                <h2 className="text-2xl font-bold">
                                    AI Recommendations
                                </h2>

                                <p className="text-gray-600 mt-1">
                                    Let AI find books based on your
                                    reading activity.
                                </p>
                            </div>

                            <button
                                onClick={getAIRecommendations}
                                disabled={aiLoading}
                                className="px-6 py-3 rounded-lg bg-black text-white font-medium hover:opacity-80 disabled:opacity-50 transition"
                            >
                                {aiLoading
                                    ? "AI is thinking..."
                                    : aiRecommendations.length > 0
                                    ? "Get New Recommendations"
                                    : "Ask AI"}
                            </button>

                        </div>

                        {aiError && (
                            <p
                                role="alert"
                                className="text-red-600 mb-6"
                            >
                                {aiError}
                            </p>
                        )}

                        {aiLoading && (
                            <div className="py-12 text-center">
                                <p className="text-lg">
                                    AI is analyzing your books...
                                </p>

                                <p className="text-sm text-gray-500 mt-2">
                                    Looking at your likes, saved books,
                                    and reading history.
                                </p>
                            </div>
                        )}

                        {!aiLoading &&
                            aiRecommendations.length === 0 && (
                                <div className="border rounded-xl p-8 text-center">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Discover your next book
                                    </h3>

                                    <p className="text-gray-500">
                                        Click "Ask AI" and BookNest will
                                        recommend books based on your
                                        reading activity.
                                    </p>
                                </div>
                            )}

                        {!aiLoading &&
                            aiRecommendations.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {aiRecommendations.map(
                                        ({ book, reason }) => (
                                            <div
                                                key={book._id}
                                                className="space-y-3"
                                            >

                                                <BookCard
                                                    book={book}
                                                />

                                                <div className="rounded-lg bg-gray-100 p-4">
                                                    <p className="text-sm font-semibold mb-1">
                                                        Why AI recommends it
                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        {reason}
                                                    </p>
                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                    </section>
                )}

                {/* NORMAL RECOMMENDATIONS */}

                <section>

                    <h2 className="text-2xl font-bold mb-2">
                        {personalized
                            ? "For You"
                            : "Popular Books"}
                    </h2>

                    <p className="mb-8 text-gray-600">
                        {personalized
                            ? "These recommendations are based on your activity."
                            : "Popular books from the BookNest library."}
                    </p>

                    {!error && books.length === 0 && (
                        <p>
                            No books are available to recommend yet.
                        </p>
                    )}

                    {books.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {books.map((book) => (
                                <BookCard
                                    key={book._id}
                                    book={book}
                                />
                            ))}

                        </div>
                    )}

                </section>

            </div>
        </main>
    )
}

export default Recommendations