import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import VisualCV from '../../components/CV/VisualCV/VisualCV';
import { ArrowLeft, Download, FileDown, Loader, Printer } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { downloadUpdatedVisualCvTex } from '../../utils/latexSync';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


const PDF_FILENAME = 'Shah_Abdul_Mazid_Visual_CV_Version_2.pdf';
const PDF_FILE_PATH = '/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.pdf';

/** Fetch an image URL and return it as a base64 data URL */
async function fetchImageAsBase64(url: string): Promise<string | null> {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(null);
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

/**
 * Generate a PDF blob from a DOM element.
 * Temporarily replaces avatar <img> src with base64 so html2canvas can capture it,
 * then restores the original src.
 */
async function generatePdfBlob(element: HTMLElement): Promise<Blob> {
    const page1 = element.querySelector('#cv-page-1') as HTMLElement | null;
    const page2 = element.querySelector('#cv-page-2') as HTMLElement | null;

    // Find all img tags and swap to base64 if needed
    const imgs = Array.from(element.querySelectorAll('img')) as HTMLImageElement[];
    const origSrcs: string[] = [];

    await Promise.all(imgs.map(async (img, i) => {
        origSrcs[i] = img.src;
        // Only swap if the src is a relative/absolute path (not already base64)
        if (!img.src.startsWith('data:')) {
            const b64 = await fetchImageAsBase64(img.src);
            if (b64) img.src = b64;
        }
    }));

    // Give browser a tick to apply new src values
    await new Promise(r => requestAnimationFrame(r));

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const attachLinks = (pageEl: HTMLElement) => {
        const pRect = pageEl.getBoundingClientRect();
        if (pRect.width === 0 || pRect.height === 0) return;
        const scaleX = 210 / pRect.width;
        const scaleY = 297 / pRect.height;
        const links = Array.from(pageEl.querySelectorAll('a')) as HTMLAnchorElement[];
        for (const link of links) {
            if (!link.href) continue;
            const rects = Array.from(link.getClientRects());
            for (const r of rects) {
                const x = (r.left - pRect.left) * scaleX;
                const y = (r.top - pRect.top) * scaleY;
                const w = r.width * scaleX;
                const h = r.height * scaleY;
                if (w > 0 && h > 0) {
                    pdf.link(x, y, w, h, { url: link.href });
                }
            }
        }
    };

    try {
        if (page1 && page2) {
            // Render Page 1 — exact 210mm x 297mm
            const canvas1 = await html2canvas(page1, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: false,
                backgroundColor: '#ffffff',
            });
            pdf.addImage(canvas1.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
            attachLinks(page1);

            // Add Page 2 — exact 210mm x 297mm
            pdf.addPage();
            const canvas2 = await html2canvas(page2, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: false,
                backgroundColor: '#ffffff',
            });
            pdf.addImage(canvas2.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
            attachLinks(page2);
        } else {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: false,
                backgroundColor: '#ffffff',
            });
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
            attachLinks(element);
        }
    } finally {
        // Always restore original srcs
        imgs.forEach((img, i) => { img.src = origSrcs[i]; });
    }

    return pdf.output('blob');
}

export const VisualResumePage: React.FC = () => {
    const { data: portfolioData } = usePortfolio();
    const [generating, setGenerating] = useState(false);
    const cvRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = useCallback(async () => {
        if (generating) return;
        setGenerating(true);

        try {
            const res = await fetch(PDF_FILE_PATH);
            const contentType = res.headers.get('content-type') || '';
            if (res.ok && !contentType.includes('text/html')) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = PDF_FILENAME;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 5000);
                setGenerating(false);
                return;
            }
        } catch {
            // Fall through to dynamic generator
        }

        try {
            if (cvRef.current) {
                const blob = await generatePdfBlob(cvRef.current);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = PDF_FILENAME;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 5000);
            }
        } catch (err) {
            console.error('Visual CV PDF download error:', err);
            window.print();
        }
        setGenerating(false);
    }, [generating]);

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
                            <button
                                onClick={handleDownloadPdf}
                                disabled={generating}
                                className="rv-btn"
                                style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: generating ? 0.7 : 1 }}
                            >
                                {generating ? <Loader size={14} className="rv-spin" /> : <FileDown size={14} />}
                                {generating ? 'Generating PDF…' : 'Download Visual CV (PDF)'}
                            </button>
                            <button
                                onClick={handleDownloadTex}
                                className="rv-btn"
                                style={{ background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Download size={14} /> Download .tex
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="rv-btn"
                                style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Printer size={14} /> Print
                            </button>
                        </div>
                    </div>

                    {/* Main Visual CV Component */}
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
