import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFileText, FiCalendar, FiBook, FiBox, FiTool,
  FiPlus, FiUsers
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    blogs: 0,
    events: 0,
    courses: 0,
    projects: 0,
    facilities: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  // Check if user has permission for a specific section
  const hasPermission = (permission) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'editor') {
      return user.permissions?.includes(permission);
    }
    return false;
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // All possible stat cards with their required permissions
  const allStatCards = [
    { label: 'Blogs', value: stats.blogs, icon: FiFileText, color: '#00e5ff', path: '/admin/blogs', permission: 'blogs' },
    { label: 'Events', value: stats.events, icon: FiCalendar, color: '#9d4edd', path: '/admin/events', permission: 'events' },
    { label: 'Courses', value: stats.courses, icon: FiBook, color: '#00f5a0', path: '/admin/courses', permission: 'courses' },
    { label: 'Projects', value: stats.projects, icon: FiBox, color: '#ff6b35', path: '/admin/projects', permission: 'projects' },
    { label: 'Facilities', value: stats.facilities, icon: FiTool, color: '#ffd60a', path: '/admin/facilities', permission: 'facilities' },
    { label: 'Users', value: stats.users || 0, icon: FiUsers, color: '#7b61ff', path: '/admin/users', permission: 'users' },
  ];

  // All possible quick actions with their required permissions
  const allQuickActions = [
    { label: 'Add Blog', icon: FiFileText, path: '/admin/blogs', action: 'new', permission: 'blogs' },
    { label: 'Add Event', icon: FiCalendar, path: '/admin/events', action: 'new', permission: 'events' },
    { label: 'Add Course', icon: FiBook, path: '/admin/courses', action: 'new', permission: 'courses' },
    { label: 'Add Project', icon: FiBox, path: '/admin/projects', action: 'new', permission: 'projects' },
    { label: 'Add Facility', icon: FiTool, path: '/admin/facilities', action: 'new', permission: 'facilities' },
  ];

  // Filter based on permissions
  const statCards = allStatCards.filter(card => hasPermission(card.permission));
  const quickActions = allQuickActions.filter(action => hasPermission(action.permission));



  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            Welcome back, {user?.name || 'Admin'}! 
            <span style={{ 
              marginLeft: 8, 
              fontSize: '0.8rem', 
              padding: '2px 8px', 
              background: user?.role === 'admin' ? 'rgba(0, 245, 160, 0.1)' : 'rgba(123, 97, 255, 0.1)',
              color: user?.role === 'admin' ? 'var(--accent-green)' : '#7b61ff',
              borderRadius: 4
            }}>
              {user?.role === 'admin' ? '🛡️ Admin' : '✏️ Editor'}
            </span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {statCards.length > 0 && (
        <div className="stats-grid">
          {statCards.map((stat) => (
            <Link 
              key={stat.label} 
              to={stat.path}
              className="stat-card"
              style={{ textDecoration: 'none' }}
            >
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                <stat.icon />
              </div>
              <div className="stat-value">{loading ? '...' : stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <>
          <div className="admin-header" style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>Quick Actions</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={`${action.path}?action=${action.action}`}
                className="stat-card"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  padding: 20,
                  textDecoration: 'none'
                }}
              >
                <div className="stat-icon" style={{ marginBottom: 0, width: 40, height: 40 }}>
                  <FiPlus />
                </div>
                <span style={{ color: 'var(--text-primary)' }}>{action.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}


    </div>
  );
};

export default AdminDashboard;
