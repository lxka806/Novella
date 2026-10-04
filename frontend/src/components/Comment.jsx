import { FiTrash2 } from "react-icons/fi"

const Comment = ({ comment, canDelete, onDelete, deleting }) => (
    <article className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex gap-4">
            
            {/* Avatar */}
            {comment.user?.avatar ? (
                <img 
                    src={comment.user.avatar} 
                    alt={`${comment.user.name || "User"} avatar`} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm shrink-0"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                    {comment.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
            )}

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
                
                {/* Header: Name + Timestamp + Delete */}
                <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                            {comment.user?.name || "Unknown user"}
                        </p>
                        <p className="text-xs text-gray-400">
                            {comment.createdAt 
                                ? new Date(comment.createdAt).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) 
                                : ""}
                        </p>
                    </div>

                    {/* Delete Button */}
                    {canDelete && (
                        <button 
                            type="button" 
                            onClick={() => onDelete(comment._id)} 
                            disabled={deleting}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors disabled:opacity-50 shrink-0"
                            aria-label="Delete comment"
                        >
                            {deleting ? (
                                <span className="text-xs font-medium">...</span>
                            ) : (
                                <FiTrash2 className="w-5 h-5" aria-hidden="true" />
                            )}
                        </button>
                    )}
                </div>

                {/* Comment Text */}
                <p className="text-gray-700 leading-relaxed break-words">
                    {comment.content}
                </p>
            </div>
        </div>
    </article>
)

export default Comment