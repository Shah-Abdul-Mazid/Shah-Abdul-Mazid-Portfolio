import React, { useEffect, useRef } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════
 *  CYBERNETIC AI & DATA SCIENCE INTELLIGENCE MATRIX
 *  Inspired by high-end AI research visuals (Holographic Neural Core,
 *  Circuit Graphs, Rotating Telemetry HUD Rings & Active Synapses).
 * 
 *  FEATURES:
 *  1. Rotating Holographic AI Neural Rings & HUD Telemetry Ticks
 *  2. Synaptic Neural Network with Real-Time Action Potential Firing (Data Packets)
 *  3. Precision Engineering Circuit Traces with Terminal Pads
 *  4. Ambient Multi-Layered Tech Data Stream (Loss, Tensors, Matrix Telemetry)
 *  5. Dual-Mode Mastery:
 *     - Night: Glowing Holographic Laser Cyan & Deep Space Obsidian
 *     - Day: High-Contrast Technical Blueprint Cobalt & Clean Laboratory Slate
 *  6. Center Typography Shield: 100% legibility for Hero text & Avatar
 *  7. Interactive Mouse Neural Attractor
 * ═══════════════════════════════════════════════════════════════════
 */

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    pulsePhase: number;
    pulseSpeed: number;
    colorIndex: number;
}

interface Pulse {
    fromIdx: number;
    toIdx: number;
    progress: number;
    speed: number;
    colorIndex: number;
}

interface CircuitTrace {
    startX: number;
    startY: number;
    midX: number;
    midY: number;
    endX: number;
    endY: number;
    progress: number;
    speed: number;
    colorIndex: number;
}

const DARK_PALETTE = [
    { r: 0,   g: 247, b: 255 }, // Laser Cyan (#00f7ff)
    { r: 56,  g: 189, b: 248 }, // Neural Sky (#38bdf8)
    { r: 139, g: 92,  b: 246 }, // AI Violet (#8b5cf6)
    { r: 16,  g: 185, b: 129 }, // Matrix Emerald (#10b981)
    { r: 244, g: 63,  b: 94  }, // Action Red (#f43f5e)
];

const LIGHT_PALETTE = [
    { r: 2,   g: 132, b: 199 }, // Technical Cobalt (#0284c7)
    { r: 37,  g: 99,  b: 235 }, // Royal Blue (#2563eb)
    { r: 124, g: 58,  b: 237 }, // Deep Violet (#7c3aed)
    { r: 5,   g: 150, b: 105 }, // Data Emerald (#059669)
    { r: 217, g: 70,  b: 239 }, // Vivid Magenta (#d946ef)
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpColor = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }, t: number) => ({
    r: Math.round(lerp(c1.r, c2.r, t)),
    g: Math.round(lerp(c1.g, c2.g, t)),
    b: Math.round(lerp(c1.b, c2.b, t)),
});

const DATA_METRICS = [
    'TENSOR.SHAPE: [64, 128, 768]',
    'FORWARD_PASS: 1.42ms',
    'LOSS_CONV: 0.0028',
    'ACCURACY: 99.41%',
    'SYNAPSE_WEIGHTS: 4.8M',
    'LATENT_VEC: 512-DIM',
    'ATTENTION_HEADS: 12',
    'GRAD_DESCENT: ADAM_W',
];

const IntelligenceMatrix: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let W = window.innerWidth;
        let H = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.scale(dpr, dpr);
        };
        resize();
        window.addEventListener('resize', resize);

        // ── THEME TRACKING ───────────────────────────────────────────
        let themeBlend = document.documentElement.classList.contains('light-mode') ? 1.0 : 0.0;

        // ── MOUSE ATTRACTOR ──────────────────────────────────────────
        let mouseX = -1000;
        let mouseY = -1000;
        let mouseActive = false;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            mouseActive = true;
        };
        const onMouseLeave = () => {
            mouseActive = false;
            mouseX = -1000;
            mouseY = -1000;
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('mouseleave', onMouseLeave);

        // ── 1. NEURAL NODES ──────────────────────────────────────────
        const NODE_COUNT = Math.min(Math.max(Math.floor((W * H) / 14000), 60), 105);
        const nodes: Node[] = [];

        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.40,
                vy: (Math.random() - 0.5) * 0.40,
                radius: Math.random() * 2.2 + 1.8,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03,
                colorIndex: i % DARK_PALETTE.length,
            });
        }

        // ── 2. SYNAPTIC FIRING SIGNALS ───────────────────────────────
        const pulses: Pulse[] = [];
        let pulseTimer = 0;

        const spawnPulse = (from: number, to: number, colorIndex: number) => {
            if (pulses.length >= 28) return;
            pulses.push({
                fromIdx: from,
                toIdx: to,
                progress: 0,
                speed: 0.018 + Math.random() * 0.022,
                colorIndex,
            });
        };

        // ── 3. ENGINEERING CIRCUIT TRACES ────────────────────────────
        const circuitTraces: CircuitTrace[] = [];
        const createCircuits = () => {
            circuitTraces.length = 0;
            const count = Math.min(Math.floor(W / 180), 8);
            for (let i = 0; i < count; i++) {
                const isLeft = i % 2 === 0;
                const startX = isLeft ? Math.random() * (W * 0.22) : W - Math.random() * (W * 0.22);
                const startY = Math.random() * H;
                const midX = startX + (isLeft ? 60 + Math.random() * 60 : - (60 + Math.random() * 60));
                const midY = startY + (Math.random() - 0.5) * 80;
                const endX = midX + (isLeft ? 50 : -50);
                const endY = midY;
                circuitTraces.push({
                    startX, startY, midX, midY, endX, endY,
                    progress: Math.random(),
                    speed: 0.003 + Math.random() * 0.005,
                    colorIndex: i % DARK_PALETTE.length,
                });
            }
        };
        createCircuits();

        // ── MAIN RENDER LOOP ──────────────────────────────────────────
        let frame = 0;

        const draw = () => {
            frame++;

            // Smooth theme interpolation (0 = Dark, 1 = Light)
            const targetBlend = document.documentElement.classList.contains('light-mode') ? 1.0 : 0.0;
            themeBlend += (targetBlend - themeBlend) * 0.08;

            // 1. CLEAR CANVAS
            const bgR = Math.round(lerp(3, 248, themeBlend));
            const bgG = Math.round(lerp(7, 250, themeBlend));
            const bgB = Math.round(lerp(23, 252, themeBlend));
            ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
            ctx.fillRect(0, 0, W, H);

            // Center of the AI neural core
            const cx = W / 2;
            const cy = H * 0.42;

            // 2. AMBIENT SCIENTIFIC NEBULA MESH
            const nebAlpha = lerp(0.09, 0.065, themeBlend);
            [
                { x: W * 0.22, y: H * 0.25, r: 460, cDark: '0, 247, 255', cLight: '2, 132, 199' },
                { x: W * 0.78, y: H * 0.28, r: 500, cDark: '139, 92, 246', cLight: '124, 58, 237' },
                { x: cx,       y: cy,        r: 380, cDark: '56, 189, 248', cLight: '37, 99, 235' },
                { x: W * 0.50, y: H * 0.82, r: 480, cDark: '16, 185, 129', cLight: '5, 150, 105' },
            ].forEach(neb => {
                const shiftX = Math.sin(frame * 0.002 + neb.r) * 25;
                const shiftY = Math.cos(frame * 0.002 + neb.r) * 20;
                const col = themeBlend > 0.5 ? neb.cLight : neb.cDark;
                const grad = ctx.createRadialGradient(neb.x + shiftX, neb.y + shiftY, 0, neb.x + shiftX, neb.y + shiftY, neb.r);
                grad.addColorStop(0, `rgba(${col}, ${nebAlpha})`);
                grad.addColorStop(0.55, `rgba(${col}, ${nebAlpha * 0.35})`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(neb.x + shiftX, neb.y + shiftY, neb.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // 3. HOLOGRAPHIC ROTATING AI HUD RINGS (The Iconic Tech Centerpiece)
            ctx.save();
            const ringR = Math.min(W * 0.26, 260);
            const ringAlpha = lerp(0.35, 0.45, themeBlend);
            const ringDark = { r: 0, g: 247, b: 255 };
            const ringLight = { r: 2, g: 132, b: 199 };
            const ringRgb = lerpColor(ringDark, ringLight, themeBlend);

            // Outer Dashed HUD Ring (Clockwise)
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(frame * 0.0018);
            ctx.strokeStyle = `rgba(${ringRgb.r}, ${ringRgb.g}, ${ringRgb.b}, ${ringAlpha * 0.35})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([8, 14]);
            ctx.beginPath();
            ctx.arc(0, 0, ringR, 0, Math.PI * 2);
            ctx.stroke();

            // Precision HUD Ticks around outer ring
            const tickCount = 36;
            ctx.lineWidth = 1.2;
            for (let t = 0; t < tickCount; t++) {
                const angle = (t / tickCount) * Math.PI * 2;
                const tLen = t % 6 === 0 ? 9 : 4;
                const x1 = Math.cos(angle) * (ringR - tLen);
                const y1 = Math.sin(angle) * (ringR - tLen);
                const x2 = Math.cos(angle) * ringR;
                const y2 = Math.sin(angle) * ringR;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            ctx.restore();

            // Middle Holographic Arc Ring (Counter-Clockwise)
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(-frame * 0.0025);
            ctx.strokeStyle = `rgba(${ringRgb.r}, ${ringRgb.g}, ${ringRgb.b}, ${ringAlpha * 0.55})`;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([45, 60, 15, 30]);
            ctx.beginPath();
            ctx.arc(0, 0, ringR * 0.72, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Inner Quantum Radar Ring
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(frame * 0.004);
            ctx.strokeStyle = `rgba(${ringRgb.r}, ${ringRgb.g}, ${ringRgb.b}, ${ringAlpha * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.setLineDash([4, 10]);
            ctx.beginPath();
            ctx.arc(0, 0, ringR * 0.45, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            ctx.restore();

            // 4. TECHNICAL COORDINATE MATRIX GRID WITH CROSSHAIRS
            const gridSize = 72;
            ctx.save();
            const gridAlpha = lerp(0.35, 0.35, themeBlend);
            const gridColor = themeBlend > 0.5
                ? `rgba(203, 213, 225, ${gridAlpha})`
                : `rgba(30, 41, 59, ${gridAlpha})`;
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 0.5;

            ctx.beginPath();
            for (let x = 0; x < W; x += gridSize) {
                ctx.moveTo(x, 0); ctx.lineTo(x, H);
            }
            for (let y = 0; y < H; y += gridSize) {
                ctx.moveTo(0, y); ctx.lineTo(W, y);
            }
            ctx.stroke();

            // Coordinate Crosshairs (+)
            const chAlpha = lerp(0.35, 0.55, themeBlend);
            const chColor = themeBlend > 0.5
                ? `rgba(2, 132, 199, ${chAlpha})`
                : `rgba(0, 247, 255, ${chAlpha})`;
            ctx.strokeStyle = chColor;
            ctx.lineWidth = 1.0;
            const chLen = 3.5;

            for (let x = gridSize; x < W; x += gridSize * 2) {
                for (let y = gridSize; y < H; y += gridSize * 2) {
                    ctx.beginPath();
                    ctx.moveTo(x - chLen, y); ctx.lineTo(x + chLen, y);
                    ctx.moveTo(x, y - chLen); ctx.lineTo(x, y + chLen);
                    ctx.stroke();
                }
            }
            ctx.restore();

            // 5. CIRCUIT TRACES (Cyber Hardware Pathways at Periphery)
            circuitTraces.forEach(ct => {
                ct.progress += ct.speed;
                if (ct.progress > 1) ct.progress = 0;

                const dRgb = DARK_PALETTE[ct.colorIndex];
                const lRgb = LIGHT_PALETTE[ct.colorIndex];
                const rgb = lerpColor(dRgb, lRgb, themeBlend);
                const traceAlpha = lerp(0.25, 0.35, themeBlend);

                ctx.save();
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${traceAlpha})`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(ct.startX, ct.startY);
                ctx.lineTo(ct.midX, ct.midY);
                ctx.lineTo(ct.endX, ct.endY);
                ctx.stroke();

                // Terminal circular pads
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${traceAlpha * 1.5})`;
                ctx.beginPath(); ctx.arc(ct.startX, ct.startY, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(ct.endX, ct.endY, 2.5, 0, Math.PI * 2); ctx.fill();

                // Electric signal moving through circuit
                const t = ct.progress;
                let sx = ct.startX, sy = ct.startY;
                if (t < 0.5) {
                    const localT = t / 0.5;
                    sx = ct.startX + (ct.midX - ct.startX) * localT;
                    sy = ct.startY + (ct.midY - ct.startY) * localT;
                } else {
                    const localT = (t - 0.5) / 0.5;
                    sx = ct.midX + (ct.endX - ct.midX) * localT;
                    sy = ct.midY + (ct.endY - ct.midY) * localT;
                }
                ctx.fillStyle = themeBlend > 0.5 ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)` : '#ffffff';
                ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            });

            // 6. UPDATE NEURAL NODES
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 14) { node.x = 14; node.vx *= -1; }
                if (node.x > W - 14) { node.x = W - 14; node.vx *= -1; }
                if (node.y < 14) { node.y = 14; node.vy *= -1; }
                if (node.y > H - 14) { node.y = H - 14; node.vy *= -1; }

                node.pulsePhase += node.pulseSpeed;
            });

            // 7. DRAW SYNAPTIC CONNECTIONS & TRIGGER FIRING PULSES
            const maxDistance = 145;
            pulseTimer++;

            for (let i = 0; i < nodes.length; i++) {
                const n1 = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const dx = n1.x - n2.x;
                    const dy = n1.y - n2.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxDistance) {
                        const linkStrength = 1 - dist / maxDistance;

                        // Center attenuation (protective halo for avatar & title)
                        const midX = (n1.x + n2.x) / 2;
                        const midY = (n1.y + n2.y) / 2;
                        const distToCenter = Math.hypot(midX - cx, midY - cy);
                        const centerFade = Math.min(Math.max((distToCenter - 140) / 160, 0.28), 1.0);

                        const dRgb = DARK_PALETTE[n1.colorIndex];
                        const lRgb = LIGHT_PALETTE[n1.colorIndex];
                        const rgb = lerpColor(dRgb, lRgb, themeBlend);

                        const lineBaseAlpha = lerp(0.32, 0.40, themeBlend);
                        const alpha = linkStrength * lineBaseAlpha * centerFade;

                        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                        ctx.lineWidth = linkStrength * (themeBlend > 0.5 ? 1.1 : 1.3);
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();

                        // Fire synaptic data packet
                        if (pulseTimer % 16 === 0 && Math.random() < 0.10 && dist < 120) {
                            spawnPulse(i, j, n1.colorIndex);
                        }
                    }
                }
            }

            // 8. DRAW ACTIVE SYNAPTIC FIRING SIGNALS (Data Packets)
            for (let p = pulses.length - 1; p >= 0; p--) {
                const pulse = pulses[p];
                pulse.progress += pulse.speed;

                if (pulse.progress >= 1) {
                    pulses.splice(p, 1);
                    continue;
                }

                const n1 = nodes[pulse.fromIdx];
                const n2 = nodes[pulse.toIdx];
                if (!n1 || !n2) {
                    pulses.splice(p, 1);
                    continue;
                }

                const curX = n1.x + (n2.x - n1.x) * pulse.progress;
                const curY = n1.y + (n2.y - n1.y) * pulse.progress;

                const dRgb = DARK_PALETTE[pulse.colorIndex];
                const lRgb = LIGHT_PALETTE[pulse.colorIndex];
                const rgb = lerpColor(dRgb, lRgb, themeBlend);

                // Core packet
                ctx.beginPath();
                ctx.arc(curX, curY, 2.4, 0, Math.PI * 2);
                ctx.fillStyle = themeBlend > 0.5 ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.95)` : '#ffffff';
                ctx.fill();

                // Luminous packet aura
                const pGlow = ctx.createRadialGradient(curX, curY, 0, curX, curY, 8);
                pGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${themeBlend > 0.5 ? 0.6 : 0.9})`);
                pGlow.addColorStop(1, 'transparent');
                ctx.fillStyle = pGlow;
                ctx.beginPath();
                ctx.arc(curX, curY, 8, 0, Math.PI * 2);
                ctx.fill();
            }

            // 9. INTERACTIVE CURSOR SYNAPSE COUPLING
            if (mouseActive) {
                const mouseRadius = 165;
                nodes.forEach(node => {
                    const d = Math.hypot(node.x - mouseX, node.y - mouseY);
                    if (d < mouseRadius) {
                        const mStrength = 1 - d / mouseRadius;
                        const dRgb = DARK_PALETTE[node.colorIndex];
                        const lRgb = LIGHT_PALETTE[node.colorIndex];
                        const rgb = lerpColor(dRgb, lRgb, themeBlend);

                        const mAlpha = mStrength * (themeBlend > 0.5 ? 0.52 : 0.65);
                        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${mAlpha})`;
                        ctx.lineWidth = mStrength * 1.6;
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.stroke();
                    }
                });

                // Laser cursor aura
                const cursorGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 32);
                const auraColor = themeBlend > 0.5 ? '2, 132, 199' : '0, 247, 255';
                cursorGlow.addColorStop(0, `rgba(${auraColor}, ${themeBlend > 0.5 ? 0.28 : 0.4})`);
                cursorGlow.addColorStop(1, 'transparent');
                ctx.fillStyle = cursorGlow;
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 32, 0, Math.PI * 2);
                ctx.fill();
            }

            // 10. RENDER NEURAL TENSOR NODES
            nodes.forEach(node => {
                const pulse = Math.sin(node.pulsePhase) * 0.35 + 0.65;
                const dRgb = DARK_PALETTE[node.colorIndex];
                const lRgb = LIGHT_PALETTE[node.colorIndex];
                const rgb = lerpColor(dRgb, lRgb, themeBlend);

                const distToCenter = Math.hypot(node.x - cx, node.y - cy);
                const centerAlpha = Math.min(Math.max((distToCenter - 130) / 150, 0.32), 1.0);

                // Glowing outer halo
                const haloR = node.radius * (themeBlend > 0.5 ? 3.0 : 4.0);
                const halo = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, haloR);
                const haloAlpha = (themeBlend > 0.5 ? 0.35 : 0.50) * pulse * centerAlpha;
                halo.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${haloAlpha})`);
                halo.addColorStop(1, 'transparent');
                ctx.fillStyle = halo;
                ctx.beginPath();
                ctx.arc(node.x, node.y, haloR, 0, Math.PI * 2);
                ctx.fill();

                // Core dot
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * (0.85 + pulse * 0.15), 0, Math.PI * 2);
                ctx.fillStyle = themeBlend > 0.5
                    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.92 * centerAlpha})`
                    : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.98 * centerAlpha})`;
                ctx.fill();

                // High-contrast rim in Day mode
                if (themeBlend > 0.5) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 * centerAlpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            });

            // 11. AMBIENT DATA SCIENCE METRICS (High-Tech HUD Periphery)
            ctx.save();
            ctx.font = '10px "JetBrains Mono", monospace, "Courier New"';

            // Top-left HUD badge
            ctx.fillStyle = themeBlend > 0.5 ? 'rgba(71, 85, 105, 0.65)' : 'rgba(56, 189, 248, 0.45)';
            ctx.fillText('◈ AI.INTELLIGENCE_MATRIX // OPERATIONAL', 24, 40);

            // Bottom-left and bottom-right live telemetry
            const metricIdx = Math.floor((frame / 120) % DATA_METRICS.length);
            ctx.fillText(`▶ METRIC: ${DATA_METRICS[metricIdx]}`, 24, H - 24);

            ctx.textAlign = 'right';
            ctx.fillText(`NEURAL_GRAPH :: ${nodes.length}_NODES // SYNC_60FPS`, W - 24, H - 24);
            ctx.restore();

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                display: 'block',
                pointerEvents: 'none',
            }}
        />
    );
};

export default IntelligenceMatrix;
