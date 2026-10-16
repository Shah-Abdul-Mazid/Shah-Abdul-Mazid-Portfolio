/**
 * Device Fingerprinting & Identification Utility
 *
 * Two-tier identification:
 * 1. browser_instance_id — A stable UUID stored in localStorage for this
 *    specific browser profile. Survives page reloads and normal navigation
 *    but is reset if the user clears storage. Unique per browser, per device.
 *
 * 2. hardware_fingerprint — A probabilistic hardware-level hash derived from
 *    GPU, screen, CPU, and audio characteristics. This is the SAME across
 *    Chrome/Edge on the same machine (both expose WebGL unmasked renderer),
 *    but may DIFFER in Firefox (which blocks WEBGL_debug_renderer_info by
 *    default since v68). Used as a HINT for canonical device matching only.
 *
 * IMPORTANT DISCLAIMER:
 * The hardware fingerprint identifies hardware characteristics, NOT physical
 * devices with certainty. Two identical laptops with the same GPU/screen specs
 * could produce the same fingerprint. Do NOT use this for security-critical
 * identity verification. Only token-based explicit linking (verification_status
 * = "verified") provides an authoritative cross-browser association.
 */

/**
 * Returns a stable UUID for this specific browser profile.
 * Stored in localStorage so it persists across sessions.
 * Each browser (Chrome, Firefox, Edge) on the same machine has its own UUID.
 */
export function getBrowserInstanceId(): string {
    const STORAGE_KEY = 'portfolio_browser_id';

    try {
        let stored = localStorage.getItem(STORAGE_KEY);
        if (stored && stored.length >= 32) {
            return stored;
        }
        // Generate a new UUID v4
        const newId = generateUUIDv4();
        localStorage.setItem(STORAGE_KEY, newId);
        return newId;
    } catch {
        // localStorage unavailable (e.g., private mode in some browsers)
        // Fall back to sessionStorage so at least the session is consistent
        try {
            let stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored && stored.length >= 32) {
                return stored;
            }
            const newId = generateUUIDv4();
            sessionStorage.setItem(STORAGE_KEY, newId);
            return newId;
        } catch {
            // Both unavailable — generate a random ID for this page load
            return generateUUIDv4();
        }
    }
}

/**
 * Generates a standards-compliant UUID v4 using the Web Crypto API.
 */
function generateUUIDv4(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Computes a probabilistic hardware fingerprint from GPU, screen, CPU,
 * audio, and platform characteristics.
 *
 * This is the SAME across Chrome and Edge on the same machine (both expose
 * WebGL unmasked renderer). Firefox may produce a DIFFERENT value if it
 * blocks WEBGL_debug_renderer_info (enabled in Firefox 68+ privacy settings).
 *
 * Returns a MAC-address-style hex string: XX:XX:XX:XX:XX:XX
 * Returns empty string if fingerprinting is not possible in this environment.
 */
export async function getDeviceIdentifier(): Promise<string> {
    try {
        // 0. Query Native Windows Device Helper for Real Physical MAC Address (Method C)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 800);
            const res = await fetch('http://127.0.0.1:48123/device', {
                signal: controller.signal,
                mode: 'cors'
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                if (data.mac_address && data.mac_address.length >= 12) {
                    const physicalMac = data.mac_address.toUpperCase();
                    try {
                        localStorage.setItem('portfolio_physical_mac', physicalMac);
                    } catch {}
                    return physicalMac;
                }
            }
        } catch {
            // Helper not active or request timed out; check local cache
            try {
                const cachedMac = localStorage.getItem('portfolio_physical_mac');
                if (cachedMac && cachedMac.length >= 12) {
                    return cachedMac;
                }
            } catch {}
        }

        const components: string[] = [];

        // 1. Screen & Display Hardware Properties
        if (typeof window !== 'undefined' && window.screen) {
            components.push(`res:${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`);
            components.push(`dpr:${window.devicePixelRatio || 1}`);
        }

        // 2. CPU & Hardware Architecture
        if (typeof navigator !== 'undefined') {
            components.push(`cores:${navigator.hardwareConcurrency || 0}`);
            if ('deviceMemory' in navigator) {
                components.push(`ram:${(navigator as any).deviceMemory}`);
            }
            components.push(`touch:${navigator.maxTouchPoints || 0}`);
            components.push(`platform:${navigator.platform || ''}`);
        }

        // 3. System Timezone & Timezone Offset (hardware OS level)
        try {
            components.push(`tz:${Intl.DateTimeFormat().resolvedOptions().timeZone || ''}`);
            components.push(`tzo:${new Date().getTimezoneOffset()}`);
        } catch {
            // ignore timezone error
        }

        // 4. WebGL Physical GPU Hardware Vendor & Renderer
        // Available in Chrome and Edge. Firefox blocks this extension by default since v68.
        // If blocked, this component is omitted — fingerprint may differ across browsers.
        try {
            const canvas = document.createElement('canvas');
            const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
                    if (vendor || renderer) {
                        components.push(`gpu:${vendor}~${renderer}`);
                    }
                }
                // Fallback: basic WebGL vendor (masked, less unique but cross-browser)
                else {
                    const basicVendor = gl.getParameter(gl.VENDOR) || '';
                    const basicRenderer = gl.getParameter(gl.RENDERER) || '';
                    components.push(`gpu_basic:${basicVendor}~${basicRenderer}`);
                }
            }
        } catch {
            // WebGL not supported or blocked
        }

        // 5. Hardware Audio Processing Subsystem
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
                const ctx = new AudioCtx();
                components.push(`audio:${ctx.sampleRate}~${ctx.destination.maxChannelCount}`);
                ctx.close();
            }
        } catch {
            // Audio context not available
        }

        // If we couldn't gather any meaningful components, return empty string
        if (components.length < 3) {
            return '';
        }

        const rawString = components.join('|||');

        // 6. Cryptographic Hash via SubtleCrypto (SHA-256)
        let macAddress = '00:00:00:00:00:00';
        if (window.crypto && window.crypto.subtle) {
            const msgUint8 = new TextEncoder().encode(rawString);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

            // Format as standard 6-byte hexadecimal MAC address: XX:XX:XX:XX:XX:XX
            macAddress = hashHex.slice(0, 12).match(/.{1,2}/g)?.join(':') || '00:00:00:00:00:00';
        } else {
            // Fallback simple hash if subtle crypto is unavailable
            let hash = 0;
            for (let i = 0; i < rawString.length; i++) {
                const chr = rawString.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            const hex = Math.abs(hash).toString(16).padStart(12, '0').slice(0, 12).toUpperCase();
            macAddress = hex.match(/.{1,2}/g)?.join(':') || '02:00:00:00:00:00';
        }

        return macAddress;

    } catch {
        return '';
    }
}

/**
 * Fast client-side public IP lookup (unaffected by cloud reverse proxy headers).
 */
export async function getClientPublicIp(): Promise<string> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
            const data = await res.json();
            if (data.ip) return data.ip.trim();
        }
    } catch {}
    return '';
}

/**
 * Parses user agent into a clean, human-readable browser and operating system summary.
 */
export function getDeviceInfo(): string {
    if (typeof navigator === 'undefined') return 'Unknown Device';

    const ua = navigator.userAgent;

    // Detect Operating System
    let os = 'Unknown OS';
    if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
    else if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Macintosh') || ua.includes('Mac OS X')) os = 'macOS';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else if (ua.includes('Linux')) os = 'Linux';

    // Detect Browser
    let browser = 'Browser';
    if (ua.includes('Edg/')) {
        const m = ua.match(/Edg\/(\d+)/);
        browser = `Edge ${m ? m[1] : ''}`;
    } else if (ua.includes('Chrome/')) {
        const m = ua.match(/Chrome\/(\d+)/);
        browser = `Chrome ${m ? m[1] : ''}`;
    } else if (ua.includes('Firefox/')) {
        const m = ua.match(/Firefox\/(\d+)/);
        browser = `Firefox ${m ? m[1] : ''}`;
    } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
        browser = 'Safari';
    }

    return `${browser.trim()} on ${os}`;
}
