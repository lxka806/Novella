import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaBookmark } from "react-icons/fa"
import api from "../api/axios"
import BookCard from "../components/BookCard"

const Profile = () => {
    const [user, setUser] = useState(null)
    const [likedBooks, setLikedBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const [profileResponse, likedBooksResponse] = await Promise.all([
                    api.get("/auth/profile"),
                    api.get("/books/liked")
                ])
                setUser(profileResponse.data.user)
                setLikedBooks(likedBooksResponse.data.books)
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
            Loading your profile...
        </div>
    )
    
    if (error) return (
        <div role="alert" className="min-h-screen flex items-center justify-center text-red-500">
            {error}
        </div>
    )

    if (!user) return null

    return (
        <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* ==================== PROFILE HEADER ==================== */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-12">
                    {/* Cover Banner */}
                    <div className="h-32 w-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    
                    <div className="px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12 gap-6">
                            
                            {/* Avatar */}
                            <div className="relative">
                                {user.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={`${user.name} avatar`} 
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-white"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Name & Email */}
                            <div className="flex-1 text-center sm:text-left pb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-500">{user.email}</p>
                            </div>

                            {/* Edit Button */}
                            <Link 
                                to="/profile/edit"
                                className="px-6 py-2.5 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-md"
                            >
                                Edit Profile
                            </Link>
                        </div>

                        {/* Bio */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">About</h2>
                            <p className="text-gray-700 leading-relaxed max-w-3xl">
                                {user.bio || "This reader hasn't added a bio yet."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================== LIKED BOOKS ==================== */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="text-red-500">♥</span> Liked Books
                        </h2>
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {likedBooks.length} {likedBooks.length === 1 ? "book" : "books"}
                        </span>
                    </div>

                    {likedBooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {likedBooks.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">You haven't liked any books yet.</p>
                            <Link to="/books" className="text-blue-600 font-semibold hover:underline">
                                Explore books to find your favorites →
                            </Link>
                        </div>
                    )}
                </section>

                {/* ==================== READ BOOKS ==================== */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="text-green-500">✓</span> Read Books
                        </h2>
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {user.readBooks?.length || 0} {user.readBooks?.length === 1 ? "book" : "books"}
                        </span>
                    </div>

                    {user.readBooks?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {user.readBooks.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
                            <p className="text-gray-500">You haven't marked any books as read yet.</p>
                        </div>
                    )}
                </section>

                {/* ==================== SAVED BOOKS ==================== */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <FaBookmark className="text-blue-500" aria-hidden="true" /> Saved Books
                        </h2>
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {user.savedBooks?.length || 0} {user.savedBooks?.length === 1 ? "book" : "books"}
                        </span>
                    </div>

                    {user.savedBooks?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {user.savedBooks.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
                            <p className="text-gray-500">You haven't saved any books yet.</p>
                        </div>
                    )}
                </section>

            </div>
        </main>
    )
}

export default Profile