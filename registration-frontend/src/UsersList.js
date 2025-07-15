import React, { useState, useEffect } from 'react';

function UsersList({ refreshTrigger }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]); // Refresh when new user is registered

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/users', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin123')
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        const updatedUser = { name: editForm.name, email: editForm.email };
        if (editForm.password) { // Only include password if it's non-empty
            updatedUser.password = editForm.password;
        }
        const response = await fetch(`http://localhost:8080/api/users/${editingUser}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin123')
            },
            body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
            setEditingUser(null);
            setEditForm({ name: '', email: '', password: '' });
            fetchUsers();
        } else {
            const errorText = await response.text();
            setError(errorText || 'Failed to update user');
        }
    } catch (err) {
        setError('Error updating user: ' + err.message);
    }
};

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Basic ' + btoa('admin:admin123')
          }
        });

        if (response.ok) {
          fetchUsers();
        } else {
          setError('Failed to delete user');
        }
      } catch (err) {
        setError('Error deleting user');
      }
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', password: '' });
  };

  if (loading) {
    return (
      <div className="users-section">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-section">
        <div className="error-message">
          <span>❌</span>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-section">
      <h3 className="users-title">Registered Users</h3>
      
      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users registered yet</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="id-cell">{user.id}</td>
                  <td className="name-cell">
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="edit-input"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="email-cell">
                    {editingUser === user.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="edit-input"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="actions-cell">
                    {editingUser === user.id ? (
                      <div className="edit-actions">
                        <button 
                          onClick={handleEditSubmit}
                          className="btn save-btn"
                        >
                          Save
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="btn cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="table-actions">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="btn edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="btn delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsersList;