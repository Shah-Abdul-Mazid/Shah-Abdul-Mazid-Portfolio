import React, { useState, useMemo } from 'react';
import { 
  Award, 
  ExternalLink, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  CheckCircle2, 
  Clock, 
  BadgeCheck, 
  Layers, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { 
  getNormalizedCertifications, 
  OFFICIAL_CREDLY_BADGES, 
  type CredentialRecord 
} from '../data/certificationData';

interface CertificationSectionProps {
  apiCertifications?: any[];
  addToRefs?: (el: HTMLElement | null) => void;
  showSectionTitle?: boolean;
}

export const CertificationSection: React.FC<CertificationSectionProps> = ({
  apiCertifications,
  addToRefs,
  showSectionTitle = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'professional' | 'course' | 'badges'>('all');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPrograms, setExpandedPrograms] = useState<Record<string, boolean>>({
    'google-ai-prof': true,
    'ibm-data-science-prof': false,
  });

  const toggleExpand = (id: string) => {
    setExpandedPrograms(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Normalized records merged with API data
  const credentials = useMemo(() => {
    return getNormalizedCertifications(apiCertifications);
  }, [apiCertifications]);

  // Unique issuers for filter
  const issuers = useMemo(() => {
    const set = new Set<string>();
    credentials.forEach(c => {
      const clean = c.issuer.trim();
      if (clean) set.add(clean);
    });
    return Array.from(set);
  }, [credentials]);

  // Filtered credentials
  const filteredCredentials = useMemo(() => {
    return credentials.filter(item => {
      // Category filter
      if (selectedCategory === 'professional' && item.category !== 'professional') return false;
      if (selectedCategory === 'course' && item.category !== 'course') return false;

      // Issuer filter
      if (selectedIssuer !== 'all') {
        if (!item.issuer.toLowerCase().includes(selectedIssuer.toLowerCase())) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesIssuer = item.issuer.toLowerCase().includes(q);
        const matchesId = item.credentialId?.toLowerCase().includes(q);
        const matchesSkill = item.skills?.some(s => s.toLowerCase().includes(q));
        const matchesSubCourse = item.subCourses?.some(sc => sc.title.toLowerCase().includes(q));
        if (!matchesTitle && !matchesIssuer && !matchesId && !matchesSkill && !matchesSubCourse) {
          return false;
        }
      }

      return true;
    });
  }, [credentials, selectedCategory, selectedIssuer, searchQuery]);

  // Categorized buckets
  const professionalCerts = useMemo(() => {
    return filteredCredentials.filter(c => c.category === 'professional');
  }, [filteredCredentials]);

  const courseCredentials = useMemo(() => {
    return filteredCredentials.filter(c => c.category === 'course');
  }, [filteredCredentials]);

  const professionalCount = useMemo(() => credentials.filter(c => c.category === 'professional').length, [credentials]);
  const courseCount = useMemo(() => credentials.filter(c => c.category === 'course').length, [credentials]);
  const credlyCount = OFFICIAL_CREDLY_BADGES.length;

  return (
    <div className="cert-section-wrapper" ref={addToRefs}>
      {showSectionTitle && (
        <div className="section-title fade-in">
          <span className="subtitle">Licenses & Certifications</span>
          <h2>
            Verified <span className="gradient-text">Credentials</span> & Badges
          </h2>
        </div>
      )}

      {/* ── Filters Bar ── */}
      <div className="cert-filter-bar">
        {/* Category Tabs */}
        <div className="cert-category-tabs">
          <button
            type="button"
            className={`cert-tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <Layers size={14} /> All Credentials ({credentials.length})
          </button>
          <button
            type="button"
            className={`cert-tab-btn ${selectedCategory === 'professional' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('professional')}
          >
            <Sparkles size={14} /> Professional Certificates ({professionalCount})
          </button>
          <button
            type="button"
            className={`cert-tab-btn ${selectedCategory === 'course' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('course')}
          >
            <BookOpen size={14} /> Courses & Specializations ({courseCount})
          </button>
          <button
            type="button"
            className={`cert-tab-btn ${selectedCategory === 'badges' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('badges')}
          >
            <BadgeCheck size={14} /> Credly Badges ({credlyCount})
          </button>
        </div>

        {/* Search & Issuer Dropdown */}
        <div className="cert-search-controls">
          <div className="cert-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, issuer, skill, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cert-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="cert-search-clear" 
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          <select
            value={selectedIssuer}
            onChange={(e) => setSelectedIssuer(e.target.value)}
            className="cert-issuer-select"
            aria-label="Filter by Issuer"
          >
            <option value="all">All Issuers</option>
            {issuers.map((iss) => (
              <option key={iss} value={iss}>{iss}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION A: PROFESSIONAL CERTIFICATES
         ───────────────────────────────────────────────────────────── */}
      {(selectedCategory === 'all' || selectedCategory === 'professional') && professionalCerts.length > 0 && (
        <div className="cert-group-container">
          <div className="cert-group-header">
            <div className="cert-group-header-left">
              <span className="cert-group-badge-pill">Tier 1</span>
              <h3 className="cert-group-title">Professional Certificates</h3>
            </div>
            <span className="cert-group-count">{professionalCerts.length} Verified Programs</span>
          </div>

          <div className="cert-grid">
            {professionalCerts.map((cert) => (
              <CredentialCard 
                key={cert.id} 
                cert={cert} 
                isExpanded={!!expandedPrograms[cert.id]} 
                onToggleExpand={() => toggleExpand(cert.id)} 
              />
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION B: COURSES & STANDALONE CREDENTIALS
         ───────────────────────────────────────────────────────────── */}
      {(selectedCategory === 'all' || selectedCategory === 'course') && courseCredentials.length > 0 && (
        <div className="cert-group-container">
          <div className="cert-group-header">
            <div className="cert-group-header-left">
              <span className="cert-group-badge-pill course-pill">Tier 2</span>
              <h3 className="cert-group-title">Courses & Specializations</h3>
            </div>
            <span className="cert-group-count">{courseCredentials.length} Specialized Tracks</span>
          </div>

          <div className="cert-grid">
            {courseCredentials.map((cert) => (
              <CredentialCard 
                key={cert.id} 
                cert={cert} 
                isExpanded={!!expandedPrograms[cert.id]} 
                onToggleExpand={() => toggleExpand(cert.id)} 
              />
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION C: CREDLY VERIFIED DIGITAL BADGES SHOWCASE
         ───────────────────────────────────────────────────────────── */}
      {(selectedCategory === 'all' || selectedCategory === 'badges') && (
        <div className="credly-showcase-card">
          <div className="credly-showcase-header">
            <div className="credly-showcase-info">
              <div className="credly-title-row">
                <span className="credly-ribbon">🏅 Credly Verified</span>
                <h3 className="credly-headline">
                  Official Digital Badges ({credlyCount})
                </h3>
              </div>
              <p className="credly-subtext">
                Directly verified credentials and modular skill badges issued to Shah Abdul Mazid via Credly.
              </p>
            </div>
            <a
              href="https://www.credly.com/users/shah-abdul-mazid"
              target="_blank"
              rel="noopener noreferrer"
              className="credly-profile-link-btn"
            >
              View Credly Profile <ExternalLink size={13} />
            </a>
          </div>

          <div className="credly-badge-grid">
            {OFFICIAL_CREDLY_BADGES.map((badge) => (
              <a
                key={badge.id}
                href={badge.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="credly-badge-item-card"
                title={`Verify on Credly: ${badge.name}`}
              >
                <div className="credly-badge-avatar">
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="credly-badge-img"
                    loading="lazy"
                  />
                </div>
                <div className="credly-badge-details">
                  <span className="credly-badge-issuer-tag">{badge.issuer}</span>
                  <span className="credly-badge-item-title">{badge.name}</span>
                  <span className="credly-badge-verify-text">
                    Verify on Credly <ExternalLink size={10} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCredentials.length === 0 && selectedCategory !== 'badges' && (
        <div className="cert-empty-state">
          <Award size={36} className="empty-icon" />
          <h4>No credentials match your filter criteria</h4>
          <p>Try resetting the search query or issuer filter.</p>
          <button
            type="button"
            className="cert-reset-btn"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedIssuer('all');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      <style>{`
        .cert-section-wrapper {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
        }

        /* ── Filters Bar ── */
        .cert-filter-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
          padding: 14px 18px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          backdrop-filter: blur(12px);
        }

        .cert-category-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cert-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cert-tab-btn:hover {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .cert-tab-btn.active {
          color: #fff;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.25));
          border-color: rgba(56, 189, 248, 0.5);
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.15);
        }

        .cert-search-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          justify-content: flex-end;
          min-width: 260px;
        }

        .cert-search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 320px;
        }

        .cert-search-box .search-icon {
          position: absolute;
          left: 10px;
          color: #64748b;
          pointer-events: none;
        }

        .cert-search-input {
          width: 100%;
          padding: 7px 28px 7px 32px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 0.8rem;
          color: #fff;
          outline: none;
          transition: border-color 0.2s;
        }

        .cert-search-input:focus {
          border-color: #38bdf8;
        }

        .cert-search-clear {
          position: absolute;
          right: 8px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 1rem;
          cursor: pointer;
          line-height: 1;
        }

        .cert-issuer-select {
          padding: 7px 12px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 0.8rem;
          color: #cbd5e1;
          outline: none;
          cursor: pointer;
        }

        .cert-issuer-select option {
          background: #0f172a;
          color: #fff;
        }

        /* ── Section Group Headings ── */
        .cert-group-container {
          margin-bottom: 36px;
        }

        .cert-group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .cert-group-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cert-group-badge-pill {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .cert-group-badge-pill.course-pill {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          border-color: rgba(168, 85, 247, 0.3);
        }

        .cert-group-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .cert-group-count {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        /* ── Cert Grid ── */
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 20px;
        }

        /* ── Base Card ── */
        .cert-card-item {
          background: rgba(15, 23, 42, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          backdrop-filter: blur(12px);
          overflow: hidden;
        }

        .cert-card-item:hover {
          transform: translateY(-3px);
          border-color: rgba(56, 189, 248, 0.3);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
          background: rgba(15, 23, 42, 0.65);
        }

        .cert-card-item.is-parent-program {
          border-color: rgba(56, 189, 248, 0.2);
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.45) 0%, rgba(15, 23, 42, 0.55) 100%);
        }

        .cert-card-item.is-parent-program::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc);
        }

        .cert-card-header {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .cert-badge-frame {
          width: 58px;
          height: 58px;
          min-width: 58px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .cert-badge-img-tag {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        .cert-badge-fallback-icon {
          color: #38bdf8;
        }

        .cert-header-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .cert-header-tags {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
        }

        .cert-issuer-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #38bdf8;
        }

        .cert-credly-verified-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.6rem;
          font-weight: 700;
          color: #fb923c;
          background: rgba(251, 146, 60, 0.12);
          border: 1px solid rgba(251, 146, 60, 0.3);
          padding: 2px 6px;
          border-radius: 100px;
          letter-spacing: 0.03em;
        }

        .cert-title-text {
          font-size: 1rem;
          font-weight: 700;
          color: #f1f5f9;
          margin: 0;
          line-height: 1.35;
        }

        .cert-date-text {
          font-size: 0.72rem;
          color: #64748b;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* ── Program Note & Skills ── */
        .cert-program-note {
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.45;
          margin: 0;
        }

        .cert-skills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .cert-skill-pill {
          font-size: 0.65rem;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          padding: 2px 7px;
          border-radius: 6px;
        }

        /* ── Sub-course Curriculum Tray ── */
        .subcourse-tray {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .subcourse-tray-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .subcourse-progress-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #38bdf8;
        }

        .subcourse-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: #38bdf8;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          padding: 3px 6px;
          border-radius: 4px;
          transition: background 0.15s;
        }

        .subcourse-toggle-btn:hover {
          background: rgba(56, 189, 248, 0.1);
        }

        .subcourse-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .subcourse-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          gap: 8px;
        }

        .subcourse-item.completed {
          background: rgba(56, 189, 248, 0.04);
          border-color: rgba(56, 189, 248, 0.15);
        }

        .subcourse-item-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .subcourse-order {
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
          width: 14px;
        }

        .subcourse-icon-completed {
          color: #38bdf8;
        }

        .subcourse-icon-pending {
          color: #64748b;
        }

        .subcourse-title-text {
          font-size: 0.75rem;
          font-weight: 500;
          color: #e2e8f0;
          line-height: 1.3;
        }

        .subcourse-title-text.pending {
          color: #94a3b8;
        }

        .subcourse-item-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .subcourse-credly-badge-link {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.62rem;
          font-weight: 600;
          color: #fb923c;
          text-decoration: none;
          background: rgba(251, 146, 60, 0.1);
          border: 1px solid rgba(251, 146, 60, 0.25);
          padding: 2px 6px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .subcourse-credly-badge-link:hover {
          background: rgba(251, 146, 60, 0.2);
          border-color: #fb923c;
        }

        .subcourse-pending-tag {
          font-size: 0.62rem;
          color: #64748b;
          background: rgba(255, 255, 255, 0.03);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* ── Card Footer ── */
        .cert-card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          gap: 10px;
          flex-wrap: wrap;
        }

        .cert-id-badge {
          font-size: 0.65rem;
          color: #64748b;
          font-family: monospace;
          letter-spacing: 0.04em;
        }

        .cert-action-links {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .cert-primary-verify-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.35);
          padding: 5px 12px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .cert-primary-verify-btn:hover {
          background: #38bdf8;
          color: #0b1120;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
        }

        .cert-secondary-credly-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #fb923c;
          background: rgba(251, 146, 60, 0.1);
          border: 1px solid rgba(251, 146, 60, 0.3);
          padding: 5px 10px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .cert-secondary-credly-btn:hover {
          background: rgba(251, 146, 60, 0.22);
          border-color: #fb923c;
        }

        /* ── Official Credly Badges Showcase ── */
        .credly-showcase-card {
          margin-top: 40px;
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%);
          border: 1px solid rgba(251, 146, 60, 0.2);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(12px);
        }

        .credly-showcase-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .credly-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .credly-ribbon {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #fb923c;
          background: rgba(251, 146, 60, 0.15);
          border: 1px solid rgba(251, 146, 60, 0.3);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .credly-headline {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
        }

        .credly-subtext {
          font-size: 0.8rem;
          color: #94a3b8;
          margin: 0;
        }

        .credly-profile-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #ea580c, #f97316);
          padding: 8px 16px;
          border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35);
          transition: all 0.2s;
        }

        .credly-profile-link-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(234, 88, 12, 0.5);
        }

        .credly-badge-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 14px;
        }

        .credly-badge-item-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .credly-badge-item-card:hover {
          background: rgba(251, 146, 60, 0.05);
          border-color: rgba(251, 146, 60, 0.3);
          transform: translateY(-2px);
        }

        .credly-badge-avatar {
          width: 52px;
          height: 52px;
          min-width: 52px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(251, 146, 60, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .credly-badge-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        .credly-badge-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .credly-badge-issuer-tag {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #fb923c;
          letter-spacing: 0.04em;
        }

        .credly-badge-item-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .credly-badge-verify-text {
          font-size: 0.65rem;
          color: #94a3b8;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .credly-badge-item-card:hover .credly-badge-verify-text {
          color: #38bdf8;
        }

        /* ── Empty State ── */
        .cert-empty-state {
          text-align: center;
          padding: 48px 20px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          margin: 20px 0;
        }

        .empty-icon {
          color: #64748b;
          margin-bottom: 12px;
        }

        .cert-empty-state h4 {
          color: #f8fafc;
          margin: 0 0 6px;
        }

        .cert-empty-state p {
          color: #64748b;
          font-size: 0.85rem;
          margin: 0 0 16px;
        }

        .cert-reset-btn {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .cert-filter-bar { flex-direction: column; align-items: stretch; }
          .cert-search-controls { width: 100%; flex-direction: column; align-items: stretch; }
          .cert-search-box { max-width: none; }
          .cert-grid { grid-template-columns: 1fr; }
          .credly-badge-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Credential Card Subcomponent
// ─────────────────────────────────────────────────────────────────────────────
interface CredentialCardProps {
  cert: CredentialRecord;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({
  cert,
  isExpanded,
  onToggleExpand,
}) => {
  const isParent = !!cert.subCourses && cert.subCourses.length > 0;
  const completedSubCourses = cert.subCourses?.filter(s => s.status === 'verified' || s.status === 'completed').length || 0;
  const totalSubCourses = cert.subCourses?.length || 0;

  return (
    <div className={`cert-card-item ${isParent ? 'is-parent-program' : ''}`}>
      <div className="cert-card-header">
        <div className="cert-badge-frame">
          {cert.badgeUrl ? (
            <img
              src={cert.badgeUrl}
              alt={`${cert.title} badge`}
              className="cert-badge-img-tag"
              loading="lazy"
            />
          ) : (
            <Award size={28} className="cert-badge-fallback-icon" />
          )}
        </div>

        <div className="cert-header-meta">
          <div className="cert-header-tags">
            <span className="cert-issuer-badge">{cert.issuer}</span>
            {cert.credlyUrl && (
              <span className="cert-credly-verified-pill">
                <BadgeCheck size={10} /> Credly
              </span>
            )}
          </div>
          <h4 className="cert-title-text">{cert.title}</h4>
          {cert.date && (
            <span className="cert-date-text">
              <Calendar size={11} /> {cert.date}
            </span>
          )}
        </div>
      </div>

      {cert.programNote && (
        <p className="cert-program-note">{cert.programNote}</p>
      )}

      {/* Skills */}
      {cert.skills && cert.skills.length > 0 && (
        <div className="cert-skills-wrap">
          {cert.skills.slice(0, 5).map((skill, sIdx) => (
            <span key={sIdx} className="cert-skill-pill">
              {skill}
            </span>
          ))}
          {cert.skills.length > 5 && (
            <span className="cert-skill-pill">+{cert.skills.length - 5}</span>
          )}
        </div>
      )}

      {/* Sub-courses / Curriculum Tray (For Google AI and IBM Data Science) */}
      {isParent && cert.subCourses && (
        <div className="subcourse-tray">
          <div className="subcourse-tray-header">
            <span className="subcourse-progress-badge">
              <CheckCircle2 size={12} /> {completedSubCourses} / {totalSubCourses} Courses Completed
            </span>
            <button
              type="button"
              className="subcourse-toggle-btn"
              onClick={onToggleExpand}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <>Collapse Curriculum <ChevronUp size={12} /></>
              ) : (
                <>View {totalSubCourses} Courses <ChevronDown size={12} /></>
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="subcourse-list">
              {cert.subCourses.map((sub) => {
                const isCompleted = sub.status === 'verified' || sub.status === 'completed';
                return (
                  <div 
                    key={sub.id} 
                    className={`subcourse-item ${isCompleted ? 'completed' : 'pending'}`}
                  >
                    <div className="subcourse-item-left">
                      <span className="subcourse-order">#{sub.order}</span>
                      {isCompleted ? (
                        <CheckCircle2 size={13} className="subcourse-icon-completed" />
                      ) : (
                        <Clock size={13} className="subcourse-icon-pending" />
                      )}
                      <span className={`subcourse-title-text ${isCompleted ? 'completed' : 'pending'}`}>
                        {sub.title}
                      </span>
                    </div>

                    <div className="subcourse-item-right">
                      {isCompleted && sub.credlyUrl ? (
                        <a
                          href={sub.credlyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="subcourse-credly-badge-link"
                          title="Verified on Credly"
                        >
                          <BadgeCheck size={9} /> Credly
                        </a>
                      ) : (
                        <span className="subcourse-pending-tag">Curriculum</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Card Footer */}
      <div className="cert-card-footer">
        {cert.credentialId && (
          <span className="cert-id-badge" title="Credential ID">
            ID: {cert.credentialId}
          </span>
        )}

        <div className="cert-action-links">
          {cert.verificationUrl && (
            <a
              href={
                cert.verificationUrl.startsWith('http://') || cert.verificationUrl.startsWith('https://')
                  ? cert.verificationUrl
                  : `https://${cert.verificationUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="cert-primary-verify-btn"
            >
              Verify <ExternalLink size={11} />
            </a>
          )}

          {cert.credlyUrl && (
            <a
              href={cert.credlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-secondary-credly-btn"
              title="View badge on Credly"
            >
              🏅 Credly <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
