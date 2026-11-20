﻿﻿﻿﻿﻿﻿﻿import { useState, useEffect } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import avtarImg from '../assets/avtar.webp';
import InlineAudioWaveform from './InlineAudioWaveform';


const Hero = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const [roleIndex, setRoleIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const rawRoles = data.hero.roles && data.hero.roles.length > 0 ? data.hero.roles : [data.hero.title];
    const roles = rawRoles.filter((r) => !r.toLowerCase().includes('ieb') && !r.includes('A-31537'));
    const [currentTime, setCurrentTime] = useState(new Date());

    const [isLightMode, setIsLightMode] = useState(() =>
        typeof document !== 'undefined' ? document.documentElement.classList.contains('light-mode') : false
    );

    useEffect(() => {
        const updateTheme = () => {
            setIsLightMode(document.documentElement.classList.contains('light-mode'));
        };
        window.addEventListener('themechange', updateTheme);
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => {
            window.removeEventListener('themechange', updateTheme);
            observer.disconnect();
        };
    }, []);

    const toggleTheme = () => {
        if (isLightMode) {
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
        window.dispatchEvent(new Event('themechange'));
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'short', 
            month: 'short', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        };
        return date.toLocaleString('en-US', options).replace(/,/g, '');
    };

    useEffect(() => {
        if (roles.length <= 1) return;
        
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setRoleIndex((prev) => (prev + 1) % roles.length);
                setFade(true);
            }, 500); // fade duration matches CSS transition
        }, 3000); // 3 seconds per role

        return () => clearInterval(interval);
    }, [roles.length]);
    
    return (
        <section id="hero" className="hero section" style={{ 
            height: '100%',
            minHeight: 0,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center', 
            paddingTop: '65px',
            paddingBottom: '0',
            boxSizing: 'border-box',
            overflow: 'hidden',
        }}>
            <div className="container">
                <div className="hero-image fade-in" ref={addToRefs} style={{ marginBottom: '10px' }}>
                    <div className="image-wrapper">
                        <img src={data.hero.avatarUrl ? resolveUrl(data.hero.avatarUrl) : avtarImg} alt={data.hero.name} />
                    </div>
                </div>
                
                <div className="hero-content">
                    <div className="time-pill-container fade-in" ref={addToRefs}>
                        <div className="time-pill">
                            <span className="time-text">{formatTime(currentTime)}</span>
                            <div className="pill-divider"></div>
                            <div 
                                className="theme-toggle-mini" 
                                onClick={toggleTheme} 
                                style={{ cursor: 'pointer' }}
                                role="button"
                                tabIndex={0}
                                aria-label="Toggle theme"
                            >
                                {isLightMode ? (
                                    <Sun size={14} className="sun-icon" style={{ color: '#f59e0b' }} />
                                ) : (
                                    <Moon size={14} className="moon-icon" />
                                )}
                                <div className={`toggle-slider ${isLightMode ? 'light' : ''}`}>
                                    <div className={`slider-thumb ${isLightMode ? 'light' : ''}`}>
                                        <div className="thumb-dots"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="badge fade-in" ref={addToRefs}>Available for new opportunities</div>
                    <h1 className="fade-in hero-name-h1" ref={addToRefs}>
                        Hi, I'm <span className="hero-name-highlight">Engr. Shah Abdul Mazid</span>
                    </h1>
                    {/* Upgraded IEB Membership Badge: Recruiter & User Friendly */}
                    <div 
                        className="ieb-hero-badge fade-in" 
                        ref={addToRefs}
                        tabIndex={0}
                        aria-label="Associate Member, Institution of Engineers, Bangladesh (IEB) | Membership No: A-31537 • Valid through 2028"
                    >
                        <img src="/documents/ieb-logo.png" alt="IEB Logo" className="ieb-hero-logo" />
                        <span className="ieb-status-dot" aria-hidden="true"></span>
                        <div className="ieb-hero-text">
                            <span className="ieb-org-title">Associate Member, Institution of Engineers, Bangladesh (IEB)</span>
                            <span className="ieb-pipe" aria-hidden="true">|</span>
                            <span className="ieb-meta-group">
                                <span className="ieb-id-wrap">
                                    <span className="ieb-id-label">Membership No:</span>&nbsp;
                                    <a
                                        href="https://www.iebbd.org/member/search.jsp?searchToken=0774C58B4389C67C58A47EECCEBBE307&membershipId=A-31537&memberNameEmailMobile="
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ieb-id ieb-id-link"
                                        title="Verify IEB Membership — Institution of Engineers, Bangladesh"
                                        onClick={(e) => e.stopPropagation()}
                                    >A-31537</a>
                                </span>
                                <span className="ieb-bullet" aria-hidden="true">&bull;</span>
                                <span className="ieb-validity">Valid through 2028</span>
                            </span>
                        </div>

                    </div>
                    <InlineAudioWaveform />
                    <p className="fade-in hero-roles-anim" ref={addToRefs}>
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {(() => {
                                const text = roles[roleIndex] || '';
                                return text.split('').map((char, index) => {
                                    const len = text.length;
                                    const center = (len - 1) / 2;
                                    const dist = Math.abs(index - center);
                                    const maxDist = center;
                                    
                                    // Fading IN: center appears first, expands outwards
                                    const inDelay = dist * 0.04;
                                    // Fading OUT: edges vanish first, ends at the middle
                                    const outDelay = (maxDist - dist) * 0.04;
                                    const delay = fade ? inDelay : outDelay;

                                    return (
                                        <span 
                                            key={`${roleIndex}-${index}`}
                                            className={`edge-fade ${fade ? 'in' : 'out'}`}
                                            style={{ 
                                                animationDelay: `${delay}s`,
                                                whiteSpace: 'pre'
                                            }}
                                        >
                                            {char === ' ' ? '\u00A0' : char}
                                        </span>
                                    );
                                });
                            })()}
                        </span>
                    </p>
                    <p className="fade-in hero-bio-line" ref={addToRefs}>
                        {(() => {
                            const desc = data.hero.description || "A CSE graduate focused on Intelligent Systems & Data Science";
                            const clean = desc.split(/\.\s+/)[0]?.replace(/\.$/, '').trim();
                            return clean || "A CSE graduate focused on Intelligent Systems & Data Science";
                        })()}
                    </p>
                    <div className="hero-btns fade-in" ref={addToRefs}>
                        <Link to="/projects" className="btn btn-primary btn-gradient">View My Work</Link>
                        <Link to="/resume" className="btn btn-secondary btn-outline">My Resume</Link>
                        <Link to="/contacts" className="btn btn-secondary btn-outline">Get In Touch</Link>
                    </div>

                </div>
            </div>
            <style>{`
                #hero { min-height: 0 !important; }
                .hero-grid { display: block; }
                .hero-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.25rem;
                    max-width: 1100px;
                    width: 100%;
                    margin: 0 auto;
                }
                .hero-content > * {
                    margin: 0;
                }
                .time-pill-container { display: flex; justify-content: center; }
                .time-pill { 
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                    background: rgba(13, 13, 18, 0.6); 
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 5px 6px 5px 18px;
                    border-radius: 100px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
                .time-text { 
                    font-family: 'JetBrains Mono', 'Fira Code', monospace; 
                    font-size: 0.85rem; 
                    color: rgba(255, 255, 255, 0.9);
                    letter-spacing: 0.5px;
                }
                .pill-divider { width: 1px; height: 16px; background: rgba(255, 255, 255, 0.1); }
                
                .theme-toggle-mini {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding-right: 4px;
                    cursor: pointer;
                    user-select: none;
                }
                .moon-icon { color: rgba(255, 255, 255, 0.7); }
                .sun-icon { color: #f59e0b; }
                .toggle-slider {
                    width: 32px;
                    height: 18px;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 10px;
                    position: relative;
                    transition: background 0.3s ease;
                }
                .toggle-slider.light {
                    background: rgba(2, 132, 199, 0.35);
                }
                .slider-thumb {
                    position: absolute;
                    left: 2px;
                    top: 2px;
                    width: 14px;
                    height: 14px;
                    background: #fff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease;
                }
                .slider-thumb.light {
                    transform: translateX(14px);
                    background: #0284c7;
                }
                .thumb-dots {
                    width: 6px;
                    height: 6px;
                    background: #94a3b8;
                    border-radius: 50%;
                }
                .slider-thumb.light .thumb-dots {
                    background: #e0f2fe;
                }

                .badge { 
                    display: inline-block; 
                    padding: 6px 20px; 
                    background: var(--primary-glow); 
                    border: 1px solid var(--border-color); 
                    border-radius: 100px; 
                    color: var(--primary); 
                    font-size: 0.8rem; 
                    font-weight: 600; 
                    backdrop-filter: blur(12px); 
                }

                /* 1. Main Headline — balanced, professional, text-3xl→text-5xl scale (desktop ~2rem–2.6rem) */
                .hero-name-h1 {
                    font-size: clamp(1.6rem, 2.9vw, 2.6rem);
                    font-weight: 800;
                    color: #FFFFFF !important;
                    letter-spacing: -0.025em;
                    line-height: 1.18;
                    margin: 0;
                    white-space: nowrap !important;
                    text-align: center;
                    position: relative;
                    display: inline-block;
                    padding: 3px 22px;
                    border-radius: 18px;
                    background: radial-gradient(ellipse 95% 90% at 50% 50%, rgba(10, 17, 34, 0.68) 0%, rgba(10, 17, 34, 0) 80%);
                    text-shadow:
                        0 3px 14px rgba(0, 0, 0, 0.9),
                        0 6px 28px rgba(0, 0, 0, 0.8);
                    filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.6));
                }
                .hero-name-highlight {
                    color: #FFFFFF !important;
                    white-space: nowrap !important;
                }
                html.light-mode .hero-name-h1 {
                    color: #0f172a !important;
                    background: radial-gradient(ellipse 95% 90% at 50% 50%, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0) 80%);
                    text-shadow: 0 2px 16px rgba(255, 255, 255, 0.95);
                    filter: none;
                }
                html.light-mode .hero-name-highlight {
                    color: #0f172a !important;
                }

                /* 2. IEB Membership Badge — responsive, never breaks mid-word */
                .ieb-hero-badge {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 20px;
                    background: rgba(15, 23, 42, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(251, 191, 36, 0.45);
                    border-radius: 9999px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 16px rgba(251, 191, 36, 0.15);
                    margin: 0;
                    cursor: default;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    max-width: 95%;
                }
                .ieb-hero-badge:hover,
                .ieb-hero-badge:focus-visible {
                    border-color: rgba(251, 191, 36, 0.8);
                    background: rgba(15, 23, 42, 0.96);
                    box-shadow: 0 6px 28px rgba(0, 0, 0, 0.55), 0 0 22px rgba(251, 191, 36, 0.3);
                    transform: translateY(-1px);
                }
                .ieb-hero-logo {
                    width: 24px;
                    height: 24px;
                    object-fit: contain;
                    border-radius: 50%;
                    background: #ffffff;
                    padding: 2px;
                    flex-shrink: 0;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
                    border: 1.5px solid rgba(251, 191, 36, 0.65);
                }
                .ieb-status-dot {
                    width: 7px;
                    height: 7px;
                    background-color: #FBBF24;
                    border-radius: 50%;
                    box-shadow: 0 0 7px #FBBF24, 0 0 11px rgba(251, 191, 36, 0.65);
                    display: inline-block;
                    flex-shrink: 0;
                    animation: iebDotPulse 2.5s infinite ease-in-out;
                }
                @keyframes iebDotPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.55; transform: scale(0.85); }
                }
                /* 
                 * .ieb-hero-text is the flex container for all badge content.
                 * Desktop: flex-wrap: nowrap forces single line.
                 * Mobile breakpoints re-enable wrap for clean 2-line stacking.
                 */
                .ieb-hero-text {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.82rem;
                    line-height: 1.4;
                    letter-spacing: 0.01em;
                    flex-wrap: nowrap;
                    white-space: nowrap;
                }
                .ieb-org-title {
                    color: #FFFFFF;
                    font-weight: 600;
                    white-space: nowrap; /* never splits "Institution of Engineers, Bangladesh (IEB)" */
                }
                .ieb-pipe {
                    color: rgba(251, 191, 36, 0.55);
                    font-weight: 300;
                    margin: 0 1px;
                    user-select: none;
                    white-space: nowrap;
                }
                .ieb-meta-group {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap; /* keeps "ID: A-31537 • Valid through 2028" on one line */
                }
                .ieb-id-wrap {
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                    color: #F1F5F9;
                    white-space: nowrap;
                }
                .ieb-id-label {
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: 500;
                }
                .ieb-id {
                    color: #FBBF24;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                }
                .ieb-id-link {
                    color: #FBBF24;
                    text-decoration: none;
                    border-bottom: 1px dashed rgba(251, 191, 36, 0.55);
                    padding-bottom: 1px;
                    transition: color 0.2s ease, border-color 0.2s ease, text-shadow 0.2s ease;
                    cursor: pointer;
                }
                .ieb-id-link:hover,
                .ieb-id-link:focus-visible {
                    color: #FDE68A;
                    border-bottom-color: #FDE68A;
                    text-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
                    outline: none;
                }
                html.light-mode .ieb-id-link {
                    color: #d97706;
                    border-bottom-color: rgba(217, 119, 6, 0.5);
                }
                html.light-mode .ieb-id-link:hover {
                    color: #b45309;
                    border-bottom-color: #b45309;
                    text-shadow: none;
                }
                .ieb-bullet {
                    color: #FBBF24;
                    font-size: 0.75rem;
                    user-select: none;
                }
                .ieb-validity {
                    color: #FFFFFF;
                    font-weight: 500;
                    white-space: nowrap;
                }


                html.light-mode .ieb-hero-badge {
                    background: rgba(255, 255, 255, 0.94);
                    border-color: rgba(217, 119, 6, 0.45);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                }
                html.light-mode .ieb-org-title,
                html.light-mode .ieb-id-label,
                html.light-mode .ieb-validity {
                    color: #0f172a;
                }
                html.light-mode .ieb-id,
                html.light-mode .ieb-pipe,
                html.light-mode .ieb-bullet {
                    color: #d97706;
                }

                html.light-mode .ieb-status-dot {
                    background-color: #d97706;
                }

                /* Audio widget integration */
                .hero-content .audio-widget-root {
                    margin: 0 auto;
                }

                /* Rotating roles */
                .hero-roles-anim {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    max-width: 800px;
                    margin: 0 auto;
                    line-height: 1.5;
                    min-height: 32px;
                    display: flex;
                    justify-content: center;
                    overflow: hidden;
                    text-shadow: 0 2px 16px rgba(0, 0, 0, 0.85);
                }
                html.light-mode .hero-roles-anim {
                    text-shadow: 0 1px 12px rgba(255, 255, 255, 0.9);
                }

                /* 3. Subtitle & Primary Bio Line */
                .hero-bio-line {
                    font-size: clamp(1.05rem, 2vw, 1.15rem);
                    color: #F1F5F9;
                    font-weight: 400;
                    line-height: 1.6;
                    max-width: 680px;
                    margin: 0 auto;
                    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.85);
                    letter-spacing: 0.01em;
                }
                html.light-mode .hero-bio-line {
                    color: #334155;
                    text-shadow: none;
                }

                /* CTA Buttons */
                .hero-btns { 
                    display: flex; 
                    gap: 14px; 
                    margin: 0; 
                    justify-content: center; 
                    align-items: center;
                }
                .image-wrapper { position: relative; width: 110px; height: 110px; margin: 0 auto; }
                .image-wrapper img { 
                    width: 100%; height: 100%; object-fit: cover; 
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    border: 2px solid var(--border-color); 
                    padding: 2px;
                    opacity: 0.9;
                    mix-blend-mode: luminosity;
                    transition: 0.5s ease;
                }
                .image-wrapper img:hover {
                    opacity: 1;
                    mix-blend-mode: normal;
                    border-radius: 50%;
                }
                html.light-mode .image-wrapper img {
                    mix-blend-mode: normal;
                    border-color: var(--primary);
                    opacity: 1;
                }
                
                .edge-fade {
                    display: inline-block;
                    opacity: 0;
                }
                
                .edge-fade.in {
                    animation: edgeFadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                .edge-fade.out {
                    animation: edgeFadeOut 0.6s cubic-bezier(0.8, 0.2, 1, 0.8) forwards;
                }

                @keyframes edgeFadeIn {
                    0% { opacity: 0; filter: blur(6px); transform: scale(0.95); letter-spacing: -2px; }
                    100% { opacity: 1; filter: blur(0px); transform: scale(1); letter-spacing: 0px; }
                }

                @keyframes edgeFadeOut {
                    0% { opacity: 1; filter: blur(0px); transform: scale(1); letter-spacing: 0px; }
                    100% { opacity: 0; filter: blur(10px); transform: scale(0.9); letter-spacing: 2px; }
                }

                .btn-gradient { 
                    background: var(--gradient); 
                    color: white; 
                    border: none; 
                    padding: 11px 26px; 
                    font-size: 0.95rem; 
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(56, 189, 248, 0.35);
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                .btn-gradient:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 28px rgba(56, 189, 248, 0.5);
                }
                .btn-outline { 
                    background: rgba(15, 23, 42, 0.85); 
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid var(--border-color); 
                    color: var(--text-color); 
                    padding: 11px 26px; 
                    font-size: 0.95rem; 
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                .btn-outline:hover { 
                    background: rgba(56, 189, 248, 0.18); 
                    border-color: var(--primary); 
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(56, 189, 248, 0.25);
                }
                html.light-mode .btn-outline {
                    background: rgba(255, 255, 255, 0.90);
                    border-color: rgba(203, 213, 225, 0.95);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                }
                html.light-mode .btn-outline:hover {
                    background: rgba(2, 132, 199, 0.1);
                    border-color: var(--primary);
                    box-shadow: 0 8px 20px rgba(2, 132, 199, 0.2);
                }

                /* ── Badge: pipe hidden below md, stays pill shape */
                @media (max-width: 860px) {
                    .ieb-pipe {
                        display: none !important;
                    }
                    .ieb-hero-badge {
                        border-radius: 18px !important;
                        padding: 8px 16px !important;
                    }
                }
                @media (max-width: 768px) {
                    #hero {
                        height: auto !important;
                        min-height: calc(100dvh - 120px) !important;
                        padding-top: 75px !important;
                        padding-bottom: 20px !important;
                        overflow: visible !important;
                    }
                    .hero-content {
                        gap: 0.9rem !important;
                    }
                    .hero-image {
                        margin-bottom: 4px !important;
                    }
                    .image-wrapper { 
                        width: 85px !important; 
                        height: 85px !important; 
                    }
                    .badge { 
                        padding: 5px 14px !important; 
                        font-size: 0.72rem !important; 
                    }
                    .time-pill { 
                        padding: 4px 6px 4px 12px !important; 
                    }
                    .time-text { 
                        font-size: 0.72rem !important; 
                    }
                    /* text-4xl equivalent (~2.25rem) on tablet */
                    .hero-name-h1 {
                        font-size: clamp(1.5rem, 5.5vw, 2.3rem) !important;
                        line-height: 1.18 !important;
                        white-space: nowrap !important;
                        padding: 3px 14px !important;
                    }
                    .ieb-hero-badge {
                        padding: 7px 14px !important;
                        gap: 7px !important;
                        border-radius: 16px !important;
                    }
                    .ieb-hero-text {
                        font-size: 0.82rem !important;
                        gap: 4px 8px !important;
                    }
                    .ieb-hero-logo { width: 20px !important; height: 20px !important; }
                    .ieb-status-dot { width: 6px !important; height: 6px !important; }
                    .hero-roles-anim {
                        font-size: 0.95rem !important;
                        max-width: 92% !important;
                        min-height: 28px !important;
                    }
                    .hero-bio-line {
                        font-size: 0.92rem !important;
                        max-width: 92% !important;
                    }
                    .hero-btns { 
                        flex-direction: column !important; 
                        align-items: center !important;
                        width: 100% !important; 
                        gap: 10px !important; 
                        margin: 0 !important;
                    }
                    .hero-btns .btn { 
                        width: 100% !important; 
                        max-width: 250px !important; 
                        text-align: center !important; 
                        padding: 10px 18px !important;
                        font-size: 0.88rem !important;
                    }
                }
                /* text-3xl equivalent (~1.875rem) on mobile, still single line */
                @media (max-width: 520px) {
                    .hero-name-h1 {
                        font-size: clamp(1.2rem, 5.2vw, 1.75rem) !important;
                        white-space: nowrap !important;
                        padding: 3px 10px !important;
                    }
                    .ieb-hero-badge {
                        font-size: 0.75rem !important;
                        padding: 6px 10px !important;
                        border-radius: 12px !important;
                        gap: 5px !important;
                    }
                    .ieb-hero-text {
                        font-size: 0.75rem !important;
                        gap: 3px 6px !important;
                    }
                    .ieb-tooltip {
                        white-space: normal !important;
                        width: 240px !important;
                        max-width: 88vw !important;
                        text-align: center !important;
                        font-size: 0.72rem !important;
                        padding: 6px 10px !important;
                    }                }
                @media (max-width: 380px) {
                    .hero-name-h1 {
                        font-size: clamp(1.05rem, 5.3vw, 1.2rem) !important;
                        white-space: nowrap !important;
                    }
                    .ieb-hero-text {
                        font-size: 0.7rem !important;
                    }
                }
                @media (max-height: 720px) {
                    .hero-content { gap: 0.7rem !important; }
                    .image-wrapper { width: 75px !important; height: 75px !important; }
                    .hero-image { margin-bottom: 4px !important; }
                    .badge { padding: 4px 12px !important; }
                    .hero-btns .btn { padding: 9px 18px !important; font-size: 0.85rem !important; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
