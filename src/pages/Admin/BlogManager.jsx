import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FiPlus, FiEdit2, FiTrash2, FiEye, FiX, FiSave,
  FiFileText, FiSearch
} from 'react-icons/fi';
import api from '../../services/api';

const BlogManager = () => {
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Technology',
    tags: '',
    coverImage: '',
    status: 'draft',
    featured: false
  });

  useEffect(() => {
    fetchBlogs();
    // Check if we should open modal for new blog
    if (searchParams.get('action') === 'new') {
      setShowModal(true);
    }
  }, [searchParams]);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/admin/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingBlog) {
        await api.put(`/admin/blogs/${editingBlog._id}`, data);
      } else {
        await api.post('/admin/blogs', data);
      }
      
      fetchBlogs();
      closeModal();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      await api.delete(`/admin/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      category: blog.category,
      tags: blog.tags?.join(', ') || '',
      coverImage: blog.coverImage || '',
      status: blog.status,
      featured: blog.featured
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'Technology',
      tags: '',
      coverImage: '',
      status: 'draft',
      featured: false
    });
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Blog Management</h1>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Add Blog
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24, position: 'relative', maxWidth: 400 }}>
        <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search blogs..."
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

      {/* Blog Table */}
      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : filteredBlogs.length === 0 ? (
        <div className="empty-state">
          <FiFileText />
          <p>No blogs found</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: 16 }}>
            Create First Blog
          </button>
        </div>
      ) : (
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {blog.coverImage && (
                        <img 
                          src={blog.coverImage} 
                          alt="" 
                          style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4 }}
                        />
                      )}
                      <span>{blog.title}</span>
                      {blog.featured && <span className="status-badge active">Featured</span>}
                    </div>
                  </td>
                  <td>{blog.category}</td>
                  <td>
                    <span className={`status-badge ${blog.status}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td>{blog.views || 0}</td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn" onClick={() => openEditModal(blog)}>
                        <FiEdit2 />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(blog._id)}>
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingBlog ? 'Edit Blog' : 'New Blog'}</h2>
              <button className="modal-close" onClick={closeModal}><FiX /></button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form" style={{ padding: 0, background: 'transparent', border: 'none' }}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Robotics">Robotics</option>
                    <option value="AI">AI</option>
                    <option value="IoT">IoT</option>
                    <option value="Tutorials">Tutorials</option>
                    <option value="News">News</option>
                    <option value="Events">Events</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Cover Image URL</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group">
                <label>Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Brief description for previews..."
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  required
                  placeholder="Write your blog content here... (HTML supported)"
                />
              </div>

              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="robotics, arduino, tutorial"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  Featured Blog
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="submit" className="btn btn-primary">
                  <FiSave /> {editingBlog ? 'Update' : 'Create'} Blog
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
