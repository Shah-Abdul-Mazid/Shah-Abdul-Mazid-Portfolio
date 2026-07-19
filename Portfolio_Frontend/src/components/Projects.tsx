import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import type { ProjectItem } from '../context/PortfolioContext';
import {
    ExternalLink,
    Search,
    Github,
    Briefcase,
    ChevronDown,
    FileText,
    Award,
} from 'lucide-react';
import { getPdfViewerUrl, isPdfUrl } from '../utils/filePreview';

type BucketPrefix = 'active' | 'complete' | 'funded';

const Projects = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const projects = data.projects || [];

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        'active-0': true,
    });

    const location = useLocation();

    const activeProjects   = projects.filter((p) => p.category === 'active' || !p.category);
    const completeProjects = projects.filter((p) => p.category === 'past');
    const fundedProjects   = projects.filter((p) => p.category === 'funded');


    const toggleExpand = (key: string) => {
        setExpanded((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const getStatus = (project: ProjectItem, bucket: BucketPrefix): { label: string; className: string } => {
        if (project.status) {
            const s = project.status.toUpperCase();
            if (s === 'ACTIVE')  return { label: 'ACTIVE',  className: 'active' };
            if (s === 'FUNDED')  return { label: 'FUNDED',  className: 'funded' };
            if (s === 'COMPLETE' || s === 'COMPLETED' || s === 'PAST') return { label: 'COMPLETE', className: 'past' };
        }

        if (bucket === 'active')  return { label: 'ACTIVE',  className: 'active' };
        if (bucket === 'funded')  return { label: 'FUNDED',  className: 'funded' };
        return { label: 'COMPLETE', className: 'past' };
    };

    const getDotColor = (tag: string) => {
        const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
        let hash = 0;
        for (let i = 0; i < tag.length; i++) {
            hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const dotColor = (bucket: BucketPrefix) => {
        if (bucket === 'active')  return { dot: '#10b981', rail: 'rgba(16,185,129,0.4)' };
        if (bucket === 'funded')  return { dot: '#a78bfa', rail: 'rgba(167,139,250,0.4)' };
        return { dot: '#f59e0b', rail: 'rgba(245,158,11,0.4)' };
    };

    const renderProjectList = (projectList: ProjectItem[], prefix: BucketPrefix) => {
        const colors = dotColor(prefix);
        return (
            <div className="proj-timeline" style={{ '--dot-color': colors.dot, '--rail-color': colors.rail } as React.CSSProperties}>
                {projectList.map((project, index) => {
                    const key = `${prefix}-${index}`;
                    const isExpanded = !!expanded[key];
                    const { label: statusLabel, className: statusClass } = getStatus(project, prefix);

                    return (
                        <div key={key} id={`project-${key}`} className={`proj-entry ${isExpanded ? 'expanded' : ''}`}>
                            {/* Timeline dot */}
                            <div className="proj-dot-wrap">
                                <div className="proj-dot">
                                    <div className="proj-dot-inner" />
                                </div>
                            </div>

                            {/* Card */}
                            <div className="proj-card">
                                {/* Clickable header */}
                                <div className="proj-card-header" onClick={() => toggleExpand(key)}>
                                    <div className="proj-header-main">
                                        {project.period && (
                                            <span className="proj-year">{project.period}</span>
                                        )}
                                        <h3 className="proj-title">{project.title}</h3>
                                        {project.institution && (
                                            <p className="proj-institution">
                                                <Briefcase size={12} className="meta-icon" />
                                                {project.institution}
                                            </p>
                                        )}
                                    </div>
                                    <div className="proj-header-right">
                                        <span className={`status-badge ${statusClass}`}>
                                            {statusClass === 'active' && <span className="status-dot" />}
                                            {statusLabel}
                                        </span>
                                        <ChevronDown size={16} className="chevron-icon" />
                                    </div>
                                </div>

                                {/* Expandable detail */}
                                <div className="proj-card-body">
                                    <div className="proj-card-inner">
                                        <p className="project-desc-text">{project.desc}</p>
                                        {project.details && <p className="project-details-text">{project.details}</p>}

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
                                                {(project.tags || []).map((tag, tIdx) => (
                                                    <span key={tIdx} className="dot-tag">
                                                        <span className="tag-dot" style={{ backgroundColor: getDotColor(tag) }} />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="project-actions-row">
                                            {project.githubUrl && (
                                                <a href={resolveUrl(project.githubUrl)} target="_blank" rel="noopener noreferrer" className="project-action-btn github-btn">
                                                    <Github size={14} /> GitHub
                                                </a>
                                            )}
                                            {project.projectUrl && (
                                                <a href={resolveUrl(project.projectUrl)} target="_blank" rel="noopener noreferrer" className="project-action-btn live-btn">
                                                    <ExternalLink size={14} /> Live Demo
                                                </a>
                                            )}
                                            {project.certificateUrl && (
                                                <button onClick={() => setSelectedFile(resolveUrl(project.certificateUrl))} className="project-action-btn cert-btn">
                                                    <Search size={14} /> Certificate
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const projectTitle = params.get('project');
        if (!projectTitle) return;

  
        const expandByKeyScheme = (list: ProjectItem[], prefix: BucketPrefix) => {
            const idx = list.findIndex((p) => p.title.toLowerCase() === projectTitle.toLowerCase());
            if (idx === -1) return false;

            const key = `${prefix}-${idx}`;
            setExpanded((prev) => ({ ...prev, [key]: true }));

            setTimeout(() => {
                const el = document.getElementById(`project-${key}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);

            return true;
        };

        if (expandByKeyScheme(activeProjects, 'active')) return;
        if (expandByKeyScheme(completeProjects, 'complete')) return;
        expandByKeyScheme(fundedProjects, 'funded');
    }, [location.search, activeProjects, completeProjects, fundedProjects]);


    return (
        <section id="projects" className="project-list-section alt-bg">
            <div className="projects-container">
                <div className="projects-header fade-in" ref={addToRefs}>
                    <h2 className="projects-title">
                        {data.sections?.projects?.title ? (
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: data.sections.projects.title.replace(
                                        /(\S+)$/,
                                        '<span class="gradient-text">$1</span>'
                                    ),
                                }}
                            />
                        ) : (
                            <>
                                Research <span className="gradient-text">Projects</span>
                            </>
                        )}
                    </h2>
                    <p className="projects-subtitle">
                        {data.sections?.projects?.subtitle ||
                            'Click any project to expand details. Funded projects and active research initiatives.'}
                    </p>
                </div>

                {activeProjects.length > 0 && (
                    <div className="project-group">
                        <div className="group-header">
                            <h3 className="group-title">🟢 Active Projects</h3>
                            <span className="group-date-badge badge-active">{activeProjects.length} Active</span>
                        </div>
                        {renderProjectList(activeProjects, 'active')}
                    </div>
                )}

                {completeProjects.length > 0 && (
                    <div className="project-group">
                        <div className="group-header">
                            <h3 className="group-title">🟡 Complete / Past Projects</h3>
                            <span className="group-date-badge badge-past">{completeProjects.length} Complete</span>
                        </div>
                        {renderProjectList(completeProjects, 'complete')}
                    </div>
                )}

                {fundedProjects.length > 0 && (
                    <div className="project-group">
                        <div className="group-header">
                            <h3 className="group-title">🟣 Funded Projects</h3>
                            <span className="group-date-badge badge-funded">{fundedProjects.length} Funded</span>
                        </div>
                        {renderProjectList(fundedProjects, 'funded')}
                    </div>
                )}
            </div>

            {selectedFile && (
                <div className="image-modal-overlay" onClick={() => setSelectedFile(null)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedFile(null)}>
                            ✖
                        </button>
                        {isPdfUrl(selectedFile) ? (
                            <iframe src={getPdfViewerUrl(selectedFile)} className="pdf-viewer" title="Document Viewer" />
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

                .project-group { 
                    margin-bottom: 56px; 
                }
                .group-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    border-bottom: 1px solid var(--border-color); 
                    padding-bottom: 12px; 
                    margin-bottom: 32px; 
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
                .group-date-badge.badge-active {
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.08);
                }
                .dark-mode .group-date-badge.badge-active {
                    background: rgba(16, 185, 129, 0.18);
                }
                .group-date-badge.badge-past {
                    color: #f59e0b;
                    background: rgba(245, 158, 11, 0.08);
                }
                .dark-mode .group-date-badge.badge-past {
                    background: rgba(245, 158, 11, 0.18);
                }
                .group-date-badge.badge-funded {
                    color: #a78bfa;
                    background: rgba(139, 92, 246, 0.1);
                }
                .dark-mode .group-date-badge.badge-funded {
                    background: rgba(139, 92, 246, 0.2);
                }

                /* ===== Timeline ===== */
                .proj-timeline {
                    position: relative;
                    padding-left: 44px;
                }
                .proj-timeline::before {
                    content: '';
                    position: absolute;
                    left: 10px;
                    top: 8px;
                    bottom: 0;
                    width: 2px;
                    background: linear-gradient(to bottom, var(--rail-color, rgba(139,92,246,0.4)), transparent);
                    border-radius: 2px;
                }

                /* Entry row */
                .proj-entry {
                    position: relative;
                    margin-bottom: 20px;
                }
                .proj-entry:last-child { margin-bottom: 0; }

                /* Dot */
                .proj-dot-wrap {
                    position: absolute;
                    left: -44px;
                    top: 18px;
                    width: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                }
                .proj-dot {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid var(--dot-color, #a78bfa);
                    background: rgba(139,92,246,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .proj-entry.expanded .proj-dot {
                    transform: scale(1.25);
                    box-shadow: 0 0 0 4px rgba(139,92,246,0.15);
                }
                .proj-dot-inner {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--dot-color, #a78bfa);
                    transition: transform 0.2s;
                }

                /* Card */
                .proj-card {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                .proj-card:hover {
                    border-color: var(--dot-color, var(--primary));
                    transform: translateX(4px);
                    box-shadow: 0 8px 28px rgba(139,92,246,0.08);
                }
                .proj-entry.expanded .proj-card {
                    border-color: var(--dot-color, var(--primary));
                    box-shadow: 0 8px 28px rgba(139,92,246,0.1);
                }

                /* Card header (always visible) */
                .proj-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 20px 24px;
                    cursor: pointer;
                    user-select: none;
                    gap: 16px;
                }
                .proj-header-main {
                    flex: 1;
                    min-width: 0;
                }
                .proj-year {
                    display: inline-block;
                    font-size: 0.78rem;
                    font-weight: 800;
                    color: var(--dot-color, var(--primary));
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                }
                .proj-title {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--text-color);
                    margin: 0 0 5px 0;
                    line-height: 1.35;
                    transition: color 0.2s;
                }
                .proj-card:hover .proj-title { color: var(--dot-color, var(--primary)); }
                .proj-entry.expanded .proj-title { color: var(--dot-color, var(--primary)); }

                .proj-institution {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin: 0;
                }
                .proj-header-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-shrink: 0;
                    padding-top: 2px;
                }

                /* Collapsible body */
                .proj-card-body {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .proj-entry.expanded .proj-card-body {
                    max-height: 900px;
                }
                .proj-card-inner {
                    padding: 0 24px 24px 24px;
                    border-top: 1px solid var(--border-color);
                }

                /* chevron */
                .chevron-icon {
                    color: var(--text-secondary);
                    opacity: 0.8;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    flex-shrink: 0;
                }
                .proj-entry.expanded .chevron-icon {
                    transform: rotate(180deg);
                    color: var(--dot-color, var(--primary));
                    opacity: 1;
                }

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
                .status-badge.funded {
                    background: rgba(139, 92, 246, 0.1);
                    color: #a78bfa;
                }
                .dark-mode .status-badge.funded {
                    background: rgba(139, 92, 246, 0.2);
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

