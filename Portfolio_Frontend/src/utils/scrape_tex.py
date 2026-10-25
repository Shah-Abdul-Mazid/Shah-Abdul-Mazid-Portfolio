"""
Scrapes all sections from Shah_Abdul_Mazid_Visual_CV_Version_2.tex
and generates a fresh, strongly-typed visualCvData.ts file.
"""
import re
import os
import json

TEX_PATH = os.path.join(os.path.dirname(__file__), '../../public/resume/Shah_Abdul_Mazid_Visual_CV_Version_2.tex')
OUT_PATH = os.path.join(os.path.dirname(__file__), '../data/visualCvData.ts')

with open(TEX_PATH, 'r', encoding='utf-8') as f:
    text = f.read()

# ==============================================================================
# Helper functions
# ==============================================================================

def strip_tex_comments(s: str) -> str:
    """Removes LaTeX comments (anything starting with % not escaped with backslash)."""
    return re.sub(r'(?<!\\)%.*', '', s)

def extract_braced_arg(s: str, start_pos: int):
    """
    Finds the first '{' at or after start_pos, tracks brace nesting depth,
    and returns (content_inside_outermost_braces, end_pos_after_closing_brace).
    Returns (None, start_pos) if not found or unclosed.
    """
    start = s.find('{', start_pos)
    if start == -1:
        return None, start_pos
    depth = 0
    for i in range(start, len(s)):
        if s[i] == '{':
            depth += 1
        elif s[i] == '}':
            depth -= 1
            if depth == 0:
                return s[start + 1:i], i + 1
    return None, start_pos

def clean(s: str) -> str:
    """Cleans LaTeX commands, symbols, and redundant whitespaces."""
    if not s:
        return ''
    s = s.replace(r'\&', '&').replace(r'\_', '_').replace(r'\%', '%')
    s = s.replace(r'---', ' — ').replace(r'--', ' – ')
    s = re.sub(r'\\textbf\{([^}]+)\}', r'\1', s)
    s = re.sub(r'\\textit\{([^}]+)\}', r'\1', s)
    s = re.sub(r'\\href\{[^}]+\}\{([^}]+)\}', r'\1', s)
    s = re.sub(r'\\small|\\normalsize|\\large|\\Huge|\\Large|\\bfseries|\\noindent|\\par', '', s)
    s = re.sub(r'\\\\(?:\[[^\]]*\])?', '\n', s)
    s = re.sub(r'\\vspace\{[^}]*\}', '', s)
    s = re.sub(r'\\[a-zA-Z*]+(?:\s|\{[^}]*\})?', '', s)
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()

def section_body(name: str, tex: str) -> str:
    name_esc = re.escape(name)
    m = re.search(
        r'\\section\*?\{' + name_esc + r'\}([\s\S]*?)(?=\\section|\% =+|\Z)',
        tex
    )
    return m.group(1) if m else ''

def ts_str(s: str) -> str:
    return json.dumps(s or '')

def ts_arr(lst) -> str:
    return '[' + ', '.join(json.dumps(x) for x in lst) + ']'

# ==============================================================================
# 1. Personal Info
# ==============================================================================
name_m   = re.search(r'\{\\Huge\\bfseries\s+([^}]+)\}', text)
title_m  = re.search(r'\{\\Large\\bfseries\s+([^}]+)\}', text)
tags_m   = re.search(r'(\\textbf\{[^}]+\}(?:\s*\\quad\|\\quad\s*\\textbf\{[^}]+\})+)', text)
tags     = [clean(t) for t in re.findall(r'\\textbf\{([^}]+)\}', tags_m.group(1))] if tags_m else [
    "Generative AI", "LLMs & RAG", "Computer Vision", "NLP", "Deep Learning"
]
phone_m  = re.search(r'\\faPhone\*\s*\\?\s*([+0-9 ]+)', text)
photo_m  = re.search(r'\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}', text)
avatar   = (photo_m.group(1).strip().replace('=', '-')) if photo_m else 'FD-109767.jpg'

links = re.findall(r'\\headerhref\{\s*([^}]+)\s*\}\{\s*([^}]+)\s*\}', text)
personal = {
    "name":         clean(name_m.group(1)) if name_m else "SHAH ABDUL MAZID",
    "title":        clean(title_m.group(1)) if title_m else "AI/ML Engineer & Researcher",
    "tags":         tags,
    "location":     "Dhaka, Bangladesh",
    "phone":        phone_m.group(1).strip() if phone_m else "+880 1531329222",
    "email":        "shahabdulmazid.ezan@yahoo.com",
    "linkedin":     "https://www.linkedin.com/in/shahabdulmazid",
    "github":       "https://github.com/Shah-Abdul-Mazid",
    "scholar":      "https://scholar.google.com/citations?user=TYkiwUgAAAAJ",
    "portfolio":    "https://shahabdulmazidezan.me",
    "orcid":        "https://orcid.org/0009-0009-6864-5343",
    "researchgate": "https://www.researchgate.net/profile/Shah-Abdul-Mazid",
    "avatarUrl":    f"/resume/{avatar}",
}
for u, _ in links:
    u = u.strip()
    if 'mailto:' in u:
        personal['email'] = u.replace('mailto:', '')
    elif 'linkedin' in u:
        personal['linkedin'] = u
    elif 'github' in u:
        personal['github'] = u
    elif 'scholar' in u:
        personal['scholar'] = u
    elif 'orcid' in u:
        personal['orcid'] = u
    elif 'researchgate' in u:
        personal['researchgate'] = u
    elif 'shahabdulmazid' in u and 'ezan' not in u and 'linkedin' not in u and 'github' not in u:
        personal['portfolio'] = u

# ==============================================================================
# 2. Professional Summary
# ==============================================================================
sum_body = section_body('Professional Summary', text)
summary  = clean(sum_body)

# ==============================================================================
# 3. Technical Skills
# ==============================================================================
skills_body = section_body('Technical Skills', text)
skills = []
for cat, items in re.findall(r'\\skill\{([^}]+)\}\{([^}]+)\}', skills_body):
    item_list = [clean(x) for x in items.split(',')]
    skills.append({
        "category": clean(cat),
        "items": [it for it in item_list if it],
    })

# ==============================================================================
# 4. Education
# ==============================================================================
edu_body = section_body('Education', text)
education = []
edu_chunks = [c for c in re.split(r'\\vspace\{[0-9.]+mm\}', edu_body) if '\\textbf{' in c]
for chunk in edu_chunks:
    deg_m = re.search(r'\\textbf\{([^}]+)\}\s*\\hfill\s*\\textbf\{([^}]+)\}', chunk)
    inst_m = re.search(r'\\textit\{([^}]+)\}', chunk)
    major_m = re.search(r'Major in\s+([^\n\\]+)', chunk)
    cgpa_m = re.search(r'CGPA:\s*([0-9.]+)', chunk)
    gpa_m = re.search(r'GPA:\s*([0-9.]+)', chunk)

    if deg_m:
        degree = clean(deg_m.group(1))
        period = clean(deg_m.group(2))
        inst   = clean(inst_m.group(1)) if inst_m else ""
        major  = major_m.group(1).strip() if major_m else ""
        res    = f"CGPA: {cgpa_m.group(1)}" if cgpa_m else (f"GPA: {gpa_m.group(1)}" if gpa_m else "")
        education.append({
            "degree": degree,
            "institution": inst,
            "period": period,
            "major": major,
            "details": f"Major in {major}" if major else "",
            "result": res,
        })

# ==============================================================================
# 5. Languages
# ==============================================================================
lang_body = section_body('Languages', text)
languages = []
for lm in re.finditer(r'\\textbf\{([^}]+)\}\s*(?:---|–|-)\s*([^\n\\]+)', lang_body):
    languages.append({
        "name": clean(lm.group(1)),
        "proficiency": clean(lm.group(2)),
    })

# ==============================================================================
# 6. Research Interests
# ==============================================================================
ri_body = section_body('Research Interests', text)
research_interests = [clean(x) for x in re.findall(r'\\item\s+([^\n\r]+)', ri_body) if clean(x)]

# ==============================================================================
# 7. Career Focus
# ==============================================================================
cf_body = section_body('Career Focus', text)
career_focus = [clean(x) for x in re.split(r'\\vspace\{[^}]*\}|\n{2,}', cf_body) if clean(x) and not clean(x).startswith('\\')]

# ==============================================================================
# 8. Tools & Platforms
# ==============================================================================
tools_body = section_body(r'Tools & Platforms', text)
if not tools_body:
    tools_body = section_body(r'Tools \& Platforms', text)
tools = []
for cat, items in re.findall(r'\\skill\{([^}]+)\}\{([^}]+)\}', tools_body):
    item_list = [clean(x) for x in items.split(',')]
    tools.append({
        "category": clean(cat),
        "items": [it for it in item_list if it],
    })

# ==============================================================================
# 9. Key Achievements
# ==============================================================================
ach_body = section_body('Key Achievements', text)
if not ach_body:
    ach_body = section_body('Key Strengths', text)
if not ach_body:
    ach_body = section_body('Achievements', text)
achievements = [clean(x) for x in re.findall(r'\\item\s+([^\n\r]+)', ach_body) if clean(x)]

# ==============================================================================
# 10. Professional Highlights
# ==============================================================================
high_body = section_body('Professional Highlights', text)
if not high_body:
    high_body = section_body('Highlights', text)
highlights = []
for block in re.split(r'\\vspace\{[^}]*\}|\n{2,}', high_body):
    block = block.strip()
    if not block or '\\textbf{' not in block:
        continue
    t_m = re.search(r'\\textbf\{([^}]+)\}', block)
    if t_m:
        t_raw = clean(t_m.group(1)).rstrip(':')
        desc_raw = block[t_m.end():]
        desc = clean(desc_raw).lstrip(':').strip()
        if desc.startswith(t_raw + ':'):
            desc = desc[len(t_raw) + 1:].strip()
        if t_raw and desc:
            highlights.append({
                "title": t_raw,
                "description": desc,
            })

# ==============================================================================
# 11. Work Experience
# ==============================================================================
exp_body = section_body('Professional Experience', text)
if not exp_body:
    exp_body = section_body('Work Experience', text)
experience = []
job_matches = list(re.finditer(r'\\job\b', exp_body))
for idx, jm in enumerate(job_matches):
    p = jm.end()
    role, p = extract_braced_arg(exp_body, p)
    comp, p = extract_braced_arg(exp_body, p)
    loc, p  = extract_braced_arg(exp_body, p)
    per, p  = extract_braced_arg(exp_body, p)
    next_p = job_matches[idx + 1].start() if idx + 1 < len(job_matches) else len(exp_body)
    rest = exp_body[p:next_p]
    pts = [clean(pt) for pt in re.findall(r'\\item\s+([^\n\r]+)', rest) if clean(pt)]
    experience.append({
        "role": clean(role),
        "company": clean(comp),
        "location": clean(loc),
        "period": clean(per),
        "points": pts,
    })

# ==============================================================================
# 12. Selected Projects (Robust brace extraction & optional links)
# ==============================================================================
proj_m = re.search(
    r'\\section\{Selected Projects\}([\s\S]*?)(?=\\section\{Publication\})',
    text
)
projects = []
if proj_m:
    proj_text = strip_tex_comments(proj_m.group(1))
    matches = list(re.finditer(r'\\project\b', proj_text))
    for idx, m in enumerate(matches):
        p_start = m.end()
        arg1, p_after1 = extract_braced_arg(proj_text, p_start)
        arg2, p_after2 = extract_braced_arg(proj_text, p_after1)
        if arg1 is None or arg2 is None:
            continue

        next_p = matches[idx + 1].start() if idx + 1 < len(matches) else len(proj_text)
        rest = proj_text[p_after2:next_p]

        # Extract GitHub and Live Demo links if present (both optional)
        gh_m = re.search(r'\\href\{([^}]+)\}\{\s*\[?GitHub\]?\s*\}', arg1, re.IGNORECASE)
        demo_m = re.search(r'\\href\{([^}]+)\}\{\s*\[?(?:Live Demo|Live|Demo)\]?\s*\}', arg1, re.IGNORECASE)

        gh_url = gh_m.group(1).strip() if gh_m else ""
        live_url = demo_m.group(1).strip() if demo_m else ""

        # Map placeholder links to real links if present
        if 'YOUR_TRAFFIC' in gh_url:
            gh_url = 'https://github.com/Shah-Abdul-Mazid/CSE475FinalProject'
        if 'YOUR_BRAIN_TUMOR' in gh_url:
            gh_url = 'https://github.com/Shah-Abdul-Mazid/CapstoneProjectFinal'

        # Clean title by removing \href commands
        title_raw = re.sub(r'\\href\{[^}]*\}\{[^}]*\}', '', arg1)
        title = clean(' '.join(title_raw.split())).rstrip(':').strip()
        subtitle = clean(arg2)

        # Parse description and item points
        item_m = re.search(r'\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}', rest)
        desc, points, tech = "", [], []
        if item_m:
            desc = clean(rest[:item_m.start()])
            for rp in re.findall(r'\\item\s+([^\n\r]+)', item_m.group(1)):
                clean_item = clean(rp)
                if 'Tech:' in clean_item:
                    tm = re.search(r'Tech:\s*(.*)', clean_item)
                    if tm:
                        tech = [x.strip().rstrip('.') for x in tm.group(1).split(',') if x.strip()]
                else:
                    pt_clean = clean(rp)
                    if pt_clean:
                        points.append(pt_clean)
        else:
            desc = clean(rest)

        desc = re.sub(r'\\vspace\{[^}]*\}', '', desc).strip()

        if title:
            projects.append({
                "title": title,
                "subtitle": subtitle,
                "description": desc,
                "points": points,
                "tech": tech,
                "githubUrl": gh_url,
                "liveUrl": live_url,
            })

# ==============================================================================
# 13. Publication
# ==============================================================================
pub_body = section_body('Publication', text)
if not pub_body:
    pub_body = section_body('Published Research', text)
publications = []
pub_blocks = [b.strip() for b in re.split(r'\\vspace\{[^}]*\}', pub_body) if b.strip()]
for b in pub_blocks:
    title_m = re.search(r'\\textbf\{([^}]+)\}', b)
    if not title_m:
        continue
    title = clean(title_m.group(1))
    auth_m = re.search(r'\\textbf\{Authors:\}\s*([\s\S]*?)(?=\\textit|\n\s*DOI|\Z)', b)
    authors = clean(auth_m.group(1)).replace('\n', ' ') if auth_m else ""
    conf_m = re.search(r'\\textit\{([^}]+)\}', b)
    conf = clean(conf_m.group(1)) if conf_m else ""
    doi_m = re.search(r'\\href\{([^}]+)\}', b)
    doi = doi_m.group(1).strip() if doi_m else ""
    yr_m = re.search(r'\b(20[2-3][0-9])\b', b)
    yr = yr_m.group(1) if yr_m else "2025"

    publications.append({
        "title": title,
        "authors": authors,
        "year": yr,
        "conference": conf,
        "doi": doi,
        "url": doi,
    })

# ==============================================================================
# 14. Certifications
# ==============================================================================
cert_body = section_body('Certifications', text)
certifications = [clean(x) for x in re.findall(r'\\item\s+([^\n\r]+)', cert_body) if clean(x)]

# ==============================================================================
# 15. Competitions
# ==============================================================================
comp_body = section_body(r'Competitions \& Awards', text)
if not comp_body:
    comp_body = section_body('Competitions', text)
competitions = []
for line in comp_body.splitlines():
    line = line.strip()
    cm = re.search(r'\\textbf\{([^}]+)\}\s*(?:---|–|-)\s*([^\n\\]+)', line)
    if cm:
        title = clean(cm.group(1))
        rest_c = clean(cm.group(2))
        parts = [p.strip() for p in rest_c.split(',')]
        year = parts[-1] if len(parts) > 1 else ""
        org = ', '.join(parts[:-1]) if len(parts) > 1 else rest_c
        competitions.append({
            "title": title,
            "organizer": org,
            "year": year,
        })

# ==============================================================================
# 16. References
# ==============================================================================
ref_body = section_body('References', text)
references = []
if ref_body:
    blocks = re.split(r'\\vspace\{[^}]*\}|\n{2,}', ref_body)
    for b in blocks:
        b = b.strip()
        if not b or 'Reference' not in b:
            continue
        label_m = re.search(r'\\textbf\{([^}]+)\}', b)
        label = clean(label_m.group(1)).rstrip(':') if label_m else 'Reference'
        email_m = re.search(r'\\href\{mailto:([^}]+)\}', b)
        email = email_m.group(1).strip() if email_m else ''
        lines_b = [clean(l) for l in b.split('\\\\') if clean(l)]
        info_lines = [l for l in lines_b if not l.startswith(label) and not l.startswith('Email:')]
        name = info_lines[0] if len(info_lines) > 0 else ''
        affil = info_lines[1] if len(info_lines) > 1 else ''
        if name:
            references.append({
                "label": label,
                "name": name,
                "affiliation": affil,
                "email": email,
            })

# ==============================================================================
# 17. Profiles & Portals
# ==============================================================================
profiles_body = section_body('Online Profiles', text)
profiles = []
if profiles_body:
    for line in profiles_body.splitlines():
        line = line.strip()
        pm = re.search(r'\\textbf\{([^}]+)\}:?\s*\\href\{([^}]+)\}\{([^}]+)\}', line)
        if pm:
            profiles.append({
                "label": clean(pm.group(1)).rstrip(':'),
                "url": pm.group(2).strip(),
                "text": clean(pm.group(3)),
            })

if not profiles:
    profiles = [
        { "label": "Portfolio",    "url": personal.get("portfolio", "https://shahabdulmazidezan.me"), "text": "shahabdulmazidezan.me" },
        { "label": "LinkedIn",     "url": personal.get("linkedin", "https://www.linkedin.com/in/shahabdulmazid"), "text": "in/shahabdulmazid" },
        { "label": "GitHub",       "url": personal.get("github", "https://github.com/Shah-Abdul-Mazid"), "text": "github.com/Shah-Abdul-Mazid" },
        { "label": "Scholar",      "url": personal.get("scholar", "https://scholar.google.com/citations?user=TYkiwUgAAAAJ"), "text": "Google Scholar" },
        { "label": "ORCID",        "url": personal.get("orcid", "https://orcid.org/0009-0009-6864-5343"), "text": "0009-0009-6864-5343" },
        { "label": "ResearchGate", "url": personal.get("researchgate", "https://www.researchgate.net/profile/Shah-Abdul-Mazid"), "text": "ResearchGate" },
    ]

# ==============================================================================
# Build TypeScript Output File
# ==============================================================================
lines = []
lines.append('/**')
lines.append(' * Visual CV Data - Auto-scraped from Shah_Abdul_Mazid_Visual_CV_Version_2.tex')
lines.append(' * DO NOT edit manually! Run `python src/utils/scrape_tex.py` or `npm run scrape:cv` to regenerate.')
lines.append(' */')
lines.append('')
lines.append('export interface VisualCvPersonal {')
lines.append('    name: string;')
lines.append('    title: string;')
lines.append('    tags: string[];')
lines.append('    location: string;')
lines.append('    phone: string;')
lines.append('    email: string;')
lines.append('    linkedin: string;')
lines.append('    github: string;')
lines.append('    scholar: string;')
lines.append('    portfolio?: string;')
lines.append('    orcid?: string;')
lines.append('    researchgate?: string;')
lines.append('    avatarUrl: string;')
lines.append('}')
lines.append('')
lines.append('export interface VisualCvSkill {')
lines.append('    category: string;')
lines.append('    items: string[];')
lines.append('}')
lines.append('')
lines.append('export interface VisualCvEducation {')
lines.append('    degree: string;')
lines.append('    institution: string;')
lines.append('    period: string;')
lines.append('    major: string;')
lines.append('    details: string;')
lines.append('    result: string;')
lines.append('}')
lines.append('')
lines.append('export interface VisualCvLanguage {')
lines.append('    name: string;')
lines.append('    proficiency: string;')
lines.append('}')
lines.append('')
lines.append('export interface VisualCvHighlight {')
lines.append('    title: string;')
lines.append('    description: string;')
lines.append('}')
lines.append('')
lines.append('export interface VisualCvExperience {')
lines.append('    role: string;')
lines.append('    company: string;')
lines.append('    location: string;')
lines.append('    period: string;')
lines.append('    points: string[];')
lines.append('}')
lines.append('')
lines.append('export interface VisualCvProject {')
lines.append('    title: string;')
lines.append('    subtitle: string;')
lines.append('    description: string;')
lines.append('    points: string[];')
lines.append('    tech: string[];')
lines.append('    githubUrl?: string;')
lines.append('    liveUrl?: string;')
lines.append('}')
lines.append('')
lines.append('export interface VisualCvPublication {')
lines.append('    title: string;')
lines.append('    authors: string;')
lines.append('    year: string;')
lines.append('    conference: string;')
lines.append('    doi: string;')
lines.append('    url: string;')
lines.append('}')
lines.append('')
lines.append('export interface VisualCvCompetition {')
lines.append('    title: string;')
lines.append('    organizer: string;')
lines.append('    year: string;')
lines.append('}')
lines.append('')
lines.append('export interface VisualCvReference {')
lines.append('    label: string;')
lines.append('    name: string;')
lines.append('    affiliation: string;')
lines.append('    email: string;')
lines.append('}')
lines.append('')
lines.append('export interface VisualCvData {')
lines.append('    personal: VisualCvPersonal;')
lines.append('    summary: string;')
lines.append('    skills: VisualCvSkill[];')
lines.append('    education: VisualCvEducation[];')
lines.append('    languages: VisualCvLanguage[];')
lines.append('    researchInterests: string[];')
lines.append('    careerFocus: string[];')
lines.append('    toolsAndPlatforms: VisualCvSkill[];')
lines.append('    achievements: string[];')
lines.append('    highlights: VisualCvHighlight[];')
lines.append('    experience: VisualCvExperience[];')
lines.append('    projects: VisualCvProject[];')
lines.append('    publications: VisualCvPublication[];')
lines.append('    certifications: string[];')
lines.append('    competitions: VisualCvCompetition[];')
lines.append('    references?: VisualCvReference[];')
lines.append('    profiles: { label: string; url: string; text: string }[];')
lines.append('}')
lines.append('')
lines.append('export const visualCvData: VisualCvData = {')

# Personal
lines.append('    personal: {')
for k, v in personal.items():
    if isinstance(v, list):
        lines.append(f'        {k}: {ts_arr(v)},')
    else:
        lines.append(f'        {k}: {ts_str(v)},')
lines.append('    },')

# Summary
lines.append(f'    summary: {ts_str(summary)},')

# Skills
lines.append('    skills: [')
for s in skills:
    lines.append(f'        {{ category: {ts_str(s["category"])}, items: {ts_arr(s["items"])} }},')
lines.append('    ],')

# Education
lines.append('    education: [')
for e in education:
    lines.append('        {')
    lines.append(f'            degree: {ts_str(e["degree"])},')
    lines.append(f'            institution: {ts_str(e["institution"])},')
    lines.append(f'            period: {ts_str(e["period"])},')
    lines.append(f'            major: {ts_str(e["major"])},')
    lines.append(f'            details: {ts_str(e["details"])},')
    lines.append(f'            result: {ts_str(e["result"])},')
    lines.append('        },')
lines.append('    ],')

# Languages
lines.append('    languages: [')
for l in languages:
    lines.append(f'        {{ name: {ts_str(l["name"])}, proficiency: {ts_str(l["proficiency"])} }},')
lines.append('    ],')

# Research interests
lines.append(f'    researchInterests: {ts_arr(research_interests)},')

# Career focus
lines.append(f'    careerFocus: {ts_arr(career_focus)},')

# Tools & Platforms
lines.append('    toolsAndPlatforms: [')
for t in tools:
    lines.append(f'        {{ category: {ts_str(t["category"])}, items: {ts_arr(t["items"])} }},')
lines.append('    ],')

# Achievements
lines.append(f'    achievements: {ts_arr(achievements)},')

# Highlights
lines.append('    highlights: [')
for h in highlights:
    lines.append(f'        {{ title: {ts_str(h["title"])}, description: {ts_str(h["description"])} }},')
lines.append('    ],')

# Experience
lines.append('    experience: [')
for e in experience:
    lines.append('        {')
    lines.append(f'            role: {ts_str(e["role"])},')
    lines.append(f'            company: {ts_str(e["company"])},')
    lines.append(f'            location: {ts_str(e["location"])},')
    lines.append(f'            period: {ts_str(e["period"])},')
    lines.append(f'            points: {ts_arr(e["points"])},')
    lines.append('        },')
lines.append('    ],')

# Projects
lines.append('    projects: [')
for p in projects:
    lines.append('        {')
    lines.append(f'            title: {ts_str(p["title"])},')
    lines.append(f'            subtitle: {ts_str(p["subtitle"])},')
    lines.append(f'            description: {ts_str(p["description"])},')
    lines.append(f'            points: {ts_arr(p["points"])},')
    lines.append(f'            tech: {ts_arr(p["tech"])},')
    lines.append(f'            githubUrl: {ts_str(p["githubUrl"])},')
    lines.append(f'            liveUrl: {ts_str(p["liveUrl"])},')
    lines.append('        },')
lines.append('    ],')

# Publications
lines.append('    publications: [')
for pub in publications:
    lines.append('        {')
    lines.append(f'            title: {ts_str(pub["title"])},')
    lines.append(f'            authors: {ts_str(pub["authors"])},')
    lines.append(f'            year: {ts_str(pub["year"])},')
    lines.append(f'            conference: {ts_str(pub["conference"])},')
    lines.append(f'            doi: {ts_str(pub["doi"])},')
    lines.append(f'            url: {ts_str(pub["url"])},')
    lines.append('        },')
lines.append('    ],')

# Certifications
lines.append(f'    certifications: {ts_arr(certifications)},')

# Competitions
lines.append('    competitions: [')
for c in competitions:
    lines.append(f'        {{ title: {ts_str(c["title"])}, organizer: {ts_str(c["organizer"])}, year: {ts_str(c["year"])} }},')
lines.append('    ],')

# References
lines.append('    references: [')
for r in references:
    lines.append('        {')
    lines.append(f'            label: {ts_str(r["label"])},')
    lines.append(f'            name: {ts_str(r["name"])},')
    lines.append(f'            affiliation: {ts_str(r["affiliation"])},')
    lines.append(f'            email: {ts_str(r["email"])},')
    lines.append('        },')
lines.append('    ],')

# Profiles
lines.append('    profiles: [')
for p in profiles:
    lines.append(f'        {{ label: {ts_str(p["label"])}, url: {ts_str(p["url"])}, text: {ts_str(p["text"])} }},')
lines.append('    ],')

lines.append('};')

output = '\n'.join(lines) + '\n'

with open(OUT_PATH, 'w', encoding='utf-8') as f:
    f.write(output)

print('SUCCESS: visualCvData.ts generated from LaTeX.')
print(f'  Skills: {len(skills)}, Education: {len(education)}, Languages: {len(languages)}')
print(f'  Research: {len(research_interests)}, CareerFocus: {len(career_focus)}, Tools: {len(tools)}')
print(f'  Achievements: {len(achievements)}, Highlights: {len(highlights)}')
print(f'  Experience: {len(experience)}, Projects: {len(projects)}, Publications: {len(publications)}')
print(f'  Certifications: {len(certifications)}, Competitions: {len(competitions)}')
print(f'  References: {len(references)}, Profiles: {len(profiles)}')
