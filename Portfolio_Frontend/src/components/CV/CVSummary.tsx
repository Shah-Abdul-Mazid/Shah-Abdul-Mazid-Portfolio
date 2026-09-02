import React from 'react';
import { cvData } from '../../data/cvData';

export const CVSummary: React.FC = () => {
    return (
        <section className="cv-section cv-summary-box">
            <h3 className="cv-section-heading">Professional Summary</h3>
            <p className="cv-summary-text">{cvData.summary}</p>
        </section>
    );
};

export default CVSummary;
