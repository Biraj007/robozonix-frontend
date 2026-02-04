import { useState, useEffect } from 'react';
import { FiSave, FiUser, FiLock, FiMail, FiGlobe, FiPhone, FiMapPin, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Site Settings Form
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Robozonix Labs',
    tagline: 'Innovating the Future of Robotics',
    contactEmail: 'info@robozonix.com',
    contactPhone: '+91 1234567890',
    address: 'Bangalore, India',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    fetchSiteSettings();
  }, [user]);

  const fetchSiteSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      if (response.data) {
        setSiteSettings(response.data);
      }
    } catch (error) {
      // Settings may not exist yet, use defaults
      console.log('Using default settings');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/admin/profile', profileData);
      if (updateUser) {
        updateUser(response.data.user);
      }
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await api.put('/admin/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password changed successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/admin/settings', siteSettings);
      showMessage('success', 'Site settings saved!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'password', label: 'Security', icon: FiLock },
    { id: 'site', label: 'Site Settings', icon: FiGlobe },
  ];

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Settings</h1>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`settings-toast ${message.type}`}>
          {message.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon /> {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="settings-panel">
          <h2 className="settings-panel-title">Profile Information</h2>
          <p className="settings-panel-desc">Update your personal information</p>
          
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label><FiUser /> Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label><FiMail /> Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label><FiPhone /> Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+91 9876543210"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="settings-panel">
          <h2 className="settings-panel-title">Change Password</h2>
          <p className="settings-panel-desc">Update your password regularly for security</p>
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={8}
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiLock /> {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {/* Site Settings Tab */}
      {activeTab === 'site' && (
        <div className="settings-panel">
          <h2 className="settings-panel-title">Site Settings</h2>
          <p className="settings-panel-desc">Configure your website information</p>
          
          <form onSubmit={handleSiteSettingsSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Site Name</label>
                <input
                  type="text"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label>Tagline</label>
                <input
                  type="text"
                  value={siteSettings.tagline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label><FiMail /> Contact Email</label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label><FiPhone /> Contact Phone</label>
                <input
                  type="tel"
                  value={siteSettings.contactPhone}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label><FiMapPin /> Address</label>
              <textarea
                value={siteSettings.address}
                onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                rows={2}
              />
            </div>
            
            <h3 style={{ marginTop: 24, marginBottom: 16, color: 'var(--text-primary)' }}>Social Links</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.facebook || ''}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialLinks: { ...siteSettings.socialLinks, facebook: e.target.value }
                  })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.instagram || ''}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialLinks: { ...siteSettings.socialLinks, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.linkedin || ''}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialLinks: { ...siteSettings.socialLinks, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              
              <div className="form-group">
                <label>YouTube</label>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.youtube || ''}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialLinks: { ...siteSettings.socialLinks, youtube: e.target.value }
                  })}
                  placeholder="https://youtube.com/@..."
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;
