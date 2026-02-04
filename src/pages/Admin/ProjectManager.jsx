import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiBox, FiSearch } from 'react-icons/fi';
import api from '../../services/api';

const ProjectManager = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '', description: '', shortDescription: '', category: 'Robotics',
    coverImage: '', videoUrl: '', technologies: '', github: '', liveUrl: '',
    status: 'ongoing', featured: false
  });

  useEffect(() => {
    fetchProjects();
    if (searchParams.get('action') === 'new') setShowModal(true);
  }, [searchParams]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/admin/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (editingProject) {
        await api.put(`/admin/projects/${editingProject._id}`, data);
      } else {
        await api.post('/admin/projects', data);
      }
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title, description: project.description,
      shortDescription: project.shortDescription || '', category: project.category,
      coverImage: project.coverImage || '', videoUrl: project.videoUrl || '',
      technologies: project.technologies?.join(', ') || '', github: project.github || '',
      liveUrl: project.liveUrl || '', status: project.status, featured: project.featured
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      title: '', description: '', shortDescription: '', category: 'Robotics',
      coverImage: '', videoUrl: '', technologies: '', github: '', liveUrl: '',
      status: 'ongoing', featured: false
    });
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Project Management</h1>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Add Project
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 24, position: 'relative', maxWidth: 400 }}>
        <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search projects..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px 12px 44px', background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
        />
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state">
          <FiBox />
          <p>No projects found</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: 16 }}>
            Create First Project
          </button>
        </div>
      ) : (
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Technologies</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project._id}>
                  <td>{project.title}</td>
                  <td>{project.category}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {project.technologies?.slice(0, 3).join(', ')}
                    {project.technologies?.length > 3 && '...'}
                  </td>
                  <td><span className={`status-badge ${project.status}`}>{project.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn" onClick={() => openEditModal(project)}><FiEdit2 /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(project._id)}><FiTrash2 /></button>
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
              <h2 className="modal-title">{editingProject ? 'Edit Project' : 'New Project'}</h2>
              <button className="modal-close" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="Robotics">Robotics</option>
                    <option value="IoT">IoT</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Drones">Drones</option>
                    <option value="Automation">Automation</option>
                    <option value="Research">Research</option>
                    <option value="Student">Student</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
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
                <label>Technologies (comma separated)</label>
                <input type="text" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} placeholder="Arduino, Python, ROS, OpenCV" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input type="url" value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Video URL (YouTube)</label>
                  <input type="url" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input type="url" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Live Demo URL</label>
                  <input type="url" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  Featured Project
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="submit" className="btn btn-primary"><FiSave /> {editingProject ? 'Update' : 'Create'} Project</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
