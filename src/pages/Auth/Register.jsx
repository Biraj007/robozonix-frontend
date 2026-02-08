import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
    clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      errors.password = "Password must include uppercase, lowercase, number, and special character";
    }

    if (!agreedToTerms) {
      errors.terms = "You must agree to the Terms of Service";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await register(formData);

    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-name">ROBOZONIX</span>
            </Link>
            <h1>Join Robozonix Labs</h1>
            <p>Create your account to get started</p>
          </div>

          {error && (
            <div className="auth-error">
              <FiAlertCircle /> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    className={`form-input ${formErrors.name ? "input-error" : ""}`}
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {formErrors.name && <span className="field-error">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone (Optional)</label>
                <div className="input-with-icon">
                  <FiPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className={`form-input ${formErrors.email ? "input-error" : ""}`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {formErrors.email && <span className="field-error">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-input ${formErrors.password ? "input-error" : ""}`}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {formErrors.password && <span className="field-error">{formErrors.password}</span>}
              <span className="password-hint">
                Must contain uppercase, lowercase, number, and special character
              </span>
            </div>

            <label className={`checkbox-label terms-checkbox ${formErrors.terms ? "checkbox-error" : ""}`}>
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={loading}
              />
              <span>
                I agree to the{" "}
                <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>
              </span>
            </label>
            {formErrors.terms && <span className="field-error">{formErrors.terms}</span>}

            <button 
              type="submit" 
              className="btn btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="spin" /> Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-auth">
              <button type="button" className="social-btn google-btn" disabled={loading}>
                <FaGoogle /> Continue with Google
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
            <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Skip</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
