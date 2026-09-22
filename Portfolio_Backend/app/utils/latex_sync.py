import os
import re
import logging

logger = logging.getLogger("latex-sync")

def escape_latex(text: str) -> str:
    """Escapes special LaTeX characters for regular text."""
    if not text:
        return ""
    text = re.sub(r'(?<!\\)&', r'\&', text)
    text = re.sub(r'(?<!\\)%', r'\%', text)
    text = re.sub(r'(?<!\\)#', r'\#', text)
    text = re.sub(r'(?<!\\)\$', r'\$', text)
    return text

def format_authors_latex(authors_str: str) -> str:
    """Formats author string bolding Shah Abdul Mazid."""
    if not authors_str:
        return r"\textbf{Shah Abdul Mazid}"
    
    clean = escape_latex(authors_str)
    
    patterns = [
        r'(?<!\\textbf\{)Shah Abdul Mazid(?!\})',
        r'(?<!\\textbf\{)Mazid, S\.\s*A\.(?!\})',
        r'(?<!\\textbf\{)Mazid, S\.A\.(?!\})',
    ]
    for pat in patterns:
        clean = re.sub(pat, r'\\textbf{Shah Abdul Mazid}', clean)
        
    return clean

def format_paper_latex(paper: dict) -> str:
    """Converts a single paper dict to LaTeX CV entry."""
    title = escape_latex(paper.get("title", "").strip())
    authors = format_authors_latex(paper.get("authors", "").strip())
    venue = escape_latex(paper.get("venue", "").strip())
    publisher = escape_latex(paper.get("publisher", "").strip())
    year = str(paper.get("year", "")).strip()
    doi = str(paper.get("doi", "")).strip()
    link = str(paper.get("link", "")).strip()

    lines = [f"\\textbf{{{title}}}\\\\"]
    
    if authors:
        lines.append(f"\\textbf{{Authors:}} {authors}\\\\[-0.5mm]")
        
    venue_parts = []
    if venue:
        venue_parts.append(f"\\textit{{{venue}}}")
    if publisher:
        venue_parts.append(publisher)
    if year and year not in venue and year not in publisher:
        venue_parts.append(year)
        
    if venue_parts:
        lines.append(f"{', '.join(venue_parts)}.\\\\[-1mm]")
        
    if doi:
        clean_doi = doi.replace("https://doi.org/", "").strip()
        escaped_doi = clean_doi.replace("_", r"\_")
        lines.append(f"DOI: \\href{{https://doi.org/{clean_doi}}}\n{{{escaped_doi}}}")
    elif link:
        lines.append(f"Link: \\href{{{link}}}{{View Publication}}")
        
    return "\n".join(lines)

def generate_publications_section(papers: list) -> str:
    r"""Generates the full \section{Publication} LaTeX code for relevant papers."""
    if not papers:
        return "\\section{Publication}\n\n"
        
    mazid_papers = [
        p for p in papers 
        if not p.get("authors") 
        or "mazid" in p.get("authors", "").lower() 
        or "shah" in p.get("authors", "").lower()
    ]
    selected_papers = mazid_papers if mazid_papers else papers

    try:
        selected_papers = sorted(
            selected_papers, 
            key=lambda x: str(x.get("year", "0")), 
            reverse=True
        )
    except Exception:
        pass

    entries = [format_paper_latex(p) for p in selected_papers]
    
    latex = "\\section{Publication}\n\n" + "\n\n\\vspace{1mm}\n\n".join(entries) + "\n\n"
    return latex

def find_tex_file_path() -> str:
    """Attempts to resolve the absolute path to Shah_Abdul_Mazid_Visual_CV_Version_2.tex."""
    candidates = [
        r"C:\Users\LENOVO\Desktop\Portfolio_Final\Portfolio_Frontend\public\resume\Shah_Abdul_Mazid_Visual_CV_Version_2.tex",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Portfolio_Frontend/public/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.tex")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../Portfolio_Frontend/public/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.tex")),
    ]
    for path in candidates:
        if os.path.isfile(path):
            return path
    return candidates[0]

def update_visual_cv_latex(papers: list, target_path: str = None) -> bool:
    """Updates the publication section in Shah_Abdul_Mazid_Visual_CV_Version_2.tex."""
    tex_path = target_path or find_tex_file_path()
    if not os.path.isfile(tex_path):
        logger.warning(f"LaTeX file not found at {tex_path}")
        return False

    try:
        with open(tex_path, "r", encoding="utf-8") as f:
            content = f.read()

        new_pub_section = generate_publications_section(papers)

        pattern = r"(\\section\{Publication\}[\s\S]*?)(?=(?:% =+\s*\n\s*% CERTIFICATIONS|\\section\{Certifications\}))"
        match = re.search(pattern, content)
        
        if match:
            updated_content = content[:match.start()] + new_pub_section + content[match.end():]
        else:
            pattern_fallback = r"(\\section\{Publication\}[\s\S]*?)(?=\\section\{)"
            matches = list(re.finditer(pattern_fallback, content))
            if matches:
                m = matches[0]
                updated_content = content[:m.start()] + new_pub_section + content[m.end():]
            else:
                logger.error("Could not locate \\section{Publication} in LaTeX file.")
                return False

        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(updated_content)

        logger.info(f"Successfully updated LaTeX publications at {tex_path}")
        return True

    except Exception as e:
        logger.error(f"Error updating LaTeX file: {e}")
        return False
