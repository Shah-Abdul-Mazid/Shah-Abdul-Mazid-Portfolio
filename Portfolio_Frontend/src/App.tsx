import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import HomePage from './pages/HomePage';

// Lazy load secondary routes to keep initial mobile bundle tiny and fast
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PublicationsPage = lazy(() => import('./pages/PublicationsPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ContactsPage = lazy(() => import('./pages/ContactsPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));

// CV / Resume pages
const ResumeSelectorPage = lazy(() => import('./pages/Resume/ResumeSelectorPage'));
const VisualResumePage = lazy(() => import('./pages/Resume/VisualResumePage'));
const ATSResumePage = lazy(() => import('./pages/Resume/ATSResumePage'));

// Heavy admin dashboard code-split completely away from public visitors
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

import { PortfolioProvider } from './context/PortfolioContext';
import { useVisitorTracker } from './hooks/useVisitorTracker';

const TrackerWrapper = ({ children }: { children: React.ReactNode }) => {
    useVisitorTracker();
    return <>{children}</>;
};

function App() {
    return (
        <PortfolioProvider>
            <BrowserRouter>
                <TrackerWrapper>
                    <Suspense fallback={null}>
                        <Routes>
                            {/* Redirect root to admin login when launched as installed PWA */}
                            <Route path="/" element={
                                window.matchMedia('(display-mode: standalone)').matches
                                    ? <Navigate to="/login/admin" replace />
                                    : <Navigate to="/home" replace />
                            } />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/skills" element={<SkillsPage />} />
                            <Route path="/publications" element={<PublicationsPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/contacts" element={<ContactsPage />} />

                            {/* CV / Resume Routes */}
                            <Route path="/resume" element={<ResumeSelectorPage />} />
                            <Route path="/resume/visual" element={<VisualResumePage />} />
                            <Route path="/resume/ats" element={<ATSResumePage />} />

                            <Route path="/login/admin" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="*" element={<Navigate to="/home" replace />} />
                        </Routes>
                    </Suspense>
                    <Analytics />
                </TrackerWrapper>
            </BrowserRouter>
        </PortfolioProvider>
    );
}

export default App;
