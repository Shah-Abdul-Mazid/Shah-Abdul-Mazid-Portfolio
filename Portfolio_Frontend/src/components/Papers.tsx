import { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Search, BookOpen, ExternalLink } from 'lucide-react';

type FilterType = 'journal' | 'conference' | 'book-chapter' | null;



const SCHOLAR_URL = 'https://scholar.google.com/citations?user=TYkiwUgAAAAJ';

const Papers = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const papers = data.papers || [];

    const [filter, setFilter] = useState<FilterType>(null);
    const [search, setSearch] = useState('');

    const counts = useMemo(() => ({
        journal: papers.filter(p => p.type === 'journal').length,
        conference: papers.filter(p => p.type === 'conference').length,
        'book-chapter': papers.filter(p => p.type === 'book-chapter').length,
    }), [papers]);

    const filtered = useMemo(() => {
        let list = filter ? papers.filter(p => p.type === filter) : papers;
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.authors.toLowerCase().includes(q) ||
                (p.venue || '').toLowerCase().includes(q)
            );
        }
        return list;
    }, [papers, filter, search]);

    // Group by type label for section headings
    const grouped = useMemo(() => {
        if (filter) return { [filter]: filtered };
        const groups: Record<string, typeof filtered> = {};
        filtered.forEach(p => {
            const key = p.type || 'journal';
            if (!groups[key]) groups[key] = [];
            groups[key].push(p);
        });
        return groups;
    }, [filtered, filter]);

    const TYPE_LABELS: Record<string, string> = {
        journal: 'Journal Articles',
        conference: 'Conference Papers',
        'book-chapter': 'Book Chapters',
    };

    if (papers.length === 0) return null;

    return (
        <section id="papers" className="pub-section">
            <div className="pub-container" ref={addToRefs}>
                {/* Page Header */}
                <div className="pub-header">
                    <h1 className="pub-page-title">Publications</h1>
                    <p className="pub-page-sub">Journal articles, book chapters, and conference papers.</p>
                </div>

                {/* Google Scholar Banner */}
                <a href={SCHOLAR_URL} target="_blank" rel="noopener noreferrer" className="scholar-banner">
                    <BookOpen size={18} className="scholar-icon" />
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
                        placeholder="Search publications by title, author, or journal ..."
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

                {/* Publication Groups */}
                {filtered.length === 0 ? (
                    <div className="pub-empty">No publications found matching your search.</div>
                ) : (
                    Object.entries(grouped).map(([type, items]) => (
                        <div key={type} className="pub-group">
                            <div className="pub-group-header">
                                <span className="pub-group-badge">{items.length}</span>
                                <span className="pub-group-label">{TYPE_LABELS[type] || type}</span>
                            </div>
                            <div className="pub-list">
                                {items.map((paper, idx) => {
                                    const href = paper.link ||
                                        (paper.doi
                                            ? (paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`)
                                            : undefined);
                                    return (
                                        <div key={idx} className="pub-row">
                                            <div className="pub-year-col">
                                                <span className="pub-year">{paper.year}</span>
                                            </div>
                                            <div className="pub-details-col">
                                                {href ? (
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="pub-title-link"
                                                    >
                                                        {paper.title}
                                                        <ExternalLink size={13} className="pub-ext-icon" />
                                                    </a>
                                                ) : (
                                                    <span className="pub-title-link no-link">{paper.title}</span>
                                                )}

                                                <p className="pub-venue">
                                                    <em>{paper.venue}</em>
                                                    {paper.publisher && (
                                                        <span className="pub-publisher">, {paper.publisher}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .pub-section {
                    min-height: 100vh;
                    padding-top: 140px;
                    padding-bottom: 80px;
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }

                .pub-container {
                    max-width: 900px;
                    width: 100%;
                    padding: 0 24px;
                    margin: 0 auto;
                }

                /* Page header */
                .pub-header {
                    margin-bottom: 32px;
                }
                .pub-page-title {
                    font-family: 'Lora', 'Playfair Display', serif;
                    font-size: 2.6rem;
                    font-weight: 700;
                    color: var(--text-color);
                    margin-bottom: 10px;
                    line-height: 1.2;
                }
                .pub-page-sub {
                    font-size: 1rem;
                    color: var(--text-secondary);
                    line-height: 1.5;
                }

                /* Scholar Banner */
                .scholar-banner {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 20px;
                    border-radius: 12px;
                    background: rgba(249, 115, 22, 0.06);
                    border: 1px solid rgba(249, 115, 22, 0.25);
                    text-decoration: none;
                    color: var(--text-secondary);
                    font-size: 0.92rem;
                    margin-bottom: 24px;
                    transition: var(--transition);
                }
                .scholar-banner:hover {
                    background: rgba(249, 115, 22, 0.1);
                    border-color: rgba(249, 115, 22, 0.5);
                }
                .scholar-icon {
                    color: #f97316;
                    flex-shrink: 0;
                }
                .scholar-link-text {
                    color: #f97316;
                    font-weight: 700;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }

                /* Search */
                .pub-search-wrap {
                    position: relative;
                    margin-bottom: 20px;
                }
                .pub-search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                    opacity: 0.6;
                }
                .pub-search-input {
                    width: 100%;
                    padding: 12px 16px 12px 42px;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    background: var(--card-bg);
                    color: var(--text-color);
                    font-size: 0.92rem;
                    outline: none;
                    transition: var(--transition);
                    box-sizing: border-box;
                }
                .pub-search-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
                }
                .pub-search-input::placeholder {
                    color: var(--text-secondary);
                    opacity: 0.6;
                }

                /* Filter Tabs */
                .pub-tabs {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-bottom: 40px;
                }
                .pub-tab {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 7px 16px;
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                    background: transparent;
                    color: var(--text-secondary);
                    font-size: 0.88rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                }
                .pub-tab:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                    background: rgba(56, 189, 248, 0.04);
                }
                .pub-tab.active {
                    background: rgba(56, 189, 248, 0.08);
                    border-color: var(--primary);
                    color: var(--primary);
                    font-weight: 600;
                }
                .tab-count {
                    background: var(--primary);
                    color: #fff;
                    font-size: 0.72rem;
                    font-weight: 700;
                    padding: 1px 7px;
                    border-radius: 100px;
                    min-width: 20px;
                    text-align: center;
                }
                .pub-tab:not(.active) .tab-count {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                }

                /* Group header */
                .pub-group {
                    margin-bottom: 48px;
                }
                .pub-group-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--border-color);
                }
                .pub-group-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: #f97316;
                    color: #fff;
                    font-size: 0.75rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                .pub-group-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    letter-spacing: 0.02em;
                    text-transform: lowercase;
                }

                /* Publication list */
                .pub-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                .pub-row {
                    display: flex;
                    gap: 20px;
                    padding: 20px 0;
                    border-bottom: 1px solid var(--border-color);
                    transition: background 0.2s;
                }
                .pub-row:last-child {
                    border-bottom: none;
                }
                .pub-row:hover {
                    background: rgba(255, 255, 255, 0.01);
                }

                /* Year column */
                .pub-year-col {
                    flex-shrink: 0;
                    width: 48px;
                    padding-top: 2px;
                }
                .pub-year {
                    font-size: 0.82rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                    opacity: 0.75;
                }

                /* Details column */
                .pub-details-col {
                    flex: 1;
                    min-width: 0;
                }

                .pub-title-link {
                    display: inline;
                    font-size: 1.02rem;
                    font-weight: 600;
                    color: #f97316;
                    text-decoration: none;
                    line-height: 1.4;
                    transition: color 0.2s;
                    word-break: break-word;
                }
                .pub-title-link:hover {
                    color: #ea580c;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
                .pub-title-link.no-link {
                    color: var(--text-color);
                    cursor: default;
                }
                .pub-ext-icon {
                    display: inline;
                    margin-left: 5px;
                    vertical-align: middle;
                    opacity: 0.7;
                    flex-shrink: 0;
                }

                .pub-authors {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin: 5px 0 4px;
                    line-height: 1.5;
                }

                .pub-venue {
                    font-size: 0.85rem;
                    color: #38bdf8;
                    margin: 0;
                    line-height: 1.4;
                }
                .pub-venue em {
                    font-style: italic;
                    font-weight: 500;
                }
                .pub-publisher {
                    color: var(--text-secondary);
                    font-style: normal;
                    font-size: 0.82rem;
                }

                /* Empty state */
                .pub-empty {
                    text-align: center;
                    padding: 60px 20px;
                    color: var(--text-secondary);
                    font-size: 1rem;
                }

                @media (max-width: 640px) {
                    .pub-page-title { font-size: 2rem; }
                    .pub-row { gap: 12px; }
                    .pub-year-col { width: 40px; }
                    .pub-tabs { gap: 6px; }
                    .pub-tab { padding: 6px 12px; font-size: 0.82rem; }
                }
            `}</style>
        </section>
    );
};

export default Papers;
