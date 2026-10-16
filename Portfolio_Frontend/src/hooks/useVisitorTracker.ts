import { useEffect } from 'react';
import { getBrowserInstanceId, getDeviceIdentifier, getDeviceInfo } from '../utils/deviceFingerprint';

/**
 * Visitor tracking hook — two-step flow with cross-browser linking support:
 *
 * Step 0: Cross-Browser Linking Token Check
 *   - If URL contains ?link_token=<token>, claims it to associate this browser with the
 *     source canonical device.
 *
 * Step 1 (first ever visit on this browser): POST /api/analytics/register-browser
 *   - Sends browser_instance_id (stable localStorage UUID) + hardware fingerprint
 *   - Backend creates/finds a canonical device record
 *   - Stores canonical_device_id in localStorage for future reference
 *
 * Step 2 (every session): POST /api/analytics/track
 *   - Sends browser_instance_id only (no fingerprint recompute needed)
 *   - Records an individual visit event linked to the canonical device
 *
 * Registration is idempotent — safe to call even if already registered.
 * Tracking fires once per browser session (sessionStorage guard).
 */
export const useVisitorTracker = () => {
    useEffect(() => {
        const trackVisit = async () => {
            try {
                const browserInstanceId = getBrowserInstanceId();

                // Step 0: Check for Cross-Browser Link Token (?link_token=...)
                try {
                    const urlParams = new URLSearchParams(window.location.search);
                    const linkToken = urlParams.get('link_token');
                    if (linkToken) {
                        const claimRes = await fetch('/api/analytics/link-claim', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                token: linkToken.trim(),
                                browser_instance_id: browserInstanceId
                            })
                        });

                        if (claimRes.ok) {
                            const claimData = await claimRes.json();
                            if (claimData.canonical_device_id) {
                                localStorage.setItem('portfolio_canonical_id', claimData.canonical_device_id);
                                console.log('🔗 Successfully linked browser to canonical device:', claimData.canonical_device_id);
                            }
                        } else {
                            const errData = await claimRes.json().catch(() => ({}));
                            console.warn('Link token claim failed:', errData.detail || 'Token invalid or expired');
                        }

                        // Clean up URL parameter cleanly
                        urlParams.delete('link_token');
                        const newQuery = urlParams.toString();
                        const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '') + window.location.hash;
                        window.history.replaceState({}, document.title, newUrl);
                    }
                } catch (linkErr) {
                    console.error('Error handling link token:', linkErr);
                }

                const hasTrackedSession = sessionStorage.getItem('portfolio_visited');

                // Check if this browser has been registered (canonical_device_id stored)
                const storedCanonicalId = localStorage.getItem('portfolio_canonical_id');
                const isRegistered = !!storedCanonicalId;

                const hardwareFingerprint = await getDeviceIdentifier();
                const deviceInfo = getDeviceInfo();

                // Step 1: Register browser if not yet registered
                if (!isRegistered) {
                    const regRes = await fetch('/api/analytics/register-browser', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            browser_instance_id: browserInstanceId,
                            hardware_fingerprint: hardwareFingerprint,
                            device_id: hardwareFingerprint || browserInstanceId,
                            device: deviceInfo,
                            user_agent: navigator.userAgent
                        })
                    });

                    if (regRes.ok) {
                        const regData = await regRes.json();
                        if (regData.canonical_device_id) {
                            try {
                                localStorage.setItem('portfolio_canonical_id', regData.canonical_device_id);
                            } catch {
                                // localStorage might be unavailable — continue anyway
                            }
                        }
                    }
                }

                // Step 2: Record this visit session (once per session)
                if (!hasTrackedSession) {
                    const canonicalDeviceId = localStorage.getItem('portfolio_canonical_id') || '';

                    const trackRes = await fetch('/api/analytics/track', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            browser_instance_id: browserInstanceId,
                            canonical_device_id: canonicalDeviceId,
                            device_id: hardwareFingerprint || browserInstanceId,
                            mac_address: hardwareFingerprint || browserInstanceId,
                            device: deviceInfo,
                            user_agent: navigator.userAgent
                        })
                    });

                    if (trackRes.ok) {
                        sessionStorage.setItem('portfolio_visited', 'true');
                    }
                }
            } catch (err) {
                console.error('Visitor tracking failed:', err);
            }
        };

        trackVisit();
    }, []);
};
