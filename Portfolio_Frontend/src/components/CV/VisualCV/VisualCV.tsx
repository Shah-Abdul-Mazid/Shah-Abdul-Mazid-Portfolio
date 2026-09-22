import React, { useMemo } from 'react';
import { MapPin, Mail, Phone, Linkedin, Github, GraduationCap } from 'lucide-react';
import { visualCvData } from '../../../data/visualCvData';
import { usePortfolio } from '../../../context/PortfolioContext';
import './visual-cv.css';

export const VisualCV: React.FC = () => {
    const { data: portfolioData } = usePortfolio();

    const {
        personal,
        summary,
        skills,
        education,
        languages,
        toolsAndPlatforms,
        achievements,
        highlights,
        researchInterests,
        careerFocus,
        experience,
        publications,
        certifications,
        competitions,
        projects,
        profiles,
    } = visualCvData;

    /* Dynamic publications from portfolio data */
    const dynamicPublications = useMemo(() => {
        if (portfolioData?.papers && portfolioData.papers.length > 0) {
            const myPapers = portfolioData.papers.filter(
                p => !p.authors || p.authors.toLowerCase().includes('mazid') || p.authors.toLowerCase().includes('shah')
            );
            const selected = myPapers.length > 0 ? myPapers : portfolioData.papers;
            return selected.map(p => ({
                title: p.title,
                authors: p.authors || 'Shah Abdul Mazid',
                year: p.year,
                conference: `${p.venue || ''}${p.publisher ? `, ${p.publisher}` : ''}`,
                doi: p.doi || '',
                url: p.link || (p.doi ? `https://doi.org/${p.doi}` : ''),
            }));
        }
        return publications;
    }, [portfolioData?.papers, publications]);

    /* Dynamic achievements derived from portfolio data */
    const dynamicAchievements = useMemo(() => {
        const items: string[] = [];

        // Publications → bullet per own paper
        if (portfolioData?.papers && portfolioData.papers.length > 0) {
            const myPapers = portfolioData.papers.filter(
                p => !p.authors || p.authors.toLowerCase().includes('mazid') || p.authors.toLowerCase().includes('shah')
            );
            myPapers.slice(0, 2).forEach(p => {
                const venue = p.venue ? ` (${p.venue}${p.year ? ` ${p.year}` : ''})` : '';
                items.push(`Published "${p.title.length > 70 ? p.title.slice(0, 67) + '…' : p.title}"${venue}`);
            });
        }

        // Featured projects → top-showcased ones
        if (portfolioData?.projects && portfolioData.projects.length > 0) {
            const topProjects = [...portfolioData.projects]
                .sort((a, b) => (b.showcase ?? 0) - (a.showcase ?? 0))
                .slice(0, 2);
            topProjects.forEach(proj => {
                if (proj.result) {
                    items.push(`${proj.title}: ${proj.result}`);
                } else if (proj.desc) {
                    const short = proj.desc.length > 90 ? proj.desc.slice(0, 87) + '…' : proj.desc;
                    items.push(`Developed ${proj.title} — ${short}`);
                }
            });
        }

        // Certifications count
        if (portfolioData?.certifications && portfolioData.certifications.length > 0) {
            items.push(`${portfolioData.certifications.length}+ professional certifications in AI/ML specializations`);
        }

        return items.length >= 3 ? items.slice(0, 5) : achievements;
    }, [portfolioData?.papers, portfolioData?.projects, portfolioData?.certifications, achievements]);

    /* Dynamic highlights derived from portfolio data */
    const dynamicHighlights = useMemo(() => {
        const items: { title: string; description: string }[] = [];

        // Publications highlight
        if (portfolioData?.papers && portfolioData.papers.length > 0) {
            const myPapers = portfolioData.papers.filter(
                p => !p.authors || p.authors.toLowerCase().includes('mazid') || p.authors.toLowerCase().includes('shah')
            );
            const venues = [...new Set(myPapers.map(p => p.venue).filter(Boolean))].slice(0, 2).join(' and ');
            if (myPapers.length > 0) {
                items.push({
                    title: 'Published Research',
                    description: `${myPapers.length} publication${myPapers.length > 1 ? 's' : ''} in AI/ML${venues ? `, including ${venues}` : ''}.`,
                });
            }
        }

        // Top project highlights (with result or desc)
        if (portfolioData?.projects && portfolioData.projects.length > 0) {
            const topProjs = [...portfolioData.projects]
                .sort((a, b) => (b.showcase ?? 0) - (a.showcase ?? 0))
                .slice(0, 2);
            topProjs.forEach(proj => {
                const desc = proj.result || proj.impact || proj.desc || '';
                if (desc) {
                    items.push({
                        title: proj.title,
                        description: desc.length > 120 ? desc.slice(0, 117) + '…' : desc,
                    });
                }
            });
        }

        // Work experience highlight
        if (portfolioData?.work && portfolioData.work.length > 0) {
            const latest = portfolioData.work[0];
            items.push({
                title: `${latest.role} at ${latest.company}`,
                description: latest.details?.[0] || `Working as ${latest.role} at ${latest.company}.`,
            });
        }

        return items.length >= 3 ? items.slice(0, 4) : highlights;
    }, [portfolioData?.papers, portfolioData?.projects, portfolioData?.work, highlights]);

    /* Split projects: 3 in Page 2 Left Column, 2 in Page 2 Right Column */
    const leftProjects = useMemo(() => projects.slice(0, 3), [projects]);
    const rightProjects = useMemo(() => projects.slice(3), [projects]);

    /* Helper to bold author's own name */
    const renderAuthors = (authorsStr: string) => {
        const parts = authorsStr.split(/(Shah Abdul Mazid)/g);
        return parts.map((part, i) =>
            part === 'Shah Abdul Mazid' ? <b key={i}>{part}</b> : part
        );
    };

    return (
        <div className="v2-cv-container">

            {/* ══════════════════════════════════════════
                PAGE 1 — Matches Overleaf LaTeX Output Exactly
                Natural two-column flow (multicols{2})
                Left:  Technical Skills -> Education -> Languages
                Right: Research Interests -> Career Focus -> Tools & Platforms -> Key Achievements
                ══════════════════════════════════════════ */}
            <div className="v2-page" id="cv-page-1">

                {/* ── Header: navy band with photo ── */}
                <div className="v2-header-band">
                    <div className="v2-header-info">
                        <h1 className="v2-name">{personal.name}</h1>
                        <h2 className="v2-subtitle">{personal.title}</h2>
                        <div className="v2-tags">
                            {personal.tags.join('\u00A0\u00A0|\u00A0\u00A0')}
                        </div>
                        <div className="v2-contact-grid">
                            <div className="v2-contact-row">
                                <span className="v2-contact-item">
                                    <MapPin size={10} />
                                    {personal.location}
                                </span>
                                <span className="v2-contact-item">
                                    <Mail size={10} />
                                    <a href={`mailto:${personal.email}`}>{personal.email}</a>
                                </span>
                            </div>
                            <div className="v2-contact-row">
                                <span className="v2-contact-item">
                                    <Phone size={10} />
                                    {personal.phone}
                                </span>
                                <span className="v2-contact-item">
                                    <Linkedin size={10} />
                                    <a href={personal.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                                </span>
                                <span className="v2-contact-item">
                                    <Github size={10} />
                                    <a href={personal.github} target="_blank" rel="noreferrer">GitHub</a>
                                </span>
                                {personal.scholar && (
                                    <span className="v2-contact-item">
                                        <GraduationCap size={10} />
                                        <a href={personal.scholar} target="_blank" rel="noreferrer">Google Scholar</a>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="v2-header-photo">
                        <img
                            src={personal.avatarUrl}
                            alt={personal.name}
                            className="v2-avatar"
                            crossOrigin="anonymous"
                        />
                    </div>
                </div>

                {/* ── Professional Summary ── */}
                <h3 className="v2-sec-heading v2-sec-summary">Professional Summary</h3>
                <p className="v2-summary-text">{summary}</p>

                {/* ── Page 1 Two-column grid (matching LaTeX multicols) ── */}
                <div className="v2-two-col">

                    {/* ── LEFT COLUMN ── */}
                    <div className="v2-col-left">

                        {/* Technical Skills */}
                        <h3 className="v2-sec-heading v2-sec-heading-top">Technical Skills</h3>
                        {skills.map((s, i) => (
                            <div key={i} className="v2-skill-entry">
                                <b>{s.category}:</b> {s.items.join(', ')}
                            </div>
                        ))}

                        {/* Education */}
                        <h3 className="v2-sec-heading">Education</h3>
                        {education.map((edu, i) => (
                            <div key={i} className="v2-edu-item">
                                <div className="v2-edu-degree">{edu.degree}</div>
                                <div className="v2-edu-row">
                                    <span className="v2-edu-inst">{edu.institution}</span>
                                    <span className="v2-edu-period">{edu.period}</span>
                                </div>
                                <div className="v2-edu-details">{edu.details}</div>
                            </div>
                        ))}

                        {/* Languages */}
                        <h3 className="v2-sec-heading">Languages</h3>
                        {languages.map((lang, i) => (
                            <div key={i} className="v2-lang-entry">
                                <b>{lang.name}</b> — {lang.proficiency}
                            </div>
                        ))}
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="v2-col-right">

                        {/* Research Interests */}
                        <h3 className="v2-sec-heading v2-sec-heading-top">Research Interests</h3>
                        <ul className="v2-ul">
                            {researchInterests.map((ri, i) => (
                                <li key={i}>{ri}</li>
                            ))}
                        </ul>

                        {/* Career Focus */}
                        <h3 className="v2-sec-heading">Career Focus</h3>
                        {careerFocus.map((cf, i) => (
                            <div key={i} className="v2-focus-item">{cf}</div>
                        ))}

                        {/* Tools & Platforms */}
                        <h3 className="v2-sec-heading">Tools &amp; Platforms</h3>
                        {toolsAndPlatforms.map((tp, i) => (
                            <div key={i} className="v2-skill-entry">
                                <b>{tp.category}:</b> {tp.items.join(', ')}
                            </div>
                        ))}

                        {/* Key Achievements */}
                        <h3 className="v2-sec-heading">Key Achievements</h3>
                        <ul className="v2-ul">
                            {dynamicAchievements.map((ach, i) => (
                                <li key={i}>{ach}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                PAGE 2 — Exactly 1 A4 Page
                Matches Overleaf LaTeX Page 2
                ══════════════════════════════════════════ */}
            <div className="v2-page" id="cv-page-2">
                <div className="v2-two-col">

                    {/* Left Column */}
                    <div className="v2-col-left">

                        {/* Professional Highlights */}
                        <h3 className="v2-sec-heading v2-sec-heading-first">Professional Highlights</h3>
                        {dynamicHighlights.map((hl, i) => (
                            <div key={i} className="v2-highlight-item">
                                <b>{hl.title}:</b> {hl.description}
                            </div>
                        ))}

                        {/* Professional Experience */}
                        <h3 className="v2-sec-heading">Professional Experience</h3>
                        {experience.map((exp, i) => (
                            <div key={i} className="v2-exp-item">
                                <div className="v2-exp-header">
                                    <span className="v2-exp-role">{exp.role}</span>
                                    <span className="v2-exp-period">{exp.period}</span>
                                </div>
                                <div className="v2-exp-company">
                                    {exp.company} — {exp.location}
                                </div>
                                <ul className="v2-ul">
                                    {exp.points.map((pt, j) => (
                                        <li key={j}>{pt}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Selected Projects (First 3) */}
                        <h3 className="v2-sec-heading">Selected Projects</h3>
                        {leftProjects.map((proj, i) => (
                            <div key={i} className="v2-project-item">
                                <div className="v2-project-title">{proj.title}</div>
                                <div className="v2-project-subtitle">{proj.subtitle}</div>
                                <div className="v2-project-desc">{proj.description}</div>
                                <ul className="v2-ul">
                                    {proj.points.map((pt, j) => (
                                        <li key={j}>{pt}</li>
                                    ))}
                                    {proj.tech.length > 0 && (
                                        <li><b>Tech:</b> {proj.tech.join(', ')}</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="v2-col-right">

                        {/* Selected Projects Continuation (Last 2) */}
                        {rightProjects.map((proj, i) => (
                            <div key={i} className="v2-project-item" style={{ marginTop: i === 0 ? '1mm' : undefined }}>
                                <div className="v2-project-title">{proj.title}</div>
                                <div className="v2-project-subtitle">{proj.subtitle}</div>
                                <div className="v2-project-desc">{proj.description}</div>
                                <ul className="v2-ul">
                                    {proj.points.map((pt, j) => (
                                        <li key={j}>{pt}</li>
                                    ))}
                                    {proj.tech.length > 0 && (
                                        <li><b>Tech:</b> {proj.tech.join(', ')}</li>
                                    )}
                                </ul>
                            </div>
                        ))}

                        {/* Publication */}
                        <h3 className="v2-sec-heading">Publication</h3>
                        {dynamicPublications.map((pub, i) => (
                            <div key={i} className="v2-pub-item">
                                <div className="v2-pub-title">{pub.title}</div>
                                {pub.authors && (
                                    <div className="v2-pub-authors">
                                        <b>Authors:</b> {renderAuthors(pub.authors)}
                                    </div>
                                )}
                                <div className="v2-pub-venue">{pub.conference}</div>
                                {pub.doi && (
                                    <div className="v2-pub-doi">
                                        DOI:{' '}
                                        <a
                                            href={pub.url || `https://doi.org/${pub.doi}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="v2-link"
                                        >
                                            {pub.doi}
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Certifications */}
                        <h3 className="v2-sec-heading">Certifications</h3>
                        <ul className="v2-ul">
                            {certifications.map((cert, i) => (
                                <li key={i}>{cert}</li>
                            ))}
                        </ul>

                        {/* Competitions & Awards */}
                        <h3 className="v2-sec-heading">Competitions &amp; Awards</h3>
                        {competitions.map((comp, i) => (
                            <div key={i} className="v2-comp-item">
                                <b>{comp.title}</b> — {comp.organizer}, {comp.year}
                            </div>
                        ))}

                        {/* Online Profiles */}
                        <h3 className="v2-sec-heading">Online Profiles</h3>
                        {profiles.map((prof, i) => (
                            <div key={i} className="v2-profile-item">
                                <b>{prof.label}:</b>{' '}
                                <a href={prof.url} target="_blank" rel="noreferrer" className="v2-link">
                                    {prof.text}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualCV;
