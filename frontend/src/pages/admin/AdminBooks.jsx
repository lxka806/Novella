import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaRegComments } from "react-icons/fa"
import api from "../../api/axios"

const AdminBooks = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState("")
    const [error, setError] = useState("")

    const loadBooks = useCallback(async () => {
        try {
            const response = await api.get("/admin/books")
            setBooks(response.data.books)
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        Promise.resolve().then(() => loadBooks())
    }, [loadBooks])

    const deleteBook = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
            return
        }
        setError("")
        setDeletingId(id)
        try {
            await api.delete(`/admin/books/${id}`)
            setBooks((current) => current.filter((book) => book._id !== id))
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setDeletingId("")
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
            Loading books...
        </div>
    )

    return (
        <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* ==================== HEADER ==================== */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Manage Books</h1>
                        <p className="text-gray-500 mt-2">
                            {books.length} {books.length === 1 ? "book" : "books"} in your library
                        </p>
                    </div>
                    <Link 
                        to="/admin/books/add"
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-md flex items-center gap-2"
                    >
                        <span className="text-lg">+</span> Add New Book
                    </Link>
                </div>

                {/* Error Alert */}
                {error && (
                    <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* ==================== BOOKS LIST ==================== */}
                {books.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm p-16 text-center border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500 mb-4">No books found in your library.</p>
                        <Link 
                            to="/admin/books/add" 
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Add your first book →
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                        
                        {/* Table Header (Hidden on Mobile) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold tracking-wider text-gray-500 uppercase">
                            <div className="col-span-1">Cover</div>
                            <div className="col-span-4">Book Details</div>
                            <div className="col-span-2">Genre</div>
                            <div className="col-span-1 text-center">Likes</div>
                            <div className="col-span-1 text-center">Comments</div>
                            <div className="col-span-3 text-right">Actions</div>
                        </div>

                        {/* Book Rows */}
                        <div className="divide-y divide-gray-100">
                            {books.map((book) => (
                                <div 
                                    key={book._id} 
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors"
                                >
                                    {/* Cover */}
                                    <div className="col-span-1">
                                        {book.cover ? (
                                            <img 
                                                src={book.cover} 
                                                alt={`${book.title} cover`} 
                                                className="w-12 h-16 object-cover rounded-md shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-12 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                                                N/A
                                            </div>
                                        )}
                                    </div>

                                    {/* Title & Author */}
                                    <div className="col-span-4">
                                        <h3 className="font-bold text-gray-900 line-clamp-1">{book.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-1">By {book.author}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {book.publishedYear || "Year N/A"} • {book.pages || "N/A"} pages
                                        </p>
                                    </div>

                                    {/* Genre */}
                                    <div className="col-span-2">
                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                            {book.genre || "Unspecified"}
                                        </span>
                                    </div>

                                    {/* Likes */}
                                    <div className="col-span-1 text-center">
                                        <span className="flex items-center justify-center gap-1 text-sm font-medium text-gray-700">
                                            <span className="text-red-400">♥</span> {book.likes?.length ?? 0}
                                        </span>
                                    </div>

                                    {/* Comments */}
                                    <div className="col-span-1 text-center">
                                        <span className="flex items-center justify-center gap-1 text-sm font-medium text-gray-700">
                                            <FaRegComments className="text-blue-400" aria-hidden="true" /> {book.comments?.length ?? 0}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-3 flex justify-end gap-3">
                                        <Link 
                                            to={`/admin/books/${book._id}/edit`}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            type="button" 
                                            disabled={deletingId === book._id}
                                            onClick={() => deleteBook(book._id)}
                                            className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-full hover:bg-red-100 transition-colors disabled:opacity-50"
                                        >
                                            {deletingId === book._id ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

export default AdminBooks