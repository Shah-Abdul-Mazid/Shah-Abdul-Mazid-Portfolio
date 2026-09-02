import React from 'react';
import { cvData } from '../../data/cvData';

export const CVEducation: React.FC = () => {
    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Education</h3>
            {cvData.education.map((item, idx) => (
                <div key={idx} className="cv-item">
                    <div className="cv-item-title">{item.degree}</div>
                    <div className="cv-item-sub">
                        <span>{item.institution}</span>
                        <span className="cv-date-badge">{item.period}</span>
                    </div>
                    <div className="cv-small-muted">{item.details}</div>
                </div>
            ))}
        </section>
    );
};

export default CVEducation;
