import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiTool, FiSearch } from 'react-icons/fi';
import api from '../../services/api';

const FacilityManager = () => {
  const [searchParams] = useSearchParams();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', shortDescription: '', category: 'Lab',
    coverImage: '', features: '', capacity: 0, availability: 'Available',
    bookingRequired: false, hourlyRate: 0, status: 'active', featured: false
  });

  useEffect(() => {
    fetchFacilities();
    if (searchParams.get('action') === 'new') setShowModal(true);
  }, [searchParams]);

  const fetchFacilities = async () => {
    try {
      const response = await api.get('/admin/facilities');
      setFacilities(response.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        features: formData.features.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (editingFacility) {
        await api.put(`/admin/facilities/${editingFacility._id}`, data);
      } else {
        await api.post('/admin/facilities', data);
      }
      fetchFacilities();
      closeModal();
    } catch (error) {
      console.error('Error saving facility:', error);
      alert('Error saving facility: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this facility?')) return;
    try {
      await api.delete(`/admin/facilities/${id}`);
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  const openEditModal = (facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name, description: facility.description,
      shortDescription: facility.shortDescription || '', category: facility.category,
      coverImage: facility.coverImage || '', features: facility.features?.join(', ') || '',
      capacity: facility.capacity || 0, availability: facility.availability || 'Available',
      bookingRequired: facility.bookingRequired, hourlyRate: facility.hourlyRate || 0,
      status: facility.status, featured: facility.featured
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFacility(null);
    setFormData({
      name: '', description: '', shortDescription: '', category: 'Lab',
      coverImage: '', features: '', capacity: 0, availability: 'Available',
      bookingRequired: false, hourlyRate: 0, status: 'active', featured: false
    });
  };

  const filteredFacilities = facilities.filter(facility => 
    facility.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Facility Management</h1>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Add Facility
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 24, position: 'relative', maxWidth: 400 }}>
        <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search facilities..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px 12px 44px', background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
        />
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : filteredFacilities.length === 0 ? (
        <div className="empty-state">
          <FiTool />
          <p>No facilities found</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: 16 }}>
            Add First Facility
          </button>
        </div>
      ) : (
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Capacity</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacilities.map((facility) => (
                <tr key={facility._id}>
                  <td>{facility.name}</td>
                  <td>{facility.category}</td>
                  <td>{facility.capacity || '-'}</td>
                  <td>{facility.availability}</td>
                  <td><span className={`status-badge ${facility.status}`}>{facility.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn" onClick={() => openEditModal(facility)}><FiEdit2 /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(facility._id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingFacility ? 'Edit Facility' : 'New Facility'}</h2>
              <button className="modal-close" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="Lab">Lab</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Software">Software</option>
                    <option value="Workspace">Workspace</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <textarea value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} rows={2} />
              </div>
              <div className="form-group">
                <label>Full Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required />
              </div>
              <div className="form-group">
                <label>Features (comma separated)</label>
                <input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="3D Printers, CNC Machine, Soldering Stations" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Capacity</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <input type="text" value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })} placeholder="Mon-Fri 9AM-6PM" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                    <input type="checkbox" checked={formData.bookingRequired} onChange={(e) => setFormData({ ...formData, bookingRequired: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                    Booking Required
                  </label>
                </div>
                <div className="form-group">
                  <label>Hourly Rate (₹)</label>
                  <input type="number" value={formData.hourlyRate} onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="form-group">
                <label>Cover Image URL</label>
                <input type="url" value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  Featured Facility
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="submit" className="btn btn-primary"><FiSave /> {editingFacility ? 'Update' : 'Create'} Facility</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityManager;
