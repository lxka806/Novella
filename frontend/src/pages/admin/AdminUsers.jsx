import { useEffect, useState } from "react"
import api from "../../api/axios"

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await api.get("/admin/users")
                setUsers(response.data.users)
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        loadUsers()
    }, [])

    const updateRole = async (id, role) => {
        setError("")
        setUpdatingId(id)
        try {
            const response = await api.patch(`/admin/users/${id}`, { role })
            const updatedUser = response.data.user
            setUsers((current) => current.map((user) =>
                user._id === id ? { ...user, ...updatedUser, role } : user
            ))
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setUpdatingId("")
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
            Loading users...
        </div>
    )

    return (
        <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* ==================== HEADER ==================== */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">Manage Users</h1>
                    <p className="text-gray-500 mt-2">
                        {users.length} registered {users.length === 1 ? "user" : "users"} on BookNest
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* ==================== USERS LIST ==================== */}
                {users.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm p-16 text-center border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500">No users found.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                        
                        {/* Table Header (Hidden on Mobile) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold tracking-wider text-gray-500 uppercase">
                            <div className="col-span-4">User</div>
                            <div className="col-span-3">Joined</div>
                            <div className="col-span-2">Role</div>
                            <div className="col-span-3 text-right">Change Role</div>
                        </div>

                        {/* User Rows */}
                        <div className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <div 
                                    key={user._id} 
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors"
                                >
                                    
                                    {/* User Info (Avatar, Name, Email) */}
                                    <div className="col-span-4 flex items-center gap-4">
                                        {user.avatar ? (
                                            <img 
                                                src={user.avatar} 
                                                alt={`${user.name} avatar`} 
                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                                                {user.name?.charAt(0).toUpperCase() || "?"}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Joined Date */}
                                    <div className="col-span-3 text-sm text-gray-600">
                                        <span className="md:hidden font-semibold text-gray-400 text-xs uppercase block mb-1">Joined</span>
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) : "N/A"}
                                    </div>

                                    {/* Current Role Badge */}
                                    <div className="col-span-2">
                                        <span className="md:hidden font-semibold text-gray-400 text-xs uppercase block mb-1">Role</span>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                            user.role === "admin" 
                                            ? "bg-purple-100 text-purple-700" 
                                            : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {user.role || "user"}
                                        </span>
                                    </div>

                                    {/* Role Selector */}
                                    <div className="col-span-3 flex md:justify-end">
                                        <select 
                                            id={`role-${user._id}`} 
                                            value={user.role || "user"}
                                            disabled={updatingId === user._id}
                                            onChange={(event) => updateRole(user._id, event.target.value)}
                                            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer disabled:opacity-50 w-full md:w-auto"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
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

export default AdminUsers