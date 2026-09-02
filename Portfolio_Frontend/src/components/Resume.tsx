import { useRef, useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Download, Loader, Printer, CheckCircle2, AlertCircle, Info, X, Zap, Mail, MapPin, Globe, Briefcase, Eye, FileDown, Phone, Linkedin, Github } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const fmtDate = (s: string) => {
    if (!s) return 'Present';
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const Resume = () => {
    const { data } = usePortfolio();
    const sheetRef = useRef<HTMLDivElement>(null);
    const [busy, setBusy] = useState(false);
    const [showAts, setShowAts] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [cvType, setCvType] = useState<'v1_ats' | 'v2_visual' | 'europass'>('v2_visual');

    // Static compiled PDF & TeX paths
    const PDF_V1 = '/resume/Shah_Abdul_Mazid_ATS_CV_Version_1.pdf';
    const PDF_V2 = '/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.pdf';
    const TEX_V1 = '/resume/Shah_Abdul_Mazid_ATS_CV_Version_1.tex';
    const TEX_V2 = '/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.tex';

    const activePdf = cvType === 'v1_ats' ? PDF_V1 : PDF_V2;
    const activeTex = cvType === 'v1_ats' ? TEX_V1 : TEX_V2;

    const downloadStaticPdf = () => {
        const link = document.createElement('a');
        link.href = activePdf;
        link.download = cvType === 'v1_ats'
            ? 'Shah_Abdul_Mazid_ATS_CV_Version_1.pdf'
            : 'Shah_Abdul_Mazid_Visual_CV_Version_2.pdf';
        link.click();
    };

    const downloadTex = () => {
        const link = document.createElement('a');
        link.href = activeTex;
        link.download = cvType === 'v1_ats'
            ? 'Shah_Abdul_Mazid_ATS_CV_Version_1.tex'
            : 'Shah_Abdul_Mazid_Visual_CV_Version_2.tex';
        link.click();
    };

    // --- ATS SCORING LOGIC ---
    const atsScore = useMemo(() => {
        let score = 50;
        const tips: { type: 'plus' | 'minus' | 'tip', text: string }[] = [];

        if (data.contact.email && data.contact.phone) { score += 10; tips.push({ type: 'plus', text: 'Professional contact info complete.' }); }
        if (data.contact.linkedin && data.contact.github) { score += 5; tips.push({ type: 'plus', text: 'Social professional profiles linked.' }); }
        if (data.about.bio.length > 200) { score += 10; tips.push({ type: 'plus', text: 'Well-defined professional statement.' }); }

        const allText = JSON.stringify(data).toLowerCase();
        const keywords = ['rag', 'llm', 'fastapi', 'python', 'nlp', 'automation', 'scalable', 'deployment'];
        const found = keywords.filter(k => allText.includes(k));
        if (found.length > 4) { score += 10; tips.push({ type: 'plus', text: `Strong keyword density (${found.length} core tags).` }); }
        if (data.work.some(w => w.details.length >= 4)) { score += 10; tips.push({ type: 'plus', text: 'Detailed professional bullet points.' }); }
        if (data.papers && data.papers.length > 0) { score += 20; tips.push({ type: 'plus', text: 'Academic publications found (High Impact).' }); }
        if (data.projects.length >= 3) { score += 5; tips.push({ type: 'plus', text: 'Project portfolio demonstrated.' }); }
        if (data.education.length >= 2) { score += 5; tips.push({ type: 'plus', text: 'Education history complete.' }); }
        if (data.certifications && data.certifications.length > 0) { score += 10; tips.push({ type: 'plus', text: 'Industry certifications verified.' }); }
        if (data.references && data.references.length > 0) { score += 5; tips.push({ type: 'plus', text: `References included (${data.references.length} contact${data.references.length > 1 ? 's' : ''}).` }); }
        score += 5; tips.push({ type: 'plus', text: 'Single-column, ATS-parsable formatting.' });

        return { total: Math.min(score, 100), tips };
    }, [data]);

    const downloadPDF = async () => {
        if (!sheetRef.current) return;
        setBusy(true);
        
        try {
            sheetRef.current.classList.add('pdf-export');
            const opt = {
                margin: [13.2, 0, 13.2, 0],
                filename: `${data.hero.name.replace(/\s+/g, '_')}_Resume.pdf`,
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: { 
                    scale: 3, 
                    useCORS: true, 
                    letterRendering: true,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 794
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'] }
            };

            const worker = (html2pdf() as any).set(opt).from(sheetRef.current);
            await worker.toPdf().get('pdf').then((pdf: any) => {
                if (cvType === 'europass') {
                    const totalPages = pdf.internal.getNumberOfPages();
                    const pageWidth = 210;
                    const pageHeight = 297;
                    const barHeight = 8;
                    const barColor = '#a8c4e5';
                    const inset = 6;

                    for (let i = 1; i <= totalPages; i++) {
                        pdf.setPage(i);
                        pdf.setFillColor(barColor);
                        pdf.rect(0, 0, pageWidth, barHeight, 'F');
                        pdf.rect(0, 0, inset, barHeight * 2, 'F');
                        pdf.rect(pageWidth - inset, 0, inset, barHeight * 2, 'F');
                        pdf.rect(0, pageHeight - barHeight, pageWidth, barHeight, 'F');
                        pdf.rect(0, pageHeight - barHeight * 2, inset, barHeight * 2, 'F');
                        pdf.rect(pageWidth - inset, pageHeight - barHeight * 2, inset, barHeight * 2, 'F');
                    }
                }
            }).save();
        } catch (e) { 
            console.error("PDF Download Error:", e); 
            alert("Download failed. Using 'Print CV' is recommended for best quality.");
        } finally { 
            if (sheetRef.current) sheetRef.current.classList.remove('pdf-export');
            setBusy(false); 
        }
    };

    const downloadDynamic = () => {
        window.print();
    };

    const em = data.contact.email || '';
    const ph = data.contact.phone || '';
    const city = 'Dhaka, Bangladesh';

    const sortedWork = [...data.work].sort((a, b) => {
        if (!a.endDate && b.endDate) return -1;
        if (a.endDate && !b.endDate) return 1;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

    return (
        <div className="rv-page">
            <div className="rv-toolbar">
                <div className="rv-layout-toggle">
                    <button 
                        onClick={() => setCvType('v1_ats')} 
                        className={`rv-btn ${cvType === 'v1_ats' ? 'rv-active' : ''}`}
                    >
                        Version 1: ATS CV
                    </button>
                    <button 
                        onClick={() => setCvType('v2_visual')} 
                        className={`rv-btn ${cvType === 'v2_visual' ? 'rv-active' : ''}`}
                    >
                        Version 2: Visual CV (2-Column)
                    </button>
                    <button 
                        onClick={() => setCvType('europass')} 
                        className={`rv-btn ${cvType === 'europass' ? 'rv-active' : ''}`}
                    >
                        Version 3: Europass (German)
                    </button>
                </div>
                <div style={{ flex: 1 }} />
                <button onClick={() => setShowAts(true)} className="rv-btn rv-solid" style={{ background: '#10b981', border: 'none' }}>
                    <Zap size={14} fill="white" /> Check ATS Score
                </button>
                <button onClick={() => setShowPdfViewer(true)} className="rv-btn rv-solid" style={{ background: '#8b5cf6', color: 'white', border: 'none' }}>
                    <Eye size={14} /> View PDF
                </button>
                <button onClick={downloadStaticPdf} className="rv-btn rv-solid" style={{ background: '#f59e0b', color: 'white', border: 'none' }}>
                    <FileDown size={14} /> Download PDF
                </button>
                {cvType !== 'europass' && (
                    <button onClick={downloadTex} className="rv-btn rv-solid" style={{ background: '#0284c7', color: 'white', border: 'none' }}>
                        <Download size={14} /> Download .tex
                    </button>
                )}
                <button onClick={downloadPDF} disabled={busy} className="rv-btn rv-solid" style={{ background: '#e11d48', color: 'white', border: 'none' }}>
                    {busy ? <Loader size={14} className="rv-spin" /> : <Download size={14} />}
                    {busy ? 'Generating…' : 'Generate PDF'}
                </button>
                <button onClick={downloadDynamic} className="rv-btn rv-solid" style={{ background: '#3b82f6', color: 'white', border: 'none' }}>
                    <Printer size={14} /> Print CV
                </button>
            </div>

            {/* ===== PDF VIEWER MODAL ===== */}
            {showPdfViewer && (
                <div className="pdf-viewer-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowPdfViewer(false); }}>
                    <div className="pdf-viewer-modal">
                        <div className="pdf-viewer-header">
                            <div className="pdf-viewer-title">
                                <Eye size={16} />
                                <span>{cvType === 'v1_ats' ? 'Version 1: ATS CV' : cvType === 'v2_visual' ? 'Version 2: Visual CV (2-Column)' : 'Version 3: Europass CV'}</span>
                            </div>
                            <div className="pdf-viewer-actions">
                                <a href={activePdf} download className="pdf-viewer-dl-btn">
                                    <FileDown size={15} /> Download
                                </a>
                                <button onClick={() => setShowPdfViewer(false)} className="pdf-viewer-close">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="pdf-viewer-body">
                            <iframe
                                src={`${activePdf}#toolbar=1&navpanes=0&scrollbar=1`}
                                title="Resume PDF Viewer"
                                className="pdf-viewer-iframe"
                                allowFullScreen
                            />
                            <div className="pdf-viewer-fallback">
                                <p>Your browser cannot display the PDF inline.</p>
                                <a href={activePdf} target="_blank" rel="noopener noreferrer" className="rv-btn rv-solid" style={{ background: '#8b5cf6', color: 'white', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                                    <Eye size={14} /> Open PDF in new tab
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={`rv-sheet ${cvType === 'europass' ? 'ep-sheet' : ''}`} ref={sheetRef}>
                {/* ========================================================================= */}
                {/* VERSION 1: ATS CV (SINGLE COLUMN)                                         */}
                {/* ========================================================================= */}
                {cvType === 'v1_ats' && (
                    <div className="rv-content">
                        <div className="rv-hd">
                            <div className="rv-hd-left">
                                <div className="rv-contact-row"><span>{ph}</span></div>
                                <div className="rv-contact-row"><span>{city}</span></div>
                                <div className="rv-contact-row"><a href={`mailto:${em}`}>{em}</a></div>
                            </div>
                            <div className="rv-hd-mid">
                                <h1 className="rv-name">{data.hero.name}</h1>
                                <p className="rv-role">{data.hero.title}</p>
                            </div>
                            <div className="rv-hd-right">
                                <div className="rv-contact-row"><a href="http://shah-abdul-mazid-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="rv-link">Portfolio: http://shah-abdul-mazid-portfolio.vercel.app/</a></div>
                                <div className="rv-contact-row"><a href={data.contact.github} target="_blank" rel="noopener noreferrer" className="rv-link">GitHub: github.com/Shah-Abdul-Mazid</a></div>
                                <div className="rv-contact-row"><a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="rv-link">LinkedIn: linkedin.com/in/shahabdulmazid</a></div>
                            </div>
                        </div>

                        <div className="rv-body">
                            {data.about.bio && (
                                <div className="rv-summary">
                                    {data.about.bio.split('\n\n').map((para, i) => (
                                        <p key={i} style={{ marginBottom: i === data.about.bio.split('\n\n').length - 1 ? 0 : '8px' }}>{para}</p>
                                    ))}
                                </div>
                            )}
                            {data.skills.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Skills</div>
                                    {data.skills.map((c, i) => (
                                        <p key={i} className="rv-skill-row"><b>{c.name}:</b> {c.items.join(', ')}</p>
                                    ))}
                                </div>
                            )}
                            {sortedWork.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Technical Experience</div>
                                    {sortedWork.map((w, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-item-top"><span className="rv-bold">{w.role}</span><span className="rv-meta-date">{fmtDate(w.startDate)} — {w.endDate ? fmtDate(w.endDate) : 'Present'}</span></div>
                                            <div className="rv-item-sub"><span className="rv-muted">{w.company}</span><span className="rv-meta">{city}</span></div>
                                            <ul className="rv-ul">{w.details.map((d, j) => <li key={j}>{d}</li>)}</ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.education.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Education</div>
                                    {data.education.map((e, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-item-top"><span className="rv-bold">{e.degree}</span><span className="rv-meta">{e.year}</span></div>
                                            <div className="rv-item-sub"><span className="rv-muted">{e.school}</span><span className="rv-meta">Dhaka, Bangladesh</span></div>
                                            {e.major && <p className="rv-sm" style={{ color: '#4b5563', fontStyle: 'italic', fontSize: '11.5px', marginTop: '2px' }}>• {e.major}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.projects.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Projects</div>
                                    {data.projects.slice(0, 8).map((p, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-proj-hd">
                                                {p.projectUrl ? (
                                                    <a href={p.projectUrl} target="_blank" rel="noopener noreferrer" className="rv-proj-link-anchor" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                                        <span className="rv-proj-title">{p.title}</span>
                                                        <span className="rv-proj-link">· {p.projectUrl.replace('https://', '')}</span>
                                                    </a>
                                                ) : (
                                                    <span className="rv-proj-title">{p.title}</span>
                                                )}
                                            </div>
                                            <p className="rv-sm" style={{ color: '#374151', margin: '1px 0 2px' }}>{p.desc}</p>
                                            {p.tags.length > 0 && <p className="rv-sm" style={{ color: '#3d5a80', margin: 0, fontStyle: 'italic', fontSize: '11px' }}>Tech: {p.tags.join(', ')}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.papers && data.papers.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Publications</div>
                                    {data.papers.slice(0, 3).map((p, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-item-top"><span className="rv-bold">{p.title}</span><span className="rv-meta">{p.year}</span></div>
                                            <p className="rv-sm" style={{ color: '#1a1a1a', margin: '2px 0 1px' }}>{p.venue}</p>
                                            {p.link && <p className="rv-sm" style={{ color: '#3d5a80', margin: 0, fontSize: '11px' }}><a href={p.link} target="_blank" rel="noopener noreferrer">{p.link.replace('https://', '')}</a></p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.certifications && data.certifications.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Licenses & Certifications</div>
                                    {data.certifications.map((c, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-item-top">
                                                <span className="rv-bold">{c.name}</span>
                                                <span className="rv-meta">{c.date}</span>
                                            </div>
                                            <div className="rv-item-sub">
                                                <span className="rv-muted">{c.issuer}{c.instructor ? ` | ${c.instructor}` : ''}</span>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {c.credentialUrl && (
                                                        <span className="rv-meta">
                                                            <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3d5a80', textDecoration: 'none' }}>
                                                                {c.credentialId ? `ID: ${c.credentialId}` : 'Show Credential'} ↗
                                                            </a>
                                                        </span>
                                                    )}
                                                    {c.links?.map((link, lIdx) => (
                                                        <span key={lIdx} className="rv-meta">
                                                            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3d5a80', textDecoration: 'none', fontStyle: 'italic' }}>
                                                                {link.label || 'Link'} ↗
                                                            </a>
                                                        </span>
                                                    ))}
                                                    {!c.credentialUrl && c.credentialId && (
                                                        <span className="rv-meta">ID: {c.credentialId}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.experience && data.experience.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Competitions & Awards</div>
                                    {data.experience.map((e, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-item-top"><span className="rv-bold">{e.role}</span><span className="rv-meta">{e.period}</span></div>
                                            <div className="rv-item-sub"><span className="rv-muted">{e.company}</span></div>
                                            <p className="rv-sm" style={{ color: '#1a1a1a', margin: '1px 0 0' }}>{e.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="rv-sec">
                                <div className="rv-sec-hd">Languages</div>
                                <p className="rv-skill-row"><b>Bengali:</b> Native &nbsp;·&nbsp; <b>English:</b> Professional Working Proficiency</p>
                            </div>
                            {data.references && data.references.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">References</div>
                                    <div className="rv-ref-grid">
                                        {data.references.map((r, i) => (
                                            <div key={i} className="rv-ref-item">
                                                <div className="rv-ref-name">{r.name}</div>
                                                <div className="rv-ref-pos">{r.title}</div>
                                                <div className="rv-ref-org">{r.company}</div>
                                                <div className="rv-ref-rel">{r.relation}</div>
                                                <div className="rv-ref-contact">
                                                    {r.email && <div className="rv-ref-email"><a href={`mailto:${r.email}`} className="rv-ref-link">{r.email}</a></div>}
                                                    {r.phone && <div className="rv-ref-phone">{r.phone}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* VERSION 2: VISUAL CV (2-COLUMN MODERN LAYOUT)                             */}
                {/* ========================================================================= */}
                {cvType === 'v2_visual' && (
                    <div className="rv-content v2-visual-content">
                        {/* Header Navy Block */}
                        <div className="v2-header-band">
                            <div className="v2-header-left">
                                <h1 className="v2-name">SHAH ABDUL MAZID</h1>
                                <h2 className="v2-subtitle">AI/ML ENGINEER</h2>
                                <div className="v2-tags">
                                    Generative AI &nbsp;|&nbsp; LLMs &nbsp;|&nbsp; RAG &nbsp;|&nbsp; Computer Vision &nbsp;|&nbsp; NLP
                                </div>
                                <div className="v2-contact-grid">
                                    <span className="v2-citem"><MapPin size={11} /> Dhaka, Bangladesh</span>
                                    <span className="v2-citem"><Mail size={11} /> <a href={`mailto:${em}`}>{em}</a></span>
                                    <span className="v2-citem"><Phone size={11} /> {ph}</span>
                                    <span className="v2-citem"><Linkedin size={11} /> <a href="https://www.linkedin.com/in/shahabdulmazid" target="_blank" rel="noreferrer">LinkedIn</a></span>
                                    <span className="v2-citem"><Github size={11} /> <a href="https://github.com/Shah-Abdul-Mazid" target="_blank" rel="noreferrer">GitHub</a></span>
                                </div>
                            </div>
                            <div className="v2-header-right">
                                <img src="/resume/FD=109767.jpg" alt="Shah Abdul Mazid" className="v2-avatar" />
                            </div>
                        </div>

                        {/* Professional Summary */}
                        <div className="v2-summary-box">
                            <h3 className="v2-sec-heading">Professional Summary</h3>
                            <p className="v2-summary-p">
                                AI/ML Engineer with a B.Sc. in Computer Science and Engineering from East West University, majoring in Intelligent Systems and Data Science. Experienced in Generative AI, LLMs, RAG, Machine Learning, Deep Learning, Computer Vision, and NLP. Skilled in building AI applications using Python, PyTorch, TensorFlow, FastAPI, Pinecone, OpenAI APIs, and AWS. Passionate about AI research and developing intelligent solutions for real-world problems.
                            </p>
                        </div>

                        {/* PAGE 1 CONTENT (2-COLUMN GRID) */}
                        <div className="v2-page1">
                            <div className="v2-grid">
                                {/* Page 1 Left Column */}
                                <div className="v2-col">
                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Technical Skills</h3>
                                        <div className="v2-skill-entry"><b>Languages:</b> Python, Java, C/C++, JavaScript, TypeScript, SQL</div>
                                        <div className="v2-skill-entry"><b>AI / ML:</b> Machine Learning, Deep Learning, Transfer Learning, Model Evaluation, Data Preprocessing</div>
                                        <div className="v2-skill-entry"><b>Generative AI:</b> Generative AI, LLMs, RAG, Prompt Engineering, AI Agents, Agentic AI, Multi-Agent Systems</div>
                                        <div className="v2-skill-entry"><b>NLP:</b> Natural Language Processing, Semantic Search, Vector Search, Embeddings, Sentence Transformers, Document Q&A, AI Chatbots</div>
                                        <div className="v2-skill-entry"><b>Computer Vision:</b> Object Detection, Image Classification, Medical Imaging, YOLO, OpenCV, Grad-CAM, CBAM Attention</div>
                                        <div className="v2-skill-entry"><b>Frameworks:</b> PyTorch, TensorFlow, Keras, Scikit-learn, NumPy, Pandas, Matplotlib, Plotly</div>
                                        <div className="v2-skill-entry"><b>Backend:</b> FastAPI, REST APIs, JWT Authentication, API Integration, PDF Processing</div>
                                        <div className="v2-skill-entry"><b>Frontend:</b> React, Next.js, Streamlit, Gradio</div>
                                        <div className="v2-skill-entry"><b>Databases:</b> Pinecone, Vector Databases, MongoDB, MySQL, SQLite</div>
                                        <div className="v2-skill-entry"><b>Cloud / DevOps:</b> AWS, EC2, Docker, PM2, Git, GitHub</div>
                                        <div className="v2-skill-entry"><b>Automation:</b> n8n, Workflow Automation, API Integration</div>
                                    </div>

                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Education</h3>
                                        <div className="v2-item">
                                            <div className="v2-bold">B.Sc. in Computer Science & Engineering</div>
                                            <div className="v2-sub">East West University <span className="v2-right-date">2021–2026</span></div>
                                            <div className="v2-small">Major: Intelligent Systems & Data Science</div>
                                        </div>
                                        <div className="v2-item">
                                            <div className="v2-bold">Higher Secondary Certificate</div>
                                            <div className="v2-sub">Dhaka Ideal College <span className="v2-right-date">2018–2020</span></div>
                                            <div className="v2-small">Science</div>
                                        </div>
                                        <div className="v2-item">
                                            <div className="v2-bold">Secondary School Certificate</div>
                                            <div className="v2-sub">Badshah Faisal Institute <span className="v2-right-date">2016–2018</span></div>
                                            <div className="v2-small">Science</div>
                                        </div>
                                    </div>

                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Languages</h3>
                                        <div><b>Bengali</b> — Native</div>
                                        <div><b>English</b> — Professional Working Proficiency</div>
                                    </div>
                                </div>

                                {/* Page 1 Right Column */}
                                <div className="v2-col">
                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Tools & Platforms</h3>
                                        <div className="v2-skill-entry"><b>Models & APIs:</b> OpenAI API, Llama 2, Mistral, Claude API, HuggingFace Models</div>
                                        <div className="v2-skill-entry"><b>Vector DBs & Search:</b> Pinecone, Weaviate, Milvus, Chroma, FAISS</div>
                                        <div className="v2-skill-entry"><b>Deployment:</b> Hugging Face Hub, AWS SageMaker, Docker Hub, Streamlit Cloud</div>
                                        <div className="v2-skill-entry"><b>Dev Tools:</b> VS Code, Git, GitHub, Jupyter, Google Colab, Linux/Ubuntu</div>
                                        <div className="v2-skill-entry"><b>APIs & Integrations:</b> OpenAI API, Google Maps, Stripe, Google Sheets, Anthropic API</div>
                                    </div>

                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Key Achievements</h3>
                                        <ul className="v2-ul">
                                            <li>Published research on interpretable ML for agricultural disease diagnosis (ICCIT 2025)</li>
                                            <li>Built enterprise RAG platform processing 10,000+ documents with 95%+ accuracy</li>
                                            <li>Developed traffic detection system for real-world Bangladesh traffic conditions</li>
                                            <li>Designed multi-agent AI system handling complex enterprise workflows</li>
                                            <li>9+ IBM and AWS certifications in AI/ML specializations</li>
                                        </ul>
                                    </div>

                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Professional Highlights</h3>
                                        <div className="v2-item"><b>Published Researcher:</b> MangoStack ensemble model published in ICCIT 2025</div>
                                        <div className="v2-item"><b>RAG Specialist:</b> Built enterprise platforms for document-based Q&A systems</div>
                                        <div className="v2-item"><b>Full-Stack AI:</b> End-to-end ML systems from training to production deployment</div>
                                        <div className="v2-item"><b>Automation Expert:</b> n8n workflow automation for business process efficiency</div>
                                    </div>

                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Research Interests</h3>
                                        <ul className="v2-ul">
                                            <li>Generative AI, LLMs & RAG Architecture</li>
                                            <li>Multi-Agent AI Systems & Autonomous Workflows</li>
                                            <li>Healthcare AI & Medical Image Diagnosis</li>
                                            <li>Computer Vision, Grad-CAM & Model Interpretability</li>
                                        </ul>
                                    </div>

                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Career Focus</h3>
                                        <div>AI/ML Engineering &nbsp;|&nbsp; Generative AI &nbsp;|&nbsp; RAG Systems</div>
                                        <div>Computer Vision &nbsp;|&nbsp; AI Research &nbsp;|&nbsp; Data Science</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PAGE 2 CONTENT (2-COLUMN GRID) */}
                        <div className="v2-page2 html2pdf__page-break" style={{ pageBreakBefore: 'always' }}>
                            <div className="v2-grid">
                                {/* Page 2 Left Column */}
                                <div className="v2-col">
                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Professional Experience</h3>
                                        <div className="v2-item">
                                            <div className="v2-bold">AI Engineer <span className="v2-right-date">Feb 2026 — May 2026</span></div>
                                            <div className="v2-sub">Softvence Agency — Dhaka, Bangladesh</div>
                                            <ul className="v2-ul">
                                                <li>Developed RAG-based chatbots using Large Language Models for intelligent question answering.</li>
                                                <li>Built scalable FastAPI backend services for AI model deployment and integration.</li>
                                                <li>Developed Text-to-Speech and voice generation systems for interactive applications.</li>
                                                <li>Automated workflows using n8n to improve operational efficiency.</li>
                                                <li>Integrated APIs and external services for end-to-end AI solutions.</li>
                                                <li>Researched and implemented emerging Generative AI, LLM, and RAG techniques.</li>
                                            </ul>
                                        </div>

                                        <div className="v2-item">
                                            <div className="v2-bold">Campus Ambassador <span className="v2-right-date">Jan 2022 — Jan 2025</span></div>
                                            <div className="v2-sub">eShikhon — Dhaka, Bangladesh</div>
                                            <ul className="v2-ul">
                                                <li>Represented the organization at East West University.</li>
                                                <li>Organized technology workshops and student events.</li>
                                                <li>Promoted digital learning and technology-focused initiatives.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Publication</h3>
                                        <div className="v2-bold">MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis</div>
                                        <div className="v2-small"><b>2025</b> — 28th International Conference on Computer and Information Technology (ICCIT).</div>
                                    </div>

                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Certifications</h3>
                                        <ul className="v2-ul">
                                            <li>IBM Deep Learning with PyTorch, Keras and TensorFlow</li>
                                            <li>DeepLearning.AI TensorFlow Developer</li>
                                            <li>IBM Machine Learning</li>
                                            <li>IBM RAG and Agentic AI</li>
                                            <li>Building AI Agents and Agentic Workflows</li>
                                            <li>IBM AI Developer</li>
                                            <li>AWS Generative AI and AI Agents with Amazon Bedrock</li>
                                            <li>IBM AI Engineering</li>
                                            <li>IBM Data Science</li>
                                        </ul>
                                    </div>

                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Competitions & Awards</h3>
                                        <div className="v2-item"><b>Network War</b> — EWU Telecommunication Club, 2024</div>
                                        <div className="v2-item"><b>IT Olympiad</b> — CSE FEST, East West University, 2024</div>
                                        <div className="v2-item"><b>In House Programming Battle</b> — EWUCoPC, 2022</div>
                                    </div>

                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Online Profiles</h3>
                                        <div><b>Portfolio:</b> <a href="http://shah-abdul-mazid-portfolio.vercel.app/" target="_blank" rel="noreferrer">shah-abdul-mazid-portfolio.vercel.app</a></div>
                                        <div><b>GitHub:</b> <a href="https://github.com/Shah-Abdul-Mazid" target="_blank" rel="noreferrer">github.com/Shah-Abdul-Mazid</a></div>
                                        <div><b>LinkedIn:</b> <a href="https://www.linkedin.com/in/shahabdulmazid" target="_blank" rel="noreferrer">linkedin.com/in/shahabdulmazid</a></div>
                                        <div><b>Nexus Intelligence:</b> <a href="https://ai-rag-project-llm-based.vercel.app/auth/login" target="_blank" rel="noreferrer">Live Demo</a></div>
                                    </div>
                                </div>

                                {/* Page 2 Right Column */}
                                <div className="v2-col">
                                    <div className="v2-sec">
                                        <h3 className="v2-sec-heading">Selected Projects</h3>

                                        <div className="v2-item">
                                            <div className="v2-bold">Nexus Intelligence — Enterprise Multi-Agent AI Platform</div>
                                            <p className="v2-small">Built a full-stack enterprise AI platform for secure question answering over private documents, spreadsheets, and web content.</p>
                                            <ul className="v2-ul">
                                                <li>Implemented RAG and multi-agent architecture.</li>
                                                <li>Integrated Pinecone vector search and live data routing.</li>
                                                <li>Added feedback memory, JWT authentication, and PII detection.</li>
                                                <li>Developed Next.js frontend and FastAPI backend.</li>
                                                <li><b>Tech:</b> FastAPI, Next.js, React, TypeScript, OpenAI, Pinecone, RAG, AWS.</li>
                                            </ul>
                                        </div>

                                        <div className="v2-item">
                                            <div className="v2-bold">HR Policies RAG Chatbot — AI-Powered Document Q&A</div>
                                            <p className="v2-small">Developed an AI chatbot capable of answering HR policy questions from PDF documents using semantic retrieval and LLM generation.</p>
                                            <ul className="v2-ul">
                                                <li>Implemented PDF processing and document retrieval.</li>
                                                <li>Used vector search and sentence embeddings.</li>
                                                <li>Developed interactive Streamlit interface.</li>
                                                <li><b>Tech:</b> Python, FastAPI, Streamlit, Pinecone, Llama 2, NLP.</li>
                                            </ul>
                                        </div>

                                        <div className="v2-item">
                                            <div className="v2-bold">Bangladesh Traffic Flow Dataset — Vehicle Detection</div>
                                            <p className="v2-small">Developed a deep learning system for vehicle detection and classification under Bangladesh traffic conditions.</p>
                                            <ul className="v2-ul">
                                                <li>Implemented YOLO-based object detection.</li>
                                                <li>Applied Grad-CAM/EigenCAM for model interpretation.</li>
                                                <li>Built interactive inference using Streamlit and Gradio.</li>
                                                <li><b>Tech:</b> PyTorch, YOLO, OpenCV, NumPy, Pandas.</li>
                                            </ul>
                                        </div>

                                        <div className="v2-item">
                                            <div className="v2-bold">Brain Tumor Detection — MobDenseNet with CBAM</div>
                                            <p className="v2-small">Developed a hybrid deep learning model combining MobileNet and DenseNet with CBAM attention for MRI brain tumor classification.</p>
                                            <ul className="v2-ul">
                                                <li>Implemented preprocessing, augmentation, and classification.</li>
                                                <li>Evaluated accuracy, precision, recall, and F1-score.</li>
                                                <li>Applied Grad-CAM for model interpretability.</li>
                                            </ul>
                                        </div>

                                        <div className="v2-item">
                                            <div className="v2-bold">WhatsUpIn — AI Travel Recommendation Engine</div>
                                            <p className="v2-small">Developed an automated AI travel recommendation platform generating personalized travel plans.</p>
                                            <ul className="v2-ul">
                                                <li>Integrated OpenAI for itinerary generation.</li>
                                                <li>Automated workflows using n8n.</li>
                                                <li>Integrated Google Maps, Google Sheets, and Stripe.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* VERSION 3: EUROPASS CV (GERMAN / EU FORMAT)                               */}
                {/* ========================================================================= */}
                {cvType === 'europass' && (
                    <div className="ep-content">
                        <div className="ep-frame-top" />
                        <div className="ep-frame-bottom" />
                        <div className="ep-header">
                            <div className="ep-photo">
                                <img src="/Image/FD=109767.jpg" alt="Profile" />
                            </div>
                            <div className="ep-info">
                                <h1 className="ep-name">{data.hero.name}</h1>
                                <div className="ep-details">
                                    <div className="ep-detail-row"><b>Nationality:</b> Bangladeshi <span style={{ marginLeft: '10px' }}><b>Date of birth:</b> 01/06/2001</span></div>
                                    <div className="ep-detail-row"><b>Place of birth:</b> Dhaka, Bangladesh</div>
                                    <div className="ep-detail-row">
                                        <MapPin size={12} fill="#003399" color="white" />
                                        <b>Home:</b> 14/14, Tajmohol Road , Mohammadpur, 1207 Dhaka (Bangladesh)
                                    </div>
                                </div>
                            </div>
                            <div className="ep-logo">
                                <img src="/Logo/Europass-Full-Colour-Brand-Mark_1.svg" alt="Europass Logo" />
                            </div>
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">ABOUT ME</h2>
                            <div className="ep-sec-line" />
                            <div className="ep-summary-text">{data.about.bio}</div>
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">EDUCATION AND TRAINING</h2>
                            <div className="ep-sec-line" />
                            {data.education.map((e, i) => (
                                <div key={i} className="ep-item">
                                    <h3 className="ep-item-title">{e.degree}</h3>
                                    <div className="ep-item-org">{e.school}</div>
                                    <div className="ep-item-meta">
                                        <span className="ep-meta-row"><b>Address:</b> Dhaka, Bangladesh</span>
                                        {i === 0 && <span className="ep-meta-row"><b>Website:</b> <a href="https://www.ewubd.edu/">https://www.ewubd.edu/</a></span>}
                                        <span className="ep-meta-row"><b>Level in EQF:</b> {i === 0 ? 'EQF level 6' : i === 1 ? 'EQF level 4' : 'EQF level 3'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">WORK EXPERIENCE</h2>
                            <div className="ep-sec-line" />
                            {sortedWork.map((w, i) => (
                                <div key={i} className="ep-item">
                                    <div className="ep-company-row">
                                        <Briefcase size={14} fill="#003399" color="white" />
                                        <span className="ep-company">{w.company}</span> — <span className="ep-loc">{city}</span>
                                    </div>
                                    <h3 className="ep-role">{w.role}</h3>
                                    <div className="ep-dates">[ {w.startDate.split('-').reverse().join('/')} – {w.endDate ? w.endDate.split('-').reverse().join('/') : 'Present'} ]</div>
                                    <ul className="ep-bullets">
                                        {w.details.map((d, j) => <li key={j}>{d}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="ep-section ep-page-break">
                            <h2 className="ep-sec-title">TECHNICAL SKILLS</h2>
                            <div className="ep-sec-line" />
                            {data.skills.map((cat, i) => (
                                <div key={i} className="ep-lang-row" style={{ marginBottom: '8px' }}>
                                    <b>{cat.name}:</b> {cat.items.join(', ')}
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">DIGITAL SKILLS TEST RESULTS</h2>
                            <div className="ep-sec-line" />
                            {[
                                { name: 'Information and data literacy', level: 'INTERMEDIATE', val: 'Level 3 / 6', icon: <Globe size={14} /> },
                                { name: 'Communication and collaboration', level: 'INTERMEDIATE', val: 'Level 4 / 6', icon: <Mail size={14} /> },
                                { name: 'Digital content creation', level: 'ADVANCED', val: 'Level 5 / 6', icon: <Globe size={14} /> },
                                { name: 'Safety', level: 'INTERMEDIATE', val: 'Level 3 / 6', icon: <CheckCircle2 size={14} /> },
                                { name: 'Problem solving', level: 'INTERMEDIATE', val: 'Level 4 / 6', icon: <Zap size={14} /> }
                            ].map((s, i) => (
                                <div key={i} className="ep-skill-row">
                                    <div className="ep-skill-name">
                                        <span className="ep-skill-icon">{s.icon}</span>
                                        {s.name}
                                    </div>
                                    <div className="ep-skill-level">
                                        <b>{s.level}</b> {s.val}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">LANGUAGE SKILLS</h2>
                            <div className="ep-sec-line" />
                            <div className="ep-lang-row"><b>Mother tongue(s):</b> Bengali</div>
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">PROJECTS</h2>
                            <div className="ep-sec-line" />
                            {data.projects.map((p, i) => (
                                <div key={i} className="ep-item">
                                    <h3 className="ep-item-title">{p.title}</h3>
                                    <div className="ep-item-meta" style={{ marginTop: '2px' }}>
                                        <div style={{ fontSize: '10.5px', color: '#444', marginBottom: '3px' }}>{p.desc}</div>
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {p.tags.slice(0, 5).map((t, j) => (
                                                <span key={j} style={{ fontSize: '9px', background: '#f0f4f8', color: '#003399', padding: '1px 5px', borderRadius: '3px' }}>{t}</span>
                                            ))}
                                        </div>
                                        {(p.projectUrl || p.githubUrl) && (
                                            <div className="ep-meta-row" style={{ marginTop: '3px' }}>
                                                <b>Link:</b> <a href={p.projectUrl || p.githubUrl}>{p.projectUrl || p.githubUrl}</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">PUBLICATIONS</h2>
                            <div className="ep-sec-line" />
                            {data.papers.map((p, i) => (
                                <div key={i} className="ep-item">
                                    <h3 className="ep-item-title">{p.title}</h3>
                                    <div className="ep-item-meta">
                                        <div><b>Authors:</b> {p.authors}</div>
                                        <div><b>Venue:</b> {p.venue}, {p.year}</div>
                                        {p.link && <div className="ep-meta-row"><b>Link:</b> <a href={p.link}>{p.link}</a></div>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">COMPETITIONS AND AWARDS</h2>
                            <div className="ep-sec-line" />
                            {data.experience.map((e, i) => (
                                <div key={i} className="ep-item">
                                    <h3 className="ep-item-title">{e.role}</h3>
                                    <div className="ep-item-org">{e.company}</div>
                                    <div className="ep-item-meta">
                                        <div className="ep-dates">{e.period}</div>
                                        <div style={{ fontSize: '10.5px', color: '#333' }}>{e.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">HOBBIES AND INTERESTS</h2>
                            <div className="ep-sec-line" />
                            <div className="ep-summary-text">
                                Open Source Contributing | Competitive Programming | Tech Blogging | Travelling | Photography
                            </div>
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">CERTIFICATIONS</h2>
                            <div className="ep-sec-line" />
                            {data.certifications.map((c, i) => (
                                <div key={i} className="ep-cert-item">
                                    <div className="ep-cert-meta">[ {c.issuer}, {c.date.split('-').reverse().join('/')} ]</div>
                                    <div className="ep-cert-name">{c.name}</div>
                                    <div className="ep-cert-mode"><b>Mode of learning:</b> Online</div>
                                    {c.credentialUrl && (
                                        <div className="ep-cert-link">
                                            <b>Link:</b> <a href={c.credentialUrl}>{c.credentialUrl}</a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">REFERENCES</h2>
                            <div className="ep-sec-line" />
                            {data.references.map((r, i) => (
                                <div key={i} className="ep-item">
                                    <h3 className="ep-item-title">{r.name}</h3>
                                    <div className="ep-item-org">{r.company}</div>
                                    <div className="ep-item-meta">
                                        <div><b>{r.title}</b> ({r.relation})</div>
                                        <div><b>Email:</b> {r.email}</div>
                                        {r.phone && <div><b>Phone:</b> {r.phone}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showAts && (
                <div className="ats-overlay" onClick={() => setShowAts(false)}>
                    <div className="ats-panel" onClick={e => e.stopPropagation()}>

                        <div className="ats-hd">

                            <div className="ats-hd-txt"><h3>ATS Insight Analyzer</h3><p>Real-time professional score</p></div>
                            <button className="ats-close" onClick={() => setShowAts(false)}><X size={20} /></button>
                        </div>
                        <div className="ats-score-box">
                            <div className="ats-circle"><span className="ats-num">{atsScore.total}</span><span className="ats-pct">%</span></div>
                            <div className="ats-label">{atsScore.total >= 80 ? 'Excellent' : atsScore.total >= 60 ? 'Professional' : 'Needs Optimization'}</div>
                        </div>
                        <div className="ats-tips">
                            {atsScore.tips.map((t, i) => (
                                <div key={i} className={`ats-tip ats-${t.type}`}>
                                    {t.type === 'plus' ? <CheckCircle2 size={16} /> : t.type === 'tip' ? <Info size={16} /> : <AlertCircle size={16} />}
                                    <span>{t.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="ats-footer"><p>Calculated based on formatting, keywords, and sections for AI roles.</p></div>
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                * { box-sizing: border-box !important; }
                @page { size: A4; margin: 0.5in; }
                .rv-page { background: #f1f5f9; min-height: 100vh; padding: 32px 16px 60px; display: flex; flex-direction: column; align-items: center; font-family: 'Source Sans Pro', 'Inter', sans-serif; }
                .rv-toolbar { width: min(794px, 100%); display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
                .rv-layout-toggle { display: flex; gap: 6px; background: rgba(0,0,0,0.06); padding: 4px; border-radius: 8px; }
                .rv-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; transition: all 0.2s; background: white; color: #334155; }
                .rv-btn:hover { background: #f8fafc; color: #0f172a; }
                .rv-btn.rv-active { background: #2563eb !important; color: white !important; }
                .rv-btn.rv-solid { font-weight: 600; }
                .rv-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .rv-sheet { width: min(794px, 100%); background: white; border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); padding: 40px; margin-bottom: 40px; }

                /* ===== VERSION 1: ATS STYLES ===== */
                .rv-content { color: #1e293b; line-height: 1.5; font-size: 0.9rem; }
                .rv-hd { display: grid; grid-template-columns: 1.5fr 2fr 1.5fr; gap: 12px; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; }
                .rv-hd-left { font-size: 0.78rem; color: #475569; }
                .rv-hd-mid { text-align: center; }
                .rv-name { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 0; letter-spacing: -0.02em; }
                .rv-role { font-size: 0.85rem; font-weight: 600; color: #3b82f6; margin: 2px 0 0; text-transform: uppercase; letter-spacing: 0.05em; }
                .rv-hd-right { text-align: right; font-size: 0.78rem; }
                .rv-contact-row { margin-bottom: 2px; }
                .rv-link { color: #2563eb; text-decoration: none; }
                .rv-summary { background: #f8fafc; border-left: 3px solid #3b82f6; padding: 12px 16px; margin-bottom: 20px; border-radius: 0 6px 6px 0; font-size: 0.88rem; color: #334155; }
                .rv-sec { margin-bottom: 20px; }
                .rv-sec-hd { font-size: 0.95rem; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 12px; }
                .rv-skill-row { margin: 0 0 6px; font-size: 0.85rem; }
                .rv-item { margin-bottom: 12px; }
                .rv-item-top { display: flex; justify-content: space-between; align-items: baseline; font-size: 0.88rem; }
                .rv-bold { font-weight: 700; color: #0f172a; }
                .rv-meta-date { font-size: 0.8rem; font-weight: 600; color: #2563eb; }
                .rv-meta { font-size: 0.8rem; color: #64748b; }
                .rv-item-sub { display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px; }
                .rv-muted { color: #475569; font-weight: 500; }
                .rv-ul { margin: 4px 0 0 16px; padding: 0; font-size: 0.83rem; color: #334155; }
                .rv-ul li { margin-bottom: 3px; }
                .rv-proj-hd { display: flex; justify-content: space-between; align-items: baseline; }
                .rv-proj-title { font-weight: 700; color: #0f172a; font-size: 0.88rem; }
                .rv-proj-link { font-size: 0.78rem; color: #2563eb; font-weight: 500; }
                .rv-ref-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .rv-ref-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 0.82rem; }
                .rv-ref-name { font-weight: 700; color: #0f172a; }
                .rv-ref-pos { color: #2563eb; font-weight: 600; }
                .rv-ref-org { color: #475569; }
                .rv-ref-rel { color: #64748b; font-style: italic; font-size: 0.78rem; margin-bottom: 4px; }
                .rv-ref-link { color: #2563eb; text-decoration: none; }

                /* ===== EUROPASS STYLES ===== */
                .ep-sheet { padding: 0 !important; }
                .ep-content { padding: 40px; position: relative; color: #222; font-family: Arial, sans-serif; font-size: 11px; line-height: 1.4; }
                .ep-frame-top { height: 8px; background: #a8c4e5; position: absolute; top: 0; left: 0; right: 0; }
                .ep-frame-bottom { height: 8px; background: #a8c4e5; position: absolute; bottom: 0; left: 0; right: 0; }
                .ep-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
                .ep-photo img { width: 90px; height: 110px; object-fit: cover; border-radius: 4px; }
                .ep-info { flex: 1; margin: 0 20px; }
                .ep-name { font-size: 22px; font-weight: 700; color: #003399; margin: 0 0 10px; }
                .ep-details { font-size: 10.5px; color: #444; }
                .ep-detail-row { margin-bottom: 3px; display: flex; align-items: center; gap: 4px; }
                .ep-logo img { width: 120px; }
                .ep-section { margin-bottom: 20px; }
                .ep-sec-title { font-size: 12px; font-weight: 700; color: #003399; margin: 0 0 4px; text-transform: uppercase; }
                .ep-sec-line { height: 1.5px; background: #003399; margin-bottom: 10px; }
                .ep-summary-text { font-size: 11px; color: #333; line-height: 1.4; }
                .ep-item { margin-bottom: 12px; }
                .ep-item-title { font-size: 11.5px; font-weight: 700; color: #111; margin: 0 0 2px; }
                .ep-item-org { font-size: 10.5px; font-weight: 600; color: #003399; }
                .ep-item-meta { font-size: 10px; color: #555; margin-top: 2px; }
                .ep-meta-row { display: block; margin-bottom: 1px; }
                .ep-company-row { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #111; }
                .ep-company { color: #003399; }
                .ep-loc { color: #555; font-weight: normal; }
                .ep-role { font-size: 11px; font-weight: 700; color: #333; margin: 2px 0; }
                .ep-dates { font-size: 10px; color: #666; font-weight: bold; margin-bottom: 4px; }
                .ep-bullets { margin: 4px 0 0 14px; padding: 0; font-size: 10.5px; color: #333; }
                .ep-bullets li { margin-bottom: 2px; }
                .ep-lang-row { font-size: 10.5px; color: #333; }
                .ep-skill-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: #f8fafc; border-radius: 4px; margin-bottom: 4px; font-size: 10.5px; }
                .ep-skill-name { display: flex; align-items: center; gap: 8px; font-weight: 600; color: #1e293b; }
                .ep-skill-icon { color: #003399; display: flex; align-items: center; }
                .ep-skill-level { font-size: 10px; color: #475569; }
                .ep-cert-item { margin-bottom: 8px; font-size: 10.5px; }
                .ep-cert-meta { font-size: 10px; color: #666; font-weight: bold; }
                .ep-cert-name { font-weight: 700; color: #003399; }
                .ep-cert-mode { font-size: 10px; color: #555; }
                .ep-cert-link { font-size: 10px; }

                /* ===== ATS INSIGHT ANALYZER OVERLAY ===== */
                .ats-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; }
                .ats-panel { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; width: min(480px, 100%); padding: 24px; color: white; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
                .ats-hd { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
                .ats-hd-txt h3 { font-size: 1.2rem; font-weight: 700; margin: 0 0 4px; color: #f8fafc; }
                .ats-hd-txt p { font-size: 0.8rem; color: #94a3b8; margin: 0; }
                .ats-close { background: transparent; border: none; color: #94a3b8; cursor: pointer; padding: 4px; border-radius: 6px; }
                .ats-close:hover { color: white; background: rgba(255, 255, 255, 0.1); }
                .ats-score-box { text-align: center; background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.05); }
                .ats-circle { font-size: 2.8rem; font-weight: 800; color: #10b981; line-height: 1; }
                .ats-pct { font-size: 1.4rem; color: #64748b; font-weight: 600; margin-left: 2px; }
                .ats-label { font-size: 0.85rem; color: #94a3b8; font-weight: 600; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
                .ats-tips { display: flex; flex-direction: column; gap: 10px; max-height: 220px; overflow-y: auto; margin-bottom: 16px; }
                .ats-tip { display: flex; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 0.82rem; align-items: center; }
                .ats-plus { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #a7f3d0; }
                .ats-plus svg { color: #10b981; flex-shrink: 0; }
                .ats-footer { border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 12px; text-align: center; font-size: 0.75rem; color: #64748b; }
                .ats-footer p { margin: 0; }

                /* ===== VERSION 2: VISUAL CV 2-COLUMN STYLES ===== */
                .v2-visual-content { padding: 0 !important; font-family: 'Source Sans Pro', 'Inter', sans-serif; color: #333; }
                .v2-header-band { background: #243B5A; color: white; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px; margin-bottom: 16px; }
                .v2-name { font-size: 26px; font-weight: 700; margin: 0 0 4px 0; color: white; letter-spacing: 0.5px; }
                .v2-subtitle { font-size: 15px; font-weight: 600; margin: 0 0 8px 0; color: #EEF3F8; }
                .v2-tags { font-size: 12px; margin-bottom: 12px; color: #EEF3F8; }
                .v2-contact-grid { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11.5px; color: #fff; }
                .v2-citem { display: inline-flex; align-items: center; gap: 4px; }
                .v2-citem a { color: #fff; text-decoration: none; }
                .v2-avatar { width: 100px; height: 120px; object-fit: cover; border-radius: 4px; border: 2px solid white; }
                .v2-summary-box { margin-bottom: 16px; }
                .v2-summary-p { font-size: 12.5px; line-height: 1.5; color: #333; margin: 4px 0 0 0; }
                .v2-sec-heading { font-size: 15px; font-weight: 700; color: #243B5A; border-bottom: 1.5px solid #243B5A; padding-bottom: 2px; margin: 12px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; }
                .v2-grid { display: flex !important; flex-direction: row !important; gap: 16px !important; }
                .v2-col { flex: 1 !important; width: 48.5% !important; min-width: 0 !important; }
                .v2-sec { margin-bottom: 14px; page-break-inside: avoid !important; break-inside: avoid !important; }
                .v2-item { margin-bottom: 8px; font-size: 12px; page-break-inside: avoid !important; break-inside: avoid !important; }
                .v2-skill-entry { font-size: 11.5px; margin-bottom: 4px; line-height: 1.4; }
                .v2-bold { font-weight: 700; font-size: 12.5px; color: #243B5A; }
                .v2-sub { font-size: 11.5px; font-style: italic; color: #555; display: flex; justify-content: space-between; }
                .v2-right-date { font-weight: 700; font-style: normal; color: #333; }
                .v2-small { font-size: 11.5px; color: #444; margin: 2px 0 4px 0; }
                .v2-ul { margin: 4px 0 0 16px; padding: 0; font-size: 11.5px; line-height: 1.4; }
                .v2-ul li { margin-bottom: 2px; }

                /* ===== PDF VIEWER MODAL ===== */
                .pdf-viewer-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0, 0, 0, 0.82); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: pdfFadeIn 0.2s ease; }
                @keyframes pdfFadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                .pdf-viewer-modal { background: #1a1a2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; width: min(960px, 100%); height: min(92vh, 1100px); display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.6); }
                .pdf-viewer-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: #16213e; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
                .pdf-viewer-title { display: flex; align-items: center; gap: 8px; color: #e2e8f0; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.02em; }
                .pdf-viewer-actions { display: flex; align-items: center; gap: 10px; }
                .pdf-viewer-dl-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; background: #f59e0b; color: white; font-size: 0.8rem; font-weight: 600; text-decoration: none; transition: background 0.2s; }
                .pdf-viewer-dl-btn:hover { background: #d97706; }
                .pdf-viewer-close { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: transparent; color: #94a3b8; cursor: pointer; transition: background 0.2s, color 0.2s; }
                .pdf-viewer-close:hover { background: rgba(239,68,68,0.15); color: #ef4444; }
                .pdf-viewer-body { flex: 1; position: relative; overflow: hidden; }
                .pdf-viewer-iframe { width: 100%; height: 100%; border: none; display: block; }
                .pdf-viewer-fallback { display: none; position: absolute; inset: 0; background: #1a1a2e; align-items: center; justify-content: center; flex-direction: column; gap: 16px; color: #94a3b8; font-size: 0.9rem; text-align: center; }

                @media print { 
                    @page { size: A4; margin: 0.75in 0.5in; }
                    .rv-page { background: white !important; padding: 0 !important; margin: 0 !important; width: 100% !important; } 
                    .rv-toolbar, .rv-print-tip { display: none !important; } 
                    .ats-overlay, .ats-panel, .ats-score-box, .ats-hd, .ats-tips, .ats-footer, .ats-close { display: none !important; }
                    .rv-sheet { box-shadow: none !important; width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; overflow: visible !important; border: none !important; }
                    .rv-content { padding: 0 !important; width: 100% !important; }
                    .rv-hd { grid-template-columns: 1.4fr 2fr 1.4fr !important; gap: 10px !important; }
                    .rv-hd-left, .rv-hd-right { font-size: 10px !important; }
                    .rv-name { font-size: 24px !important; }
                    header, footer, .mobile-drawer { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; }
                    .container { max-width: none !important; padding: 0 !important; margin: 0 !important; }
                    .bu-project { break-before: auto !important; page-break-before: auto !important; }
                    .rv-item, .rv-proj-hd, .rv-ref-item, .rv-skill-row { break-inside: auto !important; page-break-inside: auto !important; }
                    .rv-sec { break-inside: auto !important; page-break-inside: auto !important; margin-bottom: 12px !important; }
                    .rv-sec-hd { break-after: avoid !important; page-break-after: avoid !important; margin-top: 15px !important; }
                    .rv-sec-hd:first-child { margin-top: 0 !important; }
                    .rv-sheet a { pointer-events: auto !important; text-decoration: none !important; }
                    .ep-content { padding: 0 !important; border: none !important; }
                    .ep-name { color: #003399 !important; -webkit-print-color-adjust: exact; }
                    .ep-sec-title { color: #003399 !important; -webkit-print-color-adjust: exact; }
                }
                .pdf-export .rv-content { padding: 0 40px !important; }
                .pdf-export .v2-grid { display: flex !important; flex-direction: row !important; }
                .pdf-export .v2-col { width: 48.5% !important; flex: 1 !important; }
            `}</style>
        </div>
    );
};

export default Resume;
