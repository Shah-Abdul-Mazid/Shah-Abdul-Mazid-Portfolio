import React from 'react';
import { cvData } from '../../data/cvData';

export const CVAchievements: React.FC = () => {
    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Key Achievements</h3>
            <ul className="cv-bullet-list">
                {cvData.achievements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        </section>
    );
};

export default CVAchievements;
