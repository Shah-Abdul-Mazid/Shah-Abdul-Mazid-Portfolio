import React from 'react';
import { cvData } from '../../data/cvData';

export const CVExperience: React.FC = () => {
    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Professional Experience</h3>
            {cvData.experience.map((exp, idx) => (
                <div key={idx} className="cv-item">
                    <div className="cv-item-title-row">
                        <span className="cv-bold">{exp.role}</span>
                        <span className="cv-date-badge">{exp.period}</span>
                    </div>
                    <div className="cv-item-sub">
                        {exp.company} — {exp.location}
                    </div>
                    <ul className="cv-bullet-list">
                        {exp.points.map((point, pIdx) => (
                            <li key={pIdx}>{point}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
};

export default CVExperience;
