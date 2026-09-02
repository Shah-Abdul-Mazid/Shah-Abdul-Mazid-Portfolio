import { useState, useMemo } from 'react';
import { usePortfolio, type PaperItem } from '../context/PortfolioContext';
import { Search, GraduationCap, Quote, Copy, Check, X } from 'lucide-react';

type FilterType = 'journal' | 'conference' | 'book-chapter' | null;

const SCHOLAR_URL = 'https://scholar.google.com/citations?user=TYkiwUgAAAAJ';

const highlightAuthors = (authorsStr: string) => {
    if (!authorsStr) return null;
    const targets = [
        'Mohammad Rifat Ahmmad Rashid',
        'Rashid, M.R.A.',
        'Rashid, M.R.',
        'Shah Abdul Mazid',
        'Mazid, S.A.',
        'Rashid, M. R. A.'
    ];

    const pattern = new RegExp(`(${targets.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = authorsStr.split(pattern);

    return parts.map((part, index) => {
        const isMatched = targets.some(t => t.toLowerCase() === part.toLowerCase());
        if (isMatched) {
            return <strong key={index} className="pub-author-bold">{part}</strong>;
        }
        return part;
    });
};

const generateBibtex = (paper: PaperItem): string => {
    if (paper.bibtex) return paper.bibtex;

    const firstAuthor = paper.authors.split(',')[0].trim().split(' ').pop() || 'author';
    const cleanYear = paper.year || '2025';
    const firstWord = paper.title.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const citeKey = `${firstAuthor.toLowerCase()}${cleanYear}${firstWord}`;

    const bibType = paper.type === 'conference' ? 'inproceedings' :
                    paper.type === 'book-chapter' ? 'inbook' : 'article';

    const venueField = paper.type === 'conference' ? `  booktitle={${paper.venue}},` :
                       paper.type === 'book-chapter' ? `  booktitle={${paper.venue}},` :
                       `  journal={${paper.venue}},`;

    const lines = [
        `@${bibType}{${citeKey},`,
        `  title={${paper.title}},`,
        `  author={${paper.authors}},`,
        venueField,
        paper.publisher ? `  publisher={${paper.publisher}},` : null,
        `  year={${paper.year}}` + (paper.doi ? ',' : ''),
        paper.doi ? `  doi={${paper.doi}}` : null,
        `}`
    ].filter(Boolean);

    return lines.join('\n');
};

const Papers = ({ addToRefs }: { addToRefs?: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const papers = data.papers || [];

    const [filter, setFilter] = useState<FilterType>('journal');
    const [search, setSearch] = useState('');
    const [activeBibtexPaper, setActiveBibtexPaper] = useState<PaperItem | null>(null);
    const [copied, setCopied] = useState(false);

    const counts = useMemo(() => ({
        journal: papers.filter(p => (p.type || 'journal') === 'journal').length,
        conference: papers.filter(p => p.type === 'conference').length,
        'book-chapter': papers.filter(p => p.type === 'book-chapter').length,
    }), [papers]);

    const filtered = useMemo(() => {
        let list = filter ? papers.filter(p => (p.type || 'journal') === filter) : papers;
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.authors.toLowerCase().includes(q) ||
                (p.venue || '').toLowerCase().includes(q) ||
                (p.publisher || '').toLowerCase().includes(q)
            );
        }
        return list;
    }, [papers, filter, search]);

    const TYPE_LABELS: Record<string, string> = {
        journal: 'journal articles',
        conference: 'conference papers',
        'book-chapter': 'book chapters',
    };

    const handleCopyBibtex = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="papers" className="pub-section">
            <div className="pub-container" ref={addToRefs}>
                {/* Header */}
                <div className="pub-header">
                    <h1 className="pub-page-title">Publications</h1>
                    <p className="pub-page-sub">Journal articles, book chapters, and conference papers.</p>
                </div>

                {/* Google Scholar Banner */}
                <a href={SCHOLAR_URL} target="_blank" rel="noopener noreferrer" className="scholar-banner">
                    <GraduationCap size={20} className="scholar-icon" />
                    <span>Full citation list on</span>
                    <span className="scholar-link-text">Google Scholar</span>
                </a>

                {/* Search Bar */}
                <div className="pub-search-wrap">
                    <Search size={16} className="pub-search-icon" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search publications by title, author, or journal..."
                        className="pub-search-input"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="pub-tabs">
                    <button
                        className={`pub-tab ${filter === 'journal' ? 'active' : ''}`}
                        onClick={() => setFilter('journal')}
                    >
                        Journal <span className="tab-count">{counts.journal}</span>
                    </button>
                    <button
                        className={`pub-tab ${filter === 'book-chapter' ? 'active' : ''}`}
                        onClick={() => setFilter('book-chapter')}
                    >
                        Book Chapters <span className="tab-count">{counts['book-chapter']}</span>
                    </button>
                    <button
                        className={`pub-tab ${filter === 'conference' ? 'active' : ''}`}
                        onClick={() => setFilter('conference')}
                    >
                        Conference <span className="tab-count">{counts.conference}</span>
                    </button>
                </div>

                {/* Article Count Header */}
                <div className="pub-count-header">
                    <span className="pub-count-num">{filtered.length}</span>
                    <span className="pub-count-label">{TYPE_LABELS[filter || 'journal'] || 'publications'}</span>
                </div>

                {/* Publication Cards List */}
                {filtered.length === 0 ? (
                    <div className="pub-empty">No publications match your search.</div>
                ) : (
                    <div className="pub-cards-list">
                        {filtered.map((paper, idx) => {
                            const href = paper.link ||
                                (paper.doi
                                    ? (paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`)
                                    : undefined);
                            const journalText = [paper.venue, paper.publisher].filter(Boolean).join(', ');

                            return (
                                <div key={idx} className="pub-item-card">
                                    <div className="pub-year-badge-col">
                                        <span className="pub-year-badge">{paper.year}</span>
                                    </div>
                                    <div className="pub-body-col">
                                        <div className="pub-title">
                                            {href ? (
                                                <a href={href} target="_blank" rel="noopener noreferrer" className="pub-title-link">
                                                    {paper.title}
                                                </a>
                                            ) : (
                                                <span className="pub-title-text">{paper.title}</span>
                                            )}
                                        </div>
                                        <div className="pub-authors">
                                            {highlightAuthors(paper.authors)}
                                        </div>
                                        <div className="pub-card-footer">
                                            {journalText && (
                                                <div className="pub-journal">
                                                    {href ? (
                                                        <a href={href} target="_blank" rel="noopener noreferrer" className="pub-journal-link">
                                                            {journalText}
                                                        </a>
                                                    ) : (
                                                        <span>{journalText}</span>
                                                    )}
                                                </div>
                                            )}
                                            <button
                                                className="cite-btn"
                                                onClick={() => setActiveBibtexPaper(paper)}
                                                title="Cite as BibTeX"
                                            >
                                                <Quote size={13} />
                                                <span>Cite</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* BibTeX Citation Modal */}
            {activeBibtexPaper && (
                <div className="bibtex-modal-overlay" onClick={() => setActiveBibtexPaper(null)}>
                    <div className="bibtex-modal-box" onClick={e => e.stopPropagation()}>
                        <div className="bibtex-modal-header">
                            <div className="bibtex-modal-title">
                                <Quote size={18} className="bibtex-modal-icon" />
                                <span>BibTeX Citation</span>
                            </div>
                            <button className="bibtex-modal-close" onClick={() => setActiveBibtexPaper(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="bibtex-modal-body">
                            <p className="bibtex-paper-name">{activeBibtexPaper.title}</p>
                            <pre className="bibtex-code-block">
                                <code>{generateBibtex(activeBibtexPaper)}</code>
                            </pre>
                        </div>
                        <div className="bibtex-modal-footer">
                            <button
                                className={`copy-bibtex-btn ${copied ? 'copied' : ''}`}
                                onClick={() => handleCopyBibtex(generateBibtex(activeBibtexPaper))}
                            >
                                {copied ? <Check size={15} /> : <Copy size={15} />}
                                <span>{copied ? 'Copied to Clipboard!' : 'Copy BibTeX'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .pub-section {
                    min-height: 100vh;
                    padding-top: 130px;
                    padding-bottom: 80px;
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    background: var(--bg-color, #fafafa);
                }

                .pub-container {
                    max-width: 920px;
                    width: 100%;
                    padding: 0 24px;
                    margin: 0 auto;
                }

                /* Header */
                .pub-header {
                    margin-bottom: 28px;
                }
                .pub-page-title {
                    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
                    font-size: 2.2rem;
                    font-weight: 700;
                    color: var(--text-color, #1e293b);
                    margin-bottom: 8px;
                    line-height: 1.25;
                }
                .pub-page-sub {
                    font-size: 0.98rem;
                    color: var(--text-secondary, #64748b);
                    line-height: 1.5;
                }

                /* Scholar Banner */
                .scholar-banner {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 20px;
                    border-radius: 12px;
                    background: rgba(249, 115, 22, 0.07);
                    border: 1px solid rgba(249, 115, 22, 0.25);
                    text-decoration: none;
                    color: var(--text-color, #334155);
                    font-size: 0.92rem;
                    margin-bottom: 24px;
                    transition: all 0.2s ease;
                }
                .scholar-banner:hover {
                    background: rgba(249, 115, 22, 0.12);
                    border-color: rgba(249, 115, 22, 0.4);
                }
                .scholar-icon {
                    color: #ea580c;
                    flex-shrink: 0;
                }
                .scholar-link-text {
                    color: #ea580c;
                    font-weight: 700;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }

                /* Search input */
                .pub-search-wrap {
                    position: relative;
                    margin-bottom: 20px;
                }
                .pub-search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary, #94a3b8);
                }
                .pub-search-input {
                    width: 100%;
                    padding: 13px 18px 13px 44px;
                    border: 1px solid var(--border-color, #e2e8f0);
                    border-radius: 12px;
                    background: var(--card-bg, #ffffff);
                    color: var(--text-color, #1e293b);
                    font-size: 0.92rem;
                    outline: none;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
                }
                .pub-search-input:focus {
                    border-color: #ea580c;
                    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.12);
                }

                /* Filter Tabs */
                .pub-tabs {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-bottom: 24px;
                }
                .pub-tab {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 18px;
                    border-radius: 10px;
                    border: 1px solid var(--border-color, #e2e8f0);
                    background: var(--card-bg, #ffffff);
                    color: var(--text-secondary, #64748b);
                    font-size: 0.88rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .pub-tab:hover {
                    border-color: #ea580c;
                    color: #ea580c;
                }
                .pub-tab.active {
                    background: rgba(249, 115, 22, 0.08);
                    border-color: #f97316;
                    color: #ea580c;
                    font-weight: 600;
                }
                .tab-count {
                    background: rgba(249, 115, 22, 0.15);
                    color: #ea580c;
                    font-size: 0.78rem;
                    font-weight: 700;
                    padding: 1px 8px;
                    border-radius: 100px;
                    min-width: 18px;
                    text-align: center;
                }
                .pub-tab.active .tab-count {
                    background: #ea580c;
                    color: #ffffff;
                }

                /* Count Header */
                .pub-count-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 20px;
                    font-size: 0.92rem;
                    color: var(--text-secondary, #64748b);
                }
                .pub-count-num {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: #ea580c;
                    color: #ffffff;
                    font-size: 0.8rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                /* Cards List */
                .pub-cards-list {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .pub-item-card {
                    display: flex;
                    gap: 20px;
                    padding: 22px 26px;
                    background: var(--card-bg, #ffffff);
                    border: 1px solid var(--border-color, #e2e8f0);
                    border-radius: 14px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.025);
                    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
                }
                .pub-item-card:hover {
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
                    border-color: rgba(249, 115, 22, 0.3);
                }

                .pub-year-badge-col {
                    flex-shrink: 0;
                    width: 50px;
                    padding-top: 2px;
                }
                .pub-year-badge {
                    font-size: 0.88rem;
                    font-weight: 700;
                    color: #ea580c;
                }

                .pub-body-col {
                    flex: 1;
                    min-width: 0;
                }

                .pub-title {
                    margin-bottom: 6px;
                    line-height: 1.4;
                }
                .pub-title-link {
                    font-size: 1.02rem;
                    font-weight: 600;
                    color: #ea580c;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }
                .pub-title-link:hover {
                    color: #c2410c;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }

                .pub-authors {
                    font-size: 0.88rem;
                    color: var(--text-secondary, #64748b);
                    margin-bottom: 8px;
                    line-height: 1.5;
                }
                .pub-author-bold {
                    font-weight: 700;
                    color: var(--text-color, #1e293b);
                }

                .pub-card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .pub-journal {
                    font-size: 0.85rem;
                    font-style: italic;
                    color: #4f46e5;
                    line-height: 1.4;
                }
                .pub-journal-link {
                    color: #4f46e5;
                    text-decoration: none;
                    font-style: italic;
                }

                .cite-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 10px;
                    border-radius: 6px;
                    border: 1px solid var(--border-color, #cbd5e1);
                    background: transparent;
                    color: var(--text-secondary, #64748b);
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .cite-btn:hover {
                    border-color: #ea580c;
                    color: #ea580c;
                    background: rgba(249, 115, 22, 0.05);
                }

                /* BibTeX Modal */
                .bibtex-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.65);
                    backdrop-filter: blur(4px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .bibtex-modal-box {
                    background: var(--card-bg, #ffffff);
                    border-radius: 16px;
                    max-width: 620px;
                    width: 100%;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.25);
                    overflow: hidden;
                    border: 1px solid var(--border-color, #e2e8f0);
                }
                .bibtex-modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--border-color, #e2e8f0);
                    background: rgba(249, 115, 22, 0.04);
                }
                .bibtex-modal-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #ea580c;
                }
                .bibtex-modal-close {
                    border: none;
                    background: transparent;
                    color: var(--text-secondary, #64748b);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 6px;
                }
                .bibtex-modal-close:hover {
                    color: var(--text-color, #1e293b);
                    background: rgba(0,0,0,0.05);
                }
                .bibtex-modal-body {
                    padding: 20px;
                }
                .bibtex-paper-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-color, #1e293b);
                    margin: 0 0 14px 0;
                    line-height: 1.4;
                }
                .bibtex-code-block {
                    background: #0f172a;
                    color: #f8fafc;
                    padding: 16px;
                    border-radius: 10px;
                    font-family: 'Fira Code', 'Courier New', monospace;
                    font-size: 0.82rem;
                    line-height: 1.5;
                    overflow-x: auto;
                    margin: 0;
                    white-space: pre-wrap;
                }
                .bibtex-modal-footer {
                    padding: 14px 20px;
                    border-top: 1px solid var(--border-color, #e2e8f0);
                    display: flex;
                    justify-content: flex-end;
                }
                .copy-bibtex-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 9px 18px;
                    border-radius: 8px;
                    border: none;
                    background: #ea580c;
                    color: #ffffff;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .copy-bibtex-btn:hover {
                    background: #c2410c;
                }
                .copy-bibtex-btn.copied {
                    background: #16a34a;
                }

                @media (max-width: 640px) {
                    .pub-section { padding-top: 110px; }
                    .pub-page-title { font-size: 1.8rem; }
                    .pub-item-card { padding: 16px 18px; gap: 12px; flex-direction: column; }
                    .pub-year-badge-col { width: auto; }
                    .pub-tabs { gap: 6px; }
                    .pub-tab { padding: 7px 12px; font-size: 0.82rem; }
                }
            `}</style>
        </section>
    );
};

export default Papers;
