import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import PublicationsPage from './pages/PublicationsPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactsPage from './pages/ContactsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SkillsPage from './pages/SkillsPage';

import ResumeSelectorPage from './pages/Resume/ResumeSelectorPage';
import VisualResumePage from './pages/Resume/VisualResumePage';
import ATSResumePage from './pages/Resume/ATSResumePage';

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
                    <Analytics />
                </TrackerWrapper>
            </BrowserRouter>
        </PortfolioProvider>
    );
}

export default App;
