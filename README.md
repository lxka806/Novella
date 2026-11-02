# 📚 Novella — Stories Worth Getting Lost In

**Novella** is a full-stack book discovery and library platform designed for readers who want to explore new books, discover their next favorite story, and build their own personal reading collection.

Discover books, explore different genres, get personalized recommendations, and keep your favorite stories in one place.

<blockquote>
  Stories worth getting lost in. Discover books, build your library, and find your next favorite read.
</blockquote>

## 🌐 Live Demo

**Website:** https://novella-luka.netlify.app/

**Repository:** https://github.com/lxka806/Novella

## ✨ Features

### 📖 Book Discovery
- Browse a collection of books.
- Explore books by genre.
- Search and discover new titles.
- View detailed book information.
- Explore book descriptions, authors, and covers.

### 🎯 Recommendations
- Personalized book recommendations.
- Discover books based on reading interests.
- Explore new titles and genres.

### ❤️ Personal Library
- Save books to your favorites.
- Manage your personal profile.
- Edit profile information.
- Keep track of books you are interested in.

### 👤 Authentication
- User registration and login.
- User account management.
- Profile functionality.
- Secure access to user-specific features.

### 🛠️ Admin Dashboard
- Dedicated administration panel.
- Add new books to the collection.
- Manage book information.
- Update book details, including:
  - Title
  - Author
  - Description
  - Cover image URL
  - Genre
  - Publication year
  - Number of pages
  - Language

### 💬 Community & Feedback
- Submit feedback.
- Interact with book-related content.
- Comments and user engagement.

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Development and build tooling |
| Tailwind CSS | UI styling |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | Database modeling |

## 🏗️ Architecture

Novella follows a full-stack client-server architecture.

**Frontend**
- React-based user interface.
- Responsive layouts.
- Reusable components.
- API communication with the backend.

**Backend**
- Express.js REST API.
- Authentication and user management.
- Book management.
- Feedback and user-related functionality.
- Administrative operations.

**Database**
- MongoDB for persistent data storage.
- Mongoose for schema definitions and database operations.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database

### 1. Clone the repository

```bash
git clone https://github.com/lxka806/Novella.git
cd Novella
```

### 2. Install dependencies

Install dependencies in the frontend and backend directories according to the project structure.

```bash
npm install
```

### 3. Environment Variables

Configure the required environment variables for the backend, including your MongoDB connection string and authentication configuration.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the Application

Start the backend and frontend using their respective development scripts.

```bash
npm run dev
```

## 🎨 Project Goals

Novella was created to provide a convenient and enjoyable experience for book lovers.

The main goals are:

- Make book discovery easier.
- Help readers explore different genres.
- Provide a personalized reading experience.
- Create a centralized personal book collection.
- Give administrators an easy way to manage the book catalog.

## 👨‍💻 Developer

**Luka Ivanishvili**

Full-Stack Developer

- GitHub: [@lxka806](https://github.com/lxka806)
- Live Project: [Novella](https://novella-luka.netlify.app/)

---

<p align="center">
  **Novella — Every book has a story. Find yours.**
</p>
