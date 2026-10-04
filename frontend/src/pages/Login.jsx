import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import useAuth from "../context/useAuth"

const Login = () => {
    const { user, login, loading } = useAuth()
    const [form, setForm] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    if (loading) return <p>Loading...</p>
    if (user) return <Navigate to="/" replace />

    const submit = async (event) => {
        event.preventDefault()
        setError("")
        setSubmitting(true)
        try {
            await login(form)
            navigate(location.state?.from?.pathname || "/", { replace: true })
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main>
            <h1>Login</h1>
            <form onSubmit={submit} className="mt-90">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })} />
                <label htmlFor="password">Password</label>
                <input id="password" type="password" required value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })} />
                {error && <p role="alert">{error}</p>}
                <button disabled={submitting}>{submitting ? "Logging in..." : "Login"}</button>
            </form>
            <p>Need an account? <Link to="/register">Register</Link></p>
        </main>
    )
}

export default Login
