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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
            Loading...
        </div>
    )
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
        <main className="min-h-screen flex mt-12">
            
            {/* ==================== LEFT PANEL: BRANDING ==================== */}
            <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col justify-between p-12 relative overflow-hidden">
                
                {/* Decorative Gradient Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

                {/* Top: Logo */}
                <div className="relative z-10">
                    <Link to="/" className="text-4xl font-bold tracking-tight">
                        Novella
                    </Link>
                </div>

                {/* Middle: Quote */}
                <div className="relative z-10 max-w-md">
                    <p className="text-3xl font-bold leading-tight mb-6">
                        "A reader lives a thousand lives before he dies."
                    </p>
                    <p className="text-gray-400 text-lg">— George R.R. Martin</p>
                </div>

                {/* Bottom: Footer Text */}
                <div className="relative z-10">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Novella. All rights reserved.
                    </p>
                </div>
            </div>

            {/* ==================== RIGHT PANEL: FORM ==================== */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
                <div className="w-full max-w-md">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-10">
                        <Link to="/" className="text-3xl font-bold text-black">Novella</Link>
                    </div>

                    {/* Heading */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back.</h1>
                        <p className="text-gray-500">Log in to continue your reading journey.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input 
                                id="email" 
                                type="email" 
                                required 
                                value={form.email}
                                onChange={(event) => setForm({ ...form, email: event.target.value })}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <input 
                                id="password" 
                                type="password" 
                                required 
                                value={form.password}
                                onChange={(event) => setForm({ ...form, password: event.target.value })}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div role="alert" className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full px-6 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="mt-8 text-center text-sm text-gray-500">
                        Need an account?{" "}
                        <Link to="/register" className="font-semibold text-black hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Login