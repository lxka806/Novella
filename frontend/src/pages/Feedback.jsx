import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { FaStar, FaTrashAlt } from "react-icons/fa"
import api from "../api/axios"
import useAuth from "../context/useAuth"

const feedbackTypes = [
    { value: "review", label: "Review" },
    { value: "bug", label: "Bug Report" },
    { value: "feature", label: "Feature Request" },
    { value: "improvement", label: "Improvement" },
    { value: "removal", label: "Remove Something" }
]

const feedbackStatuses = [
    { value: "pending", label: "Pending" },
    { value: "reviewed", label: "Reviewed" },
    { value: "planned", label: "Planned" },
    { value: "implemented", label: "Implemented" },
    { value: "rejected", label: "Rejected" }
]

const filters = [
    { value: "all", label: "All" },
    { value: "review", label: "Reviews" },
    { value: "bug", label: "Bug Reports" },
    { value: "feature", label: "Feature Requests" },
    { value: "improvement", label: "Improvements" },
    { value: "removal", label: "Removal Suggestions" }
]

const formatLabel = (value) =>
    feedbackTypes.find((type) => type.value === value)?.label || value

const Feedback = () => {
    const { user, loading: authLoading } = useAuth()
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState("all")
    const [type, setType] = useState("review")
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [rating, setRating] = useState(0)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState("")
    const [updatingId, setUpdatingId] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        if (authLoading) return

        let active = true
        const loadFeedback = async () => {
            setLoading(true)
            setError("")
            try {
                const response = await api.get("/feedback")
                if (active) setItems(response.data.feedback || [])
            } catch (requestError) {
                if (active) {
                    setError(
                        requestError.response?.data?.message ||
                        "Unable to load feedback right now"
                    )
                }
            } finally {
                if (active) setLoading(false)
            }
        }

        loadFeedback()
        return () => {
            active = false
        }
    }, [authLoading, user])

    const visibleItems = useMemo(
        () => filter === "all" ? items : items.filter((item) => item.type === filter),
        [filter, items]
    )

    const submitFeedback = async (event) => {
        event.preventDefault()
        setError("")
        setSuccess("")

        if (!title.trim() || !message.trim()) {
            setError("Please provide both a title and a message.")
            return
        }

        if (type === "review" && !rating) {
            setError("Please choose a star rating for your review.")
            return
        }

        setSubmitting(true)
        try {
            const response = await api.post("/feedback", {
                type,
                title: title.trim(),
                message: message.trim(),
                ...(rating ? { rating } : {})
            })
            setItems((currentItems) => [response.data.feedback, ...currentItems])
            setTitle("")
            setMessage("")
            setRating(0)
            setType("review")
            setSuccess("Thank you — your feedback has been submitted.")
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to submit your feedback. Please try again."
            )
        } finally {
            setSubmitting(false)
        }
    }

    const deleteFeedback = async (feedbackId) => {
        setError("")
        setDeletingId(feedbackId)
        try {
            await api.delete(`/feedback/${feedbackId}`)
            setItems((currentItems) =>
                currentItems.filter((item) => item._id !== feedbackId)
            )
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to delete feedback. Please try again."
            )
        } finally {
            setDeletingId("")
        }
    }

    const changeStatus = async (feedbackId, status) => {
        setError("")
        setUpdatingId(feedbackId)
        try {
            const response = await api.patch(`/feedback/${feedbackId}/status`, { status })
            setItems((currentItems) =>
                currentItems.map((item) =>
                    item._id === feedbackId ? response.data.feedback : item
                )
            )
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to update feedback status. Please try again."
            )
        } finally {
            setUpdatingId("")
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 pb-16 pt-28">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Feedback &amp; Suggestions
                    </h1>
                    <p className="mx-auto mt-3 max-w-3xl text-gray-600">
                        Help us make BookNest better. Tell us what you like, what should change, and what features you want to see.
                    </p>
                </header>

                {error && (
                    <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </p>
                )}
                {success && (
                    <p role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </p>
                )}

                {authLoading ? (
                    <p className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
                        Checking your account...
                    </p>
                ) : user ? (
                    <form onSubmit={submitFeedback} className="mb-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                        <h2 className="mb-6 text-xl font-semibold text-gray-900">Share your feedback</h2>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Feedback type
                                <select
                                    value={type}
                                    onChange={(event) => setType(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    {feedbackTypes.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </label>
                            <div>
                                <p id="rating-label" className="text-sm font-medium text-gray-700">
                                    Rating {type === "review" ? "(required)" : "(optional)"}
                                </p>
                                <div className="mt-2 flex items-center gap-2" role="group" aria-labelledby="rating-label">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setRating(value)}
                                            aria-label={`${value} star${value === 1 ? "" : "s"}`}
                                            aria-pressed={rating === value}
                                            className="rounded p-1 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <FaStar className={value <= rating ? "text-amber-400" : "text-gray-300"} aria-hidden="true" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <label className="mt-5 block text-sm font-medium text-gray-700">
                            Title
                            <input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                maxLength={160}
                                required
                                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="Give your feedback a short title"
                            />
                        </label>
                        <label className="mt-5 block text-sm font-medium text-gray-700">
                            Message
                            <textarea
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                maxLength={5000}
                                rows={5}
                                required
                                className="mt-2 w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="Tell us more..."
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </form>
                ) : (
                    <section className="mb-10 rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">Log in to share feedback</h2>
                        <p className="mt-2 text-gray-600">You need to be logged in to submit feedback. You can still browse community suggestions below.</p>
                        <Link to="/login" className="mt-4 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                            Log in
                        </Link>
                    </section>
                )}

                <section aria-labelledby="feedback-list-title">
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 id="feedback-list-title" className="text-2xl font-bold text-gray-900">Community feedback</h2>
                            <p className="mt-1 text-sm text-gray-500">See what readers are saying about BookNest.</p>
                        </div>
                        <label className="text-sm font-medium text-gray-700">
                            Filter
                            <select
                                value={filter}
                                onChange={(event) => setFilter(event.target.value)}
                                className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 sm:min-w-52"
                            >
                                {filters.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {loading ? (
                        <p className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">Loading feedback...</p>
                    ) : visibleItems.length === 0 ? (
                        <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                            Be the first person to share feedback about BookNest.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {visibleItems.map((item) => {
                                const isOwner = String(item.user?._id) === String(user?._id)
                                return (
                                    <article key={item._id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                        {formatLabel(item.type)}
                                                    </span>
                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <h3 className="break-words text-lg font-semibold text-gray-900">{item.title}</h3>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {item.user?.name || "Former member"} · {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                                                </p>
                                            </div>
                                            {isOwner && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteFeedback(item._id)}
                                                    disabled={deletingId === item._id}
                                                    aria-label={`Delete feedback: ${item.title}`}
                                                    className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                                                >
                                                    <FaTrashAlt aria-hidden="true" />
                                                    {deletingId === item._id ? "Deleting..." : "Delete"}
                                                </button>
                                            )}
                                        </div>
                                        {item.rating && (
                                            <div className="mt-3 flex items-center gap-1" aria-label={`Rated ${item.rating} out of 5 stars`}>
                                                {Array.from({ length: 5 }, (_, index) => (
                                                    <FaStar key={index} className={index < item.rating ? "text-amber-400" : "text-gray-300"} aria-hidden="true" />
                                                ))}
                                            </div>
                                        )}
                                        <p className="mt-4 whitespace-pre-wrap break-words leading-relaxed text-gray-700">{item.message}</p>
                                        {user?.role === "admin" && (
                                            <label className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium text-gray-700">
                                                Update status
                                                <select
                                                    value={item.status}
                                                    onChange={(event) => changeStatus(item._id, event.target.value)}
                                                    disabled={updatingId === item._id}
                                                    className="rounded-xl border border-gray-300 bg-white px-3 py-2 disabled:opacity-60"
                                                >
                                                    {feedbackStatuses.map((status) => (
                                                        <option key={status.value} value={status.value}>{status.label}</option>
                                                    ))}
                                                </select>
                                                {updatingId === item._id && <span className="text-xs text-gray-500">Saving...</span>}
                                            </label>
                                        )}
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Feedback
