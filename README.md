# 🌌 Shah Abdul Mazid — Full-Stack Portfolio & CMS Ecosystem

A modern, high-performance, full-stack portfolio and Content Management System (CMS) engineered with **React 19**, **TypeScript**, **FastAPI**, **MongoDB Atlas**, **Cloudinary**, and **PWA support**. Features a futuristic technical design, verified Credly badge integration, multi-course progressive curricula, dual ATS & Visual CV builders, an AI-powered project assistant, and an **enterprise-grade 20-Point Defensive Security Framework**.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Repository Structure](#-repository-structure)
- [Core Functional Scopes](#-core-functional-scopes)
  - [1. Public Portfolio & Navigation](#1-public-portfolio--navigation)
  - [2. Verified Credly Badges & Certifications System](#2-verified-credly-badges--certifications-system)
  - [3. Resume & CV Generation Engine (ATS + Visual)](#3-resume--cv-generation-engine-ats--visual)
  - [4. Admin Dashboard CMS & Automation](#4-admin-dashboard-cms--automation)
  - [5. AI Agent & LLM Project Assistant](#5-ai-agent--llm-project-assistant)
- [Backend Services & Protected API Endpoints](#-backend-services--protected-api-endpoints)
- [🔒 20-Point Security Hardening Framework](#-20-point-security-hardening-framework)
  - [Threat Model & Defense-in-Depth Architecture](#threat-model--defense-in-depth-architecture)
  - [Audit Matrix & Implementation Details](#audit-matrix--implementation-details)
- [Deployment & Hosting Infrastructure](#-deployment--hosting-infrastructure)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables Guide](#-environment-variables-guide)
- [License & Acknowledgements](#-license--acknowledgements)

---

## 🏛 Architectural Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER / PWA                            │
│           React 19 · TypeScript · Vite · Tailwind/CSS                  │
└──────────────────┬──────────────────────────────────▲──────────────────┘
                   │                                  │
            HTTPS Requests                       Fast HMR &
           (Vercel Proxies)                      State Sync
                   │                                  │
┌──────────────────▼──────────────────────────────────┴──────────────────┐
│                   FASTAPI SECURITY MIDDLEWARE & APP                    │
│      Rate Limiter · OWASP Headers · CORS Whitelist · JWT Bearer        │
└─────────┬──────────────────────────┬─────────────────────────┬─────────┘
          │                          │                         │
┌─────────▼─────────┐      ┌─────────▼─────────┐      ┌────────▼─────────┐
│   MongoDB Atlas   │      │    Cloudinary     │      │   Groq / Ollama  │
│ Resilient Cluster │      │ Strict Upload CDN │      │ LLM Inferences   │
└───────────────────┘      └───────────────────┘      └──────────────────┘
```

---

## 📁 Repository Structure

```
Portfolio_Final/
├── README.md                           # Main project documentation & security specification
├── LICENSE                             # Open-source MIT license
├── TODO.md                             # Backlog & feature roadmap
│
├── Portfolio_Frontend/                 # React 19 + TypeScript + Vite SPA
│   ├── public/                         # Public static assets
│   │   ├── data/                       # Official appointment letters & docs (PDF/PNG)
│   │   ├── resume/                     # CV source templates (.tex, .pdf, photo)
│   │   ├── admin-pwa-192.png           # PWA standalone icon (192x192)
│   │   ├── admin-pwa-512.png           # PWA standalone icon (512x512)
│   │   └── favicon.svg                 # Vector browser favicon
│   ├── src/
│   │   ├── assets/                     # UI graphics & theme backgrounds (WebP)
│   │   ├── components/                 # Modular UI components
│   │   │   ├── CV/                     # ATS & Visual CV subcomponents
│   │   │   │   ├── ATSCV/              # Single-column ATS resume render & print styles
│   │   │   │   └── VisualCV/           # Creative two-column visual resume
│   │   │   ├── CertificationSection.tsx # Unified certifications, Credly showcase & trays
│   │   │   ├── Certifications.tsx      # Section wrapper
│   │   │   ├── IntelligenceMatrix.tsx  # Dynamic skillset & telemetry radar
│   │   │   ├── Projects.tsx            # Project showcase with dynamic modal
│   │   │   ├── Papers.tsx              # Research publications with BibTeX citations
│   │   │   ├── WorkExperience.tsx      # Professional career timeline
│   │   │   ├── Education.tsx           # Academic background
│   │   │   └── FloatingContactForm.tsx # Interactive instant contact drawer
│   │   ├── context/
│   │   │   └── PortfolioContext.tsx    # Global React state, API sync & cache
│   │   ├── data/
│   │   │   ├── certificationData.ts    # Master Credly badges & canonical credentials
│   │   │   ├── cvData.ts               # Master structured CV profile schema
│   │   │   ├── atsCvData.ts            # ATS-optimized bullet points & metadata
│   │   │   └── visualCvData.ts         # Visual CV design structure
│   │   ├── hooks/                      # Custom hooks (intersection observer, visitor tracker)
│   │   ├── pages/                      # Page view controllers
│   │   │   ├── HomePage.tsx            # Hero landing presentation
│   │   │   ├── ProfilePage.tsx         # Full career dossier
│   │   │   ├── ProjectsPage.tsx        # Portfolio applications catalogue
│   │   │   ├── PublicationsPage.tsx    # Academic research papers
│   │   │   ├── SkillsPage.tsx          # Technical proficiency breakdown
│   │   │   ├── ContactsPage.tsx        # Direct inquiries & social networks
│   │   │   ├── AdminLogin.tsx          # Secure biometric/password admin entry
│   │   │   ├── AdminDashboard.tsx      # Comprehensive CMS dashboard
│   │   │   └── Resume/                 # Dual resume page routers
│   │   ├── utils/                      # Helper utilities (certBadges, latexSync, api, dateUtils)
│   │   ├── App.tsx                     # Top-level routing & PWA standalone handler
│   │   ├── main.tsx                    # React DOM entry point
│   │   ├── vercel.json                 # Vercel deployment rewrites (/api/ -> Render)
│   │   └── vite.config.ts              # Vite configuration & production security (sourcemap: false)
│   │
└── Portfolio_Backend/                  # FastAPI Modular Microservice
    ├── app/
    │   ├── api/v1/endpoints/
    │   │   ├── portfolio.py            # Public GET & Admin POST portfolio content (SSRF protected)
    │   │   ├── admin.py                # Admin authentication & token generation (Brute-force protected)
    │   │   ├── analytics.py            # Real-time visitor tracking & views telemetry
    │   │   ├── messages.py             # Contact form submissions (XSS sanitized & rate-limited)
    │   │   ├── upload.py               # Cloudinary secure upload pipeline (Auth + type + size validated)
    │   │   └── agent.py                # AI agent (Groq / Ollama) project generator (Admin guarded)
    │   ├── middleware/
    │   │   ├── __init__.py             # Middleware package
    │   │   └── security.py             # Sliding-window IP rate limiter & OWASP security headers
    │   ├── core/                       # Core authentication & password hashing
    │   ├── config.py                   # Pydantic BaseSettings & environment configs
    │   ├── db.py                       # Async Motor MongoDB connection client
    │   └── main.py                     # FastAPI application factory & hardened CORS configuration
    ├── Dockerfile                      # Production container recipe
    ├── main.py                         # ASGI entry point (`uvicorn main:app`)
    ├── requirements.txt                # Python package dependencies
    └── vercel.json                     # Serverless deployment configuration
```

---

## 🎯 Core Functional Scopes

### 1. Public Portfolio & Navigation
* **Futuristic Dark Atmosphere:** Technical cyberpunk aesthetic, animated neon accents, interactive canvas telemetry, and responsive grid layouts.
* **Telemetry Radar / Intelligence Matrix:** Dynamic visualization of core competencies across Artificial Intelligence, Full-Stack Engineering, and Cloud Infrastructure.
* **Instant Visitor Inquiries:** In-app floating contact drawer that saves messages directly to the database and notifies the administrator.

### 2. Verified Credly Badges & Certifications System
* **Cloud-First Media Pipeline:** **Zero badge image files stored inside Git or build bundles.** All badges stream dynamically from the official **Credly CDN** (`images.credly.com`) or **Cloudinary** (`res.cloudinary.com`).
* **Canonical Deduplication:** Certifications and digital badges are mapped to single underlying achievements in [`src/data/certificationData.ts`](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/Portfolio_Frontend/src/data/certificationData.ts).
* **Parent-Child Progressive Hierarchy:**
  * **Google AI Professional Certificate:** 8-course modular program (`8 / 8 Courses Completed`) featuring dynamic completion tracking, expandable curriculum tray, direct Coursera course links, and verified Credly badges for foundational modules (*AI Fundamentals*, *AI for Brainstorming and Planning*).
  * **IBM Data Science Professional Certificate (V3):** 12-course comprehensive curriculum (`12 / 12 Courses Completed`) featuring 5 verified Credly child badges (*Databases & SQL, Data Visualization, Applied Capstone, GenAI Essentials, Career Guide & Interview Prep*) and 7 verified Coursera milestones.
  * **IBM AI Engineering Specialization:** 13-course advanced track (`13 / 13 Courses Completed`) covering Machine Learning, Deep Learning (Keras, PyTorch, TensorFlow), Transformers, LLM Fine-Tuning, RAG, and AI Agent workflows with LangChain.
  * **IBM AI Developer Specialization:** 10-course software engineering & GenAI track (`10 / 10 Courses Completed`) covering Python, Flask, HTML/CSS/JS, Prompt Engineering, and custom Generative AI application development.
  * **Smart Provider Link Detection:** Automatically displays `🏅 Credly` for Credly badges, `↗ Coursera` for Coursera course links, or `✓ Completed` for finished milestones without dedicated badges.
* **Instant Credly Auto-Fetch Integration:**
  * Paste any public Credly badge URL (`https://www.credly.com/badges/...`) into the dashboard.
  * The system automatically queries `/api/portfolio/credly-image` to scrape and extract the official `images.credly.com` CDN image link without requiring manual image searches.
* **Multi-Tiered Classification:**
  * **Tier 1 — Professional Certificates:** High-level comprehensive credentials (e.g., Google AI Professional Certificate, IBM Data Science Professional Certificate, IBM AI Engineering, IBM AI Developer).
  * **Tier 2 — Courses & Specializations:** Standalone verified courses across AWS, Microsoft, DeepLearning.AI, CertNexus, and IBM.
  * **Tier 3 — Verified Credly Badges Gallery:** Compact showcase of authentic Credly achievements with public verification URLs.
* **Interactive Filtering:** Instant client-side search by title, issuer, credential ID, skills, and badge status.

### 3. Resume & CV Generation Engine (ATS + Visual)
* **Dual Resume Formats:**
  * **ATS-Optimized Mode (`/resume/ats`):** Single-column, machine-readable format engineered specifically to maximize parsing scores in modern Applicant Tracking Systems (Workday, Greenhouse, Lever).
  * **Visual Design Mode (`/resume/visual`):** Styled, print-ready document featuring skill radars, timeline sidebars, and European/Standard layouts.
* **Live ATS Scoring Engine:** Real-time heuristic scoring that grades resume content, keyword density, and structural clarity.
* **Direct PDF Export:** Client-side vector PDF generation via `html2pdf.js` with customizable download filenames.

### 4. Admin Dashboard CMS & Automation
* **Standalone Progressive Web App (PWA):** Installs as a standalone native-like desktop or mobile application (`/login/admin`).
* **Parent-Child Curriculum Tray Manager:**
  * Visual progress bar displaying percentage and completed course count (e.g. `13 / 13 Completed (100%)`).
  * Course-by-course editor for Sub-Course Title, Status (`verified`, `completed`, `in-progress`, `curriculum`), Verification Link (Credly or Coursera), and Completion Date.
  * **1-Click Status Toggler:** Fast toggle between `In Progress` and `Verified` with automated Credly badge image retrieval.
  * **Progressive Curriculum Converter:** Convert any single certification into a multi-course track via `+ Enable Progressive Curriculum`.
* **Smart Credly Badge Auto-Fetch:**
  * Automatic metadata resolver for Credly badge links in both parent certificates and modular sub-courses.
* **Full CRUD Content Control:** Real-time visual editor for:
  * Profile Bio, Title & Contact Information
  * Licenses & Certifications with Cloudinary image uploaders and Credly integration
  * Projects Catalogue (featuring repository links, live demos, and technical tags)
  * Research Publications (with **BibTeX Auto-Parser** that instantly extracts title, authors, venue, DOI, and keywords)
  * Work Experience & Career Achievements
  * Technical Skills & Categorized Proficiencies
* **System Health Monitor:** Live status monitoring for MongoDB Atlas connectivity and Cloudinary storage.
* **Direct Inbox Management:** Review, reply via `mailto:`, and purge incoming visitor messages.

### 5. AI Agent & LLM Project Assistant
* **Autonomous Project Drafter (`/api/agent/generate-project`):** An embedded AI assistant that generates structured project descriptions, feature lists, key learnings, and role highlights.
* **Hybrid LLM Provider Support:**
  * **Production Mode:** Ultra-fast cloud inference powered by **Groq** (`openai/gpt-oss-120b` or `mixtral-8x7b-32768`).
  * **Local / Zero-Cost Mode:** Local offline inference powered by **Ollama** (`openchat` or custom model files).

---

## 🔌 Backend Services & Protected API Endpoints

| Endpoint | Method | Security Level | Rate Limit | Description |
|---|:---:|:---:|:---:|---|
| `/api/portfolio` | `GET` | Public | Standard | Retrieves full portfolio document from MongoDB (`portfolio_content`) |
| `/api/portfolio` | `POST` | **Admin JWT** | 180 req / min | Updates portfolio document in MongoDB (Protected via JWT Bearer) |
| `/api/portfolio/credly-image` | `GET` | Public + SSRF Filter | **30 req / min** | Scrapes official CDN badge image (Restricted strictly to `credly.com`) |
| `/api/admin/login` | `POST` | Public + Sanitized | **5 attempts / 5 min** | Authenticates admin credentials, hashes check, issues signed JWT |
| `/api/admin/register` | `POST` | **Locked Endpoint** | 5 attempts / 5 min | Initial setup only; permanently rejects registration if admin exists |
| `/api/admin/verify` | `GET` | **Admin JWT** | Standard | Validates existing session token against expiration |
| `/api/admin/list` | `GET` | **Admin JWT** | Standard | Fetches admin user list (Password hashes redacted) |
| `/api/messages` | `POST` | Public + Sanitized | **5 submissions / 10 min** | Submits a contact inquiry (XSS sanitized, length capped) |
| `/api/messages` | `GET` | **Admin JWT** | Standard | Retrieves visitor inquiries sorted by submission date |
| `/api/messages/{id}` | `DELETE`| **Admin JWT** | Standard | Deletes a processed inquiry |
| `/api/upload` | `POST` | **Admin JWT** | **20 req / min** | Secure upload to Cloudinary (Extension, MIME & 10MB size limit) |
| `/api/agent/generate-project` | `POST` | **Admin JWT** | **15 req / min** | AI project case-study drafter using Groq / Ollama |
| `/api/analytics` | `GET` | Public | Standard | Returns total website views count |
| `/api/analytics/track`| `POST` | Public | Standard | Increments visitor counter and records geolocation telemetry |
| `/api/health` | `GET` | Public | Standard | Verifies MongoDB and Cloudinary system health |

---

## 🔒 20-Point Security Hardening Framework

This application implements an enterprise-grade defense-in-depth model aligned with the OWASP Top 10 and cloud application security standards:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INCOMING HTTP REQUEST                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    [1. CORS Whitelist] ────────────► Reject unauthorized domains
                                    │
    [2. Rate Limiting Middleware] ──► Reject flooders / brute-force (429)
                                    │
    [3. OWASP Security Headers] ────► Inject nosniff, SAMEORIGIN, CSP
                                    │
    [4. JWT Bearer Guard] ──────────► Verify signature, exp, and role: admin
                                    │
    [5. Input Validator & Pydantic] ► Escape XSS, strip script tags, cap sizes
                                    │
    [6. NoSQL Operator Guard] ──────► Strict typed string parameter queries ($eq)
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    SECURE DATABASE / CLOUD STORAGE                     │
└────────────────────────────────────────────────────────────────────────┘
```

### Threat Model & Defense-in-Depth Architecture

| Category | Security Standard | Defense Mechanism | Implementation File |
|---|---|---|---|
| **Rate Limiting** | Sliding Window Algorithm | In-memory timestamp buckets per client IP with dynamic `Retry-After` headers. | [`security.py`](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/Portfolio_Backend/app/middleware/security.py) |
| **Authentication** | Cryptographic JWT | HS256 algorithm with explicit `exp` claim (`ACCESS_TOKEN_EXPIRE_MINUTES`). | [`admin.py`](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/Portfolio_Backend/app/api/v1/endpoints/admin.py) |
| **Password Storage** | BCrypt Work Factor 12 | Salted cryptographic hashes; plaintext passwords never touch database or logs. | [`admin.py`](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/Portfolio_Backend/app/api/v1/endpoints/admin.py) |
| **SSRF Defense** | Domain Whitelisting | Target URL parsing restricting external fetches strictly to `credly.com`. Blocks loopbacks and cloud metadata (`169.254.169.254`). | [`portfolio.py`](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/Portfolio_Backend/app/api/v1/endpoints/portfolio.py) |
| **Upload Security** | Tri-Layer File Filter | Admin authentication requirement + extension whitelist (`png, jpg, webp, svg, pdf`) + MIME verification + 10MB size ceiling. | [`upload.py`](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/Portfolio_Backend/app/api/v1/endpoints/upload.py) |
| **XSS Defense** | Dual-Layer Sanitization | Server-side regex script stripping and HTML escaping + Frontend DOMPurify sanitizer. | [`messages.py`](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/Portfolio_Backend/app/api/v1/endpoints/messages.py) |
| **Source Protection**| Bundler Hardening | Production source maps disabled (`sourcemap: false`) in Vite build configuration. | [`vite.config.ts`](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/Portfolio_Frontend/vite.config.ts) |

---

### Audit Matrix & Implementation Details

### 🛡️ Group 1: Injection & Input Validation

| # | Security Check | Status | Kya Action Liya Gaya? |
|---|---|:---:|---|
| 1 | **NoSQL / Parameter Injection** | ✅ Secure | MongoDB queries mein strict typed parameter matching (`$eq`) enforce kiya. User string input se MongoDB operator injection (`$ne`, `$gt`, etc.) completely block kar diya gaya hai. |
| 2 | **Cross-Site Scripting (XSS)** | ✅ Secure | Backend par HTML escaping aur script regex sanitization add kiya (`<script>`, `<iframe>`, `javascript:` URIs stripped). Frontend par dynamically rendered content pehle se hi `DOMPurify` se sanitized hai. |
| 3 | **CSRF Protection** | ✅ Secure | Saare state-changing endpoints (`/api/portfolio`, `/api/upload`, `/api/admin/*`) cookie-based ambient auth ke bajaye **Cryptographic Bearer JWT** use karte hain. Browsers cross-origin requests par custom Authorization headers automatically attach nahi kar sakte. |
| 4 | **File Upload Validation** | ✅ Secure | `upload.py` ko harden kiya:<br>• **Admin Auth Mandatory**: Unauthenticated uploads block kar diye.<br>• **Extension Whitelist**: Sirf `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.pdf` allowed hain.<br>• **MIME Check**: Content-Type verification.<br>• **Size Limit**: Maximum 10MB per file cap (quota exhaustion aur DoS se protection). |
| 5 | **Server-Side Request Forgery (SSRF)** | ✅ Secure | `/api/portfolio/credly-image` par strict domain whitelist lagaya gaya hai. Sirf official `credly.com` domain se request accept hogi. Internal IP (`127.0.0.1`, `localhost`, `10.*`) aur cloud metadata IP (`169.254.169.254`) requests completely block hain. |

---

### 🔐 Group 2: Authentication & Access Control

| # | Security Check | Status | Kya Action Liya Gaya? |
|---|---|:---:|---|
| 6 | **Broken Object Level Authorization (BOLA)** | ✅ Secure | Tamam administrative endpoints (`/api/portfolio`, `/api/upload`, `/api/messages`, `/api/agent/generate-project`) par server-side `get_admin_user` dependency enforce ki gayi hai. |
| 7 | **Rate Limiting** | ✅ Secure | Production-grade in-memory sliding-window IP rate limiter middleware (`security.py`) deploy kiya:<br>• `/api/admin/login`: **Max 5 attempts / 5 mins** (brute-force defense, `429 Too Many Requests` + `Retry-After`).<br>• `/api/messages`: **Max 5 contact messages / 10 mins** (anti-spam bot).<br>• `/api/portfolio/credly-image`: **Max 30 req / min**.<br>• AI Project Generation: **Max 15 req / min**. |
| 8 | **Secure Password Hashing** | ✅ Secure | Passwords **BCrypt** with high salt work factor (`rounds=12`) se hash hote hain. Registration par minimum 8-character password length enforce ki gayi hai. |
| 9 | **Token Expiration (exp)** | ✅ Secure | JWT tokens mein standard expiration timestamp (`exp: ACCESS_TOKEN_EXPIRE_MINUTES`) shamil kiya gaya hai taake leaked tokens hamesha ke liye valid na rahein. |
| 10 | **Permissions Server-Side Enforced** | ✅ Secure | Client-side claims par trust nahi kiya jata; server har request par independently `role == "admin"` verify karta hai. |
| 11 | **Row-Level / Tenant Isolation** | ✅ Secure | Portfolio collection strictly single singleton document key (`key: "main"`) par scoped hai. |
| 12 | **Public Registration Locked** | ✅ Secure | `/api/admin/register` endpoint ab public internet ke liye **locked** hai agar system mein pehle se admin exist karta hai (`403 Forbidden`). |

---

### 🔑 Group 3: Secrets & Token Safety

| # | Security Check | Status | Kya Action Liya Gaya? |
|---|---|:---:|---|
| 13 | **Server-Side API Secrets** | ✅ Secure | Cloudinary secret keys, Groq API keys, aur MongoDB connection string sirf server `.env` file mein hain. Client-side bundle mein koi private secret expose nahi hai. |
| 14 | **Frontend Environment Sanitized** | ✅ Secure | Frontend `.env` mein sirf public vanity links hain (`VITE_API_BASE_URL`, `VITE_GITHUB_URL`). |
| 15 | **Git Secret Leak Prevention** | ✅ Secure | Root aur Backend dono jagah `.gitignore` updated hai. `.env`, logs, aur python compiled bytecode files (`__pycache__`) git tracking se eliminate kar di gayi hain. |

---

### ⚙️ Group 4: Config & Web Hygiene

| # | Security Check | Status | Kya Action Liya Gaya? |
|---|---|:---:|---|
| 16 | **CORS Settings Tightened** | ✅ Secure | Wildcard `allow_origins=["*"]` hata kar **explicit origin whitelist** lagaya gaya (`shahabdulmazid.com`, `shah-abdul-mazid.vercel.app`, local dev ports + Vercel preview regex). |
| 17 | **OWASP Security Headers** | ✅ Secure | Har HTTP response par defensive security headers inject hote hain:<br>• `X-Content-Type-Options: nosniff`<br>• `X-Frame-Options: SAMEORIGIN` (Clickjacking defense)<br>• `X-XSS-Protection: 1; mode=block`<br>• `Referrer-Policy: strict-origin-when-cross-origin`<br>• `Permissions-Policy: camera=(), microphone=(), geolocation=()` |
| 18 | **Exposed Source Maps Removed** | ✅ Secure | `vite.config.ts` mein `build.sourcemap = false` set kiya gaya hai taake production mein original TypeScript code, directory tree ya comments leak na ho sakein. |
| 19 | **Sensitive Data Kept Out of Logs** | ✅ Secure | Login request logging se passwords aur tokens ko redact kiya gaya hai. |
| 20 | **PWA Sandboxing & Clean Build** | ✅ Secure | Frontend PWA window mode detect karke admin portal par safe redirect karta hai. Production build (`npm run build`) 0 errors ke sath pass hua (`✓ built in 5.94s`). |

---

## 🚀 Deployment & Hosting Infrastructure

* **Frontend:** Hosted on **Vercel**. Configured with `vercel.json` rewrite rules to seamlessly proxy `/api/*` requests to the live backend server without CORS preflight complications.
* **Backend:** Hosted on **Render** (or Docker container). Runs with asynchronous concurrency via `uvicorn` / `gunicorn`.
* **Database:** **MongoDB Atlas** multi-region cloud cluster with resilient retryable writes.
* **Media Storage:** **Cloudinary** CDN with automatic format optimization (`f_auto, q_auto`).

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js** (v18.0 or higher) & **npm**
* **Python** (v3.10 or higher) & **pip**
* A free **MongoDB Atlas** connection string or local MongoDB instance

---

### Step 1: Start the Backend (FastAPI)

```bash
# Navigate to the backend directory
cd Portfolio_Backend

# Create and activate a virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn main:app --reload --port 8000
```
Backend API docs will be available at: `http://localhost:8000/docs`

---

### Step 2: Start the Frontend (React + Vite)

```bash
# Open a new terminal and navigate to the frontend directory
cd Portfolio_Frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Portfolio will be live at: `http://localhost:5173`
Admin Portal: `http://localhost:5173/login/admin`

---

## 🔑 Environment Variables Guide

### Frontend (`Portfolio_Frontend/.env`)
```env
# Optional: Set backend target (defaults to Render proxy in vite.config.ts)
VITE_API_BASE_URL=https://shah-abdul-mazid-portfolio.onrender.com

# Academic profiles (Public metadata)
VITE_SCHOLAR_URL=https://scholar.google.com/citations?user=TYkiwUgAAAAJ
VITE_ORCID_URL=https://orcid.org/0009-0009-6864-5343
VITE_RESEARCHGATE_URL=https://www.researchgate.net/profile/Shah-Abdul-Mazid
VITE_GITHUB_URL=https://github.com/Shah-Abdul-Mazid
```

### Backend (`Portfolio_Backend/.env`)
```env
# MongoDB Atlas Database
atlas_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"
atlas_DB_NAME=portfolio_data

# Admin Security & Auth
JWT_SECRET=your_super_secret_jwt_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Cloudinary (Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Agent (Groq LLM)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
ENVIRONMENT=production
```

---

## 📜 License & Acknowledgements

Created with passion by **Shah Abdul Mazid**. Distributed under the [MIT License](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/LICENSE).
Digital credential badges are verified property of their respective issuers (**Google**, **IBM**, **AWS**, **Microsoft**, **DeepLearning.AI**, and **CertNexus**) via **Credly**.
