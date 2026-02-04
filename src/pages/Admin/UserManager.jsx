import { useState, useEffect } from 'react';
import { 
  FiUsers, FiSearch, FiShield, FiTrash2, FiEdit2,
  FiCalendar, FiCheck, FiX, FiAlertCircle, FiUser
} from 'react-icons/fi';
import api from '../../services/api';

const PERMISSIONS = [
  { key: 'blogs', label: 'Blogs' },
  { key: 'events', label: 'Events' },
  { key: 'courses', label: 'Courses' },
  { key: 'projects', label: 'Projects' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'users', label: 'Users' },
  { key: 'settings', label: 'Settings' },
];

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false, action: null, user: null });
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('user');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showMessage('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role || 'user');
    setSelectedPermissions(user.permissions || []);
  };

  const handleSaveRole = async () => {
    try {
      await api.put(`/admin/users/${editingUser._id}/role`, { 
        role: selectedRole,
        permissions: selectedRole === 'editor' ? selectedPermissions : []
      });
      showMessage('success', `${editingUser.name}'s role updated successfully`);
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update role');
    }
  };

  const togglePermission = (permission) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleDeleteUser = async (user) => {
    try {
      await api.delete(`/admin/users/${user._id}`);
      showMessage('success', `User ${user.name} has been deleted`);
      fetchUsers();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to delete user');
    }
    setConfirmModal({ show: false, action: null, user: null });
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin': return 'status-badge published';
      case 'editor': return 'status-badge active';
      default: return 'status-badge draft';
    }
  };

  const getRoleEmoji = (role) => {
    switch(role) {
      case 'admin': return '🛡️';
      case 'editor': return '✏️';
      default: return '👤';
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">User Management</h1>
        <div style={{ color: 'var(--text-secondary)' }}>
          {users.length} total users
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`settings-toast ${message.type}`}>
          {message.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
          {message.text}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 24, position: 'relative', maxWidth: 400 }}>
        <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 44px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)'
          }}
        />
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 245, 160, 0.1)', color: 'var(--accent-green)' }}>
            <FiShield />
          </div>
          <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
          <div className="stat-label">Admins</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(123, 97, 255, 0.1)', color: '#7b61ff' }}>
            <FiEdit2 />
          </div>
          <div className="stat-value">{users.filter(u => u.role === 'editor').length}</div>
          <div className="stat-label">Editors</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 107, 53, 0.1)', color: 'var(--accent-orange)' }}>
            <FiUser />
          </div>
          <div className="stat-value">{users.filter(u => u.membership && u.membership !== 'None').length}</div>
          <div className="stat-label">Members</div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="empty-state">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <FiUsers />
          <p>No users found</p>
        </div>
      ) : (
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Permissions</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'var(--accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--bg-primary)',
                        fontWeight: 600
                      }}>
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`} style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                      {user.email}
                    </a>
                  </td>
                  <td>
                    <span className={getRoleBadgeClass(user.role)}>
                      {getRoleEmoji(user.role)} {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                    </span>
                  </td>
                  <td>
                    {user.role === 'editor' && user.permissions?.length > 0 ? (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {user.permissions.map(p => (
                          <span key={p} style={{
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                            background: 'rgba(0, 229, 255, 0.1)',
                            borderRadius: 4,
                            color: 'var(--accent-cyan)'
                          }}>{p}</span>
                        ))}
                      </div>
                    ) : user.role === 'admin' ? (
                      <span style={{ color: 'var(--accent-green)', fontSize: '0.85rem' }}>All</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                    )}
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn"
                        title="Edit Role & Permissions"
                        onClick={() => openEditModal(user)}
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="action-btn delete"
                        title="Delete User"
                        onClick={() => setConfirmModal({ show: true, action: 'delete', user })}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Role & Permissions</h2>
              <button className="modal-close" onClick={() => setEditingUser(null)}>
                <FiX />
              </button>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              Editing: <strong>{editingUser.name}</strong>
            </p>

            {/* Role Selection */}
            <div className="form-group">
              <label>Role</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {['user', 'editor', 'admin'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: selectedRole === role ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                      border: `1px solid ${selectedRole === role ? 'transparent' : 'var(--border-primary)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: selectedRole === role ? 'var(--bg-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontWeight: selectedRole === role ? 600 : 400
                    }}
                  >
                    {getRoleEmoji(role)} {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Permissions (only for editor role) */}
            {selectedRole === 'editor' && (
              <div className="form-group">
                <label>Permissions</label>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Select which sections this editor can manage:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {PERMISSIONS.map(perm => (
                    <label 
                      key={perm.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '10px 12px',
                        background: selectedPermissions.includes(perm.key) ? 'rgba(0, 229, 255, 0.1)' : 'var(--bg-secondary)',
                        border: `1px solid ${selectedPermissions.includes(perm.key) ? 'var(--accent-cyan)' : 'var(--border-primary)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.key)}
                        onChange={() => togglePermission(perm.key)}
                        style={{ accentColor: 'var(--accent-cyan)', width: 18, height: 18, cursor: 'pointer' }}
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button 
                className="btn btn-primary"
                onClick={handleSaveRole}
                disabled={selectedRole === 'editor' && selectedPermissions.length === 0}
              >
                Save Changes
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmModal.show && (
        <div className="modal-overlay" onClick={() => setConfirmModal({ show: false, action: null, user: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2 className="modal-title">Delete User?</h2>
              <button className="modal-close" onClick={() => setConfirmModal({ show: false, action: null, user: null })}>
                <FiX />
              </button>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Are you sure you want to delete <strong>{confirmModal.user?.name}</strong>? This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                className="btn btn-danger"
                onClick={() => handleDeleteUser(confirmModal.user)}
              >
                Delete
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setConfirmModal({ show: false, action: null, user: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
