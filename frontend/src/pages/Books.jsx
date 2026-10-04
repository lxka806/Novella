import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import api from "../api/axios"
import BookCard from "../components/BookCard"

const Books = () => {
    const [searchParams] = useSearchParams()
    const genre = (searchParams.get("genre") || "").trim()
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let active = true

        const loadBooks = async () => {
            setLoading(true)
            setError("")
            try {
                const response = await api.get("/books")
                if (active) {
                    const allBooks = response.data.books || []
                    setBooks(genre
                        ? allBooks.filter((book) =>
                            book.genre?.toLocaleLowerCase() === genre.toLocaleLowerCase()
                        )
                        : allBooks)
                }
            } catch (requestError) {
                if (active) {
                    setError(requestError.response?.data?.message || "Something went wrong")
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        Promise.resolve().then(loadBooks)
        return () => {
            active = false
        }
    }, [genre])

    if (loading) return <p className="text-center mt-20 text-xl">Loading books...</p>

    return (
        <main className="min-h-screen px-4 py-28">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">
                    {genre ? `${genre} Books` : "Explore Books"}
                </h1>
                {genre && <p className="mb-8"><Link to="/books" className="underline">View all books</Link></p>}
                {error && <p role="alert" className="text-red-600">{error}</p>}
                {!error && books.length === 0 && <p>No books found.</p>}
                {books.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {books.map((book) => <BookCard key={book._id} book={book} />)}
                    </div>
                )}
            </div>
        </main>
    )
}

export default Books
