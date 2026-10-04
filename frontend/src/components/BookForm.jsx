import { useState } from "react"

const emptyBook = {}

const fields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "author", label: "Author", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true, fullWidth: true },
    { name: "cover", label: "Cover URL", type: "url", required: false },
    { name: "genre", label: "Genre", type: "text", required: false },
    { name: "publishedYear", label: "Published Year", type: "number", required: false },
    { name: "pages", label: "Pages", type: "number", required: false },
    { name: "language", label: "Language", type: "text", required: false }
]

const getInitialValues = (initialData) => ({
    title: initialData.title || "",
    author: initialData.author || "",
    description: initialData.description || "",
    cover: initialData.cover || "",
    genre: initialData.genre || "",
    publishedYear: initialData.publishedYear ?? "",
    pages: initialData.pages ?? "",
    language: initialData.language || ""
})

const BookForm = ({ initialData = emptyBook, submitLabel, onSubmit, error, submitting }) => {
    const [values, setValues] = useState(() => getInitialValues(initialData))

    const changeField = (event) => {
        setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    }

    const submit = (event) => {
        event.preventDefault()
        const payload = { ...values }
        for (const key of ["publishedYear", "pages"]) {
            payload[key] = payload[key] === "" ? undefined : Number(payload[key])
        }
        onSubmit(payload)
    }

    return (
        <form onSubmit={submit} className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
            
            {/* Grid Layout for Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                
                {fields.map((field) => (
                    <div 
                        key={field.name} 
                        className={field.fullWidth ? "md:col-span-2" : ""}
                    >
                        <label 
                            htmlFor={field.name} 
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {field.type === "textarea" ? (
                            <textarea
                                id={field.name}
                                name={field.name}
                                rows="4"
                                value={values[field.name] || ""}
                                onChange={changeField}
                                required={field.required}
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 resize-none"
                            />
                        ) : (
                            <input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                value={values[field.name] ?? ""}
                                onChange={changeField}
                                required={field.required}
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                            />
                        )}

                        {/* Live Cover Preview */}
                        {field.name === "cover" && values.cover && (
                            <div className="mt-4 flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <img 
                                    src={values.cover} 
                                    alt="Cover Preview" 
                                    className="w-16 h-24 object-cover rounded-md shadow-sm"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <span className="text-sm text-gray-500">Cover Preview</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default BookForm