import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import api from "../api/axios"
import BookCard from "../components/BookCard"
import notFoundImage from "../assets/404img.jpg"

const Search = () => {
    const [searchParams] = useSearchParams()
    const query = (searchParams.get("q") || "").trim()
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let active = true

        const searchBooks = async () => {
            setLoading(true)
            setError("")
            try {
                const response = await api.get("/books")
                if (active) {
                    const searchText = query.toLocaleLowerCase()
                    const matchingBooks = (response.data.books || []).filter((book) =>
                        [book.title, book.author, book.genre, book.description, book.language]
                            .some((field) => field?.toLocaleLowerCase().includes(searchText))
                    )
                    setBooks(matchingBooks)
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

        Promise.resolve().then(searchBooks)
        return () => {
            active = false
        }
    }, [query])

    if (loading) return <p className="text-center mt-20 text-xl">Searching...</p>

        if (!error && books.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-28 pb-20">
                <div className="max-w-2xl w-full text-center">
                    
                    {/* 404 Image Card */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 bg-white border border-gray-100">
                        <img 
                            src={notFoundImage} 
                            alt="Page not found in the library" 
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>

                    {/* Text Content */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        No results found
                    </h1>
                    <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                        We couldn't find any books matching <span className="font-semibold text-gray-800">"{query}"</span>. 
                        Try a different title, author, or genre.
                    </p>

                    {/* Action Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-gray-800"
                    >
                        <FaArrowLeft aria-hidden="true" />
                        Return to Home
                    </Link>
                </div>
            </main>
        )
    }
    
    return (
        <main className="min-h-screen px-4 py-28">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                <p className="mb-8">
                    Results for: <strong>{query || "all books"}</strong>
                </p>
                {error && <p role="alert" className="text-red-600">{error}</p>}
                {books.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {books.map((book) => <BookCard key={book._id} book={book} />)}
                    </div>
                )}
            </div>
        </main>
    )
}

export default Search
