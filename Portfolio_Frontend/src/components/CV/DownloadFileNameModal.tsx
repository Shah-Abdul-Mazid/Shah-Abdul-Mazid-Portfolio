import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, FileDown, Edit3, Check, FileText } from 'lucide-react';

interface DownloadFileNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmDownload: (fileName: string) => void;
    isGenerating?: boolean;
    cvVersionName?: string;
    versionSpecificDefault?: string;
}

export const DownloadFileNameModal: React.FC<DownloadFileNameModalProps> = ({
    isOpen,
    onClose,
    onConfirmDownload,
    isGenerating = false,
    cvVersionName = 'Visual CV',
    versionSpecificDefault = 'Shah_Abdul_Mazid_Visual_CV_Version_2.pdf',
}) => {
    const corporatePresets = [
        {
            id: 'role_resume',
            name: 'Shah_Abdul_Mazid_AI_Engineer_Resume.pdf',
            label: 'Role-Specific Corporate (Recommended)',
            desc: 'Targeted format preferred by AI / ML hiring teams & technical leads',
            tag: 'Recommended',
        },
        {
            id: 'general_resume',
            name: 'Shah_Abdul_Mazid_Resume.pdf',
            label: 'Concise Corporate Resume',
            desc: 'Clean underscore format universally standard across tech recruiters',
            tag: 'Popular',
        },
        {
            id: 'hyphen_resume',
            name: 'Shah-Abdul-Mazid-Resume.pdf',
            label: 'ATS-Friendly Hyphenated Resume',
            desc: 'Hyphenated kebab-case format optimized for automated ATS parsers',
            tag: 'ATS Standard',
        },
        {
            id: 'general_cv',
            name: 'Shah_Abdul_Mazid_CV.pdf',
            label: 'International / Academic CV',
            desc: 'Standard format for research positions, academia & international roles',
            tag: 'Academic',
        },
        {
            id: 'version_specific',
            name: versionSpecificDefault,
            label: `${cvVersionName} Archive Version`,
            desc: 'Includes version numbering for your records and documentation',
            tag: 'Versioned',
        },
    ];

    const [selectedOption, setSelectedOption] = useState<string>('role_resume');
    const [customName, setCustomName] = useState<string>('Shah_Abdul_Mazid_AI_Engineer');
    const customInputRef = useRef<HTMLInputElement>(null);

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedOption('role_resume');
        }
    }, [isOpen]);

    // Focus input when custom option selected
    useEffect(() => {
        if (selectedOption === 'custom' && customInputRef.current) {
            customInputRef.current.focus();
            customInputRef.current.select();
        }
    }, [selectedOption]);

    if (!isOpen) return null;

    const sanitizeFileName = (name: string): string => {
        const trimmed = name.trim();
        if (!trimmed) return versionSpecificDefault || 'Shah_Abdul_Mazid_Resume.pdf';
        let clean = trimmed.replace(/[\\/:*?"<>|]/g, '_');
        if (!clean.toLowerCase().endsWith('.pdf')) {
            clean += '.pdf';
        }
        return clean;
    };

    const handleDownload = () => {
        if (isGenerating) return;
        if (selectedOption === 'custom') {
            const finalName = sanitizeFileName(customName);
            onConfirmDownload(finalName);
        } else {
            const preset = corporatePresets.find(p => p.id === selectedOption);
            onConfirmDownload(preset ? preset.name : versionSpecificDefault);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleDownload();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const modalContent = (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                zIndex: 999999, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'rgba(0,0,0,0.72)', 
                backdropFilter: 'blur(8px)', 
                padding: '16px' 
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            onKeyDown={handleKeyDown}
        >
            <div 
                style={{
                    background: '#131826',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '560px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06)',
                    color: '#f8fafc',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '90vh',
                }}
            >
                {/* Modal Header */}
                <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
                            <FileDown size={22} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                                Download CV / Resume
                            </h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                                Select a professional naming format convention for your file
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#94a3b8';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body / Preset Options */}
                <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>
                    {corporatePresets.map((preset) => {
                        const isSelected = selectedOption === preset.id;
                        return (
                            <div
                                key={preset.id}
                                onClick={() => setSelectedOption(preset.id)}
                                onDoubleClick={handleDownload}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: isSelected ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                                    background: isSelected ? 'rgba(245, 158, 11, 0.09)' : 'rgba(255, 255, 255, 0.02)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: isSelected ? '2px solid #f59e0b' : '2px solid #64748b',
                                            background: isSelected ? '#f59e0b' : 'transparent',
                                            flexShrink: 0,
                                            boxSizing: 'border-box',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#ffffff',
                                        }}
                                    >
                                        {isSelected && <Check size={12} strokeWidth={3} />}
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: isSelected ? '#ffffff' : '#f1f5f9', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                                                {preset.name}
                                            </span>
                                            {preset.tag && (
                                                <span
                                                    style={{
                                                        fontSize: '0.68rem',
                                                        padding: '1px 7px',
                                                        borderRadius: '999px',
                                                        fontWeight: 700,
                                                        background: preset.tag === 'Recommended' ? 'rgba(245, 158, 11, 0.2)' : preset.tag === 'ATS Standard' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.15)',
                                                        color: preset.tag === 'Recommended' ? '#fbbf24' : preset.tag === 'ATS Standard' ? '#34d399' : '#cbd5e1',
                                                        border: preset.tag === 'Recommended' ? '1px solid rgba(245, 158, 11, 0.3)' : 'none',
                                                    }}
                                                >
                                                    {preset.tag}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                                            {preset.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Option: Custom File Name */}
                    <div
                        onClick={() => setSelectedOption('custom')}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: selectedOption === 'custom' ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                            background: selectedOption === 'custom' ? 'rgba(245, 158, 11, 0.09)' : 'rgba(255, 255, 255, 0.02)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: selectedOption === 'custom' ? '2px solid #f59e0b' : '2px solid #64748b',
                                    background: selectedOption === 'custom' ? '#f59e0b' : 'transparent',
                                    flexShrink: 0,
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                }}
                            >
                                {selectedOption === 'custom' && <Check size={12} strokeWidth={3} />}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Edit3 size={14} color="#94a3b8" />
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9' }}>
                                    Custom File Name
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>(type your own format)</span>
                            </div>
                        </div>

                        {selectedOption === 'custom' && (
                            <div style={{ paddingLeft: '32px', marginTop: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#0a0d14', border: '1px solid rgba(245, 158, 11, 0.5)', borderRadius: '8px', overflow: 'hidden' }}>
                                    <input
                                        ref={customInputRef}
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value.replace(/\.pdf$/i, ''))}
                                        placeholder="e.g. Shah_Abdul_Mazid_AI_Engineer"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ffffff',
                                            padding: '8px 12px',
                                            fontSize: '0.85rem',
                                            outline: 'none',
                                            width: '100%',
                                            fontFamily: 'monospace',
                                        }}
                                    />
                                    <span style={{ padding: '0 12px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, userSelect: 'none', fontFamily: 'monospace' }}>
                                        .pdf
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.73rem', color: '#64748b', margin: '4px 0 0' }}>
                                    Illegal characters (\ / : * ? &quot; &lt; &gt; |) will automatically be converted to underscores.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.76rem' }}>
                        <FileText size={14} />
                        <span>Format: Standard A4 PDF</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            onClick={onClose}
                            disabled={isGenerating}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: '#cbd5e1',
                                padding: '8px 16px',
                                fontSize: '0.84rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#ffffff',
                                padding: '8px 20px',
                                fontSize: '0.84rem',
                                fontWeight: 700,
                                cursor: isGenerating ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                                opacity: isGenerating ? 0.7 : 1,
                                transition: 'transform 0.1s',
                            }}
                            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <FileDown size={15} />
                            {isGenerating ? 'Generating…' : 'Download Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body);
    }
    return modalContent;
};

export default DownloadFileNameModal;
