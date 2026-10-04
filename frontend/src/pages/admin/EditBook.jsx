import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../api/axios"
import BookForm from "../../components/BookForm"

const EditBook = () => {
    const { id } = useParams()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const loadBook = async () => {
            try {
                const response = await api.get(`/admin/books/${id}`)
                setBook(response.data.book)
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        loadBook()
    }, [id])

    const updateBook = async (bookData) => {
        setError("")
        setSubmitting(true)
        try {
            await api.patch(`/admin/books/${id}`, bookData)
            navigate("/admin/books")
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p>Loading...</p>
    if (!book) return <p role="alert">{error || "Book not found."}</p>

    return (
        <main>
            <h1>Edit Book</h1>
            <BookForm initialData={book} submitLabel="Save Changes" onSubmit={updateBook}
                error={error} submitting={submitting} />
        </main>
    )
}

export default EditBook
