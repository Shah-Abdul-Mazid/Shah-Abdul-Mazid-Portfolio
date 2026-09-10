import { useState, useEffect } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import avtarImg from '../assets/avtar.png';


const Hero = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const [roleIndex, setRoleIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const roles = data.hero.roles && data.hero.roles.length > 0 ? data.hero.roles : [data.hero.title];
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
                    <h1 className="fade-in" ref={addToRefs} style={{ fontSize: 'clamp(2.2rem, 8vw, 5rem)', fontWeight: 900, margin: '10px 0' }}>
                        Hi, I'm <span className="gradient-text">{data.hero.name}</span>
                    </h1>
                    <p className="fade-in" ref={addToRefs} style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 6px', lineHeight: 1.5, minHeight: '34px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
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
                    <p className="fade-in" ref={addToRefs} style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.4 }}>
                        {data.hero.description}
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
                .time-pill-container { display: flex; justify-content: center; margin-bottom: 12px; }
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



                .hero-content h1 {
                    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.8);
                }
                html.light-mode .hero-content h1 {
                    text-shadow: 0 2px 24px rgba(255, 255, 255, 0.95), 0 1px 2px rgba(255, 255, 255, 0.8);
                }
                .hero-content p {
                    text-shadow: 0 2px 16px rgba(0, 0, 0, 0.85);
                }
                html.light-mode .hero-content p {
                    text-shadow: 0 1px 12px rgba(255, 255, 255, 0.9);
                }

                .badge { display: inline-block; padding: 6px 20px; background: var(--primary-glow); border: 1px solid var(--border-color); border-radius: 100px; color: var(--primary); font-size: 0.8rem; font-weight: 600; margin-bottom: 12px; backdrop-filter: blur(12px); }
                .hero-btns { display: flex; gap: 14px; margin-top: 20px; justify-content: center; }
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

                @media (max-width: 768px) {
                    #hero {
                        height: auto !important;
                        min-height: calc(100dvh - 120px) !important;
                        padding-top: 75px !important;
                        padding-bottom: 20px !important;
                        overflow: visible !important;
                    }
                    .hero-image {
                        margin-bottom: 8px !important;
                    }
                    .image-wrapper { 
                        width: 85px !important; 
                        height: 85px !important; 
                    }
                    .badge { 
                        padding: 5px 14px !important; 
                        font-size: 0.72rem !important; 
                        margin-bottom: 10px !important; 
                    }
                    .time-pill-container {
                        margin-bottom: 8px !important;
                    }
                    .time-pill { 
                        padding: 4px 6px 4px 12px !important; 
                    }
                    .time-text { 
                        font-size: 0.72rem !important; 
                    }
                    .hero-content h1 {
                        font-size: clamp(1.75rem, 6vw, 2.6rem) !important;
                        margin: 6px 0 !important;
                        line-height: 1.2 !important;
                    }
                    .hero-content p {
                        font-size: 0.92rem !important;
                        max-width: 92% !important;
                        margin: 0 auto 14px !important;
                    }
                    .hero-btns { 
                        flex-direction: column !important; 
                        align-items: center !important;
                        width: 100% !important; 
                        gap: 10px !important; 
                        margin-top: 14px !important; 
                    }
                    .hero-btns .btn { 
                        width: 100% !important; 
                        max-width: 250px !important; 
                        text-align: center !important; 
                        padding: 10px 18px !important;
                        font-size: 0.88rem !important;
                    }
                }
                @media (max-height: 700px) {
                    .image-wrapper { width: 75px !important; height: 75px !important; }
                    .hero-image { margin-bottom: 6px !important; }
                    .badge { margin-bottom: 8px !important; padding: 4px 12px !important; }
                    .hero-btns { margin-top: 10px !important; gap: 8px !important; }
                    .hero-btns .btn { padding: 9px 18px !important; font-size: 0.85rem !important; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
