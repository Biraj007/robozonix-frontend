import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiCreditCard,
  FiBook,
  FiCalendar,
  FiDownload,
  FiSettings,
  FiLogOut,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { fadeInUp, staggerContainer } from "../../utils/animations";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Get first name from user's full name
  const firstName = user?.name?.split(" ")[0] || "User";

  // User data with real info
  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    plan: user?.membership === "None" ? "Free Plan" : user?.membership + " Plan",
    memberSince: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    labHoursUsed: 18,
    labHoursTotal: 30,
  };

  const courses = [
    { id: 1, title: "Robotics with ROS", progress: 65, status: "In Progress" },
    { id: 2, title: "Drone Design", progress: 100, status: "Completed" },
  ];

  const bookings = [
    {
      id: 1,
      date: "Jan 30, 2026",
      time: "10:00 AM - 2:00 PM",
      lab: "Robotics Lab",
      status: "Confirmed",
    },
    {
      id: 2,
      date: "Feb 2, 2026",
      time: "2:00 PM - 6:00 PM",
      lab: "Electronics Lab",
      status: "Pending",
    },
  ];

  const certificates = [
    { id: 1, title: "Drone Design & Flight Control", date: "Dec 2025" },
  ];

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Sidebar */}
        <motion.aside 
          className="dashboard-sidebar"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sidebar-user">
            <div className="user-avatar">
              <span className="avatar-initials">{getInitials(userData.name)}</span>
            </div>
            <div className="user-info">
              <h4>{userData.name}</h4>
              <span>{userData.plan}</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <a href="#overview" className="nav-item active">
              <FiUser /> Overview
            </a>
            <a href="#membership" className="nav-item">
              <FiCreditCard /> Membership
            </a>
            <a href="#courses" className="nav-item">
              <FiBook /> My Courses
            </a>
            <a href="#bookings" className="nav-item">
              <FiCalendar /> Lab Bookings
            </a>
            <a href="#certificates" className="nav-item">
              <FiAward /> Certificates
            </a>
            <a href="#settings" className="nav-item">
              <FiSettings /> Settings
            </a>
          </nav>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </motion.aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Welcome back, {firstName}!
          </motion.h1>

          {/* Stats Grid */}
          <motion.div 
            className="stats-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="stat-card" variants={fadeInUp}>
              <div className="stat-icon">
                <FiCreditCard />
              </div>
              <div className="stat-content">
                <span className="stat-label">Current Plan</span>
                <span className="stat-value">{userData.plan}</span>
              </div>
            </motion.div>
            <motion.div className="stat-card" variants={fadeInUp}>
              <div className="stat-icon">
                <FiClock />
              </div>
              <div className="stat-content">
                <span className="stat-label">Lab Hours Used</span>
                <span className="stat-value">
                  {userData.labHoursUsed}/{userData.labHoursTotal} hrs
                </span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(userData.labHoursUsed / userData.labHoursTotal) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
            <motion.div className="stat-card" variants={fadeInUp}>
              <div className="stat-icon">
                <FiBook />
              </div>
              <div className="stat-content">
                <span className="stat-label">Courses</span>
                <span className="stat-value">{courses.length} Active</span>
              </div>
            </motion.div>
            <motion.div className="stat-card" variants={fadeInUp}>
              <div className="stat-icon">
                <FiAward />
              </div>
              <div className="stat-content">
                <span className="stat-label">Certificates</span>
                <span className="stat-value">{certificates.length} Earned</span>
              </div>
            </motion.div>
          </motion.div>

          {/* My Courses */}
          <motion.section 
            className="dashboard-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
          >
            <h2>My Courses</h2>
            <div className="courses-list">
              {courses.map((course) => (
                <div key={course.id} className="course-item">
                  <div className="course-info">
                    <h4>{course.title}</h4>
                    <span
                      className={`course-status ${course.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <div className="course-progress">
                    <span>{course.progress}%</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Lab Bookings */}
          <motion.section 
            className="dashboard-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
          >
            <h2>Upcoming Lab Bookings</h2>
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-date">
                    <FiCalendar />
                    <span>{booking.date}</span>
                  </div>
                  <div className="booking-details">
                    <strong>{booking.lab}</strong>
                    <span>{booking.time}</span>
                  </div>
                  <span
                    className={`booking-status badge ${booking.status.toLowerCase()}`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/facilities" className="btn btn-outline" style={{ marginTop: '20px', display: 'inline-flex' }}>
              Book New Session
            </Link>
          </motion.section>

          {/* Certificates */}
          <motion.section 
            className="dashboard-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
          >
            <h2>My Certificates</h2>
            <div className="certificates-list">
              {certificates.map((cert) => (
                <div key={cert.id} className="certificate-item">
                  <FiAward className="cert-icon" />
                  <div className="cert-info">
                    <h4>{cert.title}</h4>
                    <span>Issued: {cert.date}</span>
                  </div>
                  <button className="btn btn-outline">
                    <FiDownload /> Download
                  </button>
                </div>
              ))}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
