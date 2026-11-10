import React, { useEffect, useState, useCallback, useRef } from 'react';

interface InlineAudioWaveformProps {
    src?: string;
}

// Global singleton — survives React Router SPA navigation
let globalAudio: HTMLAudioElement | null = null;
let globalHasStarted = false;
let globalHasEnded = false;
let globalDialogDismissed = false; // tracks if user already answered the dialog

export const InlineAudioWaveform: React.FC<InlineAudioWaveformProps> = ({
    src = '/audio/ai_intro.mp3',
}) => {
    const [isPlaying, setIsPlaying]     = useState<boolean>(() =>
        !!(globalAudio && !globalAudio.paused && !globalAudio.ended)
    );
    const [hasStarted, setHasStarted]   = useState<boolean>(() => globalHasStarted);
    const [hasEnded, setHasEnded]       = useState<boolean>(() =>
        globalHasEnded || !!(globalAudio && globalAudio.ended)
    );
    const [isLoading, setIsLoading]     = useState(false);

    // Show dialog only on first ever mount (not on back-navigation)
    const [showDialog, setShowDialog]   = useState<boolean>(
        !globalHasStarted && !globalHasEnded && !globalDialogDismissed
    );

    const rippleRef = useRef<HTMLDivElement>(null);

    // Engineered acoustic frequency bins (40 symmetrical)
    const FREQ_BARS = [
        18, 26, 38, 54, 72, 88, 64, 46,
        78, 92, 100, 84, 68, 90, 76, 58,
        86, 95, 78, 62, 88, 94, 75, 58,
        86, 96, 78, 60, 88, 100, 84, 68,
        48, 72, 88, 65, 48, 38, 28, 20
    ];

    // ── Audio event wiring ──────────────────────────────────────────
    useEffect(() => {
        if (!globalAudio) {
            globalAudio = new Audio(src);
            globalAudio.preload = 'auto';
            globalAudio.muted   = false;
            globalAudio.volume  = 1.0;
            globalAudio.loop    = false;
        }

        const audio = globalAudio;

        // Re-sync state on SPA back-navigation
        if (!audio.paused && !audio.ended) {
            setIsPlaying(true); setHasStarted(true); setHasEnded(false);
        } else if (audio.ended || globalHasEnded) {
            setIsPlaying(false); setHasStarted(true); setHasEnded(true);
        }

        const onPlay    = () => { setIsPlaying(true);  setHasStarted(true); setHasEnded(false); globalHasStarted = true; setIsLoading(false); };
        const onPause   = () => setIsPlaying(false);
        const onEnded   = () => { setIsPlaying(false); setHasEnded(true);   globalHasEnded = true; };
        const onWaiting = () => setIsLoading(true);
        const onCanPlay = () => setIsLoading(false);

        audio.addEventListener('play',    onPlay);
        audio.addEventListener('pause',   onPause);
        audio.addEventListener('ended',   onEnded);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('canplay', onCanPlay);

        return () => {
            audio.removeEventListener('play',    onPlay);
            audio.removeEventListener('pause',   onPause);
            audio.removeEventListener('ended',   onEnded);
            audio.removeEventListener('waiting', onWaiting);
            audio.removeEventListener('canplay', onCanPlay);
        };
    }, [src]);

    // ── Dialog actions ──────────────────────────────────────────────
    const handleStart = useCallback(() => {
        setShowDialog(false);
        globalDialogDismissed = true;
        if (!globalAudio) return;
        globalAudio.muted  = false;
        globalAudio.volume = 1.0;
        setIsLoading(true);
        const p = globalAudio.play();
        if (p !== undefined) p.catch(() => setIsLoading(false));
    }, []);

    const handleSkip = useCallback(() => {
        setShowDialog(false);
        globalDialogDismissed = true;
    }, []);

    // ── Waveform click (pause / resume / replay) ────────────────────
    const handleWaveformClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!globalAudio || showDialog) return;

        // Ripple
        if (rippleRef.current) {
            rippleRef.current.classList.remove('ripple-active');
            void rippleRef.current.offsetWidth;
            rippleRef.current.classList.add('ripple-active');
        }

        if (isPlaying) {
            globalAudio.pause();
        } else {
            if (hasEnded || globalAudio.ended) {
                globalAudio.currentTime = 0;
                setHasEnded(false);
                globalHasEnded = false;
            }
            globalAudio.muted  = false;
            globalAudio.volume = 1.0;
            setIsLoading(true);
            const p = globalAudio.play();
            if (p !== undefined) p.catch(() => setIsLoading(false));
        }
    }, [isPlaying, hasEnded, showDialog]);

    // Status labels
    const statusLabel = hasEnded ? 'REPLAY' : isPlaying ? 'STREAMING' : hasStarted ? 'PAUSED' : 'AUDIO AI';
    const rateLabel   = hasEnded ? 'STANDBY' : isLoading ? 'BUFFERING…' : '128 kbps';
    const idlePulse   = !hasStarted && !isPlaying && !showDialog;

    return (
        <>
            {/* ── Intro Dialog Modal ────────────────────────────────── */}
            {showDialog && (
                <div className="avm-overlay" role="dialog" aria-modal="true" aria-labelledby="avm-title">
                    <div className="avm-dialog">
                        {/* Glow ring */}
                        <div className="avm-glow-ring" />

                        {/* Icon */}
                        <div className="avm-icon-wrap">
                            <span className="avm-icon">🔊</span>
                            <div className="avm-icon-pulse" />
                        </div>

                        {/* Text */}
                        <h2 className="avm-title" id="avm-title">Hear my voice intro?</h2>
                        <p className="avm-desc">
                            A short AI-generated introduction about my work,<br />
                            research & experience. Takes about 30 seconds.
                        </p>

                        {/* Actions */}
                        <div className="avm-actions">
                            <button className="avm-btn avm-skip" onClick={handleSkip}>
                                Skip
                            </button>
                            <button className="avm-btn avm-start" onClick={handleStart} autoFocus>
                                <span className="avm-start-dot" />
                                Start
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DSP Waveform bar ──────────────────────────────────── */}
            <div className="audio-widget-root">
                <div
                    className={`eng-waveform-wrapper ${hasEnded ? 'terminated' : ''} ${isPlaying ? 'playing' : ''} ${idlePulse ? 'idle-pulse' : ''}`}
                    onClick={handleWaveformClick}
                    aria-label={isPlaying ? 'Pause voice intro' : 'Play voice intro'}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleWaveformClick(e as unknown as React.MouseEvent); }}
                >
                    <div ref={rippleRef} className="click-ripple" />

                    {/* Left — frequency tag */}
                    <div className="eng-freq-tag left">
                        <span className={`signal-dot ${isPlaying ? 'live' : hasEnded ? 'off' : 'idle'}`} />
                        <span className="freq-text">24.0 kHz</span>
                    </div>

                    <div className="eng-trackline" />

                    {/* Waveform bars */}
                    <div className="eng-dsp-track">
                        {FREQ_BARS.map((height, i) => (
                            <div key={i} className="dsp-bar-channel">
                                <span
                                    className={`dsp-bar-top ${isPlaying ? 'active' : 'static'}`}
                                    style={{
                                        height: hasEnded ? '3px' : `${Math.max(10, (height / 100) * 14)}px`,
                                        animationDelay: `${(i % 8) * 0.08}s`,
                                    }}
                                />
                                <span
                                    className={`dsp-bar-bottom ${isPlaying ? 'active' : 'static'}`}
                                    style={{
                                        height: hasEnded ? '3px' : `${Math.max(10, (height / 100) * 14)}px`,
                                        animationDelay: `${(i % 8) * 0.08}s`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="eng-trackline" />

                    {/* Right — status tag */}
                    <div className="eng-freq-tag right">
                        <span className="freq-text">{statusLabel}</span>
                        <span className="freq-rate">{rateLabel}</span>
                    </div>
                </div>
            </div>

            {/* ── All styles ───────────────────────────────────────── */}
            <style>{`

                /* === DIALOG OVERLAY === */
                .avm-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(3, 7, 18, 0.72);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    animation: overlayFadeIn 0.35s ease forwards;
                }
                @keyframes overlayFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /* === DIALOG BOX === */
                .avm-dialog {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    padding: 36px 40px 32px;
                    border-radius: 20px;
                    background: rgba(10, 17, 34, 0.92);
                    border: 1px solid rgba(56, 189, 248, 0.2);
                    box-shadow:
                        0 0 0 1px rgba(56, 189, 248, 0.08),
                        0 24px 60px rgba(0, 0, 0, 0.6),
                        0 0 80px rgba(56, 189, 248, 0.07);
                    max-width: 380px;
                    width: 90vw;
                    text-align: center;
                    overflow: hidden;
                    animation: dialogSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes dialogSlideIn {
                    from { opacity: 0; transform: translateY(18px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)     scale(1);    }
                }

                /* Ambient glow ring behind dialog */
                .avm-glow-ring {
                    position: absolute;
                    top: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, transparent 70%);
                    pointer-events: none;
                    animation: glowBreath 3s ease-in-out infinite;
                }
                @keyframes glowBreath {
                    0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
                    50%       { opacity: 1;   transform: translateX(-50%) scale(1.15); }
                }

                /* Emoji icon with pulse ring */
                .avm-icon-wrap {
                    position: relative;
                    width: 56px;
                    height: 56px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 4px;
                }
                .avm-icon {
                    font-size: 2rem;
                    line-height: 1;
                    position: relative;
                    z-index: 1;
                }
                .avm-icon-pulse {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 1.5px solid rgba(56, 189, 248, 0.4);
                    animation: iconRing 2s ease-in-out infinite;
                }
                @keyframes iconRing {
                    0%   { transform: scale(0.9);  opacity: 0.9; }
                    70%  { transform: scale(1.35); opacity: 0; }
                    100% { transform: scale(0.9);  opacity: 0; }
                }

                /* Title */
                .avm-title {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #e2e8f0;
                    letter-spacing: -0.01em;
                }

                /* Description */
                .avm-desc {
                    margin: 0;
                    font-size: 0.82rem;
                    color: rgba(148, 163, 184, 0.85);
                    line-height: 1.6;
                }

                /* Button row */
                .avm-actions {
                    display: flex;
                    gap: 12px;
                    margin-top: 8px;
                    width: 100%;
                    justify-content: center;
                }

                /* Base button */
                .avm-btn {
                    padding: 10px 28px;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: all 0.22s ease;
                    letter-spacing: 0.01em;
                }

                /* Skip button */
                .avm-skip {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(148, 163, 184, 0.9);
                }
                .avm-skip:hover {
                    background: rgba(255, 255, 255, 0.11);
                    border-color: rgba(255, 255, 255, 0.18);
                    color: #e2e8f0;
                }

                /* Start button */
                .avm-start {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #0ea5e9, #0284c7);
                    color: #fff;
                    box-shadow: 0 4px 18px rgba(14, 165, 233, 0.4);
                }
                .avm-start:hover {
                    background: linear-gradient(135deg, #38bdf8, #0ea5e9);
                    box-shadow: 0 6px 24px rgba(14, 165, 233, 0.55);
                    transform: translateY(-1px);
                }
                .avm-start:active {
                    transform: translateY(0);
                }
                .avm-start-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.85);
                    box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
                    animation: signalPulse 1.2s infinite ease-in-out;
                }

                /* Light mode overrides for dialog */
                html.light-mode .avm-overlay {
                    background: rgba(241, 245, 249, 0.75);
                }
                html.light-mode .avm-dialog {
                    background: rgba(255, 255, 255, 0.95);
                    border-color: rgba(2, 132, 199, 0.2);
                    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12), 0 0 60px rgba(2, 132, 199, 0.07);
                }
                html.light-mode .avm-title  { color: #0f172a; }
                html.light-mode .avm-desc   { color: #475569; }
                html.light-mode .avm-skip {
                    background: rgba(0, 0, 0, 0.04);
                    border-color: rgba(0, 0, 0, 0.1);
                    color: #64748b;
                }
                html.light-mode .avm-skip:hover {
                    background: rgba(0, 0, 0, 0.08);
                    color: #334155;
                }

                /* === WAVEFORM WIDGET === */
                .audio-widget-root {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    margin: 8px auto 16px auto;
                }
                .eng-waveform-wrapper {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 4px 16px;
                    border-radius: 999px;
                    background: rgba(10, 17, 34, 0.45);
                    border: 1px solid rgba(56, 189, 248, 0.22);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    user-select: none;
                    cursor: pointer;
                    overflow: hidden;
                }
                .eng-waveform-wrapper:hover {
                    border-color: rgba(56, 189, 248, 0.55);
                    background: rgba(10, 17, 34, 0.7);
                    box-shadow: 0 6px 26px rgba(0,0,0,0.4), 0 0 18px rgba(56,189,248,0.25);
                    transform: translateY(-1px);
                }
                .eng-waveform-wrapper:focus-visible {
                    outline: 2px solid rgba(56,189,248,0.6);
                    outline-offset: 3px;
                }
                .eng-waveform-wrapper.terminated {
                    opacity: 0.65;
                    border-color: rgba(148,163,184,0.18);
                    background: rgba(10,17,34,0.25);
                }
                .eng-waveform-wrapper.idle-pulse {
                    animation: idlePulse 3s ease-in-out infinite;
                }
                @keyframes idlePulse {
                    0%,100% { box-shadow: 0 4px 20px rgba(0,0,0,0.25), 0 0 0px rgba(56,189,248,0); }
                    50%     { box-shadow: 0 4px 24px rgba(0,0,0,0.35), 0 0 16px rgba(56,189,248,0.18); }
                }
                html.light-mode .eng-waveform-wrapper {
                    background: rgba(255,255,255,0.7);
                    border-color: rgba(2,132,199,0.2);
                    box-shadow: 0 4px 14px rgba(0,0,0,0.05);
                }
                html.light-mode .eng-waveform-wrapper.terminated {
                    background: rgba(255,255,255,0.4);
                    border-color: rgba(148,163,184,0.2);
                }

                /* Click ripple */
                .click-ripple { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
                .click-ripple.ripple-active { animation: rippleFlash 0.45s ease-out forwards; }
                @keyframes rippleFlash {
                    0%   { background: rgba(56,189,248,0.22); }
                    100% { background: rgba(56,189,248,0); }
                }

                /* Freq tags */
                .eng-freq-tag {
                    display: flex; align-items: center; gap: 6px;
                    font-family: 'JetBrains Mono','Fira Code',monospace;
                    font-size: 0.66rem;
                    color: rgba(148,163,184,0.85);
                    letter-spacing: 0.5px;
                }
                html.light-mode .eng-freq-tag { color: #475569; }
                .freq-text { font-weight: 600; color: #38bdf8; }
                .eng-waveform-wrapper.terminated .freq-text { color: rgba(148,163,184,0.7); }
                html.light-mode .freq-text { color: #0284c7; }
                .freq-rate { font-size: 0.6rem; opacity: 0.55; }

                /* Signal dot */
                .signal-dot {
                    width: 5px; height: 5px; border-radius: 50%;
                    background: #64748b; transition: all 0.3s;
                }
                .signal-dot.live { background: #38bdf8; box-shadow: 0 0 8px #38bdf8; animation: signalPulse 1.4s infinite ease-in-out; }
                .signal-dot.idle { background: rgba(56,189,248,0.4); box-shadow: 0 0 5px rgba(56,189,248,0.3); animation: signalPulse 2.6s infinite ease-in-out; }
                .signal-dot.off  { background: #475569; box-shadow: none; }
                @keyframes signalPulse {
                    0%,100% { transform: scale(0.9); opacity: 0.7; }
                    50%     { transform: scale(1.3); opacity: 1; }
                }

                /* Laser tracklines */
                .eng-trackline {
                    width: 28px; height: 1px;
                    background: linear-gradient(90deg, rgba(56,189,248,0.1) 0%, rgba(56,189,248,0.5) 50%, rgba(56,189,248,0.1) 100%);
                }
                html.light-mode .eng-trackline {
                    background: linear-gradient(90deg, rgba(2,132,199,0.1) 0%, rgba(2,132,199,0.4) 50%, rgba(2,132,199,0.1) 100%);
                }

                /* Waveform grid */
                .eng-dsp-track {
                    display: flex; align-items: center;
                    gap: 2.5px; height: 32px; width: 220px;
                }
                .dsp-bar-channel {
                    flex: 1; display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    gap: 1.5px; height: 100%;
                }
                .dsp-bar-top, .dsp-bar-bottom {
                    width: 100%;
                    background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
                    border-radius: 1px;
                    transition: height 0.4s ease, opacity 0.4s ease, background 0.4s ease;
                    opacity: 0.85;
                }
                .dsp-bar-top    { transform-origin: bottom; }
                .dsp-bar-bottom {
                    transform-origin: top;
                    background: linear-gradient(180deg, #0284c7 0%, rgba(56,189,248,0.3) 100%);
                    opacity: 0.65;
                }
                .dsp-bar-top.static, .dsp-bar-bottom.static {
                    background: rgba(148,163,184,0.25); opacity: 0.4; box-shadow: none;
                }
                html.light-mode .dsp-bar-top    { background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); }
                html.light-mode .dsp-bar-bottom { background: linear-gradient(180deg, #0369a1 0%, rgba(2,132,199,0.3) 100%); }

                .dsp-bar-top.active    { animation: dspOscillateTop    0.85s ease-in-out infinite alternate; }
                .dsp-bar-bottom.active { animation: dspOscillateBottom 0.85s ease-in-out infinite alternate; }
                @keyframes dspOscillateTop {
                    0%   { transform: scaleY(0.5);  opacity: 0.65; }
                    50%  { transform: scaleY(1.3);  opacity: 1; filter: drop-shadow(0 0 3px rgba(56,189,248,0.7)); }
                    100% { transform: scaleY(0.75); opacity: 0.85; }
                }
                @keyframes dspOscillateBottom {
                    0%   { transform: scaleY(0.5);  opacity: 0.45; }
                    50%  { transform: scaleY(1.2);  opacity: 0.85; }
                    100% { transform: scaleY(0.75); opacity: 0.6; }
                }

                /* Mobile */
                @media (max-width: 680px) {
                    .eng-waveform-wrapper { gap: 8px; padding: 3px 12px; }
                    .eng-trackline { width: 14px; }
                    .eng-dsp-track { width: 150px; gap: 1.5px; }
                    .eng-freq-tag  { font-size: 0.58rem; }
                    .avm-dialog    { padding: 28px 24px 24px; }
                    .avm-title     { font-size: 1.1rem; }
                    .avm-actions   { flex-direction: column; }
                    .avm-btn       { width: 100%; }
                }
            `}</style>
        </>
    );
};

export default InlineAudioWaveform;
