import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ATSCV from '../../components/CV/ATSCV/ATSCV';
import { ArrowLeft, Download, Eye, FileDown, Loader, Printer, X } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const ATSResumePage: React.FC = () => {
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [viewerLoading, setViewerLoading] = useState(false);
    const cvRef = useRef<HTMLDivElement>(null);

    const texPath = '/resume/Shah_Abdul_Mazid_ATS_CV_Version_1.tex';

    const getHtml2PdfOpts = () => ({
        margin: [10, 10, 10, 10],
        filename: 'Shah_Abdul_Mazid_ATS_CV_Version_1.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
    });

    const handleDownloadPdf = async () => {
        setGenerating(true);
        if (cvRef.current) {
            try {
                await (html2pdf() as any).set(getHtml2PdfOpts()).from(cvRef.current).save();
            } catch (err) {
                console.error("Live PDF Generation error:", err);
                window.print();
            }
        }
        setGenerating(false);
    };

    const handleViewPdf = useCallback(async () => {
        setShowPdfViewer(true);
        setViewerLoading(true);
        if (cvRef.current) {
            try {
                const blob: Blob = await (html2pdf() as any)
                    .set(getHtml2PdfOpts())
                    .from(cvRef.current)
                    .outputPdf('blob');
                const url = URL.createObjectURL(blob);
                if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
                setPdfBlobUrl(url);
            } catch (err) {
                console.error("PDF preview generation error:", err);
            }
        }
        setViewerLoading(false);
    }, [pdfBlobUrl]);

    const handleCloseViewer = () => {
        setShowPdfViewer(false);
        if (pdfBlobUrl) {
            URL.revokeObjectURL(pdfBlobUrl);
            setPdfBlobUrl(null);
        }
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
                            <button onClick={handleViewPdf} className="rv-btn" style={{ background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Eye size={14} /> View PDF
                            </button>
                            <button onClick={handleDownloadPdf} disabled={generating} className="rv-btn" style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                {generating ? <Loader size={14} className="rv-spin" /> : <FileDown size={14} />}
                                {generating ? 'Generating PDF…' : 'Download ATS CV (PDF)'}
                            </button>
                            <a href={texPath} download="Shah_Abdul_Mazid_ATS_CV_Version_1.tex" className="rv-btn" style={{ background: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: '8px', padding: '8px 14px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Download size={14} /> Download .tex
                            </a>
                            <button onClick={() => window.print()} className="rv-btn" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Printer size={14} /> Print
                            </button>
                        </div>
                    </div>

                    {/* PDF Viewer Modal — Live Generated */}
                    {showPdfViewer && (
                        <div className="pdf-viewer-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseViewer(); }}>
                            <div className="pdf-viewer-modal">
                                <div className="pdf-viewer-header">
                                    <div className="pdf-viewer-title">
                                        <Eye size={16} />
                                        <span>ATS CV — Version 1 (Live Preview)</span>
                                    </div>
                                    <div className="pdf-viewer-actions">
                                        <button onClick={handleDownloadPdf} className="pdf-viewer-dl-btn" style={{ cursor: 'pointer', border: 'none' }}>
                                            <FileDown size={15} /> Download PDF
                                        </button>
                                        <button onClick={handleCloseViewer} className="pdf-viewer-close">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="pdf-viewer-body" style={{ display: 'flex', flexDirection: 'column' }}>
                                    {viewerLoading ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '10px', color: '#94a3b8', padding: '40px' }}>
                                            <Loader size={20} className="rv-spin" /> Generating live PDF preview…
                                        </div>
                                    ) : pdfBlobUrl ? (
                                        <iframe src={`${pdfBlobUrl}#toolbar=1&navpanes=0&scrollbar=1`} title="ATS CV PDF" className="pdf-viewer-iframe" style={{ flex: 1, border: 'none' }} />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8', padding: '40px' }}>
                                            Failed to generate preview. Please use Download PDF instead.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main ATS CV Component Wrapped in Ref */}
                    <div ref={cvRef}>
                        <ATSCV />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ATSResumePage;
