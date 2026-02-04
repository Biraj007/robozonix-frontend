import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiCalendar, FiSearch } from 'react-icons/fi';
import api from '../../services/api';

const EventManager = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'Workshop',
    date: '',
    time: '',
    location: '',
    isOnline: false,
    meetingLink: '',
    coverImage: '',
    capacity: 0,
    price: 0,
    status: 'upcoming',
    featured: false
  });

  useEffect(() => {
    fetchEvents();
    if (searchParams.get('action') === 'new') setShowModal(true);
  }, [searchParams]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/admin/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent._id}`, formData);
      } else {
        await api.post('/admin/events', formData);
      }
      fetchEvents();
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/admin/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      date: event.date?.split('T')[0] || '',
      time: event.time,
      location: event.location,
      isOnline: event.isOnline,
      meetingLink: event.meetingLink || '',
      coverImage: event.coverImage || '',
      capacity: event.capacity || 0,
      price: event.price || 0,
      status: event.status,
      featured: event.featured
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({
      title: '', description: '', eventType: 'Workshop', date: '', time: '',
      location: '', isOnline: false, meetingLink: '', coverImage: '',
      capacity: 0, price: 0, status: 'upcoming', featured: false
    });
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Event Management</h1>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Add Event
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 24, position: 'relative', maxWidth: 400 }}>
        <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search events..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px 12px 44px', background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
        />
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state">
          <FiCalendar />
          <p>No events found</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: 16 }}>
            Create First Event
          </button>
        </div>
      ) : (
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.eventType}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.isOnline ? 'Online' : event.location}</td>
                  <td><span className={`status-badge ${event.status}`}>{event.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn" onClick={() => openEditModal(event)}><FiEdit2 /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(event._id)}><FiTrash2 /></button>
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
              <h2 className="modal-title">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
              <button className="modal-close" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Event Type</label>
                  <select value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Competition">Competition</option>
                    <option value="Training">Training</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input type="text" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="10:00 AM - 4:00 PM" required />
                </div>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={formData.isOnline} onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  Online Event
                </label>
              </div>
              <div className="form-group">
                <label>{formData.isOnline ? 'Meeting Link' : 'Location'} *</label>
                <input type="text" value={formData.isOnline ? formData.meetingLink : formData.location}
                  onChange={(e) => setFormData({ ...formData, [formData.isOnline ? 'meetingLink' : 'location']: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Capacity (0 = unlimited)</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label>Price (0 = free)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="form-group">
                <label>Cover Image URL</label>
                <input type="url" value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  Featured Event
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="submit" className="btn btn-primary"><FiSave /> {editingEvent ? 'Update' : 'Create'} Event</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
