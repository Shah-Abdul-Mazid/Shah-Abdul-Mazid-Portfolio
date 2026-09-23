import { useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingContactForm from '../components/FloatingContactForm';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { usePortfolio } from '../context/PortfolioContext';
import { formatDateLabel, sortRecentFirst } from '../utils/dateUtils';
import { Github, ExternalLink, GraduationCap } from 'lucide-react';
import { getCredlyBadgeForCert, CREDLY_VERIFIED_BADGES } from '../utils/certBadges';

import { GITHUB_URL, SCHOLAR_URL, ORCID_URL, RESEARCHGATE_URL } from '../constants/researchLinks';

const CORE_RESEARCH_LINKS = [
  { label: 'GitHub Profile', url: GITHUB_URL, icon: 'github' },
  { label: 'Google Scholar', url: SCHOLAR_URL, icon: 'scholar' },
  { label: 'ORCID iD', url: ORCID_URL, icon: 'orcid' },
  { label: 'ResearchGate', url: RESEARCHGATE_URL, icon: 'researchgate' }
];

const ProfilePage = () => {
  const { addToRefs } = useIntersectionObserver();
  const { data } = usePortfolio();

  const education = data.education || [];
  const workExperience = sortRecentFirst(data.work || []);
  const certifications = data.certifications || [];

  const allBioLinks = useMemo(() => {
    const customLinks = data.about.bioLinks || [];
    if (customLinks.length === 0) return CORE_RESEARCH_LINKS;
    const existingUrls = new Set(customLinks.map(l => (l.url || '').toLowerCase()));
    const missing = CORE_RESEARCH_LINKS.filter(c => !existingUrls.has(c.url.toLowerCase()));
    return [...customLinks, ...missing];
  }, [data.about.bioLinks]);

  return (
    <div className="app">
      <IntelligenceMatrix />
      <Header />
      <main className="profile-page-main">
        <div className="profile-container fade-in" ref={addToRefs}>
          {/* Profile Header */}
          <div className="profile-header">
            <h1 className="profile-title">Profile</h1>
            <p className="profile-subtitle">Academic background, professional experience, research collaborations, and awards.</p>
          </div>

          {/* Short Biography Card */}
            {/* Short Biography Card */}
            <div className="bio-card">
              <h2 className="section-heading">Short Biography</h2>
              
              {/* Heading / Hero Tagline */}
              <div className="bio-hero-tagline">
                <span className="bio-tagline-text">AI ENGINEER &amp; RESEARCHER &nbsp;|&nbsp; INTELLIGENT SYSTEMS &amp; DATA SCIENCE</span>
              </div>

              {(() => {
                const TECH_PILLS = [
                  'Multi-Agent RAG',
                  'Grad-CAM',
                  'Vision-Language Transformers',
                  'Vision Transformers',
                  'LLM pipelines',
                  'production LLM',
                  'computer vision',
                  'AI microservices',
                  'explainable AI',
                  'Transformers',
                  'RAG platforms',
                ];

                const renderHighlighted = (text: string) => {
                  const escaped = TECH_PILLS.map(p => p.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
                  const regex = new RegExp(`(\\b(?:${escaped})\\b|\\*\\*[^*]+\\*\\*)`, 'gi');
                  const parts = text.split(regex);

                  return parts.map((part, idx) => {
                    if (!part) return null;
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={idx} className="bio-highlight-strong">{part.slice(2, -2)}</strong>;
                    }
                    const matched = TECH_PILLS.find(p => p.toLowerCase() === part.toLowerCase());
                    if (matched) {
                      return <span key={idx} className="bio-tech-pill">{part}</span>;
                    }
                    return <span key={idx}>{part}</span>;
                  });
                };

                const rawBio = data.about.bio || '';
                const hasEng = /Engineering\s+Focus/i.test(rawBio);
                const hasRes = /Research\s+Focus/i.test(rawBio);

                if (hasEng || hasRes) {
                  const engIdx = rawBio.search(/(?:\*\*|###\s*)?Engineering\s+Focus(?:\*\*)?/i);
                  const resIdx = rawBio.search(/(?:\*\*|###\s*)?Research\s+Focus(?:\*\*)?/i);

                  let intro = '';
                  let engBlock = '';
                  let resBlock = '';

                  if (engIdx !== -1 && resIdx !== -1) {
                    if (engIdx < resIdx) {
                      intro = rawBio.slice(0, engIdx).trim();
                      engBlock = rawBio.slice(engIdx, resIdx).trim();
                      resBlock = rawBio.slice(resIdx).trim();
                    } else {
                      intro = rawBio.slice(0, resIdx).trim();
                      resBlock = rawBio.slice(resIdx, engIdx).trim();
                      engBlock = rawBio.slice(engIdx).trim();
                    }
                  } else if (engIdx !== -1) {
                    intro = rawBio.slice(0, engIdx).trim();
                    engBlock = rawBio.slice(engIdx).trim();
                  } else if (resIdx !== -1) {
                    intro = rawBio.slice(0, resIdx).trim();
                    resBlock = rawBio.slice(resIdx).trim();
                  }

                  engBlock = engBlock.replace(/^(?:\*\*|###\s*)?Engineering\s+Focus(?:\*\*)?[:\s•\-]*/i, '').trim();
                  resBlock = resBlock.replace(/^(?:\*\*|###\s*)?Research\s+Focus(?:\*\*)?[:\s•\-]*/i, '').trim();

                  const extractItems = (text: string) => {
                    return text
                      .split(/(?:\r?\n\s*[-*•]\s*|\r?\n|•\s*)/)
                      .map(s => s.trim())
                      .filter(s => s.length > 0 && s !== '-' && s !== '*' && s !== '•')
                      .map(item => {
                        const m = item.match(/^(?:\*\*)?([^:*]+?)(?:\*\*)?:\s*(.*)$/);
                        if (m) {
                          return { label: m[1].replace(/\*\*/g, '').trim(), desc: m[2].trim() };
                        }
                        return { label: '', desc: item.replace(/^[-*•]\s*/, '').trim() };
                      });
                  };

                  const defaultIntro = "I am an AI Engineer at Neuroxyte and a Computer Science & Engineering graduate from East West University (majoring in Intelligent Systems & Data Science). Driven by AI innovation, research, and hackathons, my work focuses on building explainable, data-driven systems that bridge the gap between academic research and production engineering.";
                  const cleanIntro = (intro || defaultIntro)
                    .replace(/^(?:\*\*|###\s*)?About\s+Me(?:\*\*)?[:\s]*/i, '')
                    .trim();

                  const engItems = extractItems(engBlock);
                  const resItems = extractItems(resBlock);

                  return (
                    <div className="bio-structured-content">
                      {cleanIntro && (
                        <p className="bio-para">{renderHighlighted(cleanIntro)}</p>
                      )}

                      {engItems.length > 0 && (
                        <div className="bio-section bio-focus-section">
                          <div className="bio-subhead">
                            <span className="bio-subhead-icon">⚡</span>
                            <span className="bio-subhead-title">Engineering Focus</span>
                          </div>
                          <ul className="bio-bullet-list">
                            {engItems.map((item, i) => (
                              <li key={i} className="bio-bullet-item">
                                <span className="bio-bullet-marker">○</span>
                                <div className="bio-bullet-text">
                                  {item.label && <strong className="bio-label">{item.label}: </strong>}
                                  <span>{renderHighlighted(item.desc)}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {resItems.length > 0 && (
                        <div className="bio-section bio-focus-section">
                          <div className="bio-subhead">
                            <span className="bio-subhead-icon">🔬</span>
                            <span className="bio-subhead-title">Research Focus</span>
                          </div>
                          <ul className="bio-bullet-list">
                            {resItems.map((item, i) => (
                              <li key={i} className="bio-bullet-item">
                                <span className="bio-bullet-marker">○</span>
                                <div className="bio-bullet-text">
                                  {item.label && <strong className="bio-label">{item.label}: </strong>}
                                  <span>{renderHighlighted(item.desc)}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                }

                // Fallback for plain bio
                return (
                  <div className="bio-content">
                    {rawBio.split(/\n\s*\n/).filter(b => b.trim().length > 0).map((block, idx) => (
                      <p key={idx} className="bio-para">{renderHighlighted(block)}</p>
                    ))}
                  </div>
                );
              })()}
            
            {/* Profile Action Links */}
            <div className="bio-links">
              {allBioLinks.map((link, idx) => {
                const iconType = (link.icon || '').toLowerCase();
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bio-btn ${iconType || 'custom'}`}
                  >
                    {iconType === 'github' && <Github size={16} />}
                    {iconType === 'scholar' && <GraduationCap size={16} />}
                    {iconType === 'orcid' && <span className="orcid-dot">iD</span>}
                    {iconType === 'researchgate' && <span className="rg-dot">RG</span>}
                    {iconType !== 'github' && iconType !== 'scholar' && iconType !== 'orcid' && iconType !== 'researchgate' && <ExternalLink size={16} />}
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Two-Column timeline layout */}
          <div className="timeline-grid">
            {/* Education Column */}
            <div className="timeline-column">
              <h2 className="section-heading line-below">Education</h2>
              <div className="timeline">
                <div className="timeline-line"></div>
                {education.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot orange"></div>
                    <div className="timeline-content">
                      <span className="timeline-year">{item.year}</span>
                      <h3 className="timeline-title">{item.degree}</h3>
                      <p className="timeline-institution">{item.school}</p>
                      {item.major && <p className="timeline-desc">{item.major}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Column */}
            <div className="timeline-column">
              <h2 className="section-heading line-below">Professional Experience</h2>
              <div className="timeline">
                <div className="timeline-line"></div>
                {workExperience.map((item, index) => {
                  const startLabel = formatDateLabel(item.startDate);
                  const endLabel = item.endDate ? formatDateLabel(item.endDate) : 'PRESENT';
                  const yearRange = `${startLabel} – ${endLabel}`.toUpperCase();

                  return (
                    <div key={index} className="timeline-item">
                      <div className="timeline-dot purple"></div>
                      <div className="timeline-content">
                        <span className="timeline-year">{yearRange}</span>
                        <h3 className="timeline-title">{item.role}</h3>
                        <p className="timeline-institution">{item.company}</p>
                        {item.details && item.details.length > 0 && (
                          <ul className="timeline-details-list">
                            {item.details.map((detail, idx) => (
                              <li key={idx} className="timeline-desc-bullet">{detail}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Certifications Section */}
          {certifications.length > 0 && (
            <div className="certifications-section">
              <h2 className="section-heading line-below">Certifications & Licenses</h2>
              <div className="certifications-grid">
                {certifications.map((cert, index) => {
                  const credlyBadge = getCredlyBadgeForCert(cert);
                  const hasBadge = credlyBadge !== null;

                  return (
                    <div key={index} className={`cert-item-card ${hasBadge ? 'has-credly-badge' : ''}`}>
                      <div className="cert-item-top">
                        {hasBadge ? (
                          <a
                            href={credlyBadge.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cert-badge-anchor"
                            title={`Verify on Credly: ${credlyBadge.name}`}
                          >
                            <div className="cert-badge-frame">
                              <img
                                src={credlyBadge.imageUrl}
                                alt={`${credlyBadge.name} badge`}
                                className="cert-badge-image"
                                loading="lazy"
                              />
                            </div>
                          </a>
                        ) : (
                          <div className="cert-issuer-badge">
                            {cert.issuer}
                          </div>
                        )}

                        <div className="cert-meta-right">
                          <span className="cert-item-date">{cert.date}</span>
                          {hasBadge && (
                            <span className="cert-credly-tag">
                              <span className="credly-dot"></span> Credly
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="cert-item-body">
                        <h3 className="cert-item-title">{cert.name}</h3>
                        <p className="cert-item-issuer">{cert.issuer}</p>
                        {cert.credentialId && (
                          <p className="cert-item-id">Credential ID: {cert.credentialId}</p>
                        )}
                      </div>

                      <div className="cert-item-footer">
                        {cert.credentialUrl && (
                          <a 
                            href={cert.credentialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="cert-item-link"
                          >
                            Verify Credential <ExternalLink size={13} style={{ marginLeft: 4 }} />
                          </a>
                        )}
                        {hasBadge && (
                          <a
                            href={credlyBadge.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cert-credly-badge-link"
                            title="Verify on Credly"
                          >
                            Credly Badge <ExternalLink size={11} style={{ marginLeft: 3 }} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Official Credly Badges Showcase ── */}
              <div className="credly-profile-showcase">
                <div className="credly-showcase-header">
                  <div className="credly-showcase-title-row">
                    <span className="credly-icon-badge">🏅</span>
                    <div>
                      <h3 className="credly-showcase-title">Credly Verified Digital Badges (9)</h3>
                      <p className="credly-showcase-desc">
                        Official, verifiable credentials issued via Credly for Google AI & IBM Data Science specializations.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://www.credly.com/users/shah-abdul-mazid"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="credly-profile-btn"
                  >
                    View Credly Profile <ExternalLink size={13} />
                  </a>
                </div>

                <div className="credly-badges-grid">
                  {CREDLY_VERIFIED_BADGES.map((b) => (
                    <a
                      key={b.id}
                      href={b.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="credly-single-badge-card"
                      title={`Verify ${b.name} on Credly`}
                    >
                      <div className="credly-single-badge-img-wrap">
                        <img src={b.imageUrl} alt={b.name} className="credly-single-badge-img" loading="lazy" />
                      </div>
                      <span className="credly-single-badge-name">{b.name}</span>
                      <span className="credly-single-badge-issuer">{b.issuer}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingContactForm />

      <style>{`
        /* Profile Page Styles */
        .profile-page-main {
          padding-top: 140px;
          padding-bottom: 80px;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .profile-container {
          max-width: 1100px;
          width: 100%;
          padding: 0 24px;
        }

        .profile-header {
          margin-bottom: 40px;
          padding: 28px 36px;
          background: var(--card-bg);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          box-shadow: var(--card-shadow);
        }

        .profile-title {
          font-family: 'Lora', 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 8px;
        }

        .profile-subtitle {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        /* Short Biography Section */
        .bio-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          padding: 36px 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          margin-bottom: 50px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: var(--transition);
        }
        .bio-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border-color: var(--primary);
        }

        .section-heading {
          font-family: 'Lora', 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 20px;
        }

        .section-heading.line-below {
          position: relative;
          padding-bottom: 12px;
          margin-bottom: 30px;
          border-bottom: 1px solid var(--border-color);
        }

        /* Bio hero tagline */
        .bio-hero-tagline {
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 22px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }
        .bio-tagline-text {
          background: linear-gradient(135deg, var(--primary), #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Bio structured content container */
        .bio-structured-content {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .bio-section {
          display: flex;
          flex-direction: column;
        }

        /* Section Subheaders */
        .bio-subhead {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .bio-subhead-icon {
          font-size: 1rem;
          color: var(--primary);
        }
        .bio-subhead-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-color);
          letter-spacing: 0.02em;
        }

        /* About Me Quote Box */
        .bio-quote-box {
          position: relative;
          padding: 12px 18px;
          border-left: 3px solid var(--primary);
          background: rgba(56, 189, 248, 0.04);
          border-radius: 0 12px 12px 0;
          box-shadow: inset 0 0 12px rgba(56, 189, 248, 0.02);
        }
        .light-mode .bio-quote-box {
          background: rgba(2, 132, 199, 0.04);
          border-left-color: #0284c7;
        }
        .bio-quote-text {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text-secondary);
          font-style: italic;
          margin: 0;
        }

        /* Bullet lists for Engineering & Research */
        .bio-bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .bio-bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.98rem;
          line-height: 1.75;
          color: var(--text-secondary);
        }
        .bio-bullet-marker {
          color: var(--primary);
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.75;
          flex-shrink: 0;
        }
        .bio-bullet-text {
          flex: 1;
        }
        .bio-label {
          color: var(--text-color);
          font-weight: 700;
        }

        /* Highlight Badges / Tech Pills */
        .bio-tech-pill {
          display: inline-block;
          padding: 1px 9px;
          border-radius: 16px;
          font-size: 0.82rem;
          font-weight: 600;
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.32);
          margin: 0 3px;
          vertical-align: baseline;
          white-space: nowrap;
          box-shadow: 0 0 8px rgba(56, 189, 248, 0.1);
        }
        .light-mode .bio-tech-pill {
          background: rgba(2, 132, 199, 0.08);
          border-color: rgba(2, 132, 199, 0.28);
          color: #0284c7;
          box-shadow: none;
        }

        .bio-highlight-strong {
          color: var(--text-color);
          font-weight: 700;
        }

        .bio-para {
          font-size: 1.025rem;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .bio-para:last-child {
          margin-bottom: 0;
        }

        /* Biography Profile Action Links */
        .bio-links {
          margin-top: 24px;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .bio-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: var(--transition);
          border: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-color);
        }

        .bio-btn:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          background: rgba(56, 189, 248, 0.06);
          color: var(--primary);
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.15);
        }

        .bio-btn.github:hover {
          border-color: #24292e;
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .light-mode .bio-btn.github:hover {
          border-color: #24292e;
          background: rgba(0, 0, 0, 0.05);
          color: #000;
        }

        .bio-btn.scholar:hover {
          border-color: #ea580c;
          background: rgba(234, 88, 12, 0.08);
          color: #ea580c;
          box-shadow: 0 4px 14px rgba(234, 88, 12, 0.2);
        }

        .bio-btn.orcid:hover {
          border-color: #a6ce39;
          background: rgba(166, 206, 57, 0.08);
          color: #a6ce39;
          box-shadow: 0 4px 14px rgba(166, 206, 57, 0.2);
        }

        .bio-btn.researchgate:hover {
          border-color: #00ccbb;
          background: rgba(0, 204, 187, 0.08);
          color: #00ccbb;
          box-shadow: 0 4px 14px rgba(0, 204, 187, 0.2);
        }

        .orcid-dot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: #a6ce39;
          color: #fff;
          font-size: 0.62rem;
          font-weight: 800;
          line-height: 1;
          flex-shrink: 0;
        }

        .rg-dot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 17px;
          height: 17px;
          border-radius: 4px;
          background: #00ccbb;
          color: #fff;
          font-size: 0.62rem;
          font-weight: 800;
          line-height: 1;
          flex-shrink: 0;
        }

        /* Timeline Grid Layout - Align items start prevents empty space in shorter column */
        .timeline-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-top: 20px;
          align-items: start;
        }

        .timeline-column {
          display: flex;
          flex-direction: column;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 36px 32px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: var(--card-shadow);
          transition: var(--transition);
          height: fit-content;
          align-self: start;
        }

        .timeline-column:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        .timeline {
          position: relative;
          padding-left: 28px;
        }

        .timeline-line {
          position: absolute;
          left: 6px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: var(--border-color);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 35px;
        }
        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-dot {
          position: absolute;
          left: -28px;
          top: 6px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid var(--card-bg-solid, #0f172a);
          z-index: 2;
        }
        
        .timeline-dot.orange {
          background-color: #f97316;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
        }

        .timeline-dot.purple {
          background-color: #8b5cf6;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
        }

        .timeline-content {
          display: flex;
          flex-direction: column;
        }

        .timeline-year {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        
        .timeline-dot.orange ~ .timeline-content .timeline-year {
          color: #f97316;
        }
        
        .timeline-dot.purple ~ .timeline-content .timeline-year {
          color: #8b5cf6;
        }

        .timeline-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .timeline-institution {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 8px;
        }

        .timeline-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          opacity: 0.85;
          line-height: 1.5;
        }

        .timeline-details-list {
          list-style: none;
          padding-left: 0;
          margin-top: 6px;
        }

        .timeline-desc-bullet {
          font-size: 0.88rem;
          color: var(--text-secondary);
          opacity: 0.85;
          line-height: 1.5;
          margin-bottom: 6px;
          position: relative;
          padding-left: 12px;
        }
        .timeline-desc-bullet::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--primary);
          font-weight: bold;
        }
        .timeline-desc-bullet:last-child {
          margin-bottom: 0;
        }

        /* Certifications Section */
        .certifications-section {
          margin-top: 50px;
          width: 100%;
        }

        .certifications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 20px;
        }

        .cert-item-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          padding: 24px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .cert-item-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), #8b5cf6);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cert-item-card:hover {
          transform: translateY(-4px);
          border-color: rgba(56, 189, 248, 0.5);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25), 0 0 20px rgba(56, 189, 248, 0.15);
        }

        .cert-item-card:hover::before {
          opacity: 1;
        }

        .cert-item-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .cert-badge-anchor {
          display: inline-block;
          text-decoration: none;
        }

        .cert-badge-frame {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%);
          border: 3px solid rgba(56, 189, 248, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 6px rgba(56, 189, 248, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cert-item-card:hover .cert-badge-frame {
          transform: scale(1.08) rotate(3deg);
          border-color: var(--primary);
          box-shadow: 0 0 32px rgba(56, 189, 248, 0.5), 0 0 0 8px rgba(56, 189, 248, 0.1);
        }

        .cert-badge-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
        }

        .cert-issuer-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: rgba(56, 189, 248, 0.08);
          padding: 4px 12px;
          border-radius: 100px;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .cert-meta-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        .cert-item-date {
          font-size: 0.78rem;
          color: var(--text-secondary);
          opacity: 0.85;
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .cert-credly-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 2px 8px;
          border-radius: 100px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .credly-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        .cert-item-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cert-item-title {
          font-size: 1.08rem;
          font-weight: 700;
          color: var(--text-color);
          line-height: 1.35;
          margin: 0;
        }

        .cert-item-issuer {
          font-size: 0.92rem;
          color: var(--primary);
          font-weight: 600;
          margin: 0;
        }

        .cert-item-id {
          font-size: 0.78rem;
          color: var(--text-secondary);
          opacity: 0.75;
          font-family: monospace;
          margin: 0;
        }

        .cert-item-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--primary);
          text-decoration: none;
          transition: var(--transition);
        }
        .cert-item-link:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .cert-badges-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cert-badge-link {
          display: inline-block;
          text-decoration: none;
          transition: transform 0.25s ease;
        }
        .cert-badge-link:hover {
          transform: scale(1.1) rotate(2deg);
        }

        .cert-regular-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: rgba(56, 189, 248, 0.08);
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .cert-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          gap: 10px;
          flex-wrap: wrap;
        }

        .cert-credly-badge-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #f97316;
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.28);
          padding: 3px 8px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .cert-credly-badge-link:hover {
          background: rgba(249, 115, 22, 0.22);
          border-color: #f97316;
          color: #ffedd5;
        }

        /* ── Official Credly Badges Showcase ── */
        .credly-profile-showcase {
          margin-top: 48px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 24px;
          padding: 32px 28px;
          backdrop-filter: blur(20px);
        }

        .credly-showcase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .credly-showcase-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .credly-icon-badge {
          font-size: 2rem;
        }

        .credly-showcase-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-color);
          margin: 0 0 4px 0;
        }

        .credly-showcase-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .credly-profile-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          padding: 8px 16px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);
        }
        .credly-profile-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(249, 115, 22, 0.45);
        }

        .credly-badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 16px;
        }

        .credly-single-badge-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          text-decoration: none;
          transition: all 0.25s ease;
          text-align: center;
        }
        .credly-single-badge-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.4);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 16px rgba(249, 115, 22, 0.25);
        }

        .credly-single-badge-img-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          padding: 4px;
        }
        .credly-single-badge-card:hover .credly-single-badge-img-wrap {
          border-color: #f97316;
        }

        .credly-single-badge-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        .credly-single-badge-name {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-color);
          line-height: 1.3;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .credly-single-badge-issuer {
          font-size: 0.65rem;
          color: #f97316;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 900px) {
          .timeline-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .profile-title {
            font-size: 2.2rem;
          }
          .bio-card {
            padding: 24px 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
