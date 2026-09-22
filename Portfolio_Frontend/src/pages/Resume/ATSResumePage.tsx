import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ATSCV from '../../components/CV/ATSCV/ATSCV';
import { ArrowLeft, Download, FileDown, Loader, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PDF_FILENAME = 'Shah_Abdul_Mazid_ATS_CV_Version_1.pdf';

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
 * Temporarily replaces img src with base64 so html2canvas can capture them,
 * then restores the original src.
 */
async function generatePdfBlob(element: HTMLElement): Promise<Blob> {
    const imgs = Array.from(element.querySelectorAll('img')) as HTMLImageElement[];
    const origSrcs: string[] = [];

    await Promise.all(imgs.map(async (img, i) => {
        origSrcs[i] = img.src;
        if (!img.src.startsWith('data:')) {
            const b64 = await fetchImageAsBase64(img.src);
            if (b64) img.src = b64;
        }
    }));

    await new Promise(r => requestAnimationFrame(r));

    let canvas: HTMLCanvasElement;
    try {
        canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            logging: false,
            backgroundColor: '#ffffff',
        });
    } finally {
        imgs.forEach((img, i) => { img.src = origSrcs[i]; });
    }

    const pageW = 210;
    const pageH = 297;
    const margin = 10;
    const contentW = pageW - margin * 2;
    const contentH = pageH - margin * 2;

    const imgW = canvas.width;
    const imgH = canvas.height;
    const ratio = imgW / imgH;
    const renderedH = contentW / ratio;

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    if (renderedH <= contentH) {
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', margin, margin, contentW, renderedH);
    } else {
        const sliceHeightPx = Math.floor((contentH / renderedH) * imgH);
        let offsetPx = 0;
        let isFirstPage = true;

        while (offsetPx < imgH) {
            const sliceH = Math.min(sliceHeightPx, imgH - offsetPx);
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = imgW;
            sliceCanvas.height = sliceH;
            const ctx = sliceCanvas.getContext('2d')!;
            ctx.drawImage(canvas, 0, offsetPx, imgW, sliceH, 0, 0, imgW, sliceH);

            const sliceRenderedH = (sliceH / sliceHeightPx) * contentH;

            if (!isFirstPage) pdf.addPage();
            pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', margin, margin, contentW, sliceRenderedH);

            offsetPx += sliceH;
            isFirstPage = false;
        }
    }

    return pdf.output('blob');
}

export const ATSResumePage: React.FC = () => {
    const [generating, setGenerating] = useState(false);
    const cvRef = useRef<HTMLDivElement>(null);

    const texPath = '/resume/Shah_Abdul_Mazid_ATS_CV_Version_1.tex';

    const handleDownloadPdf = useCallback(async () => {
        if (!cvRef.current || generating) return;
        setGenerating(true);
        try {
            const blob = await generatePdfBlob(cvRef.current);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = PDF_FILENAME;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
        } catch (err) {
            console.error('ATS CV PDF download error:', err);
            window.print();
        }
        setGenerating(false);
    }, [generating]);

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
                                style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: generating ? 0.7 : 1 }}
                            >
                                {generating ? <Loader size={14} className="rv-spin" /> : <FileDown size={14} />}
                                {generating ? 'Generating PDF…' : 'Download ATS CV (PDF)'}
                            </button>
                            <a
                                href={texPath}
                                download="Shah_Abdul_Mazid_ATS_CV_Version_1.tex"
                                className="rv-btn"
                                style={{ background: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: '8px', padding: '8px 14px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Download size={14} /> Download .tex
                            </a>
                            <button
                                onClick={() => window.print()}
                                className="rv-btn"
                                style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Printer size={14} /> Print
                            </button>
                        </div>
                    </div>

                    {/* Main ATS CV Component */}
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
