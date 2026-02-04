import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError("Please fill in all fields");
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      navigate("/");
    } else {
      setFormError(result.error);
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
            <h1>Welcome Back</h1>
            <p>Login to access your dashboard</p>
          </div>

          {(formError || error) && (
            <div className="auth-error">
              {formError || error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
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
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="spin" /> Logging in...
                </>
              ) : (
                "Login"
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
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
