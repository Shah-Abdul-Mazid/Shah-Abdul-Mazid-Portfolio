import { useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingContactForm from '../components/FloatingContactForm';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { usePortfolio } from '../context/PortfolioContext';
import { formatDateLabel, sortRecentFirst } from '../utils/dateUtils';
import { Github, ExternalLink, GraduationCap } from 'lucide-react';

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
                {certifications.map((cert, index) => (
                  <div key={index} className="cert-item-card">
                    <div className="cert-item-header">
                      <h3 className="cert-item-title">{cert.name}</h3>
                      <span className="cert-item-date">{cert.date}</span>
                    </div>
                    <p className="cert-item-issuer">{cert.issuer}</p>
                    {cert.credentialId && <p className="cert-item-id">Credential ID: {cert.credentialId}</p>}
                    {cert.credentialUrl && (
                      <a 
                        href={cert.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="cert-item-link"
                      >
                        Verify Credential
                      </a>
                    )}
                  </div>
                ))}
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
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: var(--transition);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .cert-item-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          box-shadow: 0 10px 25px rgba(56, 189, 248, 0.15);
        }

        .cert-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .cert-item-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-color);
          line-height: 1.3;
        }

        .cert-item-date {
          font-size: 0.78rem;
          color: var(--text-secondary);
          opacity: 0.8;
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 100px;
        }

        .cert-item-issuer {
          font-size: 0.92rem;
          color: var(--primary);
          font-weight: 600;
        }

        .cert-item-id {
          font-size: 0.8rem;
          color: var(--text-secondary);
          opacity: 0.75;
          font-family: monospace;
        }

        .cert-item-link {
          display: inline-flex;
          align-items: center;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--primary);
          text-decoration: none;
          margin-top: auto;
          padding-top: 8px;
          transition: var(--transition);
        }
        .cert-item-link:hover {
          color: var(--text-color);
          text-decoration: underline;
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
