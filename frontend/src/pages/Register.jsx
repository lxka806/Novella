import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import useAuth from "../context/useAuth"

const Register = () => {
    const { user, register, loading } = useAuth()
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

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
            await register(form)
            navigate("/", { replace: true })
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
                        "There is no friend as loyal as a book."
                    </p>
                    <p className="text-gray-400 text-lg">— Ernest Hemingway</p>
                </div>

                {/* Bottom: Feature Highlights */}
                <div className="relative z-10 space-y-3">
                    <p className="text-gray-500 text-sm uppercase tracking-widest mb-3">What you get</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            Build your personal library
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            AI-powered book recommendations
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            Connect with fellow readers
                        </li>
                    </ul>
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
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create your account.</h1>
                        <p className="text-gray-500">Join Novella and start your reading journey.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Name
                            </label>
                            <input 
                                id="name" 
                                type="text"
                                required 
                                value={form.name}
                                onChange={(event) => setForm({ ...form, name: event.target.value })}
                                placeholder="Your display name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                            />
                        </div>

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
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input 
                                id="password" 
                                type="password" 
                                required 
                                minLength="6"
                                value={form.password}
                                onChange={(event) => setForm({ ...form, password: event.target.value })}
                                placeholder="At least 6 characters"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Must be at least 6 characters long.
                            </p>
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
                            {submitting ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Terms Note */}
                    <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <a href="#" className="text-gray-700 hover:underline">Terms of Service</a>{" "}
                        and{" "}
                        <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>.
                    </p>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already registered?{" "}
                        <Link to="/login" className="font-semibold text-black hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Register