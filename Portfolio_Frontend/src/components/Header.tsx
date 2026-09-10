import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import avtarImg from '../assets/avtar.png';

const Header = () => {
    // Compact, professional navigation (less clutter)
    const compactLinks = [
        { to: '/home', label: 'Home' },
        { to: '/profile', label: 'Profile' },
        { to: '/skills', label: 'Skills' },
        { to: '/publications', label: 'Publications' },
        { to: '/projects', label: 'Projects' },
        { to: '/contacts', label: 'Contacts' },
    ];

    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Apply theme on mount and when it changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
        window.dispatchEvent(new Event('themechange'));
    }, [isDarkMode]);

    useEffect(() => {
        const handleExternalThemeChange = () => {
            const isLight = document.documentElement.classList.contains('light-mode');
            setIsDarkMode(!isLight);
        };
        window.addEventListener('themechange', handleExternalThemeChange);
        return () => window.removeEventListener('themechange', handleExternalThemeChange);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const closeMenu = () => setIsMenuOpen(false);
    const isHomePage = location.pathname === '/' || location.pathname === '/home';
    const isScrolledHeader = scrolled && !isHomePage;

    return (
        <>
            <header className={isScrolledHeader ? 'scrolled' : ''} style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1000,
                padding: isScrolledHeader ? '12px 0' : '16px 0',
                transition: 'var(--transition)',
                backgroundColor: isScrolledHeader ? (isDarkMode ? 'rgba(2, 6, 23, 0.82)' : 'rgba(255, 255, 255, 0.88)') : 'transparent',
                backdropFilter: isScrolledHeader ? 'blur(16px)' : 'none',
                WebkitBackdropFilter: isScrolledHeader ? 'blur(16px)' : 'none',
                borderBottom: isScrolledHeader ? '1px solid var(--border-color)' : 'none',
                boxShadow: isScrolledHeader ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
            }}>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', width: '100%', padding: '0 3%' }}>
                    {/* Logo */}
                    <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', inset: '-2px', borderRadius: '50%',
                                background: 'var(--gradient)', zIndex: 0
                            }} />
                            <img src={avtarImg} alt="Logo" style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                objectFit: 'cover', position: 'relative', zIndex: 1,
                                border: '2px solid var(--bg-color)'
                            }} />
                        </div>
                        <span className="logo-name-text">Shah Abdul Mazid</span>
                    </Link>

                    {/* Desktop Nav - Compact */}
                    <div className="nav-links-desktop">
                        {compactLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={location.pathname === link.to ? 'nav-flat-link active' : 'nav-flat-link'}
                                style={{ fontSize: '0.8rem', padding: '8px 8px' }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} aria-label="Toggle theme" id="theme-toggle">
                            {isDarkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                            )}
                        </button>

                        {/* Hamburger - mobile only */}
                        <button
                            className={`mobile-toggle ${isMenuOpen ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                            id="hamburger-btn"
                        >
                            <span className="bar" />
                            <span className="bar" />
                            <span className="bar" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Backdrop */}
            <div
                className={`mobile-backdrop ${isMenuOpen ? 'open' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* Mobile Drawer */}
            <aside className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
                <div className="mobile-drawer-header">
                    <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} onClick={closeMenu}>
                        <img src={avtarImg} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-color)' }}>Shah Abdul Mazid</span>
                    </Link>
                    <button className="drawer-close" onClick={closeMenu} aria-label="Close menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <nav className="mobile-nav">
                    <ul>
                        {compactLinks.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={location.pathname === link.to ? 'mobile-nav-link active' : 'mobile-nav-link'}
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <style>{`
                .logo-name-text {
                    font-size: 1.0625rem;
                    font-weight: 700;
                    color: #ffffff;
                    white-space: nowrap;
                    text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7);
                    transition: color 0.3s ease;
                }
                html.light-mode .logo-name-text {
                    color: #0f172a;
                    text-shadow: 0 1px 4px rgba(255,255,255,0.8);
                }

                #theme-toggle {
                    background: rgba(15, 23, 42, 0.65);
                    border: 1px solid rgba(255,255,255,0.15);
                    color: #ffffff;
                    cursor: pointer;
                    width: 40px; height: 40px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    transition: var(--transition);
                    flex-shrink: 0;
                    backdrop-filter: blur(16px);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
                }
                #theme-toggle:hover { border-color: #38bdf8; color: #38bdf8; transform: scale(1.05); }
                html.light-mode #theme-toggle {
                    background: rgba(255, 255, 255, 0.85);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    color: #0f172a;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
                }
                html.light-mode #theme-toggle:hover {
                    border-color: #0284c7;
                    color: #0284c7;
                }

                /* Floating Glass Capsule Desktop Nav */
                .nav-links-desktop {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                    margin: 0 auto;
                    flex-wrap: nowrap;
                    background: rgba(15, 23, 42, 0.65);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    border-radius: 100px;
                    padding: 5px 10px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }
                html.light-mode .nav-links-desktop {
                    background: rgba(255, 255, 255, 0.88);
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
                }

                .nav-flat-link {
                    text-decoration: none;
                    color: #ffffff;
                    font-size: 0.85rem;
                    font-weight: 600;
                    padding: 7px 14px;
                    border-radius: 100px;
                    opacity: 0.9;
                    white-space: nowrap;
                    transition: var(--transition);
                    position: relative;
                    text-shadow: 0 1px 4px rgba(0,0,0,0.8);
                    letter-spacing: 0.02em;
                }
                html.light-mode .nav-flat-link {
                    color: #334155;
                    text-shadow: none;
                }
                .nav-flat-link::after {
                    display: none;
                }
                .nav-flat-link:hover { 
                    opacity: 1; 
                    color: #ffffff; 
                    background: rgba(255,255,255,0.12); 
                }
                html.light-mode .nav-flat-link:hover {
                    color: #0284c7;
                    background: rgba(2, 132, 199, 0.08);
                }
                .nav-flat-link.active { 
                    opacity: 1; 
                    color: #ffffff; 
                    font-weight: 700; 
                    background: linear-gradient(135deg, rgba(56, 189, 248, 0.35), rgba(168, 85, 247, 0.35)); 
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 2px 10px rgba(56, 189, 248, 0.2);
                }
                html.light-mode .nav-flat-link.active { 
                    color: #0284c7; 
                    background: rgba(2, 132, 199, 0.12); 
                    border: 1px solid rgba(2, 132, 199, 0.25);
                    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.1);
                }

                /* Hamburger */
                .mobile-toggle {
                    display: none;
                    width: 40px; height: 40px;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.35);
                    border-radius: 12px;
                    cursor: pointer;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 5px;
                    flex-shrink: 0;
                    transition: var(--transition);
                    backdrop-filter: blur(6px);
                }
                .mobile-toggle:hover { border-color: #a78bfa; }
                .mobile-toggle .bar {
                    width: 20px; height: 2px;
                    background: #ffffff;
                    border-radius: 2px;
                    transition: var(--transition);
                    transform-origin: center;
                }
                .mobile-toggle.active .bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
                .mobile-toggle.active .bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
                .mobile-toggle.active .bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

                /* Backdrop */
                .mobile-backdrop {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 1100;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                    backdrop-filter: blur(2px);
                }
                .mobile-backdrop.open { opacity: 1; visibility: visible; }

                /* Drawer */
                .mobile-drawer {
                    position: fixed;
                    top: 0; right: -100%;
                    width: min(320px, 88vw);
                    height: 100dvh;
                    background: var(--bg-color);
                    border-left: 1px solid var(--border-color);
                    z-index: 1200;
                    display: flex;
                    flex-direction: column;
                    transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: -20px 0 60px rgba(0,0,0,0.25);
                    overflow-y: auto;
                }
                .mobile-drawer.open { right: 0; }

                .mobile-drawer-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border-color);
                    flex-shrink: 0;
                }
                .drawer-close {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--text-color);
                    transition: var(--transition);
                }
                .drawer-close:hover { border-color: var(--primary); color: var(--primary); }

                .mobile-nav { flex: 1; padding: 16px 16px; }
                .mobile-nav ul { list-style: none; display: flex; flex-direction: column; gap: 4px; }
                .mobile-nav-link {
                    display: block;
                    padding: 14px 16px;
                    text-decoration: none;
                    color: var(--text-color);
                    font-size: 1rem;
                    font-weight: 500;
                    border-radius: 12px;
                    opacity: 0.7;
                    transition: var(--transition);
                }
                .mobile-nav-link:hover { opacity: 1; background: rgba(139,92,246,0.08); color: var(--primary); }
                .mobile-nav-link.active { opacity: 1; background: rgba(139,92,246,0.12); color: var(--primary); font-weight: 700; }

                @media (max-width: 900px) {
                    .nav-links-desktop { display: none !important; }
                    .mobile-toggle { display: flex !important; }
                    .mobile-backdrop { display: block; }
                }

                @media (max-width: 600px) {
                    .logo-name-text { font-size: 0.95rem; }
                    #theme-toggle { width: 36px; height: 36px; }
                    .mobile-toggle { width: 36px; height: 36px; }
                }

                @media (max-width: 440px) {
                    .logo-name-text { display: none; }
                }
            `}</style>
        </>
    );
};

export default Header;
