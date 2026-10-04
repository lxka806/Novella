import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AdminRoute from "./components/AdminRoute"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthProvider from "./context/AuthContext"
import BookDetails from "./pages/BookDetails"
import Books from "./pages/Books"
import CreateBook from "./pages/CreateBook"
import EditProfile from "./pages/EditProfile"
import Feedback from "./pages/Feedback"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import Recommendations from "./pages/Recommendations"
import Search from "./pages/Search"
import AddBook from "./pages/admin/AddBook"
import AdminBooks from "./pages/admin/AdminBooks"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminUsers from "./pages/admin/AdminUsers"
import EditBook from "./pages/admin/EditBook"
import Footer from "./components/Footer"

const NotFound = () => <p>Page not found.</p>

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/recommendations" element={<Recommendations />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/books/:id" element={<BookDetails />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/edit" element={<EditProfile />} />
                    </Route>
                    <Route element={<AdminRoute />}>
                        <Route path="/books/create" element={<CreateBook />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/books" element={<AdminBooks />} />
                        <Route path="/admin/books/add" element={<AddBook />} />
                        <Route path="/admin/books/:id/edit" element={<EditBook />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                    </Route>
                    <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
