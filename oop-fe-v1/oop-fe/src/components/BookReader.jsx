import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const BookReader = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/books/${id}`);
        setBook(response.data);
        setError('');
      } catch (error) {
        setError('Failed to load book details');
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const openBookFile = async () => {
    console.log(id, "id");
  
    try {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');
  
      if (!username || !password) {
        setError('Authentication information missing. Please log in again.');
        return;
      }
  
      const response = await fetch(`${api.defaults.baseURL}/api/books/${id}/read`, {
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response, "response");
  
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      console.log(blobUrl, "ttt");
  
      // Create a link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${book.name}.pdf`; // Set the default file name for download
      document.body.appendChild(link); // Append to the body
      link.click(); // Simulate click
      document.body.removeChild(link); // Remove the link after triggering download
  
      // Cleanup the blob URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
  
    } catch (error) {
      console.error('Error opening book file:', error);
      setError('Failed to open book file. ' + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {loading ? (
        <p className="text-center text-gray-600">Loading book details...</p>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>
      ) : book ? (
        <div className="book-details">
          <h2 className="text-2xl font-bold mb-4">{book.name}</h2>
          
          <div className="mb-4">
            <p className="text-gray-700"><span className="font-medium">Uploaded by:</span> {book.uploadedBy.username}</p>
            <p className="text-gray-700">
              <span className="font-medium">Date:</span> {new Date(book.uploadDate).toLocaleDateString()}
            </p>
          </div>
          
          <button 
            onClick={openBookFile} 
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
          >
            Read Book
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">Book not found</p>
      )}
    </div>
  );
};

export default BookReader;