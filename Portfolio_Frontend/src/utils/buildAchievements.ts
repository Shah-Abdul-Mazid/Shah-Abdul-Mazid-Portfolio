import type { PaperItem, CertificationItem } from '../context/PortfolioContext';

/**
 * Extracts a short field/domain label from a paper based on its keywords, title, or venue.
 */
export function inferField(paper: PaperItem): string {
    const src = `${paper.keywords ?? ''} ${paper.title} ${paper.venue}`.toLowerCase();

    if (src.includes('agri') || src.includes('mango') || src.includes('crop') || src.includes('plant') || src.includes('flower') || src.includes('sunflower')) return 'agricultural AI';
    if (src.includes('medical') || src.includes('chest') || src.includes('pathology') || src.includes('tumor') || src.includes('brain') || src.includes('cancer') || src.includes('clinical') || src.includes('health')) return 'medical imaging';
    if (src.includes('nlp') || src.includes('natural language') || src.includes('text') || src.includes('language model') || src.includes('sentiment') || src.includes('translation')) return 'NLP';
    if (src.includes('vision') || src.includes('image') || src.includes('detection') || src.includes('classification') || src.includes('segmentation') || src.includes('yolo') || src.includes('object')) return 'computer vision';
    if (src.includes('rag') || src.includes('retrieval') || src.includes('llm') || src.includes('generative') || src.includes('chatbot') || src.includes('agent')) return 'Generative AI';
    if (src.includes('traffic') || src.includes('vehicle') || src.includes('autonomous') || src.includes('driving')) return 'autonomous systems';
    if (src.includes('fabric') || src.includes('defect') || src.includes('industrial') || src.includes('manufacturing')) return 'industrial AI';
    if (src.includes('recommend') || src.includes('collaborative filtering')) return 'recommendation systems';
    return 'AI/ML';
}

function shortenVenue(paper: PaperItem): string {
    const v = paper.venue || '';
    const y = paper.year ? ` ${paper.year}` : '';

    // Auto-extract acronyms in parentheses like "... (ICCIT)" or "... (CVPR)"
    const acronymMatch = v.match(/\(([A-Za-z0-9\-\s]+)\)/);
    if (acronymMatch && acronymMatch[1].trim().length <= 10) {
        return `${acronymMatch[1].trim()}${y}`;
    }

    if (/ICCIT/i.test(v)) return `ICCIT${y}`;
    if (/Innovations in Data Analytics/i.test(v)) return `Springer ICIDA${y}`;
    if (/Scientific Reports/i.test(v)) return `Nature Scientific Reports${y}`;
    if (/IEEE Access/i.test(v)) return `IEEE Access${y}`;
    if (/Smart Agricultural Technology/i.test(v)) return `Elsevier SAT${y}`;
    if (/Data in Brief/i.test(v)) return `Elsevier DiB${y}`;
    if (paper.publisher) return `${paper.publisher}${y}`;
    if (v.length > 25) return `${v.slice(0, 22)}…${y}`;
    return `${v}${y}`.trim();
}

/**
 * Generates the single Key Achievement publication bullet.
 *
 * Rules:
 * - Never create multiple paper bullets (individual papers are placed in the "Publication" section).
 * - If 7+ papers:
 *     "X+ publications spanning [field1], [field2], [field3] across [Publisher1], [Publisher2]..."
 * - If 2–6 papers:
 *     "Published X research papers in [field1] and [field2] ([Venue1], [Venue2])"
 * - If 1 paper:
 *     "Published research in [field] ([Venue])"
 */
export function generatePublicationBullet(myPapers: PaperItem[]): string {
    if (myPapers.length === 0) {
        return "Published research on interpretable ML for agricultural disease diagnosis (ICCIT 2025)";
    }

    const count = myPapers.length;
    const fields = Array.from(new Set(myPapers.map(inferField)));
    const publishers = Array.from(new Set(myPapers.map(p => p.publisher).filter(Boolean))) as string[];
    const shortVenues = Array.from(new Set(myPapers.map(shortenVenue).filter(Boolean)));

    if (count >= 7) {
        // 7+ papers → compact summary "X+ publications spanning [fields] across [publishers/venues]"
        const fieldStr = fields.slice(0, 4).join(', ');
        const pubStr = publishers.length > 0 ? publishers.slice(0, 3).join(', ') : shortVenues.slice(0, 3).join(', ');
        return `${count}+ publications spanning ${fieldStr}${pubStr ? ` across ${pubStr}` : ''}`;
    }

    if (count >= 2) {
        const fieldStr = fields.length === 2 ? `${fields[0]} and ${fields[1]}` : fields.slice(0, 3).join(', ');
        const venueStr = shortVenues.slice(0, 2).join(', ');
        return `Published ${count} research papers in ${fieldStr}${venueStr ? ` (${venueStr})` : ''}`;
    }

    // 1 paper
    const paper = myPapers[0];
    const field = inferField(paper);
    const where = shortenVenue(paper);
    return `Published research on ${field}${where ? ` (${where})` : ''}`;
}

/**
 * Returns the 5 Key Achievements, auto-updating bullet 1 (publications)
 * and bullet 5 (certifications) based on live portfolio data, while preserving
 * the other core achievements.
 */
export function getUpdatedAchievements(
    papers: PaperItem[] | undefined,
    certifications: CertificationItem[] | undefined,
    baseAchievements: string[],
): string[] {
    // If baseAchievements are provided, respect them directly
    if (baseAchievements && baseAchievements.length > 0) {
        return baseAchievements;
    }

    const myPapers = (papers ?? []).filter(
        p => !p.authors || p.authors.toLowerCase().includes('mazid') || p.authors.toLowerCase().includes('shah')
    );

    const pubBullet = generatePublicationBullet(myPapers);

    // Clone base achievements
    const list = [...(baseAchievements || [])];

    // Update bullet 1 (publications)
    if (list.length > 0) {
        list[0] = pubBullet;
    } else {
        list.push(pubBullet);
    }

    // Update bullet 5 (certifications) if certifications exist in portfolio
    if (certifications && certifications.length > 0 && list.length >= 5) {
        list[4] = `${certifications.length}+ IBM and AWS certifications in AI/ML specializations`;
    }

    return list;
}

/**
 * Returns the 4 Professional Highlights, auto-updating the "Published Research" card
 * while preserving the other cards.
 */
export function getUpdatedHighlights(
    papers: PaperItem[] | undefined,
    baseHighlights: { title: string; description: string }[],
): { title: string; description: string }[] {
    // If baseHighlights are provided, respect them directly
    if (baseHighlights && baseHighlights.length > 0) {
        return baseHighlights;
    }

    const myPapers = (papers ?? []).filter(
        p => !p.authors || p.authors.toLowerCase().includes('mazid') || p.authors.toLowerCase().includes('shah')
    );

    const count = myPapers.length;
    const fields = Array.from(new Set(myPapers.map(inferField)));
    const publishers = Array.from(new Set(myPapers.map(p => p.publisher).filter(Boolean))) as string[];
    const shortVenues = Array.from(new Set(myPapers.map(shortenVenue).filter(Boolean)));

    let desc: string;
    if (count >= 7) {
        const fieldStr = fields.slice(0, 4).join(', ');
        const pubStr = publishers.length > 0 ? publishers.slice(0, 3).join(', ') : shortVenues.slice(0, 3).join(', ');
        desc = `${count}+ publications spanning ${fieldStr}${pubStr ? ` across ${pubStr}` : ''}.`;
    } else if (count >= 2) {
        const fieldStr = fields.length === 2 ? `${fields[0]} and ${fields[1]}` : fields.slice(0, 3).join(', ');
        const venueStr = shortVenues.slice(0, 2).join(' and ');
        desc = `${count} publications in ${fieldStr}${venueStr ? `, including ${venueStr}` : ''}.`;
    } else if (count === 1) {
        const paper = myPapers[0];
        desc = `Publication in ${inferField(paper)}${paper.venue ? `, including ${shortenVenue(paper)}` : ''}.`;
    } else {
        desc = baseHighlights[0]?.description || "Research publications in AI/ML.";
    }

    return baseHighlights.map((hl, index) => {
        if (index === 0 || hl.title.toLowerCase().includes('research') || hl.title.toLowerCase().includes('publish')) {
            return { ...hl, description: desc };
        }
        return hl;
    });
}
