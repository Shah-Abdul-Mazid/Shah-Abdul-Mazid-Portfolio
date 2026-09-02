import React from 'react';
import { cvData } from '../../data/cvData';

export const CVProjects: React.FC = () => {
    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Selected Projects</h3>
            {cvData.projects.map((proj, idx) => (
                <div key={idx} className="cv-item cv-project-card">
                    <div className="cv-bold">
                        {proj.title} — <span className="cv-italic">{proj.subtitle}</span>
                    </div>
                    <p className="cv-small-desc">{proj.description}</p>
                    <ul className="cv-bullet-list">
                        {proj.points.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                        ))}
                    </ul>
                    {proj.tech.length > 0 && (
                        <div className="cv-tech-tags">
                            <span className="cv-bold">Tech:</span>{' '}
                            {proj.tech.map((t, tIdx) => (
                                <span key={tIdx} className="cv-tech-badge">
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
};

export default CVProjects;
