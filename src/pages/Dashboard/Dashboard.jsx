import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiCreditCard,
  FiBook,
  FiCalendar,
  FiDownload,
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

  // User data with real info
  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    plan: user?.membership === "None" ? "Free Plan" : user?.membership + " Plan",
    memberSince: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    labHoursUsed: 18,
    labHoursTotal: 30,
  };



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

  // User data with fallback
  const enrolledCourses = user?.enrolledCourses || [];
  const bookings = user?.bookings || [];
  const certificates = user?.certificates || [];
  const labHoursUsed = user?.labHoursUsed || 0;
  const labHoursTotal = user?.labHoursTotal || 20;

  return (
    <div className="dashboard-page">
      {/* Mobile Header */}
      <div className="dashboard-container">


        {/* Main Content */}
        <main className="dashboard-main">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="dashboard-heading"
          >
            Welcome back, {userData.name}
            <span className="plan-badge-large">{userData.plan}</span>
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
                  {labHoursUsed}/{labHoursTotal} <span className="stat-unit">hrs</span>
                </span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(labHoursUsed / labHoursTotal) * 100}%`,
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
                <span className="stat-value">{enrolledCourses.length} <span className="stat-unit">Active</span></span>
              </div>
            </motion.div>
            <motion.div className="stat-card" variants={fadeInUp}>
              <div className="stat-icon">
                <FiAward />
              </div>
              <div className="stat-content">
                <span className="stat-label">Certificates</span>
                <span className="stat-value">{certificates.length} <span className="stat-unit">Earned</span></span>
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
            {enrolledCourses.length > 0 ? (
              <div className="courses-list">
                {enrolledCourses.map((course, index) => (
                  <div key={index} className="course-item">
                    <div className="course-info">
                      <h4>{course.title}</h4>
                      <span
                        className={`course-status ${course.status?.toLowerCase().replace(" ", "-")}`}
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
            ) : (
             <div className="empty-state">
               <p>You haven't enrolled in any courses yet.</p>
               <Link to="/courses" className="btn btn-primary" style={{marginTop: '10px'}}>Browse Courses</Link>
             </div>
            )}
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
            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map((booking, index) => (
                  <div key={index} className="booking-item">
                    <div className="booking-date">
                      <FiCalendar />
                      <span>{booking.date}</span>
                    </div>
                    <div className="booking-details">
                      <strong>{booking.lab}</strong>
                      <span>{booking.time}</span>
                    </div>
                    <span
                      className={`booking-status badge ${booking.status?.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-msg">No upcoming bookings.</p>
            )}
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
            {certificates.length > 0 ? (
              <div className="certificates-list">
                {certificates.map((cert, index) => (
                  <div key={index} className="certificate-item">
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
            ) : (
              <p className="no-data-msg">No certificates earned yet.</p>
            )}
          </motion.section>
          <motion.div 
            className="dashboard-logout-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}
          >
             <button className="logout-btn-large" onClick={handleLogout}>
               <FiLogOut /> Logout
             </button>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
