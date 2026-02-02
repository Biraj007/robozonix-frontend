import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import "./App.css";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Facilities = lazy(() => import("./pages/Facilities/Facilities"));
const Courses = lazy(() => import("./pages/Courses/Courses"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const Membership = lazy(() => import("./pages/Membership/Membership"));
const Events = lazy(() => import("./pages/Events/Events"));
const Blog = lazy(() => import("./pages/Blog/Blog"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Gallery = lazy(() => import("./pages/Gallery/Gallery"));
const FAQs = lazy(() => import("./pages/FAQs/FAQs"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

// Lazy load heavy components
const HeroCanvas = lazy(() => import("./components/Hero/HeroCanvas"));
const Chatbot = lazy(() => import("./components/Chatbot/Chatbot"));
const MobileDrone = lazy(() => import("./components/MobileDrone/MobileDrone"));

// Layout component to conditionally show header/footer
const Layout = ({ children, appReady }) => {
  const location = useLocation();
  const authRoutes = ['/login', '/register'];
  const isAuthPage = authRoutes.includes(location.pathname);
  const [isMobile, setIsMobile] = useState(false);
  const [load3D, setLoad3D] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Defer 3D loading to avoid blocking main thread
  useEffect(() => {
    if (!appReady) return;

    // Use requestIdleCallback if available, or fallback to timeout
    const loadHeavyAssets = () => {
      setLoad3D(true);
    };

    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(loadHeavyAssets, { timeout: 3000 });
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(loadHeavyAssets, 2000);
      return () => clearTimeout(timer);
    }
  }, [appReady]);

  return (
    <div className={`app ${appReady ? 'visible' : ''}`}>
      {/* Background Grid Effect */}
      <div className="bg-grid"></div>

      {/* Global 3D Background - Only on desktop, deferred load */}
      {load3D && !isMobile && (
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      )}

      {/* Lightweight 3D Drone for Mobile, deferred load */}
      {load3D && isMobile && (
        <Suspense fallback={null}>
          <MobileDrone />
        </Suspense>
      )}

      {/* Header/Navigation - hidden on auth pages */}
      {!isAuthPage && <Header />}

      {/* Main Content */}
      <main className="main-content">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>

      {/* Footer - hidden on auth pages */}
      {!isAuthPage && <Footer />}

      {/* Chatbot - hidden on auth pages, lazy loaded */}
      {!isAuthPage && (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      )}
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Lazy load Lenis for smooth scrolling
    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
      });
      
      window.lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
        window.lenis = null;
      };
    });
  }, []);

  const handleSplashComplete = () => {
    // Scroll to top immediately
    window.scrollTo(0, 0);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
    
    setIsLoading(false);
    setTimeout(() => setAppReady(true), 100);
  };

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        {isLoading && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
      
      {!isLoading && (
        <Router>
          <ScrollToTop />
          <Layout appReady={appReady}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/events" element={<Events />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Layout>
        </Router>
      )}
    </AuthProvider>
  );
}

export default App;
