import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Nav from './components/Nav';
import { AuthProvider } from './contexts/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddEditBook from './pages/AddEditBook';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

// Navigation component for top menu
function Navigation() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="nav">
      <div style={{ flex: 1 }}>
        <Link to="/">Home</Link> | <Link to="/add">Add Book</Link> | <Link to="/profile">Profile</Link>
      </div>
      <div>
        {user ? (
          <span className="small">Hi, {user.name}</span>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
}

// Main App component
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/add" element={<ProtectedRoute><AddEditBook /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><AddEditBook /></ProtectedRoute>} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
