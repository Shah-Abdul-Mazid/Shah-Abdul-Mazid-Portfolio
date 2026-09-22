import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import VisualCV from '../../components/CV/VisualCV/VisualCV';
import { ArrowLeft, Download, Eye, FileDown, Printer, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { downloadUpdatedVisualCvTex } from '../../utils/latexSync';

export const VisualResumePage: React.FC = () => {
    const { data: portfolioData } = usePortfolio();
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const cvRef = useRef<HTMLDivElement>(null);

    const pdfPath = '/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.pdf';

    const handleViewPdf = () => {
        setShowPdfViewer(true);
    };

    const handleCloseViewer = () => {
        setShowPdfViewer(false);
    };

    const handleDownloadTex = () => {
        downloadUpdatedVisualCvTex(portfolioData.papers || []);
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
                            <a href={pdfPath} download="Shah_Abdul_Mazid_Visual_CV_Version_2.pdf" className="rv-btn" style={{ background: '#f59e0b', color: '#fff', textDecoration: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <FileDown size={14} /> Download Visual CV (PDF)
                            </a>
                            <button onClick={handleDownloadTex} className="rv-btn" style={{ background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Download size={14} /> Download .tex
                            </button>
                            <button onClick={() => window.print()} className="rv-btn" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Printer size={14} /> Print
                            </button>
                        </div>
                    </div>

                    {/* PDF Viewer Modal */}
                    {showPdfViewer && (
                        <div className="pdf-viewer-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseViewer(); }}>
                            <div className="pdf-viewer-modal">
                                <div className="pdf-viewer-header">
                                    <div className="pdf-viewer-title">
                                        <Eye size={16} />
                                        <span>Visual CV — Version 2 (PDF Preview)</span>
                                    </div>
                                    <div className="pdf-viewer-actions">
                                        <a href={pdfPath} download="Shah_Abdul_Mazid_Visual_CV_Version_2.pdf" className="pdf-viewer-dl-btn" style={{ cursor: 'pointer', border: 'none', textDecoration: 'none' }}>
                                            <FileDown size={15} /> Download PDF
                                        </a>
                                        <button onClick={handleCloseViewer} className="pdf-viewer-close">
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
