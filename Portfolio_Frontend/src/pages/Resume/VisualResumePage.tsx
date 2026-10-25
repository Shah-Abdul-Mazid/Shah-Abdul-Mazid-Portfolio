﻿import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import VisualCV from '../../components/CV/VisualCV/VisualCV';
import DownloadFileNameModal from '../../components/CV/DownloadFileNameModal';
import { ArrowLeft, FileDown, Loader, Download, Eye, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { downloadUpdatedVisualCvTex } from '../../utils/latexSync';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
 * Generates an ultra-crisp 2-page A4 PDF capturing the live Visual CV DOM,
 * guaranteeing all education results, updated coursework, and links are fully embedded.
 */
async function generateVisualPdfBlob(container: HTMLElement): Promise<Blob> {
    const imgs = Array.from(container.querySelectorAll('img')) as HTMLImageElement[];
    const origSrcs: string[] = [];

    await Promise.all(imgs.map(async (img, i) => {
        origSrcs[i] = img.src;
        if (!img.src.startsWith('data:')) {
            const b64 = await fetchImageAsBase64(img.src);
            if (b64) img.src = b64;
        }
    }));

    await new Promise(r => requestAnimationFrame(r));

    const pages = Array.from(container.querySelectorAll('.v2-page')) as HTMLElement[];
    const targetElements = pages.length > 0 ? pages : [container];

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageW = 210;
    const pageH = 297;

    try {
        for (let i = 0; i < targetElements.length; i++) {
            const el = targetElements[i];
            const canvas = await html2canvas(el, {
                scale: 2.5,
                useCORS: true,
                allowTaint: false,
                logging: false,
                backgroundColor: '#ffffff',
            });
            if (i > 0) pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pageW, pageH);

            try {
                const pRect = el.getBoundingClientRect();
                if (pRect.width > 0 && pRect.height > 0) {
                    const scaleX = pageW / pRect.width;
                    const scaleY = pageH / pRect.height;
                    const links = Array.from(el.querySelectorAll('a')) as HTMLAnchorElement[];
                    for (const link of links) {
                        if (!link.href) continue;
                        const rects = Array.from(link.getClientRects());
                        for (const r of rects) {
                            const x = (r.left - pRect.left) * scaleX;
                            const y = (r.top - pRect.top) * scaleY;
                            const w = r.width * scaleX;
                            const h = r.height * scaleY;
                            pdf.link(x, y, w, h, { url: link.href });
                        }
                    }
                }
            } catch {}
        }
    } finally {
        imgs.forEach((img, i) => { img.src = origSrcs[i]; });
    }

    return pdf.output('blob');
}


export const VisualResumePage: React.FC = () => {
    const { data: portfolioData } = usePortfolio();
    const [generating, setGenerating] = useState(false);
    const [showNameModal, setShowNameModal] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [viewerLoading, setViewerLoading] = useState(false);
    const cvRef = useRef<HTMLDivElement>(null);

    /* ── Execute PDF download with user's selected naming convention ── */
    const handleExecuteDownload = useCallback(async (selectedFileName: string) => {
        if (generating) return;
        setGenerating(true);
        setShowNameModal(false);
        try {
            if (cvRef.current) {
                const blob = await generateVisualPdfBlob(cvRef.current);
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

    /* ── Instant Live PDF Preview ── */
    const handleViewPdf = useCallback(async () => {
        if (!cvRef.current || viewerLoading) return;
        setShowPdfViewer(true);
        setViewerLoading(true);
        try {
            const blob = await generateVisualPdfBlob(cvRef.current);
            const url = URL.createObjectURL(blob);
            if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
            setPdfBlobUrl(url);
        } catch (err) {
            console.error('Failed to preview Visual CV PDF:', err);
        }
        setViewerLoading(false);
    }, [viewerLoading, pdfBlobUrl]);

    const handleCloseViewer = () => {
        setShowPdfViewer(false);
        if (pdfBlobUrl) {
            URL.revokeObjectURL(pdfBlobUrl);
            setPdfBlobUrl(null);
        }
    };

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
                            {/* Preview PDF */}
                            <button
                                onClick={handleViewPdf}
                                disabled={viewerLoading}
                                style={{
                                    background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '8px', padding: '8px 16px',
                                    cursor: viewerLoading ? 'not-allowed' : 'pointer',
                                    fontWeight: 600, fontSize: '0.82rem',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                }}
                            >
                                {viewerLoading ? <Loader size={14} className="animate-spin" /> : <Eye size={14} />}
                                {viewerLoading ? 'Preparing…' : 'Preview PDF'}
                            </button>

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

                    {/* ── PDF Preview Modal ── */}
                    {showPdfViewer && (
                        <div style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            background: 'rgba(0,0,0,0.85)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            padding: '16px'
                        }}>
                            <div style={{
                                width: '100%', maxWidth: '920px', height: '90vh',
                                background: '#1e293b', borderRadius: '12px',
                                display: 'flex', flexDirection: 'column',
                                overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 18px', background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                                        PDF Preview — Visual CV
                                    </span>
                                    <button
                                        onClick={handleCloseViewer}
                                        style={{
                                            background: 'transparent', border: 'none', color: '#94a3b8',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px'
                                        }}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <div style={{ flex: 1, background: '#334155', position: 'relative' }}>
                                    {viewerLoading ? (
                                        <div style={{
                                            height: '100%', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#cbd5e1'
                                        }}>
                                            <Loader size={28} className="animate-spin text-amber-500" />
                                            <p style={{ fontSize: '0.9rem' }}>Generating high-resolution PDF preview…</p>
                                        </div>
                                    ) : pdfBlobUrl ? (
                                        <iframe
                                            src={`${pdfBlobUrl}#toolbar=1`}
                                            style={{ width: '100%', height: '100%', border: 'none' }}
                                            title="PDF Preview"
                                        />
                                    ) : (
                                        <div style={{
                                            height: '100%', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', color: '#ef4444'
                                        }}>
                                            Failed to generate preview. Please use Download PDF instead.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default VisualResumePage;