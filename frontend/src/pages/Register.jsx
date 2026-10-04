import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import useAuth from "../context/useAuth"

const Register = () => {
    const { user, register, loading } = useAuth()
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    if (loading) return <p>Loading...</p>
    if (user) return <Navigate to="/" replace />

    const submit = async (event) => {
        event.preventDefault()
        setError("")
        setSubmitting(true)
        try {
            await register(form)
            navigate("/", { replace: true })
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main>
            <h1>Register</h1>
            <form onSubmit={submit}>
                <label htmlFor="name">Name</label>
                <input id="name" required value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })} />
                <label htmlFor="password">Password</label>
                <input id="password" type="password" required minLength="6" value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })} />
                {error && <p role="alert">{error}</p>}
                <button disabled={submitting}>{submitting ? "Creating account..." : "Register"}</button>
            </form>
            <p>Already registered? <Link to="/login">Login</Link></p>
        </main>
    )
}

export default Register
