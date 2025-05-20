import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Assuming you have an API service

const BookUpload = () => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Please enter a book name');
      return;
    }

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await api.post('/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/books');
      }, 1500);
    } catch (error) {
      console.error('Error uploading book:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to upload books.');
      } else {
        setError(`Failed to upload book: ${error.response?.data || error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a valid PDF file');
        return;
      }

      // Validate file size
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  return (
    <div className="book-upload">
      <h2>Upload Book</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Book Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Book File(Only .pdf)</label>
          <input
            type="file"
            onChange={handleFileChange}
            required
            accept="application/pdf" // Restrict file selection to PDF
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Book'}
        </button>
      </form>
    </div>
  );
};

export default BookUpload;