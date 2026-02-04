import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  FiHome, FiFileText, FiCalendar, FiBook, FiBox, 
  FiSettings, FiLogOut, FiGrid, FiUsers, FiTool,
  FiMenu, FiX
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Check if user has access to admin panel
  const hasAdminAccess = user && (user.role === 'admin' || user.role === 'editor');
  
  // Check if user has permission for a specific section
  const hasPermission = (permission) => {
    // Admin has all permissions
    if (user?.role === 'admin') return true;
    // Editor needs specific permission
    if (user?.role === 'editor') {
      return user.permissions?.includes(permission);
    }
    return false;
  };
  
  // Redirect if no admin access
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!hasAdminAccess) {
      navigate('/dashboard');
    }
  }, [user, navigate, hasAdminAccess]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // All possible nav items with their required permissions
  const allNavItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true, permission: null }, // Dashboard always visible
    { path: '/admin/blogs', icon: FiFileText, label: 'Blogs', permission: 'blogs' },
    { path: '/admin/events', icon: FiCalendar, label: 'Events', permission: 'events' },
    { path: '/admin/courses', icon: FiBook, label: 'Courses', permission: 'courses' },
    { path: '/admin/projects', icon: FiBox, label: 'Projects', permission: 'projects' },
    { path: '/admin/facilities', icon: FiTool, label: 'Facilities', permission: 'facilities' },
    { path: '/admin/users', icon: FiUsers, label: 'Users', permission: 'users' },
  ];

  // Filter nav items based on permissions
  const navItems = allNavItems.filter(item => 
    item.permission === null || hasPermission(item.permission)
  );

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  /* Mobile Sidebar Toggle */
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  if (!user || !hasAdminAccess) {
    return null;
  }

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <div className="mobile-admin-header">
        <button className="mobile-toggle-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? <FiX /> : <FiMenu />}
        </button>
        <div className="mobile-brand">
          <FiGrid size={20} />
          <span>ROBOZONIX</span>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="admin-logo">
            <FiGrid size={24} />
            <h2>ROBOZONIX ADMIN</h2>
          </Link>
          <button className="close-sidebar-btn" onClick={closeSidebar}>
            <FiX />
          </button>
        </div>

        <nav className="admin-nav">
          <div className="nav-section">
            <span className="nav-section-title">Management</span>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Account</span>
            {hasPermission('settings') && (
              <Link to="/admin/settings" className={`nav-link ${isActive('/admin/settings') ? 'active' : ''}`} onClick={closeSidebar}>
                <FiSettings />
                <span>Settings</span>
              </Link>
            )}
            <button onClick={handleLogout} className="nav-link" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}>
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet context={{ hasPermission }} />
      </main>
    </div>
  );
};

export default AdminLayout;
