import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiBook, FiSearch } from 'react-icons/fi';
import api from '../../services/api';

const CourseManager = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '', description: '', shortDescription: '', category: 'Robotics',
    level: 'Beginner', duration: '', totalHours: 0, coverImage: '',
    prerequisites: '', skills: '', price: 0, discountPrice: 0,
    instructor: '', maxStudents: 20, status: 'draft', featured: false
  });

  useEffect(() => {
    fetchCourses();
    if (searchParams.get('action') === 'new') setShowModal(true);
  }, [searchParams]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/admin/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        prerequisites: formData.prerequisites.split(',').map(t => t.trim()).filter(Boolean),
        skills: formData.skills.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (editingCourse) {
        await api.put(`/admin/courses/${editingCourse._id}`, data);
      } else {
        await api.post('/admin/courses', data);
      }
      fetchCourses();
      closeModal();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title, description: course.description,
      shortDescription: course.shortDescription || '', category: course.category,
      level: course.level, duration: course.duration, totalHours: course.totalHours || 0,
      coverImage: course.coverImage || '', prerequisites: course.prerequisites?.join(', ') || '',
      skills: course.skills?.join(', ') || '', price: course.price || 0,
      discountPrice: course.discountPrice || 0, instructor: course.instructor || '',
      maxStudents: course.maxStudents || 20, status: course.status, featured: course.featured
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormData({
      title: '', description: '', shortDescription: '', category: 'Robotics',
      level: 'Beginner', duration: '', totalHours: 0, coverImage: '',
      prerequisites: '', skills: '', price: 0, discountPrice: 0,
      instructor: '', maxStudents: 20, status: 'draft', featured: false
    });
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Course Management</h1>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Add Course
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 24, position: 'relative', maxWidth: 400 }}>
        <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search courses..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px 12px 44px', background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
        />
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="empty-state">
          <FiBook />
          <p>No courses found</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: 16 }}>
            Create First Course
          </button>
        </div>
      ) : (
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Level</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.category}</td>
                  <td><span className={`status-badge ${course.level.toLowerCase()}`}>{course.level}</span></td>
                  <td>{course.duration}</td>
                  <td><span className={`status-badge ${course.status}`}>{course.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn" onClick={() => openEditModal(course)}><FiEdit2 /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(course._id)}><FiTrash2 /></button>
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
              <h2 className="modal-title">{editingCourse ? 'Edit Course' : 'New Course'}</h2>
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
                    <option value="Embedded Systems">Embedded Systems</option>
                    <option value="Drones">Drones</option>
                    <option value="3D Printing">3D Printing</option>
                    <option value="Programming">Programming</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Level</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration *</label>
                  <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="8 weeks" required />
                </div>
                <div className="form-group">
                  <label>Total Hours</label>
                  <input type="number" value={formData.totalHours} onChange={(e) => setFormData({ ...formData, totalHours: parseInt(e.target.value) || 0 })} />
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
                <label>Prerequisites (comma separated)</label>
                <input type="text" value={formData.prerequisites} onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })} placeholder="Basic programming, Arduino basics" />
              </div>
              <div className="form-group">
                <label>Skills Learned (comma separated)</label>
                <input type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="C++, Robotics, Electronics" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Instructor</label>
                  <input type="text" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Max Students</label>
                  <input type="number" value={formData.maxStudents} onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 20 })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label>Discount Price (₹)</label>
                  <input type="number" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="form-group">
                <label>Cover Image URL</label>
                <input type="url" value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 30, whiteSpace: 'nowrap' }}>
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                    Featured Course
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="submit" className="btn btn-primary"><FiSave /> {editingCourse ? 'Update' : 'Create'} Course</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;
