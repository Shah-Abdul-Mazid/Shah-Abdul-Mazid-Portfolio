import React, { useMemo } from 'react';
import { MapPin, Mail, Phone, Linkedin, Github, GraduationCap, Globe } from 'lucide-react';
import { visualCvData } from '../../../data/visualCvData';
import { usePortfolio } from '../../../context/PortfolioContext';
import { getUpdatedAchievements, getUpdatedHighlights } from '../../../utils/buildAchievements';
import './visual-cv.css';


const OrcidIcon: React.FC<{ size?: number }> = ({ size = 10 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

const ResearchGateIcon: React.FC<{ size?: number }> = ({ size = 10 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
        <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.123 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .077.53h-.005a3.334 3.334 0 0 0 .113.438c.245.743.65 1.303 1.214 1.68.565.376 1.256.564 2.075.564.8 0 1.536-.213 2.105-.603.57-.39.94-.916 1.175-1.65.076-.235.135-.558.177-.93a10.9 10.9 0 0 0 .043-1.207v-.82c0-.095-.047-.142-.14-.142h-3.064c-.094 0-.14.047-.14.141v.956c0 .094.046.14.14.14h1.666c.056 0 .084.03.084.086 0 .36 0 .62-.036.865-.038.244-.1.447-.147.606-.108.385-.348.664-.638.876-.29.212-.738.35-1.227.35-.545 0-.901-.15-1.21-.353-.306-.203-.517-.454-.67-.915a3.136 3.136 0 0 1-.147-.762 17.366 17.367 0 0 1-.034-.656c-.01-.26-.014-.572-.014-.939a26.401 26.403 0 0 1 .014-.938 15.821 15.822 0 0 1 .035-.656 3.19 3.19 0 0 1 .148-.76 1.89 1.89 0 0 1 .742-1.01c.344-.244.593-.352 1.137-.352.508 0 .815.096 1.144.303.33.207.528.492.764.925.047.094.111.118.198.07l1.044-.43c.075-.048.09-.115.042-.199a3.549 3.549 0 0 0-.466-.742 3 3 0 0 0-.679-.607 3.313 3.313 0 0 0-.903-.41A4.068 4.068 0 0 0 19.586 0zM8.217 5.836c-1.69 0-3.036.086-4.297.086-1.146 0-2.291 0-3.007-.029v.831l1.088.2c.744.144 1.174.488 1.174 2.264v11.288c0 1.777-.43 2.12-1.174 2.263l-1.088.2v.832c.773-.029 2.12-.086 3.465-.086 1.29 0 2.951.057 3.667.086v-.831l-1.49-.2c-.773-.115-1.174-.487-1.174-2.264v-4.784c.688.057 1.29.057 2.206.057 1.748 3.123 3.41 5.472 4.355 6.56.86 1.032 2.177 1.691 3.839 1.691.487 0 1.003-.086 1.318-.23v-.744c-1.031 0-2.063-.716-2.808-1.518-1.26-1.376-2.95-3.582-4.355-6.074 2.32-.545 4.04-2.722 4.04-4.9 0-3.208-2.492-4.698-5.758-4.698zm-.515 1.29c2.406 0 3.839 1.26 3.839 3.552 0 2.263-1.547 3.782-4.097 3.782-.974 0-1.404-.03-2.063-.086v-7.19c.66-.059 1.547-.059 2.32-.059z" />
    </svg>
);

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
        references,
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

    /* Fit max 2 featured publications on Page 2 right column so A4 layout never breaks */
    const displayedPublications = useMemo(() => dynamicPublications.slice(0, 2), [dynamicPublications]);
    const remainingPubCount = dynamicPublications.length - displayedPublications.length;

    /* Dynamic achievements (publication summary auto-scales, other 4 bullets preserved) */
    const dynamicAchievements = useMemo(() =>
        getUpdatedAchievements(portfolioData?.papers, portfolioData?.certifications, achievements),
        [portfolioData?.papers, portfolioData?.certifications, achievements]
    );

    /* Dynamic highlights (research card auto-scales, other 3 cards preserved) */
    const dynamicHighlights = useMemo(() =>
        getUpdatedHighlights(portfolioData?.papers, highlights),
        [portfolioData?.papers, highlights]
    );

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
                PAGE 1 — Exactly 1 A4 Page (210 x 297 mm)
                Left:  Technical Skills -> Education -> Languages
                Right: Research Interests -> Career Focus -> Tools & Platforms -> Key Achievements
                Both columns end on the EXACT same horizontal line
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
                                {personal.portfolio && (
                                    <span className="v2-contact-item">
                                        <Globe size={10} />
                                        <a href={personal.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
                                    </span>
                                )}
                            </div>
                            {(personal.orcid || personal.researchgate) && (
                                <div className="v2-contact-row">
                                    {personal.orcid && (
                                        <span className="v2-contact-item">
                                            <OrcidIcon size={10} />
                                            <a href={personal.orcid} target="_blank" rel="noreferrer">ORCID ID</a>
                                        </span>
                                    )}
                                    {personal.researchgate && (
                                        <span className="v2-contact-item">
                                            <ResearchGateIcon size={10} />
                                            <a href={personal.researchgate} target="_blank" rel="noreferrer">ResearchGate</a>
                                        </span>
                                    )}
                                </div>
                            )}
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

                        {/* Technical Skills — ALL 11 categories */}
                        <div className="v2-sec-block">
                            <h3 className="v2-sec-heading v2-sec-heading-top">Technical Skills</h3>
                            {skills.map((s, i) => (
                                <div key={i} className="v2-skill-entry">
                                    <b>{s.category}:</b> {s.items.join(', ')}
                                </div>
                            ))}
                        </div>

                        {/* Education */}
                        <div className="v2-sec-block">
                            <h3 className="v2-sec-heading">Education</h3>
                            {education.map((edu, i) => {
                                const isBSc = edu.degree.toLowerCase().includes("b.sc") || edu.degree.toLowerCase().includes("bachelor");
                                const eduResult = (edu as any).result || (
                                    isBSc ? "2.56" :
                                    (edu.degree.toLowerCase().includes("higher secondary") || edu.degree.toLowerCase().includes("hsc")) ? "4.08" :
                                    (edu.degree.toLowerCase().includes("secondary school") || edu.degree.toLowerCase().includes("ssc")) ? "4.00" : ""
                                );
                                const groupOrMajor = isBSc ? "Major: Intelligent Systems & Data Science" : "Group: Science";
                                return (
                                <div key={i} className="v2-edu-item">
                                    <div className="v2-edu-row">
                                        <span className="v2-edu-degree">{edu.degree}</span>
                                        <span className="v2-edu-period">{edu.period}</span>
                                    </div>
                                    <div className="v2-edu-inst">{edu.institution}</div>
                                    <div className="v2-edu-details">{groupOrMajor}</div>
                                    {eduResult && <div className="v2-edu-details">Result: {eduResult}</div>}
                                </div>
                                );
                            })}
                        </div>
                        

                        {/* Languages — Anchored so bottom aligns with right column */}
                        <div className="v2-sec-block v2-lang-block">
                            <h3 className="v2-sec-heading">Languages</h3>
                            {languages.map((lang, i) => (
                                <div key={i} className="v2-lang-entry">
                                    <b>{lang.name}</b> — {lang.proficiency}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN (matching PDF right column) ── */}
                    <div className="v2-col-right">

                        {/* Research Interests */}
                        <div className="v2-sec-block">
                            <h3 className="v2-sec-heading v2-sec-heading-top">Research Interests</h3>
                            <ul className="v2-ul">
                                {researchInterests.map((ri, i) => (
                                    <li key={i}>{ri}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Career Focus */}
                        <div className="v2-sec-block">
                            <h3 className="v2-sec-heading">Career Focus</h3>
                            {careerFocus.map((cf, i) => (
                                <div key={i} className="v2-focus-item">{cf}</div>
                            ))}
                        </div>

                        {/* Tools & Platforms */}
                        <div className="v2-sec-block">
                            <h3 className="v2-sec-heading">Tools &amp; Platforms</h3>
                            {toolsAndPlatforms.map((tp, i) => (
                                <div key={i} className="v2-skill-entry">
                                    <b>{tp.category}:</b> {tp.items.join(', ')}
                                </div>
                            ))}
                        </div>

                        {/* Key Achievements — Anchored so bottom aligns with left column */}
                        <div className="v2-sec-block v2-achieve-block">
                            <h3 className="v2-sec-heading">Key Achievements</h3>
                            <ul className="v2-ul">
                                {dynamicAchievements.map((ach, i) => (
                                    <li key={i}>{ach}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                PAGE 2 — Exactly 1 A4 Page (210 x 297 mm)
                Matches Overleaf LaTeX Page 2
                Both columns end on the EXACT same horizontal line
                ══════════════════════════════════════════ */}
            <div className="v2-page" id="cv-page-2">
                <div className="v2-two-col">

                    {/* Left Column */}
                    <div className="v2-col-left">

                        {/* Professional Highlights */}
                        <div className="v2-sec-block">
                            <h3 className="v2-sec-heading v2-sec-heading-first">Professional Highlights</h3>
                            {dynamicHighlights.map((hl, i) => (
                                <div key={i} className="v2-highlight-item">
                                    <b>{hl.title}:</b> {hl.description}
                                </div>
                            ))}
                        </div>

                        {/* Professional Experience */}
                        <div className="v2-sec-block">
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
                        </div>

                        {/* Selected Projects (First 3) — Anchored at bottom */}
                        <div className="v2-sec-block v2-left-projects-block">
                            <h3 className="v2-sec-heading">Selected Projects</h3>
                            {leftProjects.map((proj, i) => (
                                <div key={i} className="v2-project-item">
                                    <div className="v2-project-title">
                                        {proj.title}
                                        {proj.githubUrl && (
                                            <a
                                                href={proj.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="v2-project-link"
                                            >
                                                {' '}[GitHub]
                                            </a>
                                        )}
                                        {proj.liveUrl && (
                                            <a
                                                href={proj.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="v2-project-link"
                                            >
                                                {' '}[Live Demo]
                                            </a>
                                        )}
                                    </div>
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
                    </div>

                    {/* Right Column */}
                    <div className="v2-col-right">

                        {/* Selected Projects Continuation (Last 2) */}
                        <div className="v2-sec-block">
                            {rightProjects.map((proj, i) => (
                                <div key={i} className="v2-project-item" style={{ marginTop: i === 0 ? '1mm' : undefined }}>
                                    <div className="v2-project-title">
                                        {proj.title}
                                        {proj.githubUrl && (
                                            <a
                                                href={proj.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="v2-project-link"
                                            >
                                                {' '}[GitHub]
                                            </a>
                                        )}
                                        {proj.liveUrl && (
                                            <a
                                                href={proj.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="v2-project-link"
                                            >
                                                {' '}[Live Demo]
                                            </a>
                                        )}
                                    </div>
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

                        {/* Publication */}
                        <div className="v2-sec-block">
                            <h3 className="v2-sec-heading">Publication</h3>
                            {displayedPublications.map((pub, i) => (
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
                            {remainingPubCount > 0 && (
                                <div style={{ fontSize: '7.5pt', color: 'var(--v2-muted)', margin: '3px 0 8px 0', fontStyle: 'italic' }}>
                                    + {remainingPubCount} more publication{remainingPubCount > 1 ? 's' : ''} ({personal.scholar ? (
                                        <a href={personal.scholar} target="_blank" rel="noreferrer" className="v2-link" style={{ textDecoration: 'underline' }}>
                                            view on Google Scholar
                                        </a>
                                    ) : 'view on portfolio'})
                                </div>
                            )}
                        </div>

                        {/* Certifications */}
                        <div className="v2-sec-block">
                            <h3 className="v2-sec-heading">Certifications</h3>
                            <ul className="v2-ul">
                                {certifications.map((cert, i) => (
                                    <li key={i}>{cert}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Competitions & Awards */}
                        <div className="v2-sec-block">
                            <h3 className="v2-sec-heading">Competitions &amp; Awards</h3>
                            {competitions.map((comp, i) => (
                                <div key={i} className="v2-comp-item">
                                    <b>{comp.title}</b> — {comp.organizer}, {comp.year}
                                </div>
                            ))}
                        </div>

                        {/* References / Profiles — Anchored at bottom */}
                        {references && references.length > 0 ? (
                            <div className="v2-sec-block v2-references-block">
                                <h3 className="v2-sec-heading">References</h3>
                                {references.map((ref, i) => (
                                    <div key={i} className="v2-ref-item" style={{ marginBottom: i < references.length - 1 ? '2.5mm' : undefined }}>
                                        <b>{ref.label}:</b><br />
                                        <span>{ref.name}</span><br />
                                        <span style={{ color: 'var(--v2-muted)' }}>{ref.affiliation}</span><br />
                                        {ref.email && (
                                            <span>
                                                Email:{' '}
                                                <a href={`mailto:${ref.email}`} className="v2-link">
                                                    {ref.email}
                                                </a>
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="v2-sec-block v2-profiles-block">
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualCV;
