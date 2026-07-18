import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import type { ProjectItem } from '../context/PortfolioContext';
import { ExternalLink, Search, Github, Calendar, Briefcase, ChevronDown, FileText, Award } from 'lucide-react';
import { isPdfUrl, getPdfViewerUrl } from '../utils/filePreview';

const Projects = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const projects = data.projects || [];
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        'active-0': true // Open the first active project by default as in the screenshot
    });

    const location = useLocation();

    // Filter projects into active and past/funded categories
    const activeProjects = projects.filter(p => p.category !== 'past');
    const pastProjects = projects.filter(p => p.category === 'past');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const projectTitle = params.get('project');
        if (projectTitle) {
            // Check active projects
            const activeIdx = activeProjects.findIndex(p => p.title.toLowerCase() === projectTitle.toLowerCase());
            if (activeIdx !== -1) {
                const key = `active-${activeIdx}`;
                setExpanded(prev => ({ ...prev, [key]: true }));
                setTimeout(() => {
                    const el = document.getElementById(`project-${key}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
                return;
            }
            // Check past projects
            const pastIdx = pastProjects.findIndex(p => p.title.toLowerCase() === projectTitle.toLowerCase());
            if (pastIdx !== -1) {
                const key = `past-${pastIdx}`;
                setExpanded(prev => ({ ...prev, [key]: true }));
                setTimeout(() => {
                    const el = document.getElementById(`project-${key}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }, [location.search, projects]);

    const toggleExpand = (key: string) => {
        setExpanded(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Helper to generate dynamic colors for tags
    const getDotColor = (tag: string) => {
        const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
        let hash = 0;
        for (let i = 0; i < tag.length; i++) {
            hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const renderProjectList = (projectList: ProjectItem[], prefix: string) => {
        return projectList.map((project, index) => {
            const key = `${prefix}-${index}`;
            const isExpanded = !!expanded[key];
            const isProjectActive = project.category !== 'past';
            const statusLabel = project.status || (isProjectActive ? 'ACTIVE' : 'COMPLETED');
            const statusClass = statusLabel.toUpperCase() === 'ACTIVE' ? 'active' : 'past';

            return (
                <div 
                    key={key} 
                    id={`project-${key}`}
                    className={`project-item-card ${isExpanded ? 'expanded' : ''}`}
                >
                    {/* Header: Always visible */}
                    <div 
                        className="project-item-header" 
                        onClick={() => toggleExpand(key)}
                    >
                        <div className="project-header-left">
                            <h3 className="project-item-title">{project.title}</h3>
                            <div className="project-meta-row">
                                {project.period && (
                                    <div className="project-meta-item">
                                        <Calendar size={13} className="meta-icon" />
                                        <span>{project.period}</span>
                                    </div>
                                )}
                                {project.institution && (
                                    <div className="project-meta-item">
                                        <Briefcase size={13} className="meta-icon" />
                                        <span>{project.institution}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="project-header-right">
                            <span className={`status-badge ${statusClass}`}>
                                {statusClass === 'active' && <span className="status-dot"></span>}
                                {statusLabel}
                            </span>
                            <ChevronDown size={18} className="chevron-icon" />
                        </div>
                    </div>

                    {/* Content: Visible when expanded */}
                    <div className="project-item-content">
                        <div className="project-content-inner">
                            {/* Main description */}
                            <p className="project-desc-text">{project.desc}</p>
                            
                            {/* Detailed key research components / details */}
                            {project.details && (
                                <p className="project-details-text">{project.details}</p>
                            )}

                            {/* Metadata row: Ref, Funding Org & Tags */}
                            <div className="project-expanded-metadata">
                                {project.refCode && (
                                    <div className="metadata-badge ref-code">
                                        <FileText size={12} />
                                        <span>{project.refCode}</span>
                                    </div>
                                )}
                                {project.fundingOrg && (
                                    <div className="metadata-badge funding-org">
                                        <Award size={12} />
                                        <span>{project.fundingOrg}</span>
                                    </div>
                                )}
                                <div className="project-expanded-tags">
                                    {project.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className="dot-tag">
                                            <span className="tag-dot" style={{ backgroundColor: getDotColor(tag) }}></span>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Links/Actions */}
                            <div className="project-actions-row">
                                {project.githubUrl && (
                                    <a 
                                        href={resolveUrl(project.githubUrl)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="project-action-btn github-btn"
                                    >
                                        <Github size={14} />
                                        GitHub
                                    </a>
                                )}
                                {project.projectUrl && (
                                    <a 
                                        href={resolveUrl(project.projectUrl)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="project-action-btn live-btn"
                                    >
                                        <ExternalLink size={14} />
                                        Live Demo
                                    </a>
                                )}
                                {project.certificateUrl && (
                                    <button 
                                        onClick={() => setSelectedFile(resolveUrl(project.certificateUrl))}
                                        className="project-action-btn cert-btn"
                                    >
                                        <Search size={14} />
                                        Certificate
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <section id="projects" className="project-list-section alt-bg">
            <div className="projects-container">
                {/* Title and Subtitle */}
                <div className="projects-header fade-in" ref={addToRefs}>
                    <h2 className="projects-title">
                        {data.sections?.projects?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.projects.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Research <span className="gradient-text">Projects</span></>
                        )}
                    </h2>
                    <p className="projects-subtitle">
                        {data.sections?.projects?.subtitle || 'Click any project to expand details. Funded projects and active research initiatives.'}
                    </p>
                </div>

                {/* Active Projects Group */}
                {activeProjects.length > 0 && (
                    <div className="project-group fade-in" ref={addToRefs}>
                        <div className="group-header">
                            <h3 className="group-title">Active Projects</h3>
                            <span className="group-date-badge">2025 – Present</span>
                        </div>
                        <div className="group-list">
                            {renderProjectList(activeProjects, 'active')}
                        </div>
                    </div>
                )}

                {/* Past & EU-Funded Projects Group */}
                {pastProjects.length > 0 && (
                    <div className="project-group fade-in" ref={addToRefs}>
                        <div className="group-header">
                            <h3 className="group-title">Past & EU-Funded Projects</h3>
                        </div>
                        <div className="group-list">
                            {renderProjectList(pastProjects, 'past')}
                        </div>
                    </div>
                )}
            </div>

            {/* Certificate/Document Lightbox Modal */}
            {selectedFile && (
                <div className="image-modal-overlay" onClick={() => setSelectedFile(null)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedFile(null)}>✖</button>
                        {isPdfUrl(selectedFile) ? (
                            <iframe 
                                src={getPdfViewerUrl(selectedFile)} 
                                className="pdf-viewer" 
                                title="Document Viewer" 
                            />
                        ) : (
                            <img src={selectedFile} alt="Full View" className="fullscreen-image" />
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .project-list-section { 
                    padding: 120px 0; 
                    background: var(--bg-color); 
                    min-height: 80vh; 
                }
                .projects-container { 
                    max-width: 960px; 
                    margin: 0 auto; 
                    padding: 0 24px; 
                }
                .projects-header { 
                    margin-bottom: 48px; 
                }
                .projects-title { 
                    font-family: 'Lora', 'Playfair Display', serif; 
                    font-size: 2.8rem; 
                    font-weight: 600; 
                    color: var(--text-color); 
                    margin-bottom: 8px; 
                }
                .projects-subtitle { 
                    font-size: 1.05rem; 
                    color: var(--text-secondary); 
                    line-height: 1.5; 
                }
                
                /* Group Styles */
                .project-group { 
                    margin-bottom: 48px; 
                }
                .group-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    border-bottom: 1px solid var(--border-color); 
                    padding-bottom: 12px; 
                    margin-bottom: 24px; 
                }
                .group-title { 
                    font-family: 'Lora', 'Playfair Display', serif; 
                    font-size: 1.5rem; 
                    font-weight: 600; 
                    color: var(--text-color); 
                    margin: 0;
                }
                .group-date-badge { 
                    font-size: 0.8rem; 
                    font-weight: 700; 
                    color: #f97316; 
                    background: rgba(249, 115, 22, 0.08); 
                    padding: 4px 12px; 
                    border-radius: 100px; 
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .dark-mode .group-date-badge {
                    background: rgba(249, 115, 22, 0.15); 
                }
                
                /* Project Cards */
                .project-item-card { 
                    background: var(--card-bg); 
                    border: 1px solid var(--border-color); 
                    border-radius: 16px; 
                    margin-bottom: 16px; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                    overflow: hidden; 
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02); 
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                .project-item-card:hover { 
                    transform: translateY(-2px); 
                    border-color: var(--primary); 
                    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.06); 
                }
                .project-item-card.expanded {
                    border-color: var(--primary);
                    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.08);
                }

                .project-item-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 24px; 
                    cursor: pointer; 
                    user-select: none; 
                }
                .project-header-left { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 8px; 
                    flex: 1;
                    padding-right: 16px;
                }
                .project-item-title { 
                    font-size: 1.25rem; 
                    font-weight: 700; 
                    color: var(--text-color); 
                    line-height: 1.4; 
                    margin: 0;
                    transition: color 0.2s; 
                }
                .project-item-card:hover .project-item-title { 
                    color: var(--primary); 
                }
                .project-meta-row { 
                    display: flex; 
                    gap: 16px; 
                    align-items: center; 
                    font-size: 0.85rem; 
                    color: var(--text-secondary); 
                    flex-wrap: wrap;
                }
                .project-meta-item { 
                    display: flex; 
                    align-items: center; 
                    gap: 6px; 
                }
                .meta-icon {
                    color: var(--text-secondary);
                    opacity: 0.7;
                }

                .project-header-right { 
                    display: flex; 
                    align-items: center; 
                    gap: 16px; 
                }
                
                /* Badges */
                .status-badge { 
                    font-size: 0.7rem; 
                    font-weight: 750; 
                    text-transform: uppercase; 
                    letter-spacing: 0.08em; 
                    padding: 5px 12px; 
                    border-radius: 100px; 
                    display: inline-flex; 
                    align-items: center; 
                    gap: 5px; 
                    white-space: nowrap;
                }
                .status-badge.active { 
                    background: rgba(16, 185, 129, 0.08); 
                    color: #10b981; 
                }
                .dark-mode .status-badge.active {
                    background: rgba(16, 185, 129, 0.15); 
                }
                .status-badge.past { 
                    background: rgba(245, 158, 11, 0.08); 
                    color: #f59e0b; 
                }
                .dark-mode .status-badge.past {
                    background: rgba(245, 158, 11, 0.15); 
                }
                .status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #10b981;
                    display: inline-block;
                }

                .chevron-icon { 
                    color: var(--text-secondary); 
                    opacity: 0.8;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                }
                .project-item-card.expanded .chevron-icon { 
                    transform: rotate(180deg); 
                    color: var(--primary);
                }

                /* Expanded Area Accordion */
                .project-item-content { 
                    max-height: 0; 
                    overflow: hidden; 
                    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
                }
                .project-item-card.expanded .project-item-content { 
                    max-height: 800px; 
                }
                .project-content-inner { 
                    padding: 0 24px 24px 24px; 
                    border-top: 1px solid var(--border-color); 
                }

                .project-desc-text {
                    font-size: 1rem;
                    color: var(--text-color);
                    opacity: 0.9;
                    line-height: 1.6;
                    margin: 20px 0 12px 0;
                }
                
                .project-details-text {
                    font-size: 0.92rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin: 0 0 20px 0;
                }

                /* Metadata badge & tags */
                .project-expanded-metadata {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    align-items: center;
                    margin: 20px 0;
                    padding: 16px 0;
                    border-top: 1px dashed var(--border-color);
                    border-bottom: 1px dashed var(--border-color);
                }
                .metadata-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.82rem;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-weight: 500;
                }
                .metadata-badge.ref-code {
                    background: rgba(100, 116, 139, 0.05);
                    color: var(--text-secondary);
                    border: 1px solid rgba(100, 116, 139, 0.1);
                }
                .metadata-badge.funding-org {
                    background: rgba(249, 115, 22, 0.05);
                    color: #f97316;
                    border: 1px solid rgba(249, 115, 22, 0.1);
                }
                .project-expanded-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-left: auto;
                }
                .dot-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    padding: 4px 10px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--border-color);
                    border-radius: 100px;
                    white-space: nowrap;
                }
                .tag-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    display: inline-block;
                }

                /* Actions/Links row */
                .project-actions-row {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .project-action-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 18px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    border-radius: 8px;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                .project-action-btn.github-btn {
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--text-color);
                    border-color: var(--border-color);
                }
                .project-action-btn.github-btn:hover {
                    background: #24292e;
                    color: white;
                    border-color: #24292e;
                }
                .project-action-btn.live-btn {
                    background: var(--primary);
                    color: white;
                }
                .project-action-btn.live-btn:hover {
                    background: #7c3aed;
                }
                .project-action-btn.cert-btn {
                    background: rgba(139, 92, 246, 0.05);
                    color: var(--primary);
                    border-color: rgba(139, 92, 246, 0.2);
                }
                .project-action-btn.cert-btn:hover {
                    background: rgba(139, 92, 246, 0.1);
                    border-color: var(--primary);
                }

                /* Modal styling */
                .image-modal-overlay { 
                    position: fixed; 
                    inset: 0; 
                    background: rgba(3,7,18,0.9); 
                    z-index: 9999; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    backdrop-filter: blur(8px); 
                    padding: 40px; 
                }
                .image-modal-content { 
                    position: relative; 
                    max-width: 900px; 
                    width: 100%; 
                    max-height: 85vh; 
                    background: #0f172a; 
                    border-radius: 12px; 
                    padding: 10px; 
                    border: 1px solid rgba(255,255,255,0.1); 
                }
                .close-modal-btn { 
                    position: absolute; 
                    top: -12px; 
                    right: -12px; 
                    width: 28px; 
                    height: 28px; 
                    background: #ef4444; 
                    color: white; 
                    border: none; 
                    border-radius: 50%; 
                    font-size: 12px; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    z-index: 10000; 
                }
                .fullscreen-image { 
                    width: 100%; 
                    height: 100%; 
                    max-height: calc(85vh - 20px); 
                    object-fit: contain; 
                }
                .pdf-viewer { 
                    width: 100%; 
                    height: calc(85vh - 20px); 
                    border: none; 
                    border-radius: 6px; 
                    background: white; 
                }

                @media (max-width: 768px) {
                    .projects-title { font-size: 2.2rem; }
                    .project-item-header { padding: 20px; }
                    .project-content-inner { padding: 0 20px 20px 20px; }
                    .project-expanded-metadata { flex-direction: column; align-items: flex-start; }
                    .project-expanded-tags { margin-left: 0; }
                }
            `}</style>
        </section>
    );
};

export default Projects;
