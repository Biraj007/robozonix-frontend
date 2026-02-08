import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

// Admin pages
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const BlogManager = lazy(() => import("./pages/Admin/BlogManager"));
const EventManager = lazy(() => import("./pages/Admin/EventManager"));
const CourseManager = lazy(() => import("./pages/Admin/CourseManager"));
const ProjectManager = lazy(() => import("./pages/Admin/ProjectManager"));
const FacilityManager = lazy(() => import("./pages/Admin/FacilityManager"));
const UserManager = lazy(() => import("./pages/Admin/UserManager"));
const ChatbotManager = lazy(() => import("./pages/Admin/ChatbotManager"));

// Restored Chatbot
const Chatbot = lazy(() => import("./components/Chatbot/Chatbot"));
const MorphingParticles = lazy(() => import("./components/Hero/MorphingParticles"));

// Layout component to conditionally show header/footer
const Layout = ({ children, appReady, show3D }) => {
  const location = useLocation();
  const authRoutes = ['/login', '/register'];
  const isAuthPage = authRoutes.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');
  const hideChrome = isAuthPage || isAdminPage;
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`app ${appReady ? 'visible' : ''}`}>
      {/* Background Particles - deferred for performance */}
      {show3D && (
        <Suspense fallback={null}>
          <MorphingParticles />
        </Suspense>
      )}

      {/* Header/Navigation - hidden on auth and admin pages */}
      {!hideChrome && <Header />}

      {/* Main Content */}
      <main className="main-content">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>

      {/* Footer - hidden on auth and admin pages */}
      {!hideChrome && <Footer />}

      {/* Chatbot - hidden on auth and admin pages */}
      {!hideChrome && (
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
  const [show3D, setShow3D] = useState(false);

  // Defer 3D scene initialization for better FCP
  useEffect(() => {
    const initId = requestIdleCallback(() => setShow3D(true), { timeout: 200 });
    return () => cancelIdleCallback(initId);
  }, []);

  useEffect(() => {
    // Defer Lenis loading to reduce initial TBT
    const lenisId = requestIdleCallback(() => {
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
      });
    }, { timeout: 500 });

    return () => {
      cancelIdleCallback(lenisId);
      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }
    };
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
          <Layout appReady={appReady} show3D={show3D}>
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
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="blogs" element={<BlogManager />} />
                <Route path="events" element={<EventManager />} />
                <Route path="courses" element={<CourseManager />} />
                <Route path="projects" element={<ProjectManager />} />
                <Route path="facilities" element={<FacilityManager />} />
                <Route path="users" element={<UserManager />} />
                <Route path="chatbot" element={<ChatbotManager />} />
              </Route>
            </Routes>
          </Layout>
        </Router>
      )}
    </AuthProvider>
  );
}

export default App;
