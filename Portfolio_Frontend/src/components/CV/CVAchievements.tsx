import React, { useMemo } from 'react';
import { cvData } from '../../data/cvData';
import { usePortfolio } from '../../context/PortfolioContext';
import { buildDynamicAchievements } from '../../utils/buildAchievements';

export const CVAchievements: React.FC = () => {
    const { data: portfolioData } = usePortfolio();

    const achievements = useMemo(() =>
        buildDynamicAchievements(
            portfolioData?.papers,
            portfolioData?.projects,
            portfolioData?.certifications,
            cvData.achievements,
        ),
    [portfolioData?.papers, portfolioData?.projects, portfolioData?.certifications]);

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
