import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingContactForm from '../components/FloatingContactForm';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { usePortfolio } from '../context/PortfolioContext';
import { formatDateLabel, sortRecentFirst } from '../utils/dateUtils';
import { Github, BookOpen, ExternalLink } from 'lucide-react';

const ProfilePage = () => {
  const { addToRefs } = useIntersectionObserver();
  const { data } = usePortfolio();

  const education = data.education || [];
  const workExperience = sortRecentFirst(data.work || []);
  const certifications = data.certifications || [];

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
          <div className="bio-card">
            <h2 className="section-heading">Short Biography</h2>
            <div className="bio-content">
              {data.about.bio.split('\n\n').map((para, idx) => (
                <p key={idx} className="bio-para">{para}</p>
              ))}
            </div>
            
            {/* Profile Action Links */}
            <div className="bio-links">
              {(data.about.bioLinks && data.about.bioLinks.length > 0)
                ? data.about.bioLinks.map((link, idx) => {
                    const iconType = (link.icon || '').toLowerCase();
                    const Icon = iconType === 'github'
                      ? Github
                      : iconType === 'scholar'
                      ? BookOpen
                      : ExternalLink;
                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bio-btn ${iconType || 'custom'}`}
                      >
                        <Icon size={16} />
                        {link.label}
                      </a>
                    );
                  })
                : (
                  <>
                    <a href="https://github.com/Shah-Abdul-Mazid" target="_blank" rel="noopener noreferrer" className="bio-btn github">
                      <Github size={16} /> GitHub Profile
                    </a>
                    <a href="https://scholar.google.com/citations?user=TYkiwUgAAAAJ" target="_blank" rel="noopener noreferrer" className="bio-btn scholar">
                      <BookOpen size={16} /> Google Scholar
                    </a>
                  </>
                )
              }
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
        }

        .profile-title {
          font-family: 'Lora', 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 12px;
        }

        .profile-subtitle {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.5;
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

        .bio-para {
          font-size: 1.025rem;
          line-height: 1.7;
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

        /* Timeline Grid Layout */
        .timeline-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          margin-top: 20px;
        }

        .timeline-column {
          display: flex;
          flex-direction: column;
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
          border: 3px solid var(--bg-color);
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
