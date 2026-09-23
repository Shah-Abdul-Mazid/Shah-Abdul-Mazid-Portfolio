import React, { useState, useEffect, useRef } from 'react';
import { X, FileDown, Edit3 } from 'lucide-react';

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
            desc: 'Professional standard for AI / Machine Learning applications',
            tag: 'Recommended',
        },
        {
            id: 'general_resume',
            name: 'Shah_Abdul_Mazid_Resume.pdf',
            label: 'Concise Corporate Resume',
            desc: 'Clean & universally preferred by tech recruiters',
            tag: 'Popular',
        },
        {
            id: 'general_cv',
            name: 'Shah_Abdul_Mazid_CV.pdf',
            label: 'International / Academic CV',
            desc: 'Standard format for research, international roles & academia',
            tag: 'Academic',
        },
        {
            id: 'version_specific',
            name: versionSpecificDefault,
            label: `${cvVersionName} Default Format`,
            desc: 'Includes version numbering for your personal tracking',
            tag: 'Archive',
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
        let clean = name.trim().replace(/[\\/:*?"<>|]/g, '_');
        if (!clean.toLowerCase().endsWith('.pdf')) {
            clean += '.pdf';
        }
        return clean || 'Shah_Abdul_Mazid_Resume.pdf';
    };

    const handleDownload = () => {
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

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', padding: '16px' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            onKeyDown={handleKeyDown}
        >
            <div 
                style={{
                    background: '#131826',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '540px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    color: '#f8fafc',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Modal Header */}
                <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                            <FileDown size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                                Download CV
                            </h3>
                            <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                                Select a corporate file naming format before downloading
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body / Preset Options */}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '60vh', overflowY: 'auto' }}>
                    {corporatePresets.map((preset) => {
                        const isSelected = selectedOption === preset.id;
                        return (
                            <div
                                key={preset.id}
                                onClick={() => setSelectedOption(preset.id)}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    border: isSelected ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                                    background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
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
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            border: isSelected ? '5px solid #f59e0b' : '2px solid #64748b',
                                            background: isSelected ? '#ffffff' : 'transparent',
                                            flexShrink: 0,
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9', wordBreak: 'break-all' }}>
                                                {preset.name}
                                            </span>
                                            {preset.tag && (
                                                <span
                                                    style={{
                                                        fontSize: '0.7rem',
                                                        padding: '1px 7px',
                                                        borderRadius: '999px',
                                                        fontWeight: 600,
                                                        background: preset.tag === 'Recommended' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.15)',
                                                        color: preset.tag === 'Recommended' ? '#fbbf24' : '#cbd5e1',
                                                    }}
                                                >
                                                    {preset.tag}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                                            {preset.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Option 5: Custom File Name */}
                    <div
                        onClick={() => setSelectedOption('custom')}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: selectedOption === 'custom' ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                            background: selectedOption === 'custom' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
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
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    border: selectedOption === 'custom' ? '5px solid #f59e0b' : '2px solid #64748b',
                                    background: selectedOption === 'custom' ? '#ffffff' : 'transparent',
                                    flexShrink: 0,
                                    boxSizing: 'border-box',
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Edit3 size={14} color="#94a3b8" />
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9' }}>
                                    Custom File Name
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>(type your own format)</span>
                            </div>
                        </div>

                        {selectedOption === 'custom' && (
                            <div style={{ paddingLeft: '30px', marginTop: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#0a0d14', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '8px', overflow: 'hidden' }}>
                                    <input
                                        ref={customInputRef}
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        placeholder="e.g. Shah_Abdul_Mazid_AI_Engineer"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ffffff',
                                            padding: '8px 12px',
                                            fontSize: '0.85rem',
                                            outline: 'none',
                                            width: '100%',
                                            fontFamily: 'inherit',
                                        }}
                                    />
                                    <span style={{ padding: '0 12px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, userSelect: 'none' }}>
                                        .pdf
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.73rem', color: '#64748b', margin: '4px 0 0' }}>
                                    Characters like \ / : * ? &quot; &lt; &gt; | will automatically be replaced with underscores.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
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
                        }}
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
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                            opacity: isGenerating ? 0.7 : 1,
                        }}
                    >
                        <FileDown size={15} />
                        {isGenerating ? 'Generating…' : 'Download Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownloadFileNameModal;
