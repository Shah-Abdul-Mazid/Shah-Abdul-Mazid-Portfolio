import React, { useRef, useEffect, useState } from 'react';

interface InlineAudioWaveformProps {
    src?: string;
    autoPlay?: boolean;
}

export const InlineAudioWaveform: React.FC<InlineAudioWaveformProps> = ({
    src = '/audio/ai_intro.mp3',
    autoPlay = true,
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);

    // Engineered acoustic frequency distribution (40 symmetrical frequency bins)
    const FREQ_BARS = [
        18, 26, 38, 54, 72, 88, 64, 46,
        78, 92, 100, 84, 68, 90, 76, 58,
        86, 95, 78, 62, 88, 94, 75, 58,
        86, 96, 78, 60, 88, 100, 84, 68,
        48, 72, 88, 65, 48, 38, 28, 20
    ];

    useEffect(() => {
        // Play only ONCE per visitor session
        const alreadyPlayed = sessionStorage.getItem('portfolio_voice_intro_played');
        if (alreadyPlayed === 'true') {
            setHasEnded(true);
            return;
        }

        const audio = audioRef.current;
        if (!audio || !autoPlay) return;

        audio.loop = false;
        audio.volume = 1.0;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => {
            setIsPlaying(false);
            setHasEnded(true);
            sessionStorage.setItem('portfolio_voice_intro_played', 'true');
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.src = '';
            }
        };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);

        // ─── STEP 1: Start MUTED (browsers always allow muted autoplay) ───
        audio.muted = true;

        const attemptMutedPlay = () => {
            const promise = audio.play();
            if (promise !== undefined) {
                promise
                    .then(() => {
                        // Muted playback started — now wire up gesture listeners to unmute
                        setIsPlaying(true);
                        attachUnmuteListeners();
                    })
                    .catch(() => {
                        // Even muted autoplay blocked (very rare) — wait for explicit gesture
                        attachClickToPlayListeners();
                    });
            }
        };

        // ─── STEP 2: Unmute on first micro-gesture (mousemove counts!) ───
        const unmute = () => {
            if (audioRef.current) {
                audioRef.current.muted = false;
            }
            removeUnmuteListeners();
        };

        const removeUnmuteListeners = () => {
            window.removeEventListener('mousemove', unmute, true);
            window.removeEventListener('pointerdown', unmute, true);
            window.removeEventListener('touchstart', unmute, true);
            window.removeEventListener('wheel', unmute, true);
            window.removeEventListener('keydown', unmute, true);
            window.removeEventListener('click', unmute, true);
        };

        const attachUnmuteListeners = () => {
            // Passive mousemove fires as soon as cursor enters the browser window
            window.addEventListener('mousemove', unmute, { capture: true, once: true, passive: true });
            window.addEventListener('pointerdown', unmute, { capture: true, once: true });
            window.addEventListener('touchstart', unmute, { capture: true, once: true, passive: true });
            window.addEventListener('wheel', unmute, { capture: true, once: true, passive: true });
            window.addEventListener('keydown', unmute, { capture: true, once: true });
            window.addEventListener('click', unmute, { capture: true, once: true });
        };

        // ─── Fallback: If muted play is also blocked, play on first explicit click ───
        const onGesture = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.muted = false;
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => {});
            }
            removeClickListeners();
        };

        const removeClickListeners = () => {
            window.removeEventListener('pointerdown', onGesture, true);
            window.removeEventListener('click', onGesture, true);
            window.removeEventListener('touchstart', onGesture, true);
        };

        const attachClickToPlayListeners = () => {
            window.addEventListener('pointerdown', onGesture, { capture: true, once: true });
            window.addEventListener('click', onGesture, { capture: true, once: true });
            window.addEventListener('touchstart', onGesture, { capture: true, once: true });
        };

        // Kick off muted autoplay immediately
        attemptMutedPlay();

        return () => {
            removeUnmuteListeners();
            removeClickListeners();
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('ended', onEnded);
        };
    }, [autoPlay]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            className={`eng-waveform-wrapper ${hasEnded ? 'terminated' : ''}`}
            aria-label="DSP Voice Signal Waveform"
            role="presentation"
        >
            {!hasEnded && (
                <audio
                    ref={audioRef}
                    src={src}
                    preload="auto"
                    playsInline
                />
            )}

            {/* Left Technical Frequency Anchor */}
            <div className="eng-freq-tag left">
                <span className={`signal-dot ${isPlaying ? 'live' : hasEnded ? 'off' : ''}`} />
                <span className="freq-text">24.0 kHz</span>
            </div>

            {/* Micro horizontal laser trackline (left) */}
            <div className="eng-trackline" />

            {/* DSP Symmetric Soundwave Grid */}
            <div className="eng-dsp-track">
                {FREQ_BARS.map((height, i) => (
                    <div key={i} className="dsp-bar-channel">
                        <span
                            className={`dsp-bar-top ${isPlaying ? 'active' : hasEnded ? 'static' : ''}`}
                            style={{
                                height: hasEnded ? '3px' : `${Math.max(14, (height / 100) * 14)}px`,
                                animationDelay: `${(i % 8) * 0.08}s`,
                            }}
                        />
                        <span
                            className={`dsp-bar-bottom ${isPlaying ? 'active' : hasEnded ? 'static' : ''}`}
                            style={{
                                height: hasEnded ? '3px' : `${Math.max(14, (height / 100) * 14)}px`,
                                animationDelay: `${(i % 8) * 0.08}s`,
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Micro horizontal laser trackline (right) */}
            <div className="eng-trackline" />

            {/* Right Technical Spec Anchor */}
            <div className="eng-freq-tag right">
                <span className="freq-text">
                    {hasEnded ? 'COMPLETED' : isPlaying ? 'STREAMING' : 'AUDIO AI'}
                </span>
                <span className="freq-rate">{hasEnded ? 'STANDBY' : '128 kbps'}</span>
            </div>

            <style>{`
                .eng-waveform-wrapper {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin: 8px auto 16px auto;
                    padding: 4px 16px;
                    border-radius: 999px;
                    background: rgba(10, 17, 34, 0.45);
                    border: 1px solid rgba(56, 189, 248, 0.18);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    user-select: none;
                    cursor: default;
                }
                .eng-waveform-wrapper.terminated {
                    opacity: 0.65;
                    border-color: rgba(148, 163, 184, 0.15);
                    background: rgba(10, 17, 34, 0.25);
                }
                html.light-mode .eng-waveform-wrapper {
                    background: rgba(255, 255, 255, 0.7);
                    border-color: rgba(2, 132, 199, 0.2);
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
                }
                html.light-mode .eng-waveform-wrapper.terminated {
                    background: rgba(255, 255, 255, 0.4);
                    border-color: rgba(148, 163, 184, 0.2);
                }

                /* Left & Right DSP Metadata Labels */
                .eng-freq-tag {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    font-size: 0.66rem;
                    color: rgba(148, 163, 184, 0.85);
                    letter-spacing: 0.5px;
                }
                html.light-mode .eng-freq-tag {
                    color: #475569;
                }
                .freq-text {
                    font-weight: 600;
                }
                .freq-rate {
                    font-size: 0.6rem;
                    opacity: 0.55;
                }
                .signal-dot {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #64748b;
                    transition: all 0.3s;
                }
                .signal-dot.live {
                    background: #38bdf8;
                    box-shadow: 0 0 8px #38bdf8;
                    animation: signalPulse 1.4s infinite ease-in-out;
                }
                .signal-dot.off {
                    background: #475569;
                    box-shadow: none;
                }
                @keyframes signalPulse {
                    0%, 100% { transform: scale(0.9); opacity: 0.7; }
                    50% { transform: scale(1.3); opacity: 1; }
                }

                /* Micro Laser Tracklines */
                .eng-trackline {
                    width: 28px;
                    height: 1px;
                    background: linear-gradient(90deg, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0.5) 50%, rgba(56, 189, 248, 0.1) 100%);
                }
                html.light-mode .eng-trackline {
                    background: linear-gradient(90deg, rgba(2, 132, 199, 0.1) 0%, rgba(2, 132, 199, 0.4) 50%, rgba(2, 132, 199, 0.1) 100%);
                }

                /* Dual-Phase DSP Waveform Track */
                .eng-dsp-track {
                    display: flex;
                    align-items: center;
                    gap: 2.5px;
                    height: 32px;
                    width: 220px;
                }

                .dsp-bar-channel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5px;
                    height: 100%;
                }

                .dsp-bar-top, .dsp-bar-bottom {
                    width: 100%;
                    background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
                    border-radius: 1px;
                    transition: height 0.4s ease, opacity 0.4s ease, background 0.4s ease;
                    opacity: 0.85;
                }
                .dsp-bar-top {
                    transform-origin: bottom;
                }
                .dsp-bar-bottom {
                    transform-origin: top;
                    background: linear-gradient(180deg, #0284c7 0%, rgba(56, 189, 248, 0.3) 100%);
                    opacity: 0.65;
                }

                .dsp-bar-top.static, .dsp-bar-bottom.static {
                    background: rgba(148, 163, 184, 0.25);
                    opacity: 0.4;
                    box-shadow: none;
                }

                html.light-mode .dsp-bar-top {
                    background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%);
                }
                html.light-mode .dsp-bar-bottom {
                    background: linear-gradient(180deg, #0369a1 0%, rgba(2, 132, 199, 0.3) 100%);
                }

                /* Oscilloscope Dynamic Modulation */
                .dsp-bar-top.active {
                    animation: dspOscillateTop 0.85s ease-in-out infinite alternate;
                }
                .dsp-bar-bottom.active {
                    animation: dspOscillateBottom 0.85s ease-in-out infinite alternate;
                }

                @keyframes dspOscillateTop {
                    0% { transform: scaleY(0.5); opacity: 0.65; }
                    50% { transform: scaleY(1.3); opacity: 1; filter: drop-shadow(0 0 3px rgba(56, 189, 248, 0.7)); }
                    100% { transform: scaleY(0.75); opacity: 0.85; }
                }

                @keyframes dspOscillateBottom {
                    0% { transform: scaleY(0.5); opacity: 0.45; }
                    50% { transform: scaleY(1.2); opacity: 0.85; }
                    100% { transform: scaleY(0.75); opacity: 0.6; }
                }

                @media (max-width: 680px) {
                    .eng-waveform-wrapper {
                        gap: 8px;
                        padding: 3px 12px;
                    }
                    .eng-trackline {
                        width: 14px;
                    }
                    .eng-dsp-track {
                        width: 150px;
                        gap: 1.5px;
                    }
                    .eng-freq-tag {
                        font-size: 0.58rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default InlineAudioWaveform;
