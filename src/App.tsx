import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import GovernmentLayout from './layouts/GovernmentLayout';
import LanguageGate from './components/LanguageGate';

// Core interactive pages
import Home from './pages/Home';
import Services from './pages/Services';
import Immigration from './pages/Immigration';
import Biometrics from './pages/Biometrics';
import Passport from './pages/Passport';
import WorkPermit from './pages/WorkPermit';
import StudyPermit from './pages/StudyPermit';
import PermanentResidence from './pages/PermanentResidence';
import Citizenship from './pages/Citizenship';
import Taxes from './pages/Taxes';
import Benefits from './pages/Benefits';
import Employment from './pages/Employment';
import Travel from './pages/Travel';
import Business from './pages/Business';
import SearchPage from './pages/Search';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationDetails from './pages/ApplicationDetails';

// Secondary hubs pages
import {
  VisitCanada,
  Health,
  Environment,
  Justice,
  PublicSafety,
  Contact,
  Help,
  Accessibility,
  Privacy,
  Terms
} from './pages/SecondaryHubs';

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll immediately
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Scroll with a tiny delay to ensure page rendering is complete and browser doesn't autoscroll
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { hasEntered } = useApp();

  if (!hasEntered) {
    return <LanguageGate />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        
        {/* Main Government Routing Template enclosing child views */}
        <Route path="/" element={<GovernmentLayout />}>
          
          {/* Primary Index Landings */}
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          
          {/* Immigration Sector Nested gateways */}
          <Route path="immigration-citizenship">
            <Route index element={<Immigration />} />
            <Route path="biometrics" element={<Biometrics />} />
            <Route path="passports" element={<Passport />} />
            <Route path="visit-canada" element={<VisitCanada />} />
            <Route path="work-permits" element={<WorkPermit />} />
            <Route path="study-permits" element={<StudyPermit />} />
            <Route path="permanent-residence" element={<PermanentResidence />} />
            <Route path="citizenship" element={<Citizenship />} />
          </Route>

          {/* Core Categories Section routes */}
          <Route path="taxes" element={<Taxes />} />
          <Route path="benefits" element={<Benefits />} />
          <Route path="employment" element={<Employment />} />
          <Route path="travel" element={<Travel />} />
          <Route path="business" element={<Business />} />
          <Route path="health" element={<Health />} />
          <Route path="environment" element={<Environment />} />
          <Route path="justice" element={<Justice />} />
          <Route path="public-safety" element={<PublicSafety />} />

          {/* Support / Help Guides pages */}
          <Route path="search" element={<SearchPage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="help" element={<Help />} />
          <Route path="accessibility" element={<Accessibility />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />

          {/* Credentials authentication portal paths */}
          <Route path="auth/login" element={<Login />} />
          <Route path="auth/register" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="application/:id" element={<ApplicationDetails />} />
          <Route path="admin" element={<AdminDashboard />} />

          {/* General Catch-All fallback redirecting to root index */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
