import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socials = [
        {
            href: 'https://github.com/Shah-Abdul-Mazid',
            label: 'GitHub',
            icon: <Github size={18} />,
        },
        {
            href: 'https://www.linkedin.com/in/shahabdulmazid',
            label: 'LinkedIn',
            icon: <Linkedin size={18} />,
        },
        {
            href: 'https://www.facebook.com/S.A.Mazid.01/',
            label: 'Facebook',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            ),
        },
        {
            href: 'mailto:shahabdulmazid.ezan@yahoo.com',
            label: 'Email',
            icon: <Mail size={18} />,
        },
    ];

    return (
        <footer className="site-footer">
            <div className="footer-inner container">
                <div className="footer-divider" />
                <div className="footer-bottom">
                    <p className="footer-copy">
                        &copy; Shah Abdul Mazid {currentYear}.&nbsp; All rights reserved.
                    </p>
                    <div className="footer-socials">
                        {socials.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target={s.href.startsWith('http') ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className="footer-social-icon"
                                title={s.label}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .site-footer {
                    background: var(--bg-color, #0a0a14);
                    padding: 0;
                    margin-top: auto;
                }

                .footer-inner {
                    padding-left: 1.5rem;
                    padding-right: 1.5rem;
                }

                .footer-divider {
                    border: none;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    margin: 0;
                }

                .footer-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 0;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .footer-copy {
                    margin: 0;
                    font-size: 0.8rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--text-secondary, rgba(180, 185, 220, 0.65));
                    font-weight: 400;
                }

                .footer-socials {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .footer-social-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    color: var(--text-secondary, rgba(180, 185, 220, 0.65));
                    background: transparent;
                    transition: color 0.2s ease, background 0.2s ease;
                    text-decoration: none;
                }

                .footer-social-icon:hover {
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.08);
                }

                @media (max-width: 600px) {
                    .footer-bottom {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 20px 0;
                        gap: 14px;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;