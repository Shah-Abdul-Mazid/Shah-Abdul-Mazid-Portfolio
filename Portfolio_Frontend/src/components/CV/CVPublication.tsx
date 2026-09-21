import React from 'react';
import { cvData } from '../../data/cvData';

export const CVPublication: React.FC = () => {
    const { publication, publications } = cvData;
    const pubs = publications || [publication];
    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Publication</h3>
            {pubs.map((pub, idx) => (
                <div key={idx} style={{ marginBottom: idx < pubs.length - 1 ? '8px' : 0 }}>
                    <div className="cv-bold">{pub.title}</div>
                    <div className="cv-small-desc">
                        <span className="cv-bold">{pub.year}</span> — {pub.conference}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default CVPublication;
