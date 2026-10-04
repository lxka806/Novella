import { useEffect, useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    FaArrowRight,
    FaBolt,
    FaBookmark,
    FaCompass,
    FaDragon,
    FaHeart,
    FaLandmark,
    FaRocket,
    FaRobot,
    FaStar,
    FaUser,
    FaUserSecret,
    FaUsers
} from "react-icons/fa"
import api from "../api/axios"
import BookCard from "../components/BookCard"
import HomeBg from "../assets/HomeBg.png"

const Home = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const response = await api.get("/books")
                setBooks(response.data.books)
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    "Something went wrong"
                )
            } finally {
                setLoading(false)
            }
        }
        loadBooks()
    }, [])

    // --- Derived Data ---
    
    // Featured Book: Highest rated book
    const featuredBook = useMemo(() => {
        if (books.length === 0) return null
        return [...books].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0]
    }, [books])

    // Trending Now: Sorted by likes (descending), limited to 8
    const trendingBooks = useMemo(() => {
        return [...books]
            .sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
            .slice(0, 8)
    }, [books])

    // Recently Added: Sorted by createdAt (descending), limited to 4
    const recentlyAdded = useMemo(() => {
        return [...books]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4)
    }, [books])

    // AI Preview Books: Pick 2-3 books for the AI assistant mock
    const aiPreviewBooks = useMemo(() => {
        return [...books]
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, 3)
    }, [books])

    // Platform Stats
    const stats = useMemo(() => {
        const uniqueGenres = new Set(books.map(b => b.genre).filter(Boolean))
        const uniqueAuthors = new Set(books.map(b => b.author).filter(Boolean))
        return {
            books: books.length,
            genres: uniqueGenres.size,
            authors: uniqueAuthors.size
        }
    }, [books])

    // Hero Floating Covers: Pick first 4 books for decorative covers
    const heroCovers = useMemo(() => {
        return [...books].slice(0, 4)
    }, [books])

    // --- Handlers ---
    const searchBooks = (event) => {
        event.preventDefault()
        const query = searchTerm.trim()
        if (query) {
            navigate(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    const handleClearSearch = () => {
        setSearchTerm("")
    }

    const handleMoodClick = (genre) => {
        navigate(`/books?genre=${encodeURIComponent(genre)}`)
    }

    // --- Loading & Error States ---
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
            Loading Novella...
        </div>
    )
    if (error) return (
        <div role="alert" className="min-h-screen flex items-center justify-center text-red-500">
            {error}
        </div>
    )

    // Moods with icons
    const moods = [
        { name: "Mystery", icon: <FaUserSecret aria-hidden="true" />, bg: "bg-gray-800" },
        { name: "Adventure", icon: <FaCompass aria-hidden="true" />, bg: "bg-amber-700" },
        { name: "Fantasy", icon: <FaDragon aria-hidden="true" />, bg: "bg-emerald-800" },
        { name: "Romance", icon: <FaHeart aria-hidden="true" />, bg: "bg-rose-800" },
        { name: "Science Fiction", icon: <FaRocket aria-hidden="true" />, bg: "bg-indigo-800" },
        { name: "Thriller", icon: <FaBolt aria-hidden="true" />, bg: "bg-red-900" },
        { name: "History", icon: <FaLandmark aria-hidden="true" />, bg: "bg-yellow-800" },
        { name: "Biography", icon: <FaUser aria-hidden="true" />, bg: "bg-slate-700" }
    ]

    // Features
    const features = [
        {
            icon: <FaCompass />,
            title: "Discover",
            description: "Explore books across different genres."
        },
        {
            icon: <FaBookmark />,
            title: "Build Your Library",
            description: "Save books you want to read later."
        },
        {
            icon: <FaRobot />,
            title: "AI Recommendations",
            description: "Get personalized recommendations based on your activity."
        },
        {
            icon: <FaUsers />,
            title: "Community",
            description: "Share your thoughts and help improve Novella."
        }
    ]

    return (
        <main className="bg-white">
            
            {/* ==================== 1. HERO SECTION ==================== */}
            <section
                className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4 overflow-hidden"
                style={{ backgroundImage: `url(${HomeBg})` }}
            >
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>

                {/* Floating Book Covers (Decorative) */}
                {heroCovers.length >= 4 && (
                    <>
                        <div className="hidden lg:block absolute top-24 left-10 w-40 xl:w-48 rotate-[-12deg] opacity-40 hover:opacity-70 transition-opacity duration-500 shadow-2xl">
                            <img src={heroCovers[0].cover} alt="" className="w-full h-auto rounded-lg" />
                        </div>
                        <div className="hidden lg:block absolute bottom-24 left-20 w-36 xl:w-44 rotate-[8deg] opacity-40 hover:opacity-70 transition-opacity duration-500 shadow-2xl">
                            <img src={heroCovers[1].cover} alt="" className="w-full h-auto rounded-lg" />
                        </div>
                        <div className="hidden lg:block absolute top-32 right-10 w-40 xl:w-48 rotate-[12deg] opacity-40 hover:opacity-70 transition-opacity duration-500 shadow-2xl">
                            <img src={heroCovers[2].cover} alt="" className="w-full h-auto rounded-lg" />
                        </div>
                        <div className="hidden lg:block absolute bottom-32 right-20 w-36 xl:w-44 rotate-[-8deg] opacity-40 hover:opacity-70 transition-opacity duration-500 shadow-2xl">
                            <img src={heroCovers[3].cover} alt="" className="w-full h-auto rounded-lg" />
                        </div>
                    </>
                )}

                <div className="relative z-10 w-full max-w-4xl text-center text-white flex flex-col items-center">
                    
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight px-2">
                        Stories worth<br />getting lost in.
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
                        Discover books, build your personal library, and let Novella help you find your next favorite story.
                    </p>

                    {/* Glassmorphism Search Bar */}
                    <form onSubmit={searchBooks} className="w-full max-w-2xl mb-8 relative">
                        <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl overflow-hidden transition-all focus-within:bg-white/20 focus-within:border-white/40">
                            <svg className="absolute left-5 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by title or author..."
                                className="w-full py-4 pl-14 pr-12 bg-transparent text-white placeholder-white/50 focus:outline-none text-lg"
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-5 text-white/60 hover:text-white transition-colors"
                                    aria-label="Clear search"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Hero Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                        <Link 
                            to="/books" 
                            className="px-8 py-4 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                        >
                            Explore Books
                        </Link>
                        <Link 
                            to="/recommendations" 
                            className="px-8 py-4 bg-transparent border-2 border-white/60 text-white font-semibold rounded-full shadow-lg hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-300"
                        >
                            Ask Novella AI
                        </Link>
                    </div>

                    {/* Platform Stats */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
                        <div>
                            <p className="text-3xl md:text-4xl font-bold text-white">{stats.books}</p>
                            <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">Books</p>
                        </div>
                        <div className="w-px h-12 bg-white/20"></div>
                        <div>
                            <p className="text-3xl md:text-4xl font-bold text-white">{stats.genres}</p>
                            <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">Genres</p>
                        </div>
                        <div className="w-px h-12 bg-white/20"></div>
                        <div>
                            <p className="text-3xl md:text-4xl font-bold text-white">{stats.authors}</p>
                            <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">Authors</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 2. TRENDING NOW ==================== */}
            <section className="py-24 bg-white overflow-hidden">
                
                {/* Header (Constrained Width) */}
                <div className="max-w-7xl mx-auto px-4 mb-10 flex flex-col sm:flex-row justify-between items-end gap-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Trending Now</h2>
                        <p className="text-lg text-gray-500">Books readers are loving right now.</p>
                    </div>
                    <Link 
                        to="/books" 
                        className="text-black font-semibold hover:text-gray-600 transition-colors flex items-center gap-1"
                    >
                        View All <span>→</span>
                    </Link>
                </div>

                {/* Horizontal Scroll Container (Full Width) */}
                {trendingBooks.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No books found.</p>
                ) : (
                    <div className="relative">
                        
                        {/* Right Fade Hint (Only visible when there's more to scroll) */}
                        <div className="absolute right-0 top-0 bottom-8 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden sm:block"></div>
                        
                        {/* Scrollable Row */}
                        <div className="flex gap-6 overflow-x-auto pb-8 px-4 sm:px-8 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                            {trendingBooks.map((book) => (
                                <div 
                                    key={book._id} 
                                    className="snap-start shrink-0 w-44 sm:w-52 md:w-56 transition-transform duration-300 hover:-translate-y-2"
                                >
                                    <BookCard book={book} />
                                </div>
                            ))}
                            
                            {/* Spacer to prevent the last card from touching the edge */}
                            <div className="shrink-0 w-4 sm:w-8"></div>
                        </div>
                    </div>
                )}
            </section>

            {/* ==================== 3. FEATURED STORY ==================== */}
            {featuredBook && (
                <section className="py-24 px-4 bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            
                            {/* Left: Cover */}
                            <div className="w-full lg:w-1/2 flex justify-center">
                                <div className="relative">
                                    <div className="absolute -inset-6 bg-black/5 rounded-3xl blur-2xl"></div>
                                    <img 
                                        src={featuredBook.cover} 
                                        alt={featuredBook.title} 
                                        className="relative w-full max-w-sm rounded-xl shadow-2xl object-cover aspect-[3/4]"
                                    />
                                </div>
                            </div>

                            {/* Right: Details */}
                            <div className="w-full lg:w-1/2 text-gray-900">
                                <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-4 block">
                                    Featured Story
                                </span>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                                    {featuredBook.title}
                                </h2>
                                <p className="text-xl text-gray-600 mb-8">by {featuredBook.author}</p>
                                
                                <div className="flex flex-wrap items-center gap-6 text-sm font-medium mb-8 pb-8 border-b border-gray-200">
                                    <span className="uppercase tracking-wider">{featuredBook.genre || "Unspecified"}</span>
                                    <span className="flex items-center gap-1 text-yellow-600">
                                        <FaStar aria-hidden="true" /> {featuredBook.rating ?? 0}
                                    </span>
                                    <span className="text-gray-500">
                                        {featuredBook.publishedYear || "Year N/A"} • {featuredBook.pages || "N/A"} pages
                                    </span>
                                </div>

                                <p className="text-gray-700 text-lg leading-relaxed mb-10 line-clamp-5">
                                    {featuredBook.description || "No description available for this book."}
                                </p>

                                <Link 
                                    to={`/books/${featuredBook._id}`}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300"
                                >
                                    Discover Story <FaArrowRight aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ==================== 4. PICK YOUR MOOD ==================== */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What's your mood?</h2>
                    <p className="text-lg text-gray-500 mb-16">Choose a feeling and discover where it takes you.</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {moods.map((mood) => (
                            <button
                                key={mood.name}
                                onClick={() => handleMoodClick(mood.name)}
                                className={`${mood.bg} group relative h-40 md:h-48 rounded-2xl flex flex-col items-center justify-center text-white overflow-hidden transition-transform duration-300 hover:scale-105 shadow-lg`}
                            >
                                <span aria-hidden="true" className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {mood.icon}
                                </span>
                                <span className="text-lg md:text-xl font-bold tracking-wide">
                                    {mood.name}
                                </span>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== 5. WHY NOVELLA ==================== */}
            <section className="py-24 px-4 bg-gray-50 border-y border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Novella</h2>
                        <p className="text-lg text-gray-500">More than just a book list.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {features.map((feature) => (
                            <div key={feature.title} className="text-center group">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center text-2xl text-black mx-auto mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== 6. RECENTLY ADDED ==================== */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-4">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Recently Added</h2>
                            <p className="text-lg text-gray-500">Fresh stories added to Novella.</p>
                        </div>
                        <Link to="/books" className="text-black font-semibold hover:text-gray-600 transition-colors flex items-center gap-1">
                            Explore the Library <FaArrowRight aria-hidden="true" />
                        </Link>
                    </div>

                    {recentlyAdded.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No books found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                            {recentlyAdded.map((book, index) => (
                                <div 
                                    key={book._id} 
                                    className={`${index % 2 === 1 ? 'lg:mt-12' : ''} transition-transform duration-500 hover:-translate-y-2`}
                                >
                                    <BookCard book={book} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ==================== 7. AI READING ASSISTANT ==================== */}
            <section className="py-24 px-4 bg-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
                
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        
                        {/* Left: Text */}
                        <div className="w-full lg:w-1/2 text-white">
                            <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4 block">
                                AI Reading Assistant
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                Meet your personal reading assistant.
                            </h2>
                            <p className="text-lg text-gray-400 leading-relaxed mb-10">
                                Not sure what to read? Tell Novella what you're looking for and let AI help you discover your next story.
                            </p>
                            <Link 
                                to="/recommendations"
                                className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                                Ask Novella AI <FaArrowRight aria-hidden="true" />
                            </Link>
                        </div>

                        {/* Right: Chat Preview */}
                        <div className="w-full lg:w-1/2">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                                
                                {/* User Message */}
                                <div className="flex justify-end mb-6">
                                    <div className="bg-white text-black rounded-2xl rounded-tr-sm px-5 py-3 max-w-[80%] shadow-lg">
                                        <p className="text-sm">I want something mysterious, atmospheric, and not too long.</p>
                                    </div>
                                </div>

                                {/* AI Response */}
                                <div className="flex justify-start mb-6">
                                    <div className="bg-white/10 border border-white/10 text-white rounded-2xl rounded-tl-sm px-5 py-3 max-w-[80%]">
                                        <p className="text-sm">Here are a few stories you might enjoy...</p>
                                    </div>
                                </div>

                                {/* AI Book Previews */}
                                <div className="space-y-3">
                                    {aiPreviewBooks.map((book) => (
                                        <Link 
                                            key={book._id} 
                                            to={`/books/${book._id}`}
                                            className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-colors group"
                                        >
                                            {book.cover && (
                                                <img 
                                                    src={book.cover} 
                                                    alt={book.title} 
                                                    className="w-12 h-16 object-cover rounded-md shadow-md shrink-0"
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-white font-semibold text-sm truncate group-hover:text-gray-200">
                                                    {book.title}
                                                </p>
                                                <p className="text-gray-400 text-xs truncate">{book.author}</p>
                                                <p className="text-gray-500 text-xs mt-1">{book.genre || "Fiction"}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 8. FINAL CTA ==================== */}
            <section className="py-24 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Your next story is waiting.
                    </h2>
                    <p className="text-xl text-gray-500 mb-10">
                        Discover something new and find your next favorite book.
                    </p>
                    <Link 
                        to="/books"
                        className="inline-block px-10 py-5 bg-black text-white font-bold text-lg rounded-full shadow-2xl hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                    >
                        Explore Books <FaArrowRight aria-hidden="true" />
                    </Link>
                </div>
            </section>

        </main>
    )
}

export default Home