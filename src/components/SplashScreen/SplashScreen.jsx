import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');

  useEffect(() => {
    const loadingTexts = [
      'Initializing',
      'Loading Assets',
      'Preparing 3D Scene',
      'Starting Up'
    ];

    let currentIndex = 0;
    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[currentIndex]);
    }, 600);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="splash-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background */}
        <div className="splash-bg">
          <div className="grid-lines"></div>
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>

        {/* Main Content */}
        <div className="splash-content">
          {/* Logo Animation */}
          <motion.div
            className="splash-logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="logo-ring">
              <svg viewBox="0 0 100 100">
                <circle className="ring-bg" cx="50" cy="50" r="45" />
                <circle 
                  className="ring-progress" 
                  cx="50" 
                  cy="50" 
                  r="45"
                  style={{ 
                    strokeDasharray: `${progress * 2.83} 283`,
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center'
                  }}
                />
              </svg>
              <span className="logo-icon"><FiZap size={40} /></span>
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            className="splash-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            ROBOZONIX
          </motion.h1>

          <motion.p
            className="splash-tagline"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            LABS
          </motion.p>

          {/* Loading Bar */}
          <motion.div
            className="splash-loader"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="loader-track">
              <div 
                className="loader-fill" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
              <div className="loader-glow"></div>
            </div>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            className="splash-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="status-text">{loadingText}</span>
            <span className="status-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
            <span className="status-percent">{Math.min(Math.round(progress), 100)}%</span>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="corner-decor top-left"></div>
        <div className="corner-decor top-right"></div>
        <div className="corner-decor bottom-left"></div>
        <div className="corner-decor bottom-right"></div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
