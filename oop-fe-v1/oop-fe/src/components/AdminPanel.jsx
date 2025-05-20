import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, booksResponse] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/books')
      ]);
      setUsers(usersResponse.data);
      setBooks(booksResponse.data);
      setError('');
    } catch (error) {
      setError('Failed to load admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookStatus = async (id, isActive) => {
    try {
      await api.put(`/api/admin/books/${id}/status?active=${!isActive}`);
      
      // Update the books list with the new status
      setBooks(books.map(book => 
        book.id === id ? { ...book, active: !isActive } : book
      ));
    } catch (error) {
      setError('Failed to update book status');
      console.error('Error updating book status:', error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      setError('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  const updateUserRoles = async (id, currentRoles) => {
    const isAdmin = currentRoles.includes('ADMIN');
    const newRoles = isAdmin ? ['USER'] : ['ADMIN', 'USER'];
    
    try {
      await api.put(`/api/admin/users/${id}/roles`, newRoles);
      
      // Update the users list with the new roles
      setUsers(users.map(user => 
        user.id === id ? { ...user, roles: newRoles } : user
      ));
    } catch (error) {
      setError('Failed to update user roles');
      console.error('Error updating user roles:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      {error && <div className="error">{error}</div>}
      
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <h3>Users Management</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.roles.join(', ')}</td>
                  <td>
                    <button onClick={() => updateUserRoles(user.id, user.roles)}>
                      {user.roles.includes('ADMIN') ? 'Remove Admin' : 'Make Admin'}
                    </button>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Books Management</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Uploaded By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.name}</td>
                  <td>{book.uploadedBy}</td>
                  <td>{book.active !== false ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button onClick={() => toggleBookStatus(book.id, book.active !== false)}>
                      {book.active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminPanel;