import type { PaperItem, ProjectItem, CertificationItem } from '../context/PortfolioContext';

const MAX_ACHIEVEMENTS = 5;

/**
 * Builds the Key Achievements list dynamically from portfolio data.
 *
 * Slot allocation (total cap = MAX_ACHIEVEMENTS):
 *   1. All own papers (filtered by author name) — each gets its own bullet.
 *      If there are too many, they fill up to MAX_ACHIEVEMENTS slots,
 *      leaving at least 1 slot for certifications when possible.
 *   2. Remaining slots → top-showcased projects (by showcase score).
 *   3. Last slot → certifications count (if any).
 *
 * Falls back to the provided staticFallback array when the portfolio data
 * yields fewer than 3 items (e.g. on first load or sparse data).
 */
export function buildDynamicAchievements(
    papers: PaperItem[] | undefined,
    projects: ProjectItem[] | undefined,
    certifications: CertificationItem[] | undefined,
    staticFallback: string[],
): string[] {
    const items: string[] = [];

    /* ── 1. Own publications ── */
    const myPapers = (papers ?? []).filter(
        p =>
            !p.authors ||
            p.authors.toLowerCase().includes('mazid') ||
            p.authors.toLowerCase().includes('shah'),
    );

    // Reserve 1 slot for certifications if there are any certs
    const hasCerts = (certifications?.length ?? 0) > 0;
    const maxPaperSlots = hasCerts ? MAX_ACHIEVEMENTS - 1 : MAX_ACHIEVEMENTS;

    myPapers.slice(0, maxPaperSlots).forEach(p => {
        const shortTitle = p.title.length > 72 ? p.title.slice(0, 69) + '…' : p.title;
        const venue = p.venue
            ? ` (${p.venue}${p.year ? `, ${p.year}` : ''})`
            : p.year
            ? ` (${p.year})`
            : '';
        items.push(`Published "${shortTitle}"${venue}`);
    });

    /* ── 2. Top projects (fill remaining slots, keep 1 for certs) ── */
    const slotsAfterPapers = Math.max(0, MAX_ACHIEVEMENTS - items.length - (hasCerts ? 1 : 0));
    if (slotsAfterPapers > 0 && (projects?.length ?? 0) > 0) {
        const topProjects = [...(projects ?? [])]
            .sort((a, b) => (b.showcase ?? 0) - (a.showcase ?? 0))
            .slice(0, slotsAfterPapers);

        topProjects.forEach(proj => {
            const detail = proj.result || proj.impact || proj.desc || '';
            if (detail) {
                const short = detail.length > 95 ? detail.slice(0, 92) + '…' : detail;
                items.push(`${proj.title}: ${short}`);
            }
        });
    }

    /* ── 3. Certifications count (last slot) ── */
    if (hasCerts && items.length < MAX_ACHIEVEMENTS) {
        items.push(
            `${certifications!.length}+ professional certifications in AI/ML specializations`,
        );
    }

    /* ── Fallback ── */
    return items.length >= 3 ? items.slice(0, MAX_ACHIEVEMENTS) : staticFallback;
}
