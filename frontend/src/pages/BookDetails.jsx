import { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../api/axios"
import CommentItem from "../components/Comment"
import useAuth from "../context/useAuth"

const BookDetails = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const [book, setBook] = useState(null)
    const [comments, setComments] = useState([])
    const [isSaved, setIsSaved] = useState(false)
    const [isRead, setIsRead] = useState(false)
    const [loadedBookId, setLoadedBookId] = useState(null)
    const [commentText, setCommentText] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [updatingLike, setUpdatingLike] = useState(false)
    const [updatingSave, setUpdatingSave] = useState(false)
    const [updatingRead, setUpdatingRead] = useState(false)
    const [checkingSaved, setCheckingSaved] = useState(false)
    const [checkingRead, setCheckingRead] = useState(false)
    const [deletingId, setDeletingId] = useState("")
    const [error, setError] = useState("")

    const loadDetails = useCallback(async () => {
        try {
            const [bookResponse, commentsResponse] = await Promise.all([
                api.get(`/books/${id}`),
                api.get(`/books/${id}/comments`)
            ])
            setError("")
            setBook(bookResponse.data.book)
            setComments(commentsResponse.data.comments)
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setLoadedBookId(id)
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        Promise.resolve().then(() => loadDetails())
    }, [loadDetails])

    const userId = user?._id || user?.id

    useEffect(() => {
        let active = true
        if (!userId) {
            Promise.resolve().then(() => {
                if (active) {
                    setIsSaved(false)
                    setCheckingSaved(false)
                }
            })
            return () => {
                active = false
            }
        }

        Promise.resolve().then(async () => {
            setCheckingSaved(true)
            try {
                const response = await api.get("/books/saved")
                if (active) {
                    const savedBooks = response.data.savedBooks || []
                    setIsSaved(savedBooks.some((savedBook) =>
                        String(typeof savedBook === "object" ? savedBook._id : savedBook) === String(id)
                    ))
                }
            } catch (requestError) {
                if (active) {
                    setError(requestError.response?.data?.message || "Something went wrong")
                }
            } finally {
                if (active) {
                    setCheckingSaved(false)
                }
            }
        })

        return () => {
            active = false
        }
    }, [userId, id])

    useEffect(() => {
        let active = true
        if (!userId) {
            Promise.resolve().then(() => {
                if (active) {
                    setIsRead(false)
                    setCheckingRead(false)
                }
            })
            return () => {
                active = false
            }
        }

        Promise.resolve().then(async () => {
            setCheckingRead(true)
            try {
                const response = await api.get("/books/read")
                if (active) {
                    const readBooks = response.data.readBooks || []
                    setIsRead(readBooks.some((readBook) =>
                        String(typeof readBook === "object" ? readBook._id : readBook) === String(id)
                    ))
                }
            } catch (requestError) {
                if (active) {
                    setError(requestError.response?.data?.message || "Something went wrong")
                }
            } finally {
                if (active) {
                    setCheckingRead(false)
                }
            }
        })

        return () => {
            active = false
        }
    }, [userId, id])

    const isLiked = book?.likes?.some((like) =>
        String(typeof like === "object" ? like._id : like) === String(userId)
    ) || false

    const toggleLike = async () => {
        setError("")
        setUpdatingLike(true)
        try {
            const response = await api({
                method: isLiked ? "delete" : "post",
                url: `/books/${id}/like`
            })
            setBook((current) => ({ ...current, likes: response.data.likes }))
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setUpdatingLike(false)
        }
    }

    const toggleSave = async () => {
        setError("")
        setUpdatingSave(true)
        try {
            const response = await api({
                method: isSaved ? "delete" : "post",
                url: `/books/${id}/save`
            })
            const savedBooks = response.data.savedBooks || []
            setIsSaved(savedBooks.some((savedBook) =>
                String(typeof savedBook === "object" ? savedBook._id : savedBook) === String(id)
            ))
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setUpdatingSave(false)
        }
    }

    const toggleRead = async () => {
        setError("")
        setUpdatingRead(true)
        try {
            const response = await api({
                method: isRead ? "delete" : "post",
                url: `/books/${id}/read`
            })
            const readBooks = response.data.readBooks || []
            setIsRead(readBooks.some((readBook) =>
                String(typeof readBook === "object" ? readBook._id : readBook) === String(id)
            ))
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setUpdatingRead(false)
        }
    }

    const addComment = async (event) => {
        event.preventDefault()
        setError("")
        setSubmitting(true)
        try {
            const response = await api.post(`/books/${id}/comments`, { content: commentText })
            setComments((current) => [response.data.comment, ...current])
            setCommentText("")
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    const deleteComment = async (commentId) => {
        setError("")
        setDeletingId(commentId)
        try {
            await api.delete(`/comments/${commentId}`)
            setComments((current) => current.filter((comment) => comment._id !== commentId))
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setDeletingId("")
        }
    }

    if (loading || loadedBookId !== id) return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
            Loading book details...
        </div>
    )
    if (error && !book) return (
        <div role="alert" className="min-h-screen flex items-center justify-center text-red-500 px-4 text-center">
            {error}
        </div>
    )
    if (!book) return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-500 px-4 text-center">
            Book not found.
        </div>
    )

    return (
        <main className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                
                {/* ==================== BOOK INFO CARD ==================== */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden flex flex-col lg:flex-row">
                    
                    {/* Cover Image */}
                    {book.cover && (
                        <div className="w-full lg:w-2/5 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6 sm:p-10 lg:p-12">
                            <img 
                                src={book.cover} 
                                alt={`${book.title} cover`} 
                                className="w-full max-w-[200px] sm:max-w-xs rounded-xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    )}

                    {/* Details */}
                    <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-10 flex flex-col">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                            {book.title}
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-6">
                            By <span className="font-semibold text-gray-800">{book.author}</span>
                        </p>

                        {/* Meta Info Grid - Responsive */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 text-sm">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="block text-gray-500 text-xs sm:text-sm">Genre</span>
                                <span className="font-medium text-gray-900 text-sm">{book.genre || "Not specified"}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="block text-gray-500 text-xs sm:text-sm">Published</span>
                                <span className="font-medium text-gray-900 text-sm">{book.publishedYear || "N/A"}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="block text-gray-500 text-xs sm:text-sm">Pages</span>
                                <span className="font-medium text-gray-900 text-sm">{book.pages || "N/A"}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="block text-gray-500 text-xs sm:text-sm">Language</span>
                                <span className="font-medium text-gray-900 text-sm">{book.language || "N/A"}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg col-span-2 sm:col-span-1">
                                <span className="block text-gray-500 text-xs sm:text-sm">Owner</span>
                                <span className="font-medium text-gray-900 text-sm">{book.owner?.name || "Unknown"}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                {book.description || "No description available."}
                            </p>
                        </div>

                        {/* Action Bar - Responsive */}
                        <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            
                            {/* Likes Counter */}
                            <div className="flex items-center gap-2 text-gray-600">
                                <span className="text-2xl text-red-400">♥</span>
                                <span className="font-medium">{book.likes?.length ?? 0} Likes</span>
                            </div>
                            
                            {user ? (
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <button 
                                        type="button" 
                                        onClick={toggleLike} 
                                        disabled={updatingLike}
                                        className={`flex-1 sm:flex-none min-w-[100px] px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                                            isLiked 
                                            ? "bg-red-50 text-red-600 hover:bg-red-100" 
                                            : "bg-black text-white hover:bg-gray-800"
                                        } disabled:opacity-50`}
                                    >
                                        {updatingLike ? "..." : isLiked ? "♥ Unlike" : "♡ Like"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={toggleSave}
                                        disabled={updatingSave || checkingSaved}
                                        className="flex-1 sm:flex-none min-w-[100px] px-4 sm:px-6 py-2.5 rounded-full border border-gray-300 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                    >
                                        {checkingSaved
                                            ? "..."
                                            : updatingSave
                                                ? "..."
                                                : isSaved
                                                    ? "✓ Saved"
                                                    : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={toggleRead}
                                        disabled={updatingRead || checkingRead}
                                        className="flex-1 sm:flex-none min-w-[100px] px-4 sm:px-6 py-2.5 rounded-full border border-gray-300 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                    >
                                        {checkingRead
                                            ? "..."
                                            : updatingRead
                                                ? "..."
                                                : isRead
                                                    ? "✓ Read"
                                                    : "Mark Read"}
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-600 text-sm">
                                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link> to like or comment.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ==================== COMMENTS SECTION ==================== */}
                <div className="mt-8 sm:mt-10 bg-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Comments</h2>
                    
                    {error && (
                        <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Add Comment Form */}
                    {user && (
                        <form onSubmit={addComment} className="mb-8">
                            <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-2">
                                Add a comment
                            </label>
                            <textarea 
                                id="comment-content" 
                                required 
                                value={commentText}
                                onChange={(event) => setCommentText(event.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 text-sm sm:text-base"
                                rows="3"
                                placeholder="Share your thoughts about this book..."
                            />
                            <div className="mt-3 flex justify-end">
                                <button 
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                                >
                                    {submitting ? "Posting..." : "Post Comment"}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Comments List */}
                    {comments.length === 0 ? (
                        <p className="text-gray-500 text-center py-8 text-sm sm:text-base">
                            No comments yet. Be the first to share your thoughts!
                        </p>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {comments.map((comment) => (
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    canDelete={String(comment.user?._id) === String(userId)}
                                    onDelete={deleteComment}
                                    deleting={deletingId === comment._id}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </main>
    )
}

export default BookDetails