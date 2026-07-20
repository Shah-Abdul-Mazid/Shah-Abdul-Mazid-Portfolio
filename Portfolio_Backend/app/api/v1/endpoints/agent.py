from fastapi import APIRouter, Depends, Body
from pydantic import BaseModel
from typing import Optional
from app.db import get_database
from app.config import settings
import logging
import httpx
import re

router = APIRouter()
logger = logging.getLogger("ai-agent")

WELCOME_MSG = (
    "Hi! I am Shah Abdul Mazid's AI Portfolio Assistant.\n\n"
    "Ask me anything about him:\n"
    "* About / Bio\n"
    "* Education (BSc, HSC, SSC)\n"
    "* Work Experience\n"
    "* Hackathon / Competition Experience\n"
    "* Technical Skills & Stack\n"
    "* Projects & Applications\n"
    "* Research Papers\n"
    "* Certifications\n"
    "* Activities & Clubs\n"
    "* References\n"
    "* Contact Details\n\n"
    "What would you like to know?"
)

SYSTEM_PROMPT_TEMPLATE = (
    "You are an AI assistant embedded in Shah Abdul Mazid's personal portfolio website.\n"
    "Your ONLY job is to answer questions about Shah Abdul Mazid using the PORTFOLIO DATA below.\n"
    "Rules:\n"
    "1. Answer ONLY from the provided PORTFOLIO DATA — do not invent information.\n"
    "2. Answer the question directly — do NOT introduce yourself or give a menu.\n"
    "3. Be concise, warm and professional. Use plain text (no markdown symbols like ** or ##).\n"
    "4. If the answer is not in the data, respond: 'I don't have that information in the portfolio. "
    "Type exit to contact Shah Abdul Mazid directly.'\n\n"
    "PORTFOLIO DATA:\n{context}"
)


# ─────────────────────────────────────────────────────────────────────────────
# Build full plain-text context from all portfolio sections
# ─────────────────────────────────────────────────────────────────────────────
def build_context(data: dict) -> str:
    hero           = data.get("hero", {})
    about          = data.get("about", {})
    skills         = data.get("skills", [])
    education      = data.get("education", [])
    work           = data.get("work", [])
    experience     = data.get("experience", [])      # hackathons / competitions
    projects       = data.get("projects", [])
    papers         = data.get("papers", [])
    certifications = data.get("certifications", [])
    activities     = data.get("activities", [])
    references     = data.get("references", [])
    blogs          = data.get("blogs", [])
    achievements   = data.get("achievements", [])
    contact        = data.get("contact", {})

    lines = [
        "FULL NAME: Shah Abdul Mazid",
        f"TITLE / ROLES: {hero.get('title', '')}",
        f"SHORT BIO: {hero.get('description', '')}",
        f"DETAILED BIO: {about.get('bio', '')}",
        f"AGE: {about.get('age', '')}",
        f"TOTAL PROJECTS: {about.get('projects', '')}",
    ]

    # Contact
    if contact:
        lines.append("\n--- CONTACT INFORMATION ---")
        for k, v in contact.items():
            if v:
                lines.append(f"  {k}: {v}")

    # Education
    if education:
        lines.append("\n--- EDUCATION ---")
        for e in education:
            lines.append(
                f"  Degree: {e.get('degree')} | Institution: {e.get('school')} | "
                f"Period: {e.get('year')} | Major/Subject: {e.get('major', '')}"
            )

    # Skills
    if skills:
        lines.append("\n--- TECHNICAL SKILLS ---")
        for cat in skills:
            lines.append(f"  {cat.get('name')}: {', '.join(cat.get('items', []))}")

    # Work
    if work:
        lines.append("\n--- WORK EXPERIENCE ---")
        for w in work:
            end = w.get("endDate") or "Present"
            lines.append(
                f"  Role: {w.get('role')} | Company: {w.get('company')} | "
                f"Period: {w.get('startDate')} to {end}"
            )
            for d in w.get("details", []):
                lines.append(f"    - {d}")

    # Experience (hackathons, competitions)
    if experience:
        lines.append("\n--- HACKATHONS & COMPETITION EXPERIENCE ---")
        for e in experience:
            name = e.get("name") or e.get("title") or e.get("event") or ""
            role = e.get("role") or e.get("position") or ""
            org  = e.get("organization") or e.get("organizer") or ""
            period = e.get("period") or e.get("year") or ""
            desc = e.get("desc") or e.get("description") or ""
            lines.append(f"  Event: {name} | Role: {role} | Organizer: {org} | Period: {period}")
            if desc:
                lines.append(f"    Description: {desc}")

    # Projects
    if projects:
        lines.append("\n--- PROJECTS ---")
        for p in projects:
            lines.append(
                f"  Title: {p.get('title')} | "
                f"Description: {p.get('desc')} | "
                f"Tags/Technologies: {', '.join(p.get('tags', []))} | "
                f"GitHub: {p.get('githubUrl', '')} | "
                f"URL: {p.get('projectUrl', '')}"
            )

    # Research Papers
    if papers:
        lines.append("\n--- RESEARCH PAPERS ---")
        for p in papers:
            lines.append(
                f"  Title: {p.get('title')} | "
                f"Authors: {p.get('authors', '')} | "
                f"Venue: {p.get('venue')} | "
                f"Year: {p.get('year')}"
            )

    # Certifications
    if certifications:
        lines.append("\n--- CERTIFICATIONS ---")
        for c in certifications:
            skills_str = ", ".join(c.get("skills", [])[:5])
            lines.append(
                f"  Name: {c.get('name')} | Issuer: {c.get('issuer')} | "
                f"Date: {c.get('date')} | "
                f"Credential ID: {c.get('credentialId', '')} | "
                f"Skills: {skills_str}"
            )

    # Activities
    if activities:
        lines.append("\n--- ACTIVITIES & CLUBS ---")
        for a in activities:
            lines.append(
                f"  Role: {a.get('role')} | Organization: {a.get('organization')} | "
                f"Period: {a.get('period')} | Description: {a.get('desc', '')}"
            )

    # Achievements
    if achievements:
        lines.append("\n--- ACHIEVEMENTS ---")
        for a in achievements:
            title = a.get("title") or a.get("name") or ""
            desc  = a.get("desc") or a.get("description") or ""
            lines.append(f"  {title}: {desc}")

    # References
    if references:
        lines.append("\n--- PROFESSIONAL REFERENCES ---")
        for r in references:
            lines.append(
                f"  Name: {r.get('name')} | Title: {r.get('title')} | "
                f"Company: {r.get('company')} | Relation: {r.get('relation', '')} | "
                f"Email: {r.get('email', '')} | Phone: {r.get('phone', '')}"
            )

    # Blogs
    if blogs:
        lines.append("\n--- BLOGS / ARTICLES ---")
        for b in blogs:
            lines.append(f"  Title: {b.get('title')} | Date: {b.get('date')} | Excerpt: {b.get('excerpt', '')}")

    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────────────────
# Strip greeting prefix so the real intent is processed
# "Hi what is his name?" → "what is his name?"
# ─────────────────────────────────────────────────────────────────────────────
def strip_greeting(query: str) -> str:
    pattern = r'^(hi|hello|hey|greetings|good\s+\w+)[,!.\s]*'
    stripped = re.sub(pattern, '', query, flags=re.IGNORECASE).strip()
    return stripped if stripped else query


# ─────────────────────────────────────────────────────────────────────────────
# ENGINE 1: Groq — fast free cloud LLM (production)
# ─────────────────────────────────────────────────────────────────────────────
async def call_groq(query: str, context: str) -> str | None:
    if not settings.GROQ_API_KEY:
        return None
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}", "Content-Type": "application/json"},
                json={
                    "model": settings.GROQ_MODEL or "llama3-8b-8192",
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT_TEMPLATE.format(context=context)},
                        {"role": "user",   "content": query}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 512,
                }
            )
            if resp.status_code == 200:
                return resp.json()["choices"][0]["message"]["content"].strip()
            logger.warning(f"Groq {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        logger.warning(f"Groq unavailable: {e}")
    return None


# ─────────────────────────────────────────────────────────────────────────────
# ENGINE 2: Ollama — local free LLM (local dev)
# ─────────────────────────────────────────────────────────────────────────────
async def call_ollama(query: str, context: str) -> str | None:
    url   = settings.OLLAMA_URL or "http://localhost:11434"
    model = settings.OLLAMA_MODEL or "llama3"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{url}/api/chat",
                headers={
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT_TEMPLATE.format(context=context)},
                        {"role": "user",   "content": query}
                    ],
                    "stream": False
                }
            )
            if resp.status_code == 200:
                answer = resp.json().get("message", {}).get("content", "").strip()
                # Reject if Ollama echoes back a greeting/menu (common Ollama bug)
                bad_phrases = ["what would you like to know", "ask me anything", "i am shah"]
                if answer and not any(p in answer.lower() for p in bad_phrases) and len(answer) > 15:
                    return answer
    except Exception as e:
        logger.warning(f"Ollama unavailable: {e}")
    return None


# ─────────────────────────────────────────────────────────────────────────────
# ENGINE 3: Comprehensive keyword matching — always reliable fallback
# ─────────────────────────────────────────────────────────────────────────────
def keyword_match(query: str, data: dict) -> dict | None:
    hero           = data.get("hero", {})
    about          = data.get("about", {})
    skills         = data.get("skills", [])
    education      = data.get("education", [])
    work           = data.get("work", [])
    experience     = data.get("experience", [])
    projects       = data.get("projects", [])
    papers         = data.get("papers", [])
    certifications = data.get("certifications", [])
    activities     = data.get("activities", [])
    achievements   = data.get("achievements", [])
    references     = data.get("references", [])
    blogs          = data.get("blogs", [])
    contact        = data.get("contact", {})

    q = strip_greeting(query).lower()

    # ── Pure greeting (no real question) ────────────────────────────────────
    if not q or q.strip() in ["hi", "hello", "hey", "help", "sup", "yo"]:
        return {"found": True, "response": WELCOME_MSG}

    # ── Name / Identity ──────────────────────────────────────────────────────
    if any(k in q for k in ["name", "who is", "who are", "your name", "his name", "full name", "introduce"]):
        roles = ", ".join(hero.get("roles", []))
        return {
            "found": True,
            "response": (
                f"His full name is Shah Abdul Mazid.\n"
                f"Roles: {roles}\n\n"
                f"{about.get('bio', hero.get('description', ''))}"
            )
        }

    # ── About / Bio ──────────────────────────────────────────────────────────
    if any(k in q for k in ["about", "bio", "background", "summary", "profile", "overview",
                             "describe", "tell me", "who", "age", "old", "nationality", "born"]):
        c = contact
        resp = (
            f"About Shah Abdul Mazid:\n\n"
            f"{about.get('bio', '')}\n\n"
            f"Age: {about.get('age', 'N/A')} | "
            f"Nationality: {c.get('nationality', 'Bangladeshi')} | "
            f"Date of Birth: {c.get('dob', '')} | "
            f"Place of Birth: {c.get('pob', '')}"
        )
        return {"found": True, "response": resp}

    # ── Contact ──────────────────────────────────────────────────────────────
    if any(k in q for k in ["contact", "email", "phone", "location", "social", "github",
                             "linkedin", "whatsapp", "facebook", "messenger", "address",
                             "reach", "connect", "dob", "date of birth", "place of birth", "pob"]):
        resp = "Contact Details:\n"
        labels = {
            "email": "Email", "phone": "Phone", "location": "Location",
            "whatsapp": "WhatsApp", "messenger": "Messenger", "facebook": "Facebook",
            "github": "GitHub", "linkedin": "LinkedIn", "nationality": "Nationality",
            "dob": "Date of Birth", "pob": "Place of Birth"
        }
        for k, label in labels.items():
            v = contact.get(k)
            if v:
                resp += f"  {label}: {v}\n"
        return {"found": True, "response": resp}

    # ── Education ────────────────────────────────────────────────────────────
    if any(k in q for k in ["education", "school", "university", "college", "degree", "academic",
                             "study", "studied", "major", "bsc", "hsc", "ssc", "bachelor",
                             "secondary", "higher secondary", "graduate", "graduation",
                             "subject", "institution", "where did", "where he", "completed",
                             "cgpa", "gpa", "east west", "ewu", "dhaka ideal", "badshah faisal"]):
        resp = "Academic Background:\n\n"
        for e in education:
            resp += (
                f"* {e.get('degree')}\n"
                f"  Institution: {e.get('school')}\n"
                f"  Period: {e.get('year')}\n"
                f"  Major/Subject: {e.get('major', 'N/A')}\n\n"
            )
        return {"found": True, "response": resp}

    # ── Skills / Tech Stack ──────────────────────────────────────────────────
    if any(k in q for k in ["skill", "tech", "language", "framework", "database", "library",
                             "tool", "cloud", "expertise", "stack", "programming", "technology",
                             "know", "knows", "proficient", "python", "java", "fastapi",
                             "tensorflow", "pytorch", "deep learning", "machine learning"]):
        resp = "Technical Skills:\n\n"
        for cat in skills:
            resp += f"* {cat.get('name')}:\n  {', '.join(cat.get('items', []))}\n\n"
        return {"found": True, "response": resp}

    # ── Work Experience ──────────────────────────────────────────────────────
    if any(k in q for k in ["work", "job", "employment", "career", "company", "position",
                             "intern", "internship", "worked", "working", "occupation",
                             "softvence", "eshikhon", "ambassador", "ai engineer"]):
        resp = "Work Experience:\n\n"
        for i, w in enumerate(work):
            end = w.get("endDate") or "Present"
            resp += f"{i+1}. {w.get('role')} at {w.get('company')}\n"
            resp += f"   Period: {w.get('startDate')} to {end}\n"
            for d in w.get("details", []):
                resp += f"   - {d}\n"
            resp += "\n"
        return {"found": True, "response": resp}

    # ── Hackathon / Competition Experience ───────────────────────────────────
    if any(k in q for k in ["hackathon", "competition", "contest", "experience",
                             "event", "participate", "participated", "achievement",
                             "award", "prize", "winner", "rank"]):
        # Try experience section first
        if experience:
            resp = "Hackathon & Competition Experience:\n\n"
            for e in experience:
                name = e.get("name") or e.get("title") or e.get("event") or ""
                role = e.get("role") or e.get("position") or ""
                org  = e.get("organization") or e.get("organizer") or ""
                period = e.get("period") or e.get("year") or ""
                desc = e.get("desc") or e.get("description") or ""
                resp += f"* {name}\n  Role: {role} | Organizer: {org} | Period: {period}\n"
                if desc:
                    resp += f"  {desc}\n"
                resp += "\n"
            return {"found": True, "response": resp}
        elif achievements:
            resp = "Achievements:\n\n"
            for a in achievements:
                resp += f"* {a.get('title', a.get('name', ''))}: {a.get('desc', a.get('description', ''))}\n"
            return {"found": True, "response": resp}

    # ── Projects ─────────────────────────────────────────────────────────────
    if any(k in q for k in ["project", "projects", "showcase", "build", "built",
                             "application", "app", "developed", "made", "created",
                             "rag", "chatbot", "travel", "brain tumor", "traffic",
                             "nexus", "whatsup", "hr policy", "enterprise"]):
        resp = "Featured Projects:\n\n"
        for p in projects:
            resp += (
                f"* {p.get('title')}\n"
                f"  {p.get('desc')}\n"
                f"  Technologies: {', '.join(p.get('tags', []))}\n"
            )
            if p.get("githubUrl"):
                resp += f"  GitHub: {p.get('githubUrl')}\n"
            resp += "\n"
        return {"found": True, "response": resp}

    # ── Research Papers ──────────────────────────────────────────────────────
    if any(k in q for k in ["paper", "papers", "publication", "publications", "research",
                             "journal", "conference", "published", "article", "author",
                             "chest", "mango", "pathology", "icida", "iccit", "vision"]):
        resp = "Research Publications:\n\n"
        for p in papers:
            resp += (
                f"* {p.get('title')}\n"
                f"  Authors: {p.get('authors', '')}\n"
                f"  Published in: {p.get('venue')} ({p.get('year')})\n\n"
            )
        return {"found": True, "response": resp}

    # ── Certifications ───────────────────────────────────────────────────────
    if any(k in q for k in ["certification", "certificate", "certifications", "certificates",
                             "license", "course", "credential", "ibm", "aws", "deeplearning",
                             "coursera", "tensorflow", "pytorch", "agentic", "rag cert"]):
        resp = "Certifications & Courses:\n\n"
        for c in certifications:
            resp += f"* {c.get('name')}\n"
            resp += f"  Issuer: {c.get('issuer')} | Date: {c.get('date')}\n"
            if c.get("credentialId"):
                resp += f"  Credential ID: {c.get('credentialId')}\n"
            if c.get("skills"):
                resp += f"  Skills: {', '.join(c.get('skills', [])[:5])}\n"
            resp += "\n"
        return {"found": True, "response": resp}

    # ── Activities / Clubs ───────────────────────────────────────────────────
    if any(k in q for k in ["activit", "club", "volunteer", "community", "organize",
                             "organizer", "workshop", "event organizer", "ewu computer"]):
        resp = "Activities & Club Involvement:\n\n"
        for a in activities:
            resp += (
                f"* {a.get('role')} at {a.get('organization')}\n"
                f"  Period: {a.get('period')}\n"
                f"  {a.get('desc', '')}\n\n"
            )
        return {"found": True, "response": resp}

    # ── References ───────────────────────────────────────────────────────────
    if any(k in q for k in ["reference", "references", "referral", "recommendation",
                             "referee", "recommend", "mentor", "supervisor", "referred"]):
        if references:
            resp = "Professional References:\n\n"
            for r in references:
                resp += (
                    f"* {r.get('name')} — {r.get('title')}\n"
                    f"  Company: {r.get('company')} | Relation: {r.get('relation', '')}\n"
                )
                if r.get("email"):
                    resp += f"  Email: {r.get('email')}\n"
                if r.get("phone"):
                    resp += f"  Phone: {r.get('phone')}\n"
                resp += "\n"
        else:
            resp = "Reference information is not currently listed. Type 'exit' to contact Shah Abdul Mazid directly."
        return {"found": True, "response": resp}

    # ── Blogs / Articles ─────────────────────────────────────────────────────
    if any(k in q for k in ["blog", "blogs", "article", "articles", "writing", "post", "wrote"]):
        if blogs:
            resp = "Blogs & Articles:\n\n"
            for b in blogs:
                resp += f"* {b.get('title')} ({b.get('date')})\n  {b.get('excerpt', '')}\n\n"
        else:
            resp = "No blog posts are listed in the portfolio yet."
        return {"found": True, "response": resp}

    # ── Smart full-text search across all sections ───────────────────────────
    words = [w for w in q.split() if len(w) > 2]
    matched = []

    for p in projects:
        text = (p.get("title","") + " " + p.get("desc","") + " " + " ".join(p.get("tags",[]))).lower()
        if any(w in text for w in words):
            matched.append(f"Project: {p.get('title')} — {p.get('desc','')[:80]}...")

    for p in papers:
        text = (p.get("title","") + " " + p.get("venue","") + " " + p.get("authors","")).lower()
        if any(w in text for w in words):
            matched.append(f"Research Paper: {p.get('title')} ({p.get('year')})")

    for c in certifications:
        text = (c.get("name","") + " " + c.get("issuer","") + " " + " ".join(c.get("skills",[]))).lower()
        if any(w in text for w in words):
            matched.append(f"Certification: {c.get('name')} by {c.get('issuer')}")

    for w_item in work:
        text = (w_item.get("role","") + " " + w_item.get("company","") + " " + " ".join(w_item.get("details",[]))).lower()
        if any(w in text for w in words):
            matched.append(f"Work: {w_item.get('role')} at {w_item.get('company')}")

    if matched:
        resp = "Here's what I found related to your query:\n\n"
        resp += "\n".join(f"* {m}" for m in matched[:5])
        return {"found": True, "response": resp}

    return None


# ─────────────────────────────────────────────────────────────────────────────
# MAIN ENDPOINT — Priority: Groq (prod) or Ollama (local) → Keyword → Fallback
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/chat")
async def ai_chat_agent(
    payload: dict = Body(...),
    db=Depends(get_database)
):
    query = payload.get("query", "").strip()

    if not query:
        return {"success": True, "response": WELCOME_MSG}

    # 1. Fetch portfolio data from MongoDB Atlas
    portfolio_data = {}
    if db is not None:
        try:
            doc = await db["portfolio_content"].find_one({"key": "main"})
            if doc:
                portfolio_data = doc.get("data", {})
        except Exception as e:
            logger.error(f"MongoDB error: {e}")

    if not portfolio_data:
        return {
            "success": False,
            "response": "Database is currently unreachable. Please type 'exit' to contact Shah Abdul Mazid directly."
        }

    # Build context once
    context = build_context(portfolio_data)
    # ── CHAT: Always use Groq (fast, always online) ──────────────────────
    if settings.GROQ_API_KEY:
        response = await call_groq(query, context)
        if response:
            return {"success": True, "response": response, "engine": "groq"}

    # ── CHAT FALLBACK: Try Ollama if Groq fails ─────────────────────────
    if settings.USE_OLLAMA:
        response = await call_ollama(query, context)
        if response:
            return {"success": True, "response": response, "engine": "ollama"}

    # ── FALLBACK: Keyword matching ────────────────────────────────────────────
    result = keyword_match(query.lower(), portfolio_data)
    if result:
        return {"success": result["found"], "response": result["response"], "engine": "keyword"}

    # ── NOTHING MATCHED ───────────────────────────────────────────────────────
    return {
        "success": False,
        "engine": "keyword",
        "response": (
            "I couldn't find specific information about that in the portfolio.\n\n"
            "Type 'exit' to open the contact form and reach Shah Abdul Mazid directly."
        )
    }

import json

async def call_llm_json(prompt: str) -> str | None:
    use_ollama = str(settings.USE_OLLAMA).lower() in ("true", "1", "yes")
    
    # If USE_OLLAMA is enabled, try Ollama FIRST (via Ngrok or localhost)
    if use_ollama:
        url = settings.OLLAMA_URL or "http://localhost:11434"
        model = settings.OLLAMA_MODEL or "llama3"
        logger.info(f"[AI] Calling Ollama at {url} with model {model}")
        try:
            # 300s timeout — Ollama on CPU needs time, especially through Ngrok tunnel
            async with httpx.AsyncClient(timeout=300.0) as client:
                resp = await client.post(
                    f"{url}/api/chat",
                    headers={
                        "ngrok-skip-browser-warning": "true",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": model,
                        "messages": [
                            {"role": "system", "content": "You are an expert technical resume writer. Respond ONLY with raw JSON. No markdown, no code blocks, no explanation."},
                            {"role": "user",   "content": prompt}
                        ],
                        "stream": False,
                        "options": {
                            "temperature": 0.2,
                            "num_predict": 1500  # Cap tokens to prevent slow runaway generation
                        }
                    }
                )
                if resp.status_code == 200:
                    content = resp.json().get("message", {}).get("content", "").strip()
                    logger.info(f"[AI] Ollama responded successfully ({len(content)} chars)")
                    return content
                else:
                    logger.warning(f"[AI] Ollama returned {resp.status_code}: {resp.text[:200]}")
        except Exception as e:
            logger.warning(f"[AI] Ollama call failed: {e}")
    
    # Fallback: Try Groq (cloud LLM)
    if settings.GROQ_API_KEY:
        logger.info("[AI] Trying Groq fallback...")
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}", "Content-Type": "application/json"},
                    json={
                        "model": "llama3-70b-8192",
                        "messages": [
                            {"role": "system", "content": "You are an expert technical resume writer. Respond ONLY with raw JSON. No markdown, no code blocks, no explanation."},
                            {"role": "user",   "content": prompt}
                        ],
                        "temperature": 0.2,
                        "max_tokens": 1500,
                    }
                )
                if resp.status_code == 200:
                    content = resp.json()["choices"][0]["message"]["content"].strip()
                    logger.info(f"[AI] Groq responded successfully ({len(content)} chars)")
                    return content
                logger.warning(f"[AI] Groq returned {resp.status_code}: {resp.text[:200]}")
        except Exception as e:
            logger.warning(f"[AI] Groq call failed: {e}")
        
    return None

def clean_json_string(s: str) -> str:
    s = re.sub(r"^```(?:json)?", "", s, flags=re.IGNORECASE)
    s = re.sub(r"```$", "", s, flags=re.IGNORECASE)
    return s.strip()

class ProjectGenerateRequest(BaseModel):
    title: str
    desc: Optional[str] = ""
    role: Optional[str] = "Software Engineer"
    instructions: Optional[str] = ""

@router.post("/generate-project")
async def generate_project_case_study(payload: ProjectGenerateRequest):
    title = payload.title.strip()
    raw_desc = payload.desc.strip()
    role = payload.role.strip() or "Software Engineer"
    instructions = payload.instructions.strip() if payload.instructions else ""
    
    if not title:
        return {"success": False, "error": "Project title is required"}
        
    prompt = (
        f"Generate a recruiter-friendly project case study in JSON format for the following project:\n"
        f"Project Title: {title}\n"
        f"Role: {role}\n"
        f"Basic Description: {raw_desc}\n"
    )
    if instructions:
        prompt += f"Custom Guidance/Focus Areas (Make sure to highlight/incorporate these): {instructions}\n"
        
    prompt += (
        f"\nYou must return a valid JSON object ONLY, with no extra text or markdown code blocks. The JSON keys MUST be exactly:\n"
        f"- problem (Business problem addressed. Keep it concise, max 2 sentences)\n"
        f"- goal (Goal/Objective. What were you trying to achieve? 1-2 sentences)\n"
        f"- solution (High-level solution. Explain the architecture/pipeline at a high level. Keep it concise, max 2 sentences)\n"
        f"- contributions (Bullet points of key contributions. 2-3 items, each starting with an action verb, highlighting specific engineering contributions, with realistic metrics like 'Optimized latency by 30%')\n"
        f"- challenges (Technical challenge. Keep it concise, max 2 sentences. Describe a difficult engineering hurdle like latency, concurrency, memory, database performance, etc.)\n"
        f"- solutions (How you solved it. Keep it concise, max 2 sentences. Describe the engineering solution to the challenge)\n"
        f"- impact (Results/Impact metrics. 2-3 bullet points containing concrete metrics/numbers, e.g., 'Reduced response time from 10s to 2.5s', '95% accuracy', 'Supports 100 concurrent users')\n"
        f"- aiStack (Comma-separated AI/ML stack, e.g., 'OpenAI, LangChain, SentenceTransformers')\n"
        f"- backendStack (Comma-separated Backend stack, e.g., 'FastAPI, Python, Redis')\n"
        f"- databaseStack (Comma-separated Database stack, e.g., 'PostgreSQL, Pinecone')\n"
        f"- cloudStack (Comma-separated Cloud/DevOps stack, e.g., 'Docker, Azure, GitHub Actions')\n"
        f"- features (Key features of the project as short tag names. 3-5 items, max 1-2 words per item, one per line)\n"
        f"- lessons (Lessons learned. Keep it concise, max 2 sentences)\n"
        f"- future (Future roadmap or improvements. 2-3 items, one per line)\n\n"
        f"Ensure all values are strings (use newline character \\n for multiline strings like contributions, impact, features, future)."
    )
    
    raw_response = await call_llm_json(prompt)
    if not raw_response:
        return {"success": False, "error": "AI model did not respond or is unreachable."}
        
    cleaned = clean_json_string(raw_response)
    try:
        parsed_data = json.loads(cleaned)
        return {"success": True, "data": parsed_data}
    except Exception as e:
        logger.error(f"Failed to parse LLM JSON response: {e}. Raw response was: {raw_response}")
        return {"success": False, "error": "AI response was not valid JSON", "raw": raw_response}


@router.post("/summarize")
async def document_summarizer(doc_id: str = Body(...)):
    """Future: summarize research papers using Ollama/Groq."""
    return {"message": "Summarization task queued."}
