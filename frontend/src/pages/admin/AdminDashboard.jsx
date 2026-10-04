import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaBookOpen, FaComments, FaHeart, FaPlus, FaUsers } from "react-icons/fa"
import api from "../../api/axios"

const AdminDashboard = () => {
    const [totals, setTotals] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [booksResponse, usersResponse] = await Promise.all([
                    api.get("/admin/books"),
                    api.get("/admin/users")
                ])
                const books = booksResponse.data.books || []
                setTotals({
                    books: books.length,
                    users: (usersResponse.data.users || []).length,
                    comments: books.reduce((sum, book) => sum + (book.comments?.length || 0), 0),
                    likes: books.reduce((sum, book) => sum + (book.likes?.length || 0), 0)
                })
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Something went wrong")
            }
        }
        loadDashboard()
    }, [])

    if (error) return (
        <div role="alert" className="min-h-screen flex items-center justify-center text-red-500 text-xl">
            {error}
        </div>
    )
    
    if (!totals) return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
            Loading dashboard...
        </div>
    )

    // Stats configuration for clean rendering
    const stats = [
        {
            label: "Total Books",
            value: totals.books,
            icon: <FaBookOpen aria-hidden="true" />,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700"
        },
        {
            label: "Total Users",
            value: totals.users,
            icon: <FaUsers aria-hidden="true" />,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700"
        },
        {
            label: "Total Comments",
            value: totals.comments,
            icon: <FaComments aria-hidden="true" />,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-700"
        },
        {
            label: "Total Likes",
            value: totals.likes,
            icon: <FaHeart aria-hidden="true" />,
            color: "from-red-500 to-red-600",
            bgColor: "bg-red-50",
            textColor: "text-red-700"
        }
    ]

    return (
        <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* ==================== HEADER ==================== */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-2">Overview of your BookNest platform.</p>
                </div>

                {/* ==================== STAT CARDS ==================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat) => (
                        <div 
                            key={stat.label}
                            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center text-2xl`}>
                                    {stat.icon}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider ${stat.textColor} px-3 py-1 rounded-full ${stat.bgColor}`}>
                                    Live
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                            <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* ==================== QUICK ACTIONS ==================== */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Manage Books */}
                        <Link 
                            to="/admin/books"
                            className="group bg-white rounded-2xl shadow-sm p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                                <FaBookOpen aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Books</h3>
                            <p className="text-gray-500 text-sm mb-6 flex-grow">
                                View, edit, or delete books in the BookNest library.
                            </p>
                            <span className="text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                Go to Books <span>→</span>
                            </span>
                        </Link>

                        {/* Add Book */}
                        <Link 
                            to="/admin/books/add"
                            className="group bg-white rounded-2xl shadow-sm p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                                <FaPlus aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Book</h3>
                            <p className="text-gray-500 text-sm mb-6 flex-grow">
                                Add a new book to the library with details and cover.
                            </p>
                            <span className="text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                Add Book <span>→</span>
                            </span>
                        </Link>

                        {/* Manage Users */}
                        <Link 
                            to="/admin/users"
                            className="group bg-white rounded-2xl shadow-sm p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                                <FaUsers aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Users</h3>
                            <p className="text-gray-500 text-sm mb-6 flex-grow">
                                View registered users and update their roles.
                            </p>
                            <span className="text-purple-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                Go to Users <span>→</span>
                            </span>
                        </Link>

                    </div>
                </div>

            </div>
        </main>
    )
}

export default AdminDashboard