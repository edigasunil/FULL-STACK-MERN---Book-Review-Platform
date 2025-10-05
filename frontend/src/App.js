import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import { AuthProvider } from './contexts/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddEditBook from './pages/AddEditBook';
import ProtectedRoute from './components/ProtectedRoute';

// Nav moved to components/Nav.js and will be imported
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <div className="nav">
      <div style={{flex:1}}>
        <Link to="/">Home</Link> | <Link to="/add">Add Book</Link>
      </div>
      <div>
        {user ? <span className="small">Hi, {user.name}</span> : (<><Link to="/login">Login</Link> | <Link to="/signup">Signup</Link></>)}
      </div>
    </div>
  );
}

export default function App(){
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <div className="container">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/add" element={<ProtectedRoute><AddEditBook /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><AddEditBook /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
