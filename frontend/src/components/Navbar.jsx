import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import useAuth from "../context/useAuth"
import logo from "../assets/icon.png"

const Navbar = () => {
    const { user, logout, error: authError } = useAuth()

    const [error, setError] = useState("")
    const [loggingOut, setLoggingOut] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        setError("")
        setLoggingOut(true)

        try {
            await logout()
            navigate("/login")
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Something went wrong"
            )
        } finally {
            setLoggingOut(false)
        }
    }

    const isActive = (path) => location.pathname === path

    const linkClass = (path) =>
        `relative px-3 py-2 text-sm font-medium transition-colors ${
            isActive(path)
                ? "text-black"
                : "text-gray-500 hover:text-black"
        }`

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <nav className="border-b border-gray-200/70 bg-white/90 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="h-20 flex items-center justify-between">

                        {/* Logo */}
                        <Link
                            to="/"
                            aria-label="Novella home"
                            className="flex items-center"
                        >
                            <img src={logo} alt="Novella" className="h-12 w-12 object-contain" />
                            <h1>Novella</h1>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">

                            <Link
                                to="/"
                                className={linkClass("/")}
                            >
                                Home
                                {isActive("/") && (
                                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-black rounded-full" />
                                )}
                            </Link>

                            <Link
                                to="/books"
                                className={linkClass("/books")}
                            >
                                Books
                                {isActive("/books") && (
                                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-black rounded-full" />
                                )}
                            </Link>

                            <Link
                                to="/recommendations"
                                className={linkClass("/recommendations")}
                            >
                                Recommendations
                                {isActive("/recommendations") && (
                                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-black rounded-full" />
                                )}
                            </Link>

                            <Link
                                to="/feedback"
                                className={linkClass("/feedback")}
                            >
                                Feedback
                                {isActive("/feedback") && (
                                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-black rounded-full" />
                                )}
                            </Link>

                            {user && (
                                <Link
                                    to="/profile"
                                    className={linkClass("/profile")}
                                >
                                    Profile
                                    {isActive("/profile") && (
                                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-black rounded-full" />
                                    )}
                                </Link>
                            )}

                            {user?.role === "admin" && (
                                <Link
                                    to="/admin"
                                    className={linkClass("/admin")}
                                >
                                    Admin
                                    {isActive("/admin") && (
                                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-black rounded-full" />
                                    )}
                                </Link>
                            )}
                        </div>

                        {/* Desktop Auth */}
                        <div className="hidden lg:flex items-center gap-3">
                            {user ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-100 transition"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                                            {user.username?.charAt(0).toUpperCase() ||
                                                user.name?.charAt(0).toUpperCase() ||
                                                "U"}
                                        </div>

                                        <span className="text-sm font-medium text-gray-700">
                                            {user.username || user.name || "Account"}
                                        </span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                                    >
                                        {loggingOut ? "Logging out..." : "Logout"}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                            aria-label="Toggle navigation menu"
                        >
                            <div className="space-y-1.5">
                                <span
                                    className={`block w-5 h-0.5 bg-black transition ${
                                        menuOpen ? "rotate-45 translate-y-2" : ""
                                    }`}
                                />
                                <span
                                    className={`block w-5 h-0.5 bg-black transition ${
                                        menuOpen ? "opacity-0" : ""
                                    }`}
                                />
                                <span
                                    className={`block w-5 h-0.5 bg-black transition ${
                                        menuOpen ? "-rotate-45 -translate-y-2" : ""
                                    }`}
                                />
                            </div>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {menuOpen && (
                        <div className="lg:hidden border-t border-gray-100 py-5">

                            <div className="flex flex-col gap-1">

                                <Link
                                    to="/"
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl ${
                                        isActive("/")
                                            ? "bg-black text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Home
                                </Link>

                                <Link
                                    to="/books"
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl ${
                                        isActive("/books")
                                            ? "bg-black text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Books
                                </Link>

                                <Link
                                    to="/recommendations"
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl ${
                                        isActive("/recommendations")
                                            ? "bg-black text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Recommendations
                                </Link>

                                <Link
                                    to="/feedback"
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl ${
                                        isActive("/feedback")
                                            ? "bg-black text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Feedback
                                </Link>

                                {user && (
                                    <Link
                                        to="/profile"
                                        onClick={() => setMenuOpen(false)}
                                        className={`px-4 py-3 rounded-xl ${
                                            isActive("/profile")
                                                ? "bg-black text-white"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        Profile
                                    </Link>
                                )}

                                {user?.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setMenuOpen(false)}
                                        className={`px-4 py-3 rounded-xl ${
                                            isActive("/admin")
                                                ? "bg-black text-white"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        Admin
                                    </Link>
                                )}
                            </div>

                            <div className="mt-5 pt-5 border-t border-gray-100">

                                {user ? (
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="w-full px-5 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                                    >
                                        {loggingOut
                                            ? "Logging out..."
                                            : "Logout"}
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <Link
                                            to="/login"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex-1 text-center px-5 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-100 transition"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            to="/register"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex-1 text-center px-5 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Error */}
                {(authError || error) && (
                    <div className="text-center py-2 px-4 text-red-500 text-sm bg-red-50 border-t border-red-100">
                        {authError && <p role="alert">{authError}</p>}
                        {error && <p role="alert">{error}</p>}
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Navbar
