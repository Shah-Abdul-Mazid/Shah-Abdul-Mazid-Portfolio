import React, { useEffect, useRef } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════
 *  MODERN AMBIENT GLOW & COSMIC MICRO-PARTICLES (OPTION 1)
 *  Elite, distraction-free atmospheric canvas for AI researcher portfolio.
 *  - Organic multi-point nebula mesh gradients (slow harmonic drift)
 *  - Subtle twinkling micro-stars & floating cosmic dust (no text / no rings)
 *  - Smooth mouse parallax response for interactive depth
 *  - Crisp Retina resolution handling & 60fps performance
 * ═══════════════════════════════════════════════════════════════════
 */

interface Star {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    r: number;
    alpha: number;
    phase: number;
    speed: number;
    depth: number;
}

interface Comet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    len: number;
    life: number;
    maxLife: number;
}

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

        const initCanvasSize = () => {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.scale(dpr, dpr);
        };
        initCanvasSize();

        // Mouse parallax tracking
        let mouseX = W / 2;
        let mouseY = H / 2;
        let targetParallaxX = 0;
        let targetParallaxY = 0;
        let currentParallaxX = 0;
        let currentParallaxY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            targetParallaxX = (mouseX - W / 2) * 0.025;
            targetParallaxY = (mouseY - H / 2) * 0.025;
        };

        const handleResize = () => {
            initCanvasSize();
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('resize', handleResize);

        // ── 1. AMBIENT NEBULA GLOW NODES ────────────────────────────────
        const nebulaOrbs = [
            { xRatio: 0.20, yRatio: 0.25, r: 420, hueDark: '99, 102, 241', hueLight: '14, 165, 233', alphaDark: 0.08, alphaLight: 0.065, speed: 0.0006, phase: 0 },
            { xRatio: 0.80, yRatio: 0.30, r: 480, hueDark: '168, 85, 247', hueLight: '139, 92, 246', alphaDark: 0.075, alphaLight: 0.055, speed: 0.0005, phase: 1.8 },
            { xRatio: 0.50, yRatio: 0.70, r: 520, hueDark: '6, 182, 212',  hueLight: '2, 132, 199',  alphaDark: 0.07, alphaLight: 0.05, speed: 0.0004, phase: 3.2 },
            { xRatio: 0.15, yRatio: 0.85, r: 380, hueDark: '236, 72, 153', hueLight: '217, 70, 239', alphaDark: 0.06, alphaLight: 0.045, speed: 0.0007, phase: 4.5 },
            { xRatio: 0.88, yRatio: 0.80, r: 400, hueDark: '16, 185, 129', hueLight: '16, 185, 129', alphaDark: 0.055, alphaLight: 0.04, speed: 0.0005, phase: 2.3 },
        ];

        // ── 2. DELICATE COSMIC MICRO-STARS ──────────────────────────────
        const STAR_COUNT = Math.min(Math.floor((W * H) / 7500), 200);
        const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
            const x = Math.random() * W;
            const y = Math.random() * H;
            return {
                x,
                y,
                baseX: x,
                baseY: y,
                r: Math.random() * 0.9 + 0.3,
                alpha: Math.random() * 0.5 + 0.2,
                phase: Math.random() * Math.PI * 2,
                speed: 0.008 + Math.random() * 0.02,
                depth: Math.random() * 0.8 + 0.2,
            };
        });

        // ── 3. OCCASIONAL ELEGANT SHOOTING STAR ─────────────────────────
        let comets: Comet[] = [];
        let cometTimer = 0;
        const spawnComet = () => {
            const startX = Math.random() * (W * 0.8) + W * 0.1;
            const startY = Math.random() * (H * 0.35);
            const speed = 7 + Math.random() * 6;
            const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
            comets.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                len: 70 + Math.random() * 80,
                life: 0,
                maxLife: 60 + Math.random() * 40,
            });
        };

        // ── ANIMATION LOOP ──────────────────────────────────────────────
        let frame = 0;

        const draw = () => {
            frame++;

            // Smooth parallax interpolation
            currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
            currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

            const isLight = document.documentElement.classList.contains('light-mode');

            // 1. Clear background with base color
            ctx.fillStyle = isLight ? '#f8fafc' : '#020617';
            ctx.fillRect(0, 0, W, H);

            // 2. Render Soft Ambient Nebula Orbs
            nebulaOrbs.forEach(orb => {
                orb.phase += orb.speed;
                const ox = W * orb.xRatio + Math.sin(orb.phase) * 60 + currentParallaxX * 0.3;
                const oy = H * orb.yRatio + Math.cos(orb.phase * 0.85) * 50 + currentParallaxY * 0.3;

                const rgb = isLight ? orb.hueLight : orb.hueDark;
                const baseAlpha = isLight ? orb.alphaLight : orb.alphaDark;

                const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
                grad.addColorStop(0, `rgba(${rgb}, ${baseAlpha})`);
                grad.addColorStop(0.5, `rgba(${rgb}, ${baseAlpha * 0.45})`);
                grad.addColorStop(1, 'transparent');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(ox, oy, orb.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // 3. Render Delicate Twinkling Micro-Stars
            stars.forEach(s => {
                s.phase += s.speed;
                const twinkle = Math.sin(s.phase) * 0.4 + 0.6;
                const curAlpha = Math.max(0.05, Math.min(0.9, s.alpha * twinkle));

                // Subtle parallax shift by depth
                const px = s.baseX + currentParallaxX * s.depth;
                const py = s.baseY + currentParallaxY * s.depth;

                ctx.beginPath();
                ctx.arc(px, py, s.r, 0, Math.PI * 2);

                if (isLight) {
                    ctx.fillStyle = `rgba(100, 116, 139, ${curAlpha * 0.45})`;
                } else {
                    ctx.fillStyle = `rgba(226, 232, 240, ${curAlpha * 0.85})`;
                }
                ctx.fill();
            });

            // 4. Render Occasional Shooting Star
            cometTimer++;
            if (cometTimer > 360) {
                cometTimer = 0;
                if (Math.random() < 0.6 && comets.length < 2) {
                    spawnComet();
                }
            }

            for (let i = comets.length - 1; i >= 0; i--) {
                const c = comets[i];
                c.x += c.vx;
                c.y += c.vy;
                c.life++;

                const progress = c.life / c.maxLife;
                const fade = Math.sin(progress * Math.PI); // Fade in then out

                const tailX = c.x - (c.vx / Math.hypot(c.vx, c.vy)) * c.len;
                const tailY = c.y - (c.vy / Math.hypot(c.vx, c.vy)) * c.len;

                const cometGrad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
                cometGrad.addColorStop(0, 'transparent');
                if (isLight) {
                    cometGrad.addColorStop(0.7, `rgba(2, 132, 199, ${fade * 0.2})`);
                    cometGrad.addColorStop(1, `rgba(2, 132, 199, ${fade * 0.6})`);
                } else {
                    cometGrad.addColorStop(0.7, `rgba(56, 189, 248, ${fade * 0.3})`);
                    cometGrad.addColorStop(1, `rgba(255, 255, 255, ${fade * 0.85})`);
                }

                ctx.save();
                ctx.strokeStyle = cometGrad;
                ctx.lineWidth = isLight ? 1.2 : 1.5;
                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(c.x, c.y);
                ctx.stroke();
                ctx.restore();

                if (c.life >= c.maxLife || c.x > W + 100 || c.y > H + 100) {
                    comets.splice(i, 1);
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
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
