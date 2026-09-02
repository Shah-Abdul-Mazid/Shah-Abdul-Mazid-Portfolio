import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Sparkles, FileText, Layout, Download, Eye } from 'lucide-react';

export const ResumeSelectorPage: React.FC = () => {
    return (
        <div className="resume-selector-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
            <Header />
            <main style={{ paddingTop: '110px', flex: 1, paddingBottom: '60px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
                            <Sparkles size={16} /> Choose Your Preferred Resume Format
                        </div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary, #ffffff)', margin: '0 0 12px 0' }}>
                            My Curriculum Vitae
                        </h1>
                        <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Select between the modern two-column Visual CV or the traditional single-column ATS CV. Both versions are fully independent and downloadable.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', maxWidth: '850px', margin: '0 auto' }}>
                        {/* CARD 1: VISUAL CV VERSION 2 */}
                        <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}>
                            <div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #243B5A, #2F527F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '20px' }}>
                                    <Layout size={24} />
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3b82f6' }}>
                                    Recommended for Humans
                                </span>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '8px 0 12px 0' }}>
                                    Visual CV
                                </h2>
                                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 600, marginBottom: '16px' }}>
                                    Version 2 — Modern 2-Column
                                </span>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                                    Features a modern navy header, profile photo, 2-column balanced layout, technical skills breakdown, and compact project presentation.
                                </p>
                            </div>
                            <div>
                                <Link to="/resume/visual" className="rv-btn rv-solid" style={{ width: '100%', justifyContent: 'center', padding: '12px', background: '#2563eb', color: '#fff', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <Eye size={16} /> View Visual CV
                                </Link>
                                <a href="/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.pdf" download style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', marginTop: '10px', fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'none' }}>
                                    <Download size={14} /> Download PDF Version 2
                                </a>
                            </div>
                        </div>

                        {/* CARD 2: ATS CV VERSION 1 */}
                        <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}>
                            <div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '20px' }}>
                                    <FileText size={24} />
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#10b981' }}>
                                    Recommended for Recruiters
                                </span>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '8px 0 12px 0' }}>
                                    ATS CV
                                </h2>
                                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 600, marginBottom: '16px' }}>
                                    Version 1 — Traditional Single-Column
                                </span>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                                    Clean, single-column traditional layout optimized for Applicant Tracking Systems (ATS), containing complete detailed experience and project descriptions.
                                </p>
                            </div>
                            <div>
                                <Link to="/resume/ats" className="rv-btn rv-solid" style={{ width: '100%', justifyContent: 'center', padding: '12px', background: '#059669', color: '#fff', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <Eye size={16} /> View ATS CV
                                </Link>
                                <a href="/resume/Shah_Abdul_Mazid_ATS_CV_Version_1.pdf" download style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', marginTop: '10px', fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'none' }}>
                                    <Download size={14} /> Download PDF Version 1
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ResumeSelectorPage;
