import { usePortfolio, } from '../context/PortfolioContext';
import { Award, ExternalLink, Calendar, User, BadgeCheck } from 'lucide-react';
import { getCredlyBadgeForCert, CREDLY_VERIFIED_BADGES } from '../utils/certBadges';

const Certifications = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const certifications = data.certifications || [];

    if (certifications.length === 0) return null;

    return (
        <section id="certifications" className="section">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.certifications?.subtitle || 'Certifications'}</span>
                    <h2>
                        {data.sections?.certifications?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.certifications.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Licenses & <span className="gradient-text">Certifications</span></>
                        )}
                    </h2>
                </div>

                <div className="cert-grid">
                    {certifications.map((cert, index) => {
                        const credlyBadge = getCredlyBadgeForCert(cert);
                        const hasBadge = credlyBadge !== null;
                        return (
                        <div key={index} className="cert-card fade-in" ref={addToRefs}>
                            {/* Badge / Icon Box */}
                            <div className="cert-icon-box">
                                {hasBadge ? (
                                    <a
                                        href={credlyBadge.publicUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cert-badge-wrapper"
                                        title={`Credly Verified Badge: ${credlyBadge.name}`}
                                    >
                                        <img
                                            src={credlyBadge.imageUrl}
                                            alt={`${cert.name} badge`}
                                            className="cert-badge-img"
                                        />
                                        <span className="cert-badge-label">
                                            <BadgeCheck size={9} /> Credly
                                        </span>
                                    </a>
                                ) : (
                                    <Award size={24} className="cert-main-icon" />
                                )}
                            </div>
                            
                            <div className="cert-content">
                                <div className="cert-header">
                                    <h3 className="cert-name">{cert.name}</h3>
                                    <span className="cert-date">
                                        <Calendar size={12} /> {cert.date}
                                    </span>
                                </div>
                                
                                <p className="cert-issuer">
                                    <strong>{cert.issuer}</strong>
                                    {cert.instructor && (
                                        <span className="cert-instructor">
                                            <User size={12} /> {cert.instructor}
                                        </span>
                                    )}
                                </p>

                                {cert.skills && cert.skills.length > 0 && (
                                    <div className="cert-skills-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                                        {cert.skills.map((skill, sIdx) => (
                                            <span key={sIdx} className="cert-skill-tag">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="cert-footer" style={{ flexWrap: 'wrap', gap: '10px' }}>
                                    {cert.credentialId && (
                                        <span className="cert-id" style={{ marginRight: 'auto' }}>ID: {cert.credentialId}</span>
                                    )}
                                    <div className="cert-link-group" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {cert.credentialUrl && (
                                            <a 
                                                href={cert.credentialUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="cert-link-btn"
                                            >
                                                Verify <ExternalLink size={14} />
                                            </a>
                                        )}
                                        {cert.links?.map((link, lIdx) => (
                                            <a 
                                                key={lIdx}
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="cert-link-btn"
                                                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                                            >
                                                {link.label || 'Link'} <ExternalLink size={14} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    })}
                </div>

                {/* ── Credly Verified Badges Gallery ── */}
                <div className="credly-section fade-in" ref={addToRefs}>
                    <div className="credly-header">
                        <span className="credly-logo-tag">
                            🏅 Credly Verified Badges
                        </span>
                        <a
                            href="https://www.credly.com/users/shah-abdul-mazid"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="credly-view-all"
                        >
                            View All on Credly <ExternalLink size={13} />
                        </a>
                    </div>

                    <div className="credly-badges-row">
                        {CREDLY_VERIFIED_BADGES.map((badge, i) => (
                            <a
                                key={i}
                                href={badge.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="credly-badge-item"
                                title={`Verified on Credly: ${badge.name}`}
                            >
                                <img
                                    src={badge.imageUrl}
                                    alt={badge.name}
                                    className="credly-badge-img"
                                    loading="lazy"
                                />
                                <span className="credly-badge-name">{badge.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

            </div>

            <style>{`
                .cert-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                    gap: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .cert-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    gap: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                }

                .cert-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 4px; height: 100%;
                    background: var(--primary);
                    opacity: 0.5;
                }

                .cert-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: var(--primary);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }

                /* ── Badge image styling ── */
                .cert-icon-box {
                    width: 72px;
                    height: 72px;
                    background: rgba(139, 92, 246, 0.05);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    flex-shrink: 0;
                    border: 1px solid rgba(139, 92, 246, 0.15);
                    transition: all 0.3s ease;
                }

                .cert-card:hover .cert-icon-box {
                    border-color: rgba(139, 92, 246, 0.5);
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
                }

                .cert-badge-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    width: 100%;
                    height: 100%;
                }

                .cert-badge-img {
                    width: 52px;
                    height: 52px;
                    object-fit: contain;
                    border-radius: 50%;
                    transition: transform 0.3s ease, filter 0.3s ease;
                    filter: drop-shadow(0 2px 6px rgba(139, 92, 246, 0.3));
                }

                .cert-card:hover .cert-badge-img {
                    transform: scale(1.08) rotate(3deg);
                    filter: drop-shadow(0 4px 12px rgba(139, 92, 246, 0.5));
                }

                .cert-badge-label {
                    font-size: 0.55rem;
                    font-weight: 700;
                    color: #f97316;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    opacity: 0.8;
                }

                .cert-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .cert-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                }

                .cert-name {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-color);
                    margin: 0;
                    line-height: 1.3;
                }

                .cert-date {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    white-space: nowrap;
                    background: rgba(255,255,255,0.05);
                    padding: 2px 8px;
                    border-radius: 100px;
                }

                .cert-issuer {
                    font-size: 0.9rem;
                    color: var(--primary);
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .cert-instructor {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 2px;
                }

                .cert-skill-tag {
                    font-size: 0.7rem;
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-color);
                    padding: 3px 10px;
                    border-radius: 100px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.2s;
                    font-weight: 500;
                    opacity: 0.8;
                }

                .cert-skill-tag:hover {
                    background: rgba(139, 92, 246, 0.1);
                    border-color: var(--primary);
                    color: var(--primary);
                    opacity: 1;
                }

                .cert-footer {
                    margin-top: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 12px;
                    border-top: 1px solid rgba(255,255,255,0.03);
                }

                .cert-id {
                    font-size: 0.7rem;
                    color: #4b5563;
                    font-family: monospace;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .cert-link-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #fff;
                    text-decoration: none;
                    background: var(--primary);
                    padding: 6px 14px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .cert-link-btn:hover {
                    scale: 1.05;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                }

                @media (max-width: 640px) {
                    .cert-grid { grid-template-columns: 1fr; }
                    .cert-card { padding: 16px; }
                    .cert-icon-box { width: 60px; height: 60px; }
                    .cert-badge-img { width: 44px; height: 44px; }
                    .cert-name { font-size: 1rem; }
                    .credly-badges-row { gap: 16px; }
                    .credly-badge-img { width: 70px; height: 70px; }
                }

                /* ── Credly Badges Gallery ── */
                .credly-section {
                    max-width: 1200px;
                    margin: 48px auto 0;
                    padding: 32px 28px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 24px;
                    backdrop-filter: blur(10px);
                }

                .credly-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .credly-logo-tag {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--text-color);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    letter-spacing: 0.02em;
                }

                .credly-view-all {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--primary);
                    text-decoration: none;
                    padding: 6px 14px;
                    border-radius: 8px;
                    border: 1px solid rgba(139,92,246,0.3);
                    transition: all 0.2s;
                    background: rgba(139,92,246,0.08);
                }

                .credly-view-all:hover {
                    background: rgba(139,92,246,0.18);
                    border-color: var(--primary);
                    box-shadow: 0 0 14px rgba(139,92,246,0.25);
                }

                .credly-badges-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 24px;
                    justify-content: center;
                    align-items: flex-start;
                }

                .credly-badge-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    cursor: pointer;
                    transition: transform 0.25s ease;
                    width: 100px;
                }

                .credly-badge-item:hover {
                    transform: translateY(-6px);
                }

                .credly-badge-img {
                    width: 90px;
                    height: 90px;
                    object-fit: contain;
                    border-radius: 50%;
                    border: 2px solid rgba(139, 92, 246, 0.2);
                    background: rgba(255,255,255,0.04);
                    padding: 4px;
                    transition: all 0.3s ease;
                    filter: drop-shadow(0 2px 6px rgba(139, 92, 246, 0.2));
                }

                .credly-badge-item:hover .credly-badge-img {
                    border-color: var(--primary);
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
                    filter: drop-shadow(0 4px 14px rgba(139, 92, 246, 0.5));
                    transform: scale(1.08);
                }

                .credly-badge-name {
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    text-align: center;
                    line-height: 1.3;
                    max-width: 90px;
                    font-weight: 500;
                    transition: color 0.2s;
                }

                .credly-badge-item:hover .credly-badge-name {
                    color: var(--primary);
                }
            `}</style>

        </section>
    );
};

export default Certifications;
