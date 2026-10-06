import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import VisualCV from "../../components/CV/VisualCV/VisualCV";
import { ArrowLeft, Download, Eye, FileDown, Loader, X } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { downloadUpdatedVisualCvTex } from "../../utils/latexSync";

/** Path to the static, pre-compiled Overleaf-generated PDF */
const PDF_FILE_PATH = "/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.pdf";

/** Download the static PDF directly from public/resume/ */
async function downloadStaticPdf(fileName: string): Promise<boolean> {
  try {
    const res = await fetch(PDF_FILE_PATH);
    const contentType = res.headers.get("content-type") || "";
    if (res.ok && !contentType.includes("text/html")) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
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
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [viewerLoading, setViewerLoading] = useState(false);

  /* ── Download PDF ── */
  const handleDownloadPdf = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    await downloadStaticPdf("Shah_Abdul_Mazid_Visual_CV.pdf");
    setDownloading(false);
  }, [downloading]);

  /* ── View PDF Modal ── */
  const handleViewPdf = useCallback(() => {
    setViewerLoading(true);
    setShowPdfViewer(true);
    // Give the iframe a moment to start loading
    setTimeout(() => setViewerLoading(false), 800);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setShowPdfViewer(false);
    setViewerLoading(false);
  }, []);

  /* ── Download .tex ── */
  const handleDownloadTex = () => {
    downloadUpdatedVisualCvTex(portfolioData.papers || []);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-color)",
      }}
    >
      <Header />
      <main style={{ paddingTop: "100px", flex: 1, paddingBottom: "60px" }}>
        <div
          className="container"
          style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}
        >
          {/* ── Top Action Toolbar ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "24px",
              background: "rgba(255,255,255,0.04)",
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Link
              to="/resume"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#94a3b8",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              <ArrowLeft size={16} /> Change Resume Version
            </Link>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {/* View PDF */}
              <button
                onClick={handleViewPdf}
                className="rv-btn"
                style={{
                  background: "#8b5cf6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Eye size={14} /> View PDF
              </button>

              {/* Download PDF */}
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="rv-btn"
                style={{
                  background: "#f59e0b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  cursor: downloading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  opacity: downloading ? 0.7 : 1,
                }}
              >
                {downloading ? (
                  <Loader size={14} className="rv-spin" />
                ) : (
                  <FileDown size={14} />
                )}
                {downloading ? "Downloading…" : "Download PDF"}
              </button>

              {/* Download .tex */}
              <button
                onClick={handleDownloadTex}
                className="rv-btn"
                style={{
                  background: "#0284c7",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Download size={14} /> Download .tex
              </button>
            </div>
          </div>

          {/* ── PDF Viewer Modal ── */}
          {showPdfViewer && (
            <div
              className="pdf-viewer-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) handleCloseViewer();
              }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0,0,0,0.82)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <div
                className="pdf-viewer-modal"
                style={{
                  background: "#1a1a2e",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  width: "100%",
                  maxWidth: "900px",
                  height: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                }}
              >
                {/* Modal Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#e2e8f0",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                    }}
                  >
                    <Eye size={16} />
                    <span>Visual CV — PDF Preview</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={handleDownloadPdf}
                      disabled={downloading}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#f59e0b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "7px 12px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        opacity: downloading ? 0.7 : 1,
                      }}
                    >
                      <FileDown size={14} />
                      {downloading ? "Downloading…" : "Download"}
                    </button>
                    <button
                      onClick={handleCloseViewer}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.08)",
                        color: "#94a3b8",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        width: "34px",
                        height: "34px",
                        cursor: "pointer",
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Modal Body — iframe */}
                <div
                  style={{ flex: 1, position: "relative", overflow: "hidden" }}
                >
                  {viewerLoading && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        color: "#94a3b8",
                        fontSize: "0.9rem",
                        background: "#1a1a2e",
                      }}
                    >
                      <Loader size={20} className="rv-spin" /> Loading PDF…
                    </div>
                  )}
                  <iframe
                    src={`${PDF_FILE_PATH}#toolbar=1&navpanes=0&scrollbar=1`}
                    title="Visual CV PDF Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "block",
                    }}
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}

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
