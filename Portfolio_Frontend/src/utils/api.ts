/**
 * Dual-Backend Resilience System (Render Primary -> Vercel Failover)
 *
 * Automatically monitors backend health:
 * 1. Attempts the Render backend first (primary).
 * 2. If Render is asleep/suspended (free tier cold start > 3.5s or returns 502/503/504/Network Error),
 *    it AUTOMATICALLY and INSTANTLY switches to the Vercel backend.
 * 3. Remembers the suspended state in sessionStorage for 5 minutes so subsequent requests
 *    bypass Render immediately without waiting for timeouts.
 * 4. Transparently intercepts standard `fetch('/api/...')` calls across the entire frontend.
 */

const RENDER_BASE = (import.meta.env.VITE_RENDER_BACKEND_URL || 'https://shah-abdul-mazid-portfolio.onrender.com').replace(/\/+$/, '');
const VERCEL_BASE = (import.meta.env.VITE_VERCEL_BACKEND_URL || 'https://www.shahabdulmazidezan.me').replace(/\/+$/, '');
const OVERRIDE_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const SUSPEND_CACHE_KEY = '__render_suspended_until';
const SUSPEND_DURATION_MS = 5 * 60 * 1000; // 5 minutes cooldown for sleeping Render instance

/**
 * Check if Render backend is currently marked as suspended / sleeping.
 */
export function isRenderSuspended(): boolean {
  try {
    const raw = sessionStorage.getItem(SUSPEND_CACHE_KEY);
    if (!raw) return false;
    const expiresAt = parseInt(raw, 10);
    if (Date.now() < expiresAt) {
      return true;
    }
    sessionStorage.removeItem(SUSPEND_CACHE_KEY);
  } catch {
    // SessionStorage may fail in private browsing; fail open
  }
  return false;
}

/**
 * Mark Render as suspended for the next 5 minutes.
 */
export function markRenderSuspended(): void {
  try {
    sessionStorage.setItem(SUSPEND_CACHE_KEY, (Date.now() + SUSPEND_DURATION_MS).toString());
    console.warn('[Backend Resilience] Render backend suspended/slow. Auto-switched to Vercel backend for 5 minutes.');
  } catch {
    // Ignore
  }
}

/**
 * Clear the suspended state to force re-testing Render.
 */
export function clearBackendCache(): void {
  try {
    sessionStorage.removeItem(SUSPEND_CACHE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Exported API base for components that reference it directly.
 */
export const API_BASE = OVERRIDE_BASE;

/**
 * Determine the active backend base URL.
 */
export function getActiveBackendBase(): string {
  if (OVERRIDE_BASE) return OVERRIDE_BASE;
  if (isRenderSuspended()) {
    // If we're already on the Vercel domain, use relative URL so it goes through vercel.json
    if (typeof window !== 'undefined' && (window.location.hostname.includes('shahabdulmazidezan.me') || window.location.hostname.includes('vercel.app'))) {
      return '';
    }
    return VERCEL_BASE;
  }
  return RENDER_BASE;
}

/**
 * Clone request options so they can be safely re-used on fallback retry.
 */
function cloneOptions(options?: RequestInit): RequestInit {
  if (!options) return {};
  const cloned: RequestInit = { ...options };
  if (options.headers) {
    if (options.headers instanceof Headers) {
      cloned.headers = new Headers(options.headers);
    } else if (Array.isArray(options.headers)) {
      cloned.headers = [...options.headers];
    } else {
      cloned.headers = { ...options.headers };
    }
  }
  return cloned;
}

/**
 * Resilient fetch wrapper with automatic Render -> Vercel failover.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  // Only intercept /api/ requests or calls explicitly targeting Render/Vercel
  const isApiCall = urlStr.startsWith('/api/') || 
                    urlStr === '/api' ||
                    urlStr.includes(RENDER_BASE + '/api') || 
                    urlStr.includes(VERCEL_BASE + '/api');

  if (!isApiCall || OVERRIDE_BASE) {
    return originalFetch(input, init);
  }

  // Extract relative API path, e.g. /api/portfolio
  let apiPath = urlStr;
  if (apiPath.startsWith(RENDER_BASE)) {
    apiPath = apiPath.substring(RENDER_BASE.length);
  } else if (apiPath.startsWith(VERCEL_BASE)) {
    apiPath = apiPath.substring(VERCEL_BASE.length);
  }

  // 1. If Render is already known to be suspended, route directly to Vercel
  if (isRenderSuspended()) {
    const isVercelDomain = typeof window !== 'undefined' && 
      (window.location.hostname.includes('shahabdulmazidezan.me') || window.location.hostname.includes('vercel.app'));
    const targetUrl = isVercelDomain ? apiPath : `${VERCEL_BASE}${apiPath}`;
    return originalFetch(targetUrl, init);
  }

  // 2. Render is presumed awake: Try Render with a 3.5s cold-start timeout
  const renderUrl = `${RENDER_BASE}${apiPath}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  // Combine user signal with our timeout signal
  const activeSignal = init?.signal;
  if (activeSignal) {
    activeSignal.addEventListener('abort', () => controller.abort());
  }

  const renderInit: RequestInit = {
    ...cloneOptions(init),
    signal: controller.signal
  };

  try {
    const response = await originalFetch(renderUrl, renderInit);
    clearTimeout(timeoutId);

    // If Render returned 502/503/504 Bad Gateway, it's booting up or overloaded
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      console.warn(`[Backend Failover] Render returned ${response.status}. Switching to Vercel backend...`);
      markRenderSuspended();
      return fallbackToVercel(apiPath, init);
    }

    // Success or standard client error (e.g. 401 invalid password) - Render is functioning normally!
    return response;
  } catch (err: any) {
    clearTimeout(timeoutId);

    // If aborted due to user abort (component unmounted), don't failover
    if (activeSignal && activeSignal.aborted) {
      throw err;
    }

    // Render timed out (cold start) or network failed: failover to Vercel immediately!
    console.warn('[Backend Failover] Render connection timed out or failed. Switching to Vercel backend...', err?.message || err);
    markRenderSuspended();
    return fallbackToVercel(apiPath, init);
  }
}

/**
 * Execute request against Vercel fallback backend.
 */
async function fallbackToVercel(apiPath: string, init?: RequestInit): Promise<Response> {
  const isVercelDomain = typeof window !== 'undefined' && 
    (window.location.hostname.includes('shahabdulmazidezan.me') || window.location.hostname.includes('vercel.app'));
  const fallbackUrl = isVercelDomain ? apiPath : `${VERCEL_BASE}${apiPath}`;
  return originalFetch(fallbackUrl, cloneOptions(init));
}

// ─── TRANSPARENT GLOBAL FETCH INTERCEPTOR ───────────────────────────────────────
// Saves original window.fetch and replaces with resilient auto-failover fetch
const originalFetch = window.fetch.bind(window);

// Only install once
if (!(window as any).__resilient_fetch_installed) {
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (urlStr.startsWith('/api/') || urlStr === '/api' || urlStr.includes('onrender.com/api')) {
      return apiFetch(input, init);
    }
    return originalFetch(input, init);
  };
  (window as any).__resilient_fetch_installed = true;
  console.info('[Backend Resilience] Active: Render primary with auto-failover to Vercel on sleep/timeout.');
}
