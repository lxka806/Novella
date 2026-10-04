import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../api/axios"
import BookForm from "../../components/BookForm"

const AddBook = () => {
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    const addBook = async (bookData) => {
        setError("")
        setSubmitting(true)
        try {
            await api.post("/admin/books", bookData)
            navigate("/admin/books")
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-10">
                    <Link 
                        to="/admin/books" 
                        className="text-gray-500 hover:text-black transition-colors text-sm font-medium flex items-center gap-1 mb-4"
                    >
                        ← Back to Books
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900">Add New Book</h1>
                    <p className="text-gray-500 mt-2">Fill in the details below to add a new book to BookNest.</p>
                </div>

                {/* Form */}
                <BookForm 
                    submitLabel="Add Book" 
                    onSubmit={addBook}
                    error={error} 
                    submitting={submitting} 
                />
            </div>
        </main>
    )
}

export default AddBook