import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ProjectsPage from '../pages/ProjectsPage';

// Admin imports
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ProjectsManager } from '../pages/admin/ProjectsManager';
import { InquiriesPage } from '../pages/admin/InquiriesPage';
import { CalendarPage } from '../pages/admin/CalendarPage';
import { AvailabilityManager } from '../pages/admin/AvailabilityManager';
import { AdminLayout } from './admin/AdminLayout';
import { ProtectedRoute } from './admin/ProtectedRoute';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default function AnimatedRoutes() {
  const location = useLocation();

  const handleExitComplete = () => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0, { immediate: true });
      }
    }
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/projects" element={<PageWrapper><ProjectsPage /></PageWrapper>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProjectsManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inquiries"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <InquiriesPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/calendar"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CalendarPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/availability"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AvailabilityManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
