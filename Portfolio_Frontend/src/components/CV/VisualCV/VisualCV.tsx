import React from 'react';
import { MapPin, Mail, Phone, Linkedin, Github } from 'lucide-react';
import { visualCvData } from '../../../data/visualCvData';
import './visual-cv.css';

export const VisualCV: React.FC = () => {
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
        publication,
        certifications,
        competitions,
        projects,
        profiles,
    } = visualCvData;

    return (
        <div className="v2-cv-paper">
            {/* Header Navy Block */}
            <div className="v2-header-band">
                <div className="v2-header-info">
                    <h1 className="v2-name">{personal.name}</h1>
                    <h2 className="v2-subtitle">{personal.title}</h2>
                    <div className="v2-tags">{personal.tags.join(' \u00A0|\u00A0 ')}</div>
                    <div className="v2-contact-grid">
                        <span className="v2-contact-item"><MapPin size={11} /> {personal.location}</span>
                        <span className="v2-contact-item"><Mail size={11} /> <a href={`mailto:${personal.email}`}>{personal.email}</a></span>
                        <span className="v2-contact-item"><Phone size={11} /> {personal.phone}</span>
                        <span className="v2-contact-item"><Linkedin size={11} /> <a href={personal.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></span>
                        <span className="v2-contact-item"><Github size={11} /> <a href={personal.github} target="_blank" rel="noreferrer">GitHub</a></span>
                    </div>
                </div>
                <div className="v2-header-right">
                    <img src={personal.avatarUrl} alt={personal.name} className="v2-avatar" />
                </div>
            </div>

            {/* Professional Summary */}
            <div className="v2-summary-box">
                <h3 className="v2-sec-heading">Professional Summary</h3>
                <p className="v2-summary-text">{summary}</p>
            </div>

            {/* PAGE 1 CONTENT (2-COLUMN GRID) */}
            <div className="v2-grid">
                {/* Page 1 Left Column */}
                <div className="v2-col">
                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Technical Skills</h3>
                        {skills.map((s, idx) => (
                            <div key={idx} className="v2-skill-entry">
                                <b>{s.category}:</b> {s.items.join(', ')}
                            </div>
                        ))}
                    </div>

                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Education</h3>
                        {education.map((edu, idx) => (
                            <div key={idx} className="v2-item">
                                <div className="v2-bold">{edu.degree}</div>
                                <div className="v2-sub">
                                    {edu.institution} <span className="v2-right-date">{edu.period}</span>
                                </div>
                                <div className="v2-small">{edu.details}</div>
                            </div>
                        ))}
                    </div>

                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Languages</h3>
                        {languages.map((lang, idx) => (
                            <div key={idx}><b>{lang.name}</b> — {lang.proficiency}</div>
                        ))}
                    </div>
                </div>

                {/* Page 1 Right Column */}
                <div className="v2-col">
                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Tools & Platforms</h3>
                        {toolsAndPlatforms.map((tp, idx) => (
                            <div key={idx} className="v2-skill-entry">
                                <b>{tp.category}:</b> {tp.items.join(', ')}
                            </div>
                        ))}
                    </div>

                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Key Achievements</h3>
                        <ul className="v2-ul">
                            {achievements.map((ach, idx) => (
                                <li key={idx}>{ach}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Professional Highlights</h3>
                        {highlights.map((hl, idx) => (
                            <div key={idx} className="v2-item">
                                <b>{hl.title}:</b> {hl.description}
                            </div>
                        ))}
                    </div>

                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Research Interests</h3>
                        <ul className="v2-ul">
                            {researchInterests.map((ri, idx) => (
                                <li key={idx}>{ri}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Career Focus</h3>
                        <div>{careerFocus.slice(0, 3).join(' \u00A0|\u00A0 ')}</div>
                        <div>{careerFocus.slice(3).join(' \u00A0|\u00A0 ')}</div>
                    </div>
                </div>
            </div>

            {/* PAGE 2 CONTENT (2-COLUMN GRID) */}
            <div className="v2-grid" style={{ marginTop: '16px' }}>
                {/* Page 2 Left Column */}
                <div className="v2-col">
                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Professional Experience</h3>
                        {experience.map((exp, idx) => (
                            <div key={idx} className="v2-item">
                                <div className="v2-bold">
                                    {exp.role} <span className="v2-right-date">{exp.period}</span>
                                </div>
                                <div className="v2-sub">{exp.company} — {exp.location}</div>
                                <ul className="v2-ul">
                                    {exp.points.map((pt, pIdx) => (
                                        <li key={pIdx}>{pt}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Publication</h3>
                        <div className="v2-bold">{publication.title}</div>
                        <div className="v2-small"><b>{publication.year}</b> — {publication.conference}</div>
                    </div>

                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Certifications</h3>
                        <ul className="v2-ul">
                            {certifications.map((cert, idx) => (
                                <li key={idx}>{cert}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Competitions & Awards</h3>
                        {competitions.map((comp, idx) => (
                            <div key={idx} className="v2-item">
                                <b>{comp.title}</b> — {comp.organizer}, {comp.year}
                            </div>
                        ))}
                    </div>

                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Online Profiles</h3>
                        {profiles.map((prof, idx) => (
                            <div key={idx}>
                                <b>{prof.label}:</b>{' '}
                                <a href={prof.url} target="_blank" rel="noreferrer" className="v2-link">
                                    {prof.text}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Page 2 Right Column */}
                <div className="v2-col">
                    <div className="v2-section">
                        <h3 className="v2-sec-heading">Selected Projects</h3>
                        {projects.map((proj, idx) => (
                            <div key={idx} className="v2-item">
                                <div className="v2-bold">{proj.title} — {proj.subtitle}</div>
                                <p className="v2-small">{proj.description}</p>
                                <ul className="v2-ul">
                                    {proj.points.map((pt, pIdx) => (
                                        <li key={pIdx}>{pt}</li>
                                    ))}
                                    {proj.tech.length > 0 && (
                                        <li><b>Tech:</b> {proj.tech.join(', ')}</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualCV;
