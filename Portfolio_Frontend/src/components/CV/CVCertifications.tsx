import React from 'react';
import { cvData } from '../../data/cvData';

export const CVCertifications: React.FC = () => {
    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Certifications</h3>
            <ul className="cv-bullet-list">
                {cvData.certifications.map((cert, idx) => (
                    <li key={idx}>{cert}</li>
                ))}
            </ul>
        </section>
    );
};

export default CVCertifications;
