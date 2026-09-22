import React, { useMemo } from 'react';
import { cvData } from '../../data/cvData';
import { usePortfolio } from '../../context/PortfolioContext';

export const CVAchievements: React.FC = () => {
    const { data: portfolioData } = usePortfolio();

    const achievements = useMemo(() => {
        const items: string[] = [];

        // Publications → bullet per own paper
        if (portfolioData?.papers && portfolioData.papers.length > 0) {
            const myPapers = portfolioData.papers.filter(
                p => !p.authors || p.authors.toLowerCase().includes('mazid') || p.authors.toLowerCase().includes('shah')
            );
            myPapers.slice(0, 2).forEach(p => {
                const venue = p.venue ? ` (${p.venue}${p.year ? ` ${p.year}` : ''})` : '';
                items.push(`Published "${p.title.length > 70 ? p.title.slice(0, 67) + '…' : p.title}"${venue}`);
            });
        }

        // Top showcased projects
        if (portfolioData?.projects && portfolioData.projects.length > 0) {
            const topProjects = [...portfolioData.projects]
                .sort((a, b) => (b.showcase ?? 0) - (a.showcase ?? 0))
                .slice(0, 2);
            topProjects.forEach(proj => {
                if (proj.result) {
                    items.push(`${proj.title}: ${proj.result}`);
                } else if (proj.desc) {
                    const short = proj.desc.length > 90 ? proj.desc.slice(0, 87) + '…' : proj.desc;
                    items.push(`Developed ${proj.title} — ${short}`);
                }
            });
        }

        // Certifications count
        if (portfolioData?.certifications && portfolioData.certifications.length > 0) {
            items.push(`${portfolioData.certifications.length}+ professional certifications in AI/ML specializations`);
        }

        // Fall back to static data if not enough dynamic items
        return items.length >= 3 ? items.slice(0, 5) : cvData.achievements;
    }, [portfolioData?.papers, portfolioData?.projects, portfolioData?.certifications]);

    return (
        <section className="cv-section">
            <h3 className="cv-section-heading">Key Achievements</h3>
            <ul className="cv-bullet-list">
                {achievements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        </section>
    );
};

export default CVAchievements;
