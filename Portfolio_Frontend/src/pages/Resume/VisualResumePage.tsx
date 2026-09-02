import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import VisualCV from '../../components/CV/VisualCV/VisualCV';
import { ArrowLeft, Download, Eye, FileDown, Loader, Printer, X } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const VisualResumePage: React.FC = () => {
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [generating, setGenerating] = useState(false);
    const cvRef = useRef<HTMLDivElement>(null);

    const pdfPath = '/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.pdf';
    const texPath = '/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.tex';

    const handleDownloadPdf = async () => {
        setGenerating(true);
        try {
            // First try downloading static file
            const res = await fetch(pdfPath, { method: 'HEAD' });
            if (res.ok && res.headers.get('content-type')?.includes('pdf')) {
                const link = document.createElement('a');
                link.href = pdfPath;
                link.download = 'Shah_Abdul_Mazid_Visual_CV_Version_2.pdf';
                link.click();
                setGenerating(false);
                return;
            }
        } catch (e) {
            // Fallback to html2pdf live generation
        }

        // Live PDF Generation Fallback using html2pdf
        if (cvRef.current) {
            try {
                const opt = {
                    margin: [10, 10, 10, 10],
                    filename: 'Shah_Abdul_Mazid_Visual_CV_Version_2.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['css', 'legacy'] },
                };
                await (html2pdf() as any).set(opt).from(cvRef.current).save();
            } catch (err) {
                console.error("Live PDF Generation error:", err);
                window.print();
            }
        }
        setGenerating(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
            <Header />
            <main style={{ paddingTop: '100px', flex: 1, paddingBottom: '60px' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
                    {/* Top Action Toolbar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', background: 'rgba(255,255,255,0.04)', padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Link to="/resume" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                            <ArrowLeft size={16} /> Change Resume Version
                        </Link>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button onClick={() => setShowPdfViewer(true)} className="rv-btn" style={{ background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Eye size={14} /> View PDF
                            </button>
                            <button onClick={handleDownloadPdf} disabled={generating} className="rv-btn" style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                {generating ? <Loader size={14} className="rv-spin" /> : <FileDown size={14} />}
                                {generating ? 'Generating PDF…' : 'Download Visual CV (PDF)'}
                            </button>
                            <a href={texPath} download="Shah_Abdul_Mazid_Visual_CV_Version_2.tex" className="rv-btn" style={{ background: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: '8px', padding: '8px 14px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Download size={14} /> Download .tex
                            </a>
                            <button onClick={() => window.print()} className="rv-btn" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Printer size={14} /> Print
                            </button>
                        </div>
                    </div>

                    {/* PDF Viewer Modal */}
                    {showPdfViewer && (
                        <div className="pdf-viewer-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowPdfViewer(false); }}>
                            <div className="pdf-viewer-modal">
                                <div className="pdf-viewer-header">
                                    <div className="pdf-viewer-title">
                                        <Eye size={16} />
                                        <span>Visual CV — Version 2 (PDF)</span>
                                    </div>
                                    <div className="pdf-viewer-actions">
                                        <button onClick={handleDownloadPdf} className="pdf-viewer-dl-btn" style={{ cursor: 'pointer', border: 'none' }}>
                                            <FileDown size={15} /> Download PDF
                                        </button>
                                        <button onClick={() => setShowPdfViewer(false)} className="pdf-viewer-close">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="pdf-viewer-body" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <iframe src={`${pdfPath}#toolbar=1&navpanes=0&scrollbar=1`} title="Visual CV PDF" className="pdf-viewer-iframe" style={{ flex: 1, border: 'none' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Visual CV Component Wrapped in Ref */}
                    <div ref={cvRef}>
                        <VisualCV />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default VisualResumePage;
