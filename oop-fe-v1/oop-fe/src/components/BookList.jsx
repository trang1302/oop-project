import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/books');
      setBooks(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load books');
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/books/search?keyword=${searchTerm}`);
      setBooks(response.data);
      setError('');
    } catch (error) {
      setError('Search failed');
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-list">
      <h2>Books</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="books-grid">
          {books.length === 0 ? (
            <p>No books found</p>
          ) : (
            books.map((book) => (
              <div key={book.id} className="book-card">
                <h3>{book.name}</h3>
                <p>Uploaded by: {book.uploadedBy}</p>
                <p>Date: {new Date(book.uploadDate).toLocaleDateString()}</p>
                <Link to={`/books/${book.id}`} className="book-link">
                  Read Book
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BookList;