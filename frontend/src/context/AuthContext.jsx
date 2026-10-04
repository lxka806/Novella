import { useEffect, useState } from "react"
import api from "../api/axios"
import AuthContext from "./auth-context"

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const getProfile = async () => {
        try {
            const response = await api.get("/auth/profile")
            setError("")
            setUser(response.data.user)
            return response.data.user
        } catch (requestError) {
            if (requestError.response?.status === 401) {
                setError("")
                setUser(null)
                return null
            }
            setError(requestError.response?.data?.message || "Something went wrong")
            throw requestError
        }
    }

    useEffect(() => {
        Promise.resolve()
            .then(() => getProfile())
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const login = async (credentials) => {
        setError("")
        const response = await api.post("/auth/login", credentials)
        setUser(response.data.user)
        return response.data.user
    }

    const register = async (details) => {
        setError("")
        const response = await api.post("/auth/register", details)
        setUser(response.data.user)
        return response.data.user
    }

    const logout = async () => {
        setError("")
        await api.post("/auth/logout")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            setError,
            login,
            register,
            logout,
            getProfile
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
