import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiDatabase, FiSearch } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import api from '../../services/api';
import './Admin.css';

const ChatbotManager = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingResponse, setEditingResponse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    keywords: '',
    response: '',
    category: 'general',
    isQuickReply: false,
    quickReplyLabel: '',
    order: 0,
    isActive: true,
  });

  const categories = ['greeting', 'membership', 'courses', 'facilities', 'events', 'projects', 'contact', 'general'];

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/chatbot');
      setResponses(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch chatbot responses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k),
      };

      if (editingResponse) {
        await api.put(`/admin/chatbot/${editingResponse._id}`, payload);
      } else {
        await api.post('/admin/chatbot', payload);
      }
      
      fetchResponses();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save response');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this response?')) return;
    try {
      await api.delete(`/admin/chatbot/${id}`);
      fetchResponses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete response');
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('This will seed default chatbot responses. Continue?')) return;
    try {
      await api.post('/admin/chatbot/seed');
      fetchResponses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to seed responses');
    }
  };

  const openModal = (response = null) => {
    if (response) {
      setEditingResponse(response);
      setFormData({
        keywords: response.keywords.join(', '),
        response: response.response,
        category: response.category || 'general',
        isQuickReply: response.isQuickReply || false,
        quickReplyLabel: response.quickReplyLabel || '',
        order: response.order || 0,
        isActive: response.isActive !== false,
      });
    } else {
      setEditingResponse(null);
      setFormData({
        keywords: '',
        response: '',
        category: 'general',
        isQuickReply: false,
        quickReplyLabel: '',
        order: responses.length + 1,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingResponse(null);
    setFormData({
      keywords: '',
      response: '',
      category: 'general',
      isQuickReply: false,
      quickReplyLabel: '',
      order: 0,
      isActive: true,
    });
  };

  const filteredResponses = responses.filter(resp =>
    resp.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
    resp.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Chatbot Management</h1>
        <div className="admin-actions">
          {responses.length === 0 && (
            <button className="btn btn-outline" onClick={handleSeed}>
              <FiDatabase /> Seed Defaults
            </button>
          )}
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FiPlus /> Add Response
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24, position: 'relative', maxWidth: 400 }}>
        <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search responses..."
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

      {error && <div className="admin-error">{error}</div>}

      {/* Cards Layout */}
      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : filteredResponses.length === 0 ? (
        <div className="empty-state">
          <BsRobot size={48} />
          <p>No chatbot responses found</p>
          <button className="btn btn-primary" onClick={() => openModal()} style={{ marginTop: 16 }}>
            Create First Response
          </button>
        </div>
      ) : (
        <div className="chatbot-cards">
          {filteredResponses.map((resp) => (
            <div key={resp._id} className="chatbot-card">
              <div className="chatbot-card-header">
                <div className="chatbot-card-order">{resp.order}</div>
                <div className="chatbot-card-actions">
                  <button className="btn-icon" onClick={() => openModal(resp)} title="Edit">
                    <FiEdit2 />
                  </button>
                  <button className="btn-icon danger" onClick={() => handleDelete(resp._id)} title="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="chatbot-card-keywords">
                {resp.keywords.map((kw, i) => (
                  <span key={i} className="keyword-tag">{kw}</span>
                ))}
              </div>

              <div className="chatbot-card-response">
                {resp.response}
              </div>

              <div className="chatbot-card-meta">
                <span className={`category-badge ${resp.category}`}>{resp.category}</span>
                {resp.isQuickReply && (
                  <span className="quick-reply-badge">{resp.quickReplyLabel}</span>
                )}
                <span className={`status-badge ${resp.isActive ? 'active' : 'inactive'}`}>
                  {resp.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingResponse ? 'Edit Response' : 'Add New Response'}</h2>
              <button className="btn-icon" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="hello, hi, hey, greetings"
                  required
                />
                <small>Enter keywords that trigger this response</small>
              </div>

              <div className="form-group">
                <label>Response</label>
                <textarea
                  value={formData.response}
                  onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                  placeholder="Hello! 👋 Welcome to Robozonix Labs!"
                  rows={5}
                  required
                />
                <small>Use \n for line breaks, emojis work too!</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isQuickReply}
                    onChange={(e) => setFormData({ ...formData, isQuickReply: e.target.checked })}
                  />
                  Show as Quick Reply Button
                </label>
              </div>

              {formData.isQuickReply && (
                <div className="form-group">
                  <label>Quick Reply Button Label</label>
                  <input
                    type="text"
                    value={formData.quickReplyLabel}
                    onChange={(e) => setFormData({ ...formData, quickReplyLabel: e.target.value })}
                    placeholder="Membership Plans"
                  />
                </div>
              )}

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <FiSave /> {editingResponse ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotManager;
