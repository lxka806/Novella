import { Link } from "react-router-dom"

const currentYear = new Date().getFullYear()

const Footer = () => {
    return (
        <footer className="bg-black text-white border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* ==================== TOP SECTION ==================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="text-3xl font-bold tracking-tight text-white block mb-4">
                            Novella
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Stories worth getting lost in. Discover books, build your library, and find your next favorite read.
                        </p>
                    </div>

                    {/* Explore Column */}
                    <div>
                        <h3 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-6">
                            Explore
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/books" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    All Books
                                </Link>
                            </li>
                            <li>
                                <Link to="/books?genre=Fantasy" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Fantasy
                                </Link>
                            </li>
                            <li>
                                <Link to="/books?genre=Mystery" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Mystery
                                </Link>
                            </li>
                            <li>
                                <Link to="/books?genre=Romance" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Romance
                                </Link>
                            </li>
                            <li>
                                <Link to="/recommendations" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    AI Recommendations
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account Column */}
                    <div>
                        <h3 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-6">
                            Account
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile/edit" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Edit Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/feedback" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Send Feedback
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h3 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-6">
                            Stay Curious
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Get weekly book recommendations and updates from Novella.
                        </p>
                        <form 
                            onSubmit={(e) => e.preventDefault()} 
                            className="flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden focus-within:border-white/30 transition-colors"
                        >
                            <input 
                                type="email" 
                                placeholder="Your email"
                                className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
                            />
                            <button 
                                type="submit"
                                className="bg-white text-black font-semibold text-sm px-5 py-3 hover:bg-gray-200 transition-colors"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                {/* ==================== DIVIDER ==================== */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    {/* Copyright */}
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        © {currentYear} Novella. All rights reserved.
                    </p>

                    {/* Legal Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer