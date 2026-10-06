import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import VisualCV from '../../components/CV/VisualCV/VisualCV';
import DownloadFileNameModal from '../../components/CV/DownloadFileNameModal';
import { ArrowLeft, FileDown, Loader, Download } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { downloadUpdatedVisualCvTex } from '../../utils/latexSync';

/** Path to the static, pre-compiled Overleaf-generated PDF */
const PDF_FILE_PATH = '/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.pdf';

export const VisualResumePage: React.FC = () => {
    const { data: portfolioData } = usePortfolio();
    const [generating, setGenerating] = useState(false);
    const [showNameModal, setShowNameModal] = useState(false);
    const cvRef = useRef<HTMLDivElement>(null);

    /* ── Execute PDF download with user's selected naming convention ── */
    const handleExecuteDownload = useCallback(async (selectedFileName: string) => {
        if (generating) return;
        setGenerating(true);
        setShowNameModal(false);
        try {
            const res = await fetch(PDF_FILE_PATH);
            const contentType = res.headers.get('content-type') || '';
            if (res.ok && !contentType.includes('text/html')) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = selectedFileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 5000);
            }
        } catch (err) {
            console.error('Visual CV PDF download error:', err);
        }
        setGenerating(false);
    }, [generating]);

    /* ── Download .tex ── */
    const handleDownloadTex = () => {
        downloadUpdatedVisualCvTex(portfolioData.papers || []);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
            <Header />
            <main style={{ paddingTop: '100px', flex: 1, paddingBottom: '60px' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>

                    {/* ── Top Action Toolbar ── */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '24px',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                        <Link
                            to="/resume"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}
                        >
                            <ArrowLeft size={16} /> Change Resume Version
                        </Link>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {/* Download PDF button opens filename selection modal */}
                            <button
                                onClick={() => setShowNameModal(true)}
                                disabled={generating}
                                className="rv-btn"
                                style={{
                                    background: '#f59e0b', color: '#fff', border: 'none',
                                    borderRadius: '8px', padding: '8px 16px',
                                    cursor: generating ? 'not-allowed' : 'pointer',
                                    fontWeight: 600, fontSize: '0.82rem',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    opacity: generating ? 0.7 : 1
                                }}
                            >
                                {generating ? <Loader size={14} className="animate-spin" /> : <FileDown size={14} />}
                                {generating ? 'Downloading…' : 'Download PDF'}
                            </button>

                            {/* Download .tex */}
                            <button
                                onClick={handleDownloadTex}
                                style={{
                                    background: '#0284c7', color: '#fff', border: 'none',
                                    borderRadius: '8px', padding: '8px 16px',
                                    cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                }}
                            >
                                <Download size={14} /> Download .tex
                            </button>
                        </div>
                    </div>

                    {/* ── Live HTML Preview (web rendering) ── */}
                    <div ref={cvRef}>
                        <VisualCV />
                    </div>

                    {/* ── Professional File Naming Convention Suggestion Modal ── */}
                    <DownloadFileNameModal
                        isOpen={showNameModal}
                        onClose={() => setShowNameModal(false)}
                        onConfirmDownload={handleExecuteDownload}
                        isGenerating={generating}
                        cvVersionName="Visual CV"
                        versionSpecificDefault="Shah_Abdul_Mazid_Visual_CV_Version_2.pdf"
                    />

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default VisualResumePage;
