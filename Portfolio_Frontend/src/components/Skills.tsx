import { usePortfolio } from '../context/PortfolioContext';

const Skills = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const categories = data.skills || [];

    return (
        <section id="skills" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.skills?.subtitle || 'Technical Stack'}</span>
                    <h2>
                        {data.sections?.skills?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.skills.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Core <span className="gradient-text">Expertise</span></>
                        )}
                    </h2>
                </div>
                
                <div className="skills-grid fade-in" ref={addToRefs}>
                    {categories.map((cat, index) => (
                        <div key={index} className="skills-group">
                            <h3>{cat.name}</h3>
                            <ul className="skill-list">
                                {cat.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .skills-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                    gap: 30px; 
                    margin-top: 40px;
                    width: 100%;
                }
                .skills-group { 
                    background: var(--card-bg); 
                    border: 1px solid var(--border-color); 
                    padding: 32px; 
                    border-radius: 24px; 
                    transition: var(--transition);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .skills-group:hover { 
                    border-color: var(--primary); 
                    transform: translateY(-5px); 
                    box-shadow: 0 12px 30px rgba(56, 189, 248, 0.15);
                }
                .skills-group h3 { 
                    font-size: 1.15rem; 
                    color: var(--primary); 
                    margin-bottom: 20px; 
                    font-weight: 700; 
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 10px;
                }
                .skill-list { 
                    list-style: none; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 12px; 
                }
                .skill-list li { 
                    color: var(--text-color); 
                    font-weight: 500; 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    font-size: 0.95rem; 
                    opacity: 0.9;
                }
                .skill-list li::before { 
                    content: '→'; 
                    color: var(--primary); 
                    font-weight: bold; 
                }

                @media (max-width: 600px) {
                    .skills-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .skills-group { padding: 24px 20px; border-radius: 20px; }
                }
            `}</style>
        </section>
    );
};

export default Skills;
