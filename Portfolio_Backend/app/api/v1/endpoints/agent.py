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
    "4. FILTER carefully: if the user asks for 'recent', 'current', 'present', 'latest', or 'only' "
    "a specific type — show ONLY the matching entries (e.g. jobs where endDate is 'Present' or empty).\n"
    "5. If the answer is not in the data, respond: 'I don't have that information in the portfolio. "
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
    # Map decommissioned models to active ones
    model = settings.GROQ_MODEL or "qwen/qwen3.8-27b"
    if "llama3-8b" in model or "llama3-70b" in model:
        model = "qwen/qwen3.8-27b"
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}", "Content-Type": "application/json"},
                json={
                    "model": model,
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
# ENGINE 2: Ollama — local free LLM (Always Active + Auto Failover)
# ─────────────────────────────────────────────────────────────────────────────
def get_ollama_urls() -> list[str]:
    urls = []
    # 1. Localhost direct (fastest when running on local machine with RTX 4060 GPU)
    local_url = getattr(settings, "OLLAMA_LOCAL_URL", "http://127.0.0.1:11434")
    if local_url:
        urls.append(local_url)
    urls.extend(["http://127.0.0.1:11434", "http://localhost:11434"])
    # 2. Configured public / Ngrok URL (for Render and Vercel cloud)
    if settings.OLLAMA_URL:
        urls.append(settings.OLLAMA_URL)
    
    seen = set()
    ordered = []
    for u in urls:
        clean = u.rstrip("/")
        if clean and clean not in seen:
            seen.add(clean)
            ordered.append(clean)
    return ordered

def get_candidate_models(preferred_model: Optional[str] = None) -> list[str]:
    models = []
    if preferred_model and preferred_model != "auto":
        models.append(preferred_model)
    if settings.OLLAMA_MODEL:
        models.append(settings.OLLAMA_MODEL)
    models.extend(["llama3.1:latest", "llama3.1", "qwen3-v1-8b-64k-agent:latest", "openchat:latest", "openchat"])
    seen = set()
    ordered = []
    for m in models:
        if m and m not in seen:
            seen.add(m)
            ordered.append(m)
    return ordered

async def call_ollama(query: str, context: str) -> str | None:
    urls = get_ollama_urls()
    models = get_candidate_models()
    headers = {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
    }
    if getattr(settings, "OLLAMA_API_SECRET", None):
        headers["Authorization"] = f"Bearer {settings.OLLAMA_API_SECRET}"

    for url in urls:
        for model in models:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{url}/api/chat",
                        headers=headers,
                        json={
                            "model": model,
                            "messages": [
                                {"role": "system", "content": SYSTEM_PROMPT_TEMPLATE.format(context=context)},
                                {"role": "user",   "content": query}
                            ],
                            "stream": False,
                            "options": {
                                "temperature": 0.3,
                                "num_predict": 512,
                                "num_ctx": 4096,
                            }
                        }
                    )
                    if resp.status_code == 200:
                        text = resp.json().get("message", {}).get("content", "").strip()
                        # Reject if Ollama echoes back a greeting/menu (common Ollama bug)
                        if not text.startswith("Hello") and len(text) > 15:
                            return text
                    elif resp.status_code == 404:
                        continue
            except Exception:
                continue
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
                             "softvence", "eshikhon", "neuroxyte", "ambassador", "ai engineer"]):

        # Check if the user wants only current/recent/present jobs
        want_current = any(k in q for k in [
            "recent", "current", "present", "latest", "now", "ongoing",
            "right now", "currently", "today", "only recent", "only current"
        ])

        filtered = []
        for w in work:
            end = w.get("endDate") or ""
            is_current = (not end) or (end.strip().lower() in ["present", "current", "now", ""])
            if want_current and not is_current:
                continue
            filtered.append(w)

        if not filtered:
            filtered = work  # fallback to all if filter returns nothing

        label = "Current / Recent Work Experience" if want_current else "Work Experience"
        resp = f"{label}:\n\n"
        for i, w in enumerate(filtered):
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
    # ── CHAT ENGINE 1: Try Ollama FIRST (Local RTX 4060 GPU / Ngrok Tunnel) ──
    if settings.USE_OLLAMA:
        response = await call_ollama(query, context)
        if response:
            return {"success": True, "response": response, "engine": "ollama"}

    # ── CHAT ENGINE 2: Failover to Groq cloud if Ollama unavailable ──────────
    if settings.GROQ_API_KEY:
        response = await call_groq(query, context)
        if response:
            return {"success": True, "response": response, "engine": "groq"}

    # ── CHAT ENGINE 3: Safety Fallback to Ollama ─────────────────────────────
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

async def _call_groq_json(prompt: str, groq_model: str) -> str | None:
    if not settings.GROQ_API_KEY:
        return None
    # Map any decommissioned models to active Groq models
    if "llama3-8b" in groq_model or "llama3-70b" in groq_model:
        groq_model = "qwen/qwen3.8-27b"
    logger.info(f"[AI] Calling Groq with model: {groq_model}")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}", "Content-Type": "application/json"},
                json={
                    "model": groq_model,
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

async def _try_ollama_json(prompt: str, requested_model: Optional[str]) -> str | None:
    urls = get_ollama_urls()
    models = get_candidate_models(requested_model)
    headers = {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
    }
    if getattr(settings, "OLLAMA_API_SECRET", None):
        headers["Authorization"] = f"Bearer {settings.OLLAMA_API_SECRET}"

    for url in urls:
        for model in models:
            try:
                logger.info(f"[AI] Trying Ollama at {url} with model {model}")
                async with httpx.AsyncClient(timeout=120.0) as client:
                    resp = await client.post(
                        f"{url}/api/chat",
                        headers=headers,
                        json={
                            "model": model,
                            "messages": [
                                {"role": "system", "content": "You are an expert technical resume writer. Respond ONLY with raw JSON. No markdown, no code blocks, no explanation."},
                                {"role": "user",   "content": prompt}
                            ],
                            "stream": False,
                            "options": {
                                "temperature": 0.2,
                                "num_predict": 1500,
                                "num_ctx": 4096  # Optimized context prevents KV allocation stall
                            }
                        }
                    )
                    if resp.status_code == 200:
                        content = resp.json().get("message", {}).get("content", "").strip()
                        if content:
                            logger.info(f"[AI] Ollama ({url} / {model}) succeeded ({len(content)} chars)")
                            return content
                    elif resp.status_code == 404:
                        continue
                    else:
                        logger.warning(f"[AI] Ollama returned {resp.status_code}: {resp.text[:150]}")
            except Exception as e:
                logger.debug(f"[AI] Ollama ({url} / {model}) failed: {e}")
                continue
    return None

async def call_llm_json(prompt: str, requested_model: Optional[str] = "llama3.1:latest") -> str | None:
    # 1. If explicit Cloud Groq model requested: try Groq first, but FALLBACK TO OLLAMA if it fails!
    if requested_model and requested_model.startswith("groq:"):
        model_name = requested_model.replace("groq:", "").strip() or "qwen/qwen3.8-27b"
        groq_res = await _call_groq_json(prompt, model_name)
        if groq_res:
            return groq_res
        logger.warning("[AI] Groq failed, seamlessly falling back to Ollama!")
        return await _try_ollama_json(prompt, "llama3.1:latest")

    # 2. Ollama ALWAYS ACTIVE / PRIMARY: Try local GPU or Ngrok tunnel across all URLs & models
    ollama_res = await _try_ollama_json(prompt, requested_model)
    if ollama_res:
        return ollama_res

    # 3. Fallback to Groq cloud if Ollama is unreachable
    logger.info("[AI] Ollama unreachable, failing over to Groq cloud...")
    groq_res = await _call_groq_json(prompt, settings.GROQ_MODEL or "qwen/qwen3.8-27b")
    if groq_res:
        return groq_res

    # 4. Final safety retry with any responsive Ollama model
    return await _try_ollama_json(prompt, "openchat:latest")

def clean_json_string(s: str) -> str:
    s = re.sub(r"^```(?:json)?", "", s, flags=re.IGNORECASE)
    s = re.sub(r"```$", "", s, flags=re.IGNORECASE)
    return s.strip()

from app.api.v1.endpoints.portfolio import get_admin_user

class ProjectGenerateRequest(BaseModel):
    title: str
    desc: Optional[str] = ""
    role: Optional[str] = "Software Engineer"
    instructions: Optional[str] = ""
    model: Optional[str] = "llama3.1"

@router.get("/models")
async def get_available_models():
    """Retrieve available AI models: dynamically discovers local Ollama models (llama3.1, qwen3, openchat, etc.) and cloud Groq models."""
    local_models = []
    
    ollama_urls = []
    if settings.OLLAMA_URL:
        ollama_urls.append(settings.OLLAMA_URL)
    ollama_urls.append("http://localhost:11434")
    ollama_urls.append("http://127.0.0.1:11434")
    
    seen_urls = set()
    for url in ollama_urls:
        if not url or url in seen_urls:
            continue
        seen_urls.add(url)
        try:
            async with httpx.AsyncClient(timeout=2.5) as client:
                resp = await client.get(
                    f"{url}/api/tags",
                    headers={"ngrok-skip-browser-warning": "true"}
                )
                if resp.status_code == 200:
                    data = resp.json()
                    for m in data.get("models", []):
                        m_name = m.get("name")
                        m_size = m.get("size", 0)
                        size_gb = f"{m_size / (1024**3):.1f} GB" if m_size else ""
                        
                        desc = "Ollama Local GPU Model"
                        if "llama3.1" in m_name.lower():
                            desc = "Llama 3.1 8B — Default, High Performance"
                        elif "qwen" in m_name.lower():
                            desc = "Qwen3 8B Agent — Deep Reasoning & Tech Architecture"
                        elif "openchat" in m_name.lower():
                            desc = "OpenChat 7B — Fast, Conversational"
                            
                        local_models.append({
                            "id": m_name,
                            "name": m_name,
                            "size": size_gb,
                            "category": "local",
                            "description": desc
                        })
                    if local_models:
                        break
        except Exception:
            continue

    # Safe defaults if Ollama query fails
    if not local_models:
        local_models = [
            {"id": "llama3.1:latest", "name": "llama3.1:latest", "size": "4.9 GB", "category": "local", "description": "Llama 3.1 8B — Default, High Performance"},
            {"id": "qwen3-v1-8b-64k-agent:latest", "name": "qwen3-v1-8b-64k-agent:latest", "size": "6.1 GB", "category": "local", "description": "Qwen3 8B Agent — Deep Reasoning"},
            {"id": "openchat:latest", "name": "openchat:latest", "size": "4.1 GB", "category": "local", "description": "OpenChat 7B — Fast Conversational"}
        ]

    cloud_models = [
        {
            "id": "groq:qwen/qwen3.8-27b",
            "name": "Groq Cloud (Qwen 3.8 27B)",
            "size": "Cloud Fast",
            "category": "cloud",
            "description": "Hosted Cloud LLM (Instant, zero GPU load)"
        }
    ]
    
    return {
        "success": True,
        "models": local_models + cloud_models,
        "default": "llama3.1:latest"
    }

@router.post("/generate-project")
async def generate_project_case_study(
    payload: ProjectGenerateRequest,
    admin=Depends(get_admin_user)
):
    title = payload.title.strip()
    raw_desc = payload.desc.strip()
    role = payload.role.strip() or "Software Engineer"
    instructions = payload.instructions.strip() if payload.instructions else ""
    requested_model = payload.model.strip() if payload.model else "llama3.1"
    
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
        f"- desc (Punchy, recruiter-friendly 1-2 sentence executive summary of the project)\n"
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
    
    raw_response = await call_llm_json(prompt, requested_model=requested_model)
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
