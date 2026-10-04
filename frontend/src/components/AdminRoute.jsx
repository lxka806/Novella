import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../context/useAuth"

const AdminRoute = () => {
    const { user, loading, error } = useAuth()

    if (loading) return <p>Loading...</p>
    if (error && !user) return <p>Something went wrong: {error}</p>
    if (!user) return <Navigate to="/login" replace />
    if (user.role !== "admin") return <Navigate to="/" replace />

    return <Outlet />
}

export default AdminRoute
