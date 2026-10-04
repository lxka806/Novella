import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import BookForm from "../components/BookForm"

const CreateBook = () => {
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    const createBook = async (bookData) => {
        setError("")
        setSubmitting(true)
        try {
            const response = await api.post("/books", bookData)
            navigate(`/books/${response.data.book._id}`)
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main>
            <h1>Create Book</h1>
            <BookForm submitLabel="Create Book" onSubmit={createBook}
                error={error} submitting={submitting} />
        </main>
    )
}

export default CreateBook
