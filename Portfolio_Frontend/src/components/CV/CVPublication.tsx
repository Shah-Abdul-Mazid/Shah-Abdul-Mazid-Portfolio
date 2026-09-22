import React, { useMemo } from 'react';
import { cvData } from '../../data/cvData';
import { usePortfolio } from '../../context/PortfolioContext';

export const CVPublication: React.FC = () => {
    const { data: portfolioData } = usePortfolio();
    const { publication, publications } = cvData;

    const pubs = useMemo(() => {
        if (portfolioData?.papers && portfolioData.papers.length > 0) {
            const myPapers = portfolioData.papers.filter(
                p => !p.authors || p.authors.toLowerCase().includes('mazid') || p.authors.toLowerCase().includes('shah')
            );
            const selected = myPapers.length > 0 ? myPapers : portfolioData.papers;
            return selected.map(p => ({
                title: p.title,
                authors: p.authors || 'Shah Abdul Mazid',
                year: p.year,
                conference: `${p.venue || ''}${p.publisher ? `, ${p.publisher}` : ''}`,
                doi: p.doi || '',
                url: p.link || (p.doi ? `https://doi.org/${p.doi}` : '')
            }));
        }
        return publications || [publication];
    }, [portfolioData?.papers, publications, publication]);

    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Publication</h3>
            {pubs.map((pub, idx) => (
                <div key={idx} style={{ marginBottom: idx < pubs.length - 1 ? '8px' : 0 }}>
                    <div className="cv-bold">{pub.title}</div>
                    {pub.authors && (
                        <div className="cv-small-desc" style={{ color: '#4b5563', marginTop: '2px' }}>
                            <b>Authors:</b> {pub.authors}
                        </div>
                    )}
                    <div className="cv-small-desc" style={{ marginTop: '2px' }}>
                        <span className="cv-bold">{pub.year}</span> — {pub.conference}
                    </div>
                    {pub.doi && (
                        <div className="cv-small-desc" style={{ marginTop: '2px' }}>
                            <b>DOI:</b>{' '}
                            <a href={pub.url || `https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="cv-link">
                                {pub.doi}
                            </a>
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
};

export default CVPublication;
