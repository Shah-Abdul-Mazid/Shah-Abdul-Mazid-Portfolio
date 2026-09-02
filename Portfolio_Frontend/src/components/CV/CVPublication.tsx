import React from 'react';
import { cvData } from '../../data/cvData';

export const CVPublication: React.FC = () => {
    const { publication } = cvData;
    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Publication</h3>
            <div className="cv-bold">{publication.title}</div>
            <div className="cv-small-desc">
                <span className="cv-bold">{publication.year}</span> — {publication.conference}
            </div>
        </section>
    );
};

export default CVPublication;
