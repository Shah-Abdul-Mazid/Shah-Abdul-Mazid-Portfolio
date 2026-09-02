import React from 'react';
import { cvData } from '../../data/cvData';

export const CVSkills: React.FC = () => {
    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Technical Skills</h3>
            {cvData.skills.map((skillGroup, idx) => (
                <div key={idx} className="cv-skill-entry">
                    <span className="cv-bold">{skillGroup.category}:</span>{' '}
                    <span>{skillGroup.items.join(', ')}</span>
                </div>
            ))}
        </section>
    );
};

export default CVSkills;
