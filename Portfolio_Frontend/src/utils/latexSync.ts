import { PaperItem } from '../context/PortfolioContext';

export const escapeLatex = (text: string): string => {
    if (!text) return '';
    return text
        .replace(/(?<!\\)&/g, '\\&')
        .replace(/(?<!\\)%/g, '\\%')
        .replace(/(?<!\\)#/g, '\\#')
        .replace(/(?<!\\)\$/g, '\\$');
};

export const formatAuthorsLatex = (authorsStr: string): string => {
    if (!authorsStr) return '\\textbf{Shah Abdul Mazid}';
    let clean = escapeLatex(authorsStr);
    const patterns = [
        /(?<!\\textbf\{)Shah Abdul Mazid(?!\})/g,
        /(?<!\\textbf\{)Mazid, S\.\s*A\.(?!\})/g,
        /(?<!\\textbf\{)Mazid, S\.A\.(?!\})/g,
    ];
    for (const pat of patterns) {
        clean = clean.replace(pat, '\\textbf{Shah Abdul Mazid}');
    }
    return clean;
};

export const formatPaperLatex = (paper: PaperItem): string => {
    const title = escapeLatex(paper.title?.trim() || '');
    const authors = formatAuthorsLatex(paper.authors?.trim() || '');
    const venue = escapeLatex(paper.venue?.trim() || '');
    const publisher = escapeLatex(paper.publisher?.trim() || '');
    const year = String(paper.year || '').trim();
    const doi = String(paper.doi || '').trim();
    const link = String(paper.link || '').trim();

    const lines: string[] = [`\\textbf{${title}}\\\\`];

    if (authors) {
        lines.push(`\\textbf{Authors:} ${authors}\\\\[-0.5mm]`);
    }

    const venueParts: string[] = [];
    if (venue) venueParts.push(`\\textit{${venue}}`);
    if (publisher) venueParts.push(publisher);
    if (year && !venue.includes(year) && !publisher.includes(year)) {
        venueParts.push(year);
    }

    if (venueParts.length > 0) {
        lines.push(`${venueParts.join(', ')}.\\\\[-1mm]`);
    }

    if (doi) {
        const cleanDoi = doi.replace('https://doi.org/', '').trim();
        const escapedDoi = cleanDoi.replace(/_/g, '\\_');
        lines.push(`DOI: \\href{https://doi.org/${cleanDoi}}\n{${escapedDoi}}`);
    } else if (link) {
        lines.push(`Link: \\href{${link}}{View Publication}`);
    }

    return lines.join('\n');
};

export const generatePublicationsLatex = (papers: PaperItem[] = []): string => {
    if (!papers || papers.length === 0) {
        return '\\section{Publication}\n\n';
    }

    // Prioritize papers where author is Shah Abdul Mazid / Mazid, or include all papers
    const mazidPapers = papers.filter(
        p => !p.authors || p.authors.toLowerCase().includes('mazid') || p.authors.toLowerCase().includes('shah')
    );
    const selectedPapers = mazidPapers.length > 0 ? mazidPapers : papers;

    const sorted = [...selectedPapers].sort((a, b) => {
        const yA = parseInt(String(a.year || '0'), 10) || 0;
        const yB = parseInt(String(b.year || '0'), 10) || 0;
        return yB - yA;
    });

    const entries = sorted.map(formatPaperLatex);
    return `\\section{Publication}\n\n${entries.join('\n\n\\vspace{1mm}\n\n')}\n\n`;
};

export const updateVisualCvTex = (originalTex: string, papers: PaperItem[]): string => {
    const newPubSection = generatePublicationsLatex(papers);

    const pattern = /(\\section\{Publication\}[\s\S]*?)(?=(?:% =+\s*\n\s*% CERTIFICATIONS|\\section\{Certifications\}))/;
    const match = pattern.exec(originalTex);

    if (match) {
        return originalTex.slice(0, match.index) + newPubSection + originalTex.slice(match.index + match[0].length);
    }

    // Fallback: search for \section{Publication} up to next \section{
    const fallbackPattern = /(\\section\{Publication\}[\s\S]*?)(?=\\section\{)/;
    const fallbackMatch = fallbackPattern.exec(originalTex);
    if (fallbackMatch) {
        return originalTex.slice(0, fallbackMatch.index) + newPubSection + originalTex.slice(fallbackMatch.index + fallbackMatch[0].length);
    }

    return originalTex;
};

export const downloadUpdatedVisualCvTex = async (
    papers: PaperItem[],
    texPath: string = '/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.tex',
    filename: string = 'Shah_Abdul_Mazid_Visual_CV_Version_2.tex'
): Promise<void> => {
    try {
        const res = await fetch(texPath);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const originalTex = await res.text();
        const updatedTex = updateVisualCvTex(originalTex, papers);

        const blob = new Blob([updatedTex], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Failed to generate updated .tex file, downloading original:', err);
        const a = document.createElement('a');
        a.href = texPath;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
