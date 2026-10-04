import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAuth from "../context/useAuth"

const ProtectedRoute = () => {
    const { user, loading, error } = useAuth()
    const location = useLocation()

    if (loading) return <p>Loading...</p>
    if (error && !user) return <p>Something went wrong: {error}</p>
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />

    return <Outlet />
}

export default ProtectedRoute
