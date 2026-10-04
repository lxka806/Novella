import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios"
import useAuth from "../context/useAuth"

const EditProfile = () => {
    const { getProfile } = useAuth()
    const [form, setForm] = useState({ name: "", email: "", bio: "", avatar: "" })
    const [avatarFileName, setAvatarFileName] = useState("")
    const [avatarPreview, setAvatarPreview] = useState("")
    const [avatarReading, setAvatarReading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await api.get("/auth/profile")
                const user = response.data.user
                setForm({
                    name: user.name || "",
                    email: user.email || "",
                    bio: user.bio || "",
                    avatar: user.avatar || ""
                })
                setAvatarPreview(user.avatar || "")
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [])

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            setError("Please choose an image file")
            event.target.value = ""
            return
        }

        if (file.size > 1024 * 1024) {
            setError("Choose an image smaller than 1MB")
            event.target.value = ""
            return
        }

        setError("")
        setAvatarFileName(file.name)
        setAvatarReading(true)
        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setForm((current) => ({ ...current, avatar: reader.result }))
                setAvatarPreview(reader.result)
            } else {
                setError("Could not read the selected image")
            }
            setAvatarReading(false)
        }
        reader.onerror = () => {
            setError("Could not read the selected image")
            setAvatarReading(false)
        }
        reader.readAsDataURL(file)
    }

    const submit = async (event) => {
        event.preventDefault()
        setError("")
        setSubmitting(true)
        
        try {
            await api.patch("/auth/profile", {
                name: form.name,
                email: form.email,
                bio: form.bio,
                avatar: form.avatar
            })
            
            await getProfile()
            navigate("/profile")
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
            Loading profile...
        </div>
    )

    return (
        <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                
                {/* Header */}
                <div className="mb-10">
                    <Link 
                        to="/profile" 
                        className="text-gray-500 hover:text-black transition-colors text-sm font-medium flex items-center gap-1 mb-4"
                    >
                        ← Back to Profile
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="text-gray-500 mt-2">Update your personal information and public avatar.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
                    <form onSubmit={submit} className="space-y-8">
                        
                        {/* Avatar Upload Section */}
                        <div className="flex flex-col items-center sm:flex-row gap-8 pb-8 border-b border-gray-100">
                            
                            {/* Avatar Preview */}
                            <div className="w-28 h-28 rounded-full border-4 border-gray-100 shadow-md overflow-hidden bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-400 shrink-0">
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview} 
                                        alt="Avatar Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    form.name?.charAt(0).toUpperCase() || "?"
                                )}
                            </div>

                            {/* File Upload Input */}
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Profile Picture
                                </label>
                                
                                {/* Hidden actual file input */}
                                <input 
                                    id="avatar-upload"
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden" 
                                />
                                
                                {/* Custom Styled Upload Button */}
                                <div className="flex items-center gap-4">
                                    <label 
                                        htmlFor="avatar-upload"
                                        className="px-6 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-colors text-center"
                                    >
                                        Choose Image
                                    </label>
                                    <span className="text-sm text-gray-500 truncate">
                                        {avatarFileName || "No file chosen"}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Image file, maximum size 1MB.</p>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Name
                            </label>
                            <input 
                                id="name" 
                                name="name"
                                type="text" 
                                required
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your display name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input 
                                id="email" 
                                name="email"
                                type="email" 
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea 
                                id="bio" 
                                name="bio"
                                rows="4"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Tell the BookNest community a little about yourself..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 resize-none"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div role="alert" className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button 
                                type="submit"
                                disabled={submitting || avatarReading}
                                className="flex-1 px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {avatarReading ? "Reading image..." : submitting ? "Saving..." : "Save Changes"}
                            </button>
                            <Link 
                                to="/profile"
                                className="flex-1 px-8 py-4 bg-white text-black font-bold rounded-full border border-gray-300 hover:bg-gray-50 transition-all duration-300 text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default EditProfile