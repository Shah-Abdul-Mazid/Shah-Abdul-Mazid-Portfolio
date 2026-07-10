/**
 * Centralized API utility.
 * 
 * - In production (Vercel): uses relative `/api/...` paths,
 *   which are rewritten by vercel.json to the Render backend.
 * - In local dev: the Vite proxy in vite.config.ts forwards
 *   `/api/...` to the Render backend automatically.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * A thin fetch wrapper that prepends the API base URL.
 * Usage: apiFetch('/api/messages', { method: 'POST', ... })
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
    const url = `${API_BASE}${path}`;
    return fetch(url, options);
}
