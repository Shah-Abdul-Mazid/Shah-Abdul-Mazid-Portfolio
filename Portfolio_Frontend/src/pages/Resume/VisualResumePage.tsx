import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import VisualCV from '../../components/CV/VisualCV/VisualCV';
import { ArrowLeft, FileDown, Loader, Download } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { downloadUpdatedVisualCvTex } from '../../utils/latexSync';

/** Path to the static, pre-compiled Overleaf-generated PDF */
const PDF_FILE_PATH = '/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.pdf';

/** Download the static PDF directly from public/resume/ */
async function downloadStaticPdf(fileName: string): Promise<boolean> {
    try {
        const res = await fetch(PDF_FILE_PATH);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && !contentType.includes('text/html')) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
            return true;
        }
    } catch {
        // fall through
    }
    return false;
}

export const VisualResumePage: React.FC = () => {
    const { data: portfolioData } = usePortfolio();
    const [downloading, setDownloading] = useState(false);

    /* ── Download PDF ── */
    const handleDownloadPdf = useCallback(async () => {
        if (downloading) return;
        setDownloading(true);
        await downloadStaticPdf('Shah_Abdul_Mazid_Visual_CV.pdf');
        setDownloading(false);
    }, [downloading]);

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
                            {/* Download PDF */}
                            <button
                                onClick={handleDownloadPdf}
                                disabled={downloading}
                                style={{
                                    background: '#f59e0b', color: '#fff', border: 'none',
                                    borderRadius: '8px', padding: '8px 16px',
                                    cursor: downloading ? 'not-allowed' : 'pointer',
                                    fontWeight: 600, fontSize: '0.82rem',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    opacity: downloading ? 0.7 : 1
                                }}
                            >
                                {downloading ? <Loader size={14} /> : <FileDown size={14} />}
                                {downloading ? 'Downloading…' : 'Download PDF'}
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
                    <div>
                        <VisualCV />
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default VisualResumePage;
