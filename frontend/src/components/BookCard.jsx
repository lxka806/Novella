import { Link } from "react-router-dom"

const BookCard = ({ book }) => (
    <article className="group relative w-full max-w-sm">

        <Link to={`/books/${book._id}`} className="block">

            {/* Card */}
            <div className="relative h-[520px] rounded-3xl overflow-hidden bg-gray-900 shadow-xl group-hover:shadow-2xl transition-all duration-500">

                {/* Background Cover */}
                {book.cover ? (
                    <img
                        src={book.cover}
                        alt={`${book.title} cover`}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-800" />
                )}

                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Top Section */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">

                    {/* Genre */}
                    <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                        {book.genre || "Book"}
                    </span>

                </div>

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">

                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl scale-75 group-hover:scale-100 transition-transform duration-500">
                        <span className="text-2xl text-gray-900">
                            →
                        </span>
                    </div>

                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                    {/* Author */}
                    <p className="text-sm text-white/70 mb-2">
                        {book.author}
                    </p>

                    {/* Title */}
                    <h2 className="text-3xl font-bold leading-tight line-clamp-2">
                        {book.title}
                    </h2>

                    {/* Description */}
                    {book.description && (
                        <p className="mt-3 text-sm text-white/70 line-clamp-2 leading-relaxed">
                            {book.description}
                        </p>
                    )}

                    {/* Bottom Stats */}
                    <div className="mt-5 flex items-center justify-between">

                        <div className="flex items-center gap-4 text-sm text-white/70">

                            {book.publishedYear && (
                                <span>
                                    {book.publishedYear}
                                </span>
                            )}

                            {book.pages && (
                                <span>
                                    {book.pages} pages
                                </span>
                            )}

                        </div>

                        {/* Likes */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-red-400 text-lg">
                                ♥
                            </span>

                            <span>
                                {book.likes?.length ?? 0}
                            </span>
                        </div>

                    </div>

                </div>
            </div>

        </Link>

    </article>
)

export default BookCard