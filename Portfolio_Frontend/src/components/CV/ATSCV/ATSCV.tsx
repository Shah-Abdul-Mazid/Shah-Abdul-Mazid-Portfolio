import React from 'react';
import { atsCvData } from '../../../data/atsCvData';
import './ats-cv.css';

export const ATSCV: React.FC = () => {
    const { personal, summary, skills, experience, education, projects, publication, certifications, competitions, onlineProfiles, languages } = atsCvData;

    return (
        <div className="ats-cv-paper">
            {/* Header */}
            <header className="ats-header">
                <h1 className="ats-name">{personal.name}</h1>
                <div className="ats-title">{personal.title}</div>
                <div className="ats-contact-bar">
                    <span>{personal.location}</span>
                    <span className="ats-sep">|</span>
                    <a href={`mailto:${personal.email}`} className="ats-link">{personal.email}</a>
                    <span className="ats-sep">|</span>
                    <span>{personal.phone}</span>
                </div>
                <div className="ats-links-bar">
                    <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="ats-link">LinkedIn</a>
                    <span className="ats-sep">|</span>
                    <a href={personal.github} target="_blank" rel="noopener noreferrer" className="ats-link">GitHub</a>
                    <span className="ats-sep">|</span>
                    <a href={personal.portfolio} target="_blank" rel="noopener noreferrer" className="ats-link">Portfolio</a>
                </div>
            </header>

            {/* Summary */}
            <section className="ats-section">
                <h2 className="ats-section-title">Professional Summary</h2>
                <p className="ats-summary">{summary}</p>
            </section>

            {/* Skills */}
            <section className="ats-section">
                <h2 className="ats-section-title">Technical Skills</h2>
                {skills.map((sGroup, idx) => (
                    <div key={idx} className="ats-skill-row">
                        <span className="ats-bold">{sGroup.category}:</span> {sGroup.items.join(', ')}
                    </div>
                ))}
            </section>

            {/* Experience */}
            <section className="ats-section">
                <h2 className="ats-section-title">Professional Experience</h2>
                {experience.map((job, idx) => (
                    <div key={idx} className="ats-item">
                        <div className="ats-item-top">
                            <span className="ats-bold">{job.role}</span>
                            <span className="ats-date-badge">{job.period}</span>
                        </div>
                        <div className="ats-item-sub">{job.company}, {job.location}</div>
                        <ul className="ats-bullet-list">
                            {job.points.map((pt, pIdx) => (
                                <li key={pIdx}>{pt}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="ats-section">
                <h2 className="ats-section-title">Education</h2>
                {education.map((edu, idx) => (
                    <div key={idx} className="ats-item">
                        <div className="ats-item-top">
                            <span className="ats-bold">{edu.degree}</span>
                            <span className="ats-date-badge">{edu.period}</span>
                        </div>
                        <div className="ats-item-sub">{edu.institution}, {edu.location}</div>
                        {edu.major && <div className="ats-small-desc">• {edu.major}</div>}
                        {edu.details && !edu.major && <div className="ats-small-desc">• {edu.details}</div>}
                    </div>
                ))}
            </section>

            {/* Projects */}
            <section className="ats-section">
                <h2 className="ats-section-title">Projects</h2>
                {projects.map((proj, idx) => (
                    <div key={idx} className="ats-item">
                        <div className="ats-bold">{proj.title} -- <span style={{ fontWeight: 600 }}>{proj.subtitle}</span></div>
                        <ul className="ats-bullet-list">
                            {proj.points.map((pt, pIdx) => (
                                <li key={pIdx}>{pt}</li>
                            ))}
                        </ul>
                        <div className="ats-tech-line">
                            <span className="ats-bold">Technologies:</span> {proj.technologies.join(', ')}
                        </div>
                    </div>
                ))}
            </section>

            {/* Publication */}
            <section className="ats-section">
                <h2 className="ats-section-title">Publication</h2>
                <div className="ats-item-top">
                    <span className="ats-bold">{publication.title}</span>
                    <span className="ats-date-badge">{publication.year}</span>
                </div>
                <p className="ats-small-desc" style={{ margin: '2px 0 0' }}>{publication.venue}</p>
            </section>

            {/* Certifications */}
            <section className="ats-section">
                <h2 className="ats-section-title">Licenses and Certifications</h2>
                <ul className="ats-bullet-list">
                    {certifications.map((cert, idx) => (
                        <li key={idx}>
                            <span className="ats-bold">{cert.name}</span> -- {cert.issuer}, {cert.date}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Competitions */}
            <section className="ats-section">
                <h2 className="ats-section-title">Competitions and Awards</h2>
                {competitions.map((comp, idx) => (
                    <div key={idx} className="ats-profile-line">
                        <span className="ats-bold">{comp.title}</span> -- {comp.organizer}, {comp.year}
                    </div>
                ))}
            </section>

            {/* Projects & Online Profiles */}
            <section className="ats-section">
                <h2 className="ats-section-title">Projects and Online Profiles</h2>
                {onlineProfiles.map((prof, idx) => (
                    <div key={idx} className="ats-profile-line">
                        <span className="ats-bold">{prof.name}:</span>{' '}
                        <a href={prof.url} target="_blank" rel="noopener noreferrer" className="ats-link">
                            {prof.label}
                        </a>
                    </div>
                ))}
            </section>

            {/* Languages */}
            <section className="ats-section">
                <h2 className="ats-section-title">Languages</h2>
                <p style={{ margin: 0 }}>
                    {languages.map(l => `${l.name} -- ${l.level}`).join(' \u00A0\u00A0 | \u00A0\u00A0 ')}
                </p>
            </section>
        </div>
    );
};

export default ATSCV;
