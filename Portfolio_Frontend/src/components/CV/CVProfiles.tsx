import React from 'react';
import { cvData } from '../../data/cvData';

export const CVProfiles: React.FC = () => {
    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Online Profiles</h3>
            <div className="cv-profiles-list">
                {cvData.profiles.map((p, idx) => (
                    <div key={idx} className="cv-profile-item">
                        <span className="cv-bold">{p.label}:</span>{' '}
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="cv-link">
                            {p.text}
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CVProfiles;
