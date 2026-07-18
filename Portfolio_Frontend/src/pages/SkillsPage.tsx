import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingContactForm from '../components/FloatingContactForm';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { usePortfolio } from '../context/PortfolioContext';

const SkillsPage = () => {
  const { addToRefs } = useIntersectionObserver();
  const { data } = usePortfolio();
  const skills = data.skills || [];
  const projects = data.projects || [];

  // Helper to find projects associated with a skill
  const getAssociatedProjects = (skillName: string) => {
    return projects.filter(proj => 
      proj.tags.some(tag => tag.trim().toLowerCase() === skillName.trim().toLowerCase())
    );
  };

  return (
    <div className="app">
      <IntelligenceMatrix />
      <Header />
      <main className="skills-page-main">
        <div className="skills-page-container fade-in" ref={addToRefs}>
          {/* Page Header */}
          <div className="skills-page-header">
            <h1 className="skills-page-title">
              {data.sections?.skills?.title ? (
                <span dangerouslySetInnerHTML={{ __html: data.sections.skills.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
              ) : (
                <>Core <span className="gradient-text">Expertise</span></>
              )}
            </h1>
            <p className="skills-page-subtitle">
              {data.sections?.skills?.subtitle || 'A detailed breakdown of my technical toolkit, proficiency levels, and project implementations.'}
            </p>
          </div>

          {/* Skills Grid */}
          {skills.length > 0 ? (
            <div className="skills-page-grid">
              {skills.map((cat, ci) => (
                <div key={ci} className="skill-page-card">
                  <div className="skill-card-header">
                    <span className="skill-card-index">{String(ci + 1).padStart(2, '0')}</span>
                    <h3 className="skill-card-category">{cat.name}</h3>
                  </div>
                  <div className="skill-card-body">
                    {cat.items.filter(Boolean).map((item, ii) => {
                      const proficiency = cat.proficiencies && cat.proficiencies[item] !== undefined
                        ? cat.proficiencies[item]
                        : 80; // fallback default
                      
                      const associatedProjs = getAssociatedProjects(item);

                      return (
                        <div key={ii} className="skill-proficiency-item">
                          <div className="skill-info-row">
                            <span className="skill-name">{item}</span>
                            <span className="skill-percentage">{proficiency}%</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="skill-progress-bg">
                            <div 
                              className="skill-progress-bar" 
                              style={{ 
                                width: `${proficiency}%`,
                                background: `linear-gradient(90deg, var(--primary) 0%, ${getThemeColor(ii)} 100%)`
                              }}
                            ></div>
                          </div>

                          {/* Associated Projects */}
                          {associatedProjs.length > 0 && (
                            <div className="associated-projects-row">
                              <span className="associated-label">Used in:</span>
                              <div className="associated-links">
                                {associatedProjs.map((proj, pi) => (
                                  <Link 
                                    key={pi} 
                                    to={`/projects?project=${encodeURIComponent(proj.title)}`}
                                    className="associated-project-badge"
                                    title={`View ${proj.title}`}
                                  >
                                    {proj.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '60px' }}>
              No skills configured yet. Add skills from the Admin Dashboard.
            </p>
          )}
        </div>
      </main>
      <Footer />
      <FloatingContactForm />

      <style>{`
        .skills-page-main {
          padding-top: 140px;
          padding-bottom: 80px;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .skills-page-container {
          max-width: 1100px;
          width: 100%;
          padding: 0 24px;
        }

        .skills-page-header {
          margin-bottom: 48px;
        }

        .skills-page-title {
          font-family: 'Lora', 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 12px;
        }

        .skills-page-subtitle {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.5;
          max-width: 600px;
        }

        /* Skills Grid */
        .skills-page-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 28px;
        }

        .skill-page-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 32px;
          transition: var(--transition);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .skill-page-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), #a855f7);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .skill-page-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 16px 40px rgba(56, 189, 248, 0.1);
        }

        .skill-page-card:hover::before {
          opacity: 1;
        }

        .skill-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .skill-card-index {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary);
          background: rgba(56, 189, 248, 0.08);
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.05em;
          font-family: monospace;
        }

        .skill-card-category {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-color);
          margin: 0;
        }

        .skill-card-body {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .skill-proficiency-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skill-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skill-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .skill-percentage {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary);
          background: rgba(56, 189, 248, 0.06);
          padding: 2px 8px;
          border-radius: 6px;
        }

        /* Progress bar */
        .skill-progress-bg {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 100px;
          overflow: hidden;
          position: relative;
        }

        .skill-progress-bar {
          height: 100%;
          border-radius: 100px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Associated projects style */
        .associated-projects-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
        }

        .associated-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          opacity: 0.7;
        }

        .associated-links {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .associated-project-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--primary);
          background: rgba(56, 189, 248, 0.04);
          border: 1px solid rgba(56, 189, 248, 0.15);
          padding: 2px 8px;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .associated-project-badge:hover {
          background: var(--primary);
          color: #0d1117;
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .skills-page-title { font-size: 2.2rem; }
          .skills-page-grid { grid-template-columns: 1fr; }
          .skill-page-card { padding: 24px; border-radius: 16px; }
        }
      `}</style>
    </div>
  );
};

// Helper colors for premium looking gradients
function getThemeColor(index: number) {
  const colors = [
    '#3b82f6', // blue
    '#a855f7', // purple
    '#10b981', // green
    '#f59e0b', // amber
    '#ec4899', // pink
    '#06b6d4'  // cyan
  ];
  return colors[index % colors.length];
}

export default SkillsPage;
