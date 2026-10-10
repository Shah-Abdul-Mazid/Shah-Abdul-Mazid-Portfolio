# 🌌 Shah Abdul Mazid — Full-Stack Portfolio & CMS Ecosystem

A modern, high-performance, full-stack portfolio and Content Management System (CMS) engineered with **React 19**, **TypeScript**, **FastAPI**, **MongoDB Atlas**, **Cloudinary**, and **PWA support**. Features a futuristic technical design, verified Credly badge integration, dual ATS & Visual CV builders, and an AI-powered project assistant.

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
- [Backend Services & API Endpoints](#-backend-services--api-endpoints)
- [Security & Authentication](#-security--authentication)
- [Deployment & Hosting Infrastructure](#-deployment--hosting-infrastructure)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables Guide](#-environment-variables-guide)

---

## 🏛 Architectural Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER / PWA                     │
│        React 19 · TypeScript · Vite · Tailwind/CSS          │
└──────────────┬──────────────────────────────▲───────────────┘
               │                              │
        HTTPS Requests                   Fast HMR &
       (Vercel Proxies)                  State Sync
               │                              │
┌──────────────▼──────────────────────────────┴───────────────┐
│                    FASTAPI BACKEND (Render)                 │
│         Python · Async Motor · PyJWT · BCrypt               │
└──────┬──────────────────────┬───────────────────────┬───────┘
       │                      │                       │
┌──────▼──────┐        ┌──────▼──────┐         ┌──────▼───────┐
│   MongoDB   │        │ Cloudinary  │         │ Groq / Ollama│
│    Atlas    │        │ Media / CDN │         │  LLM Agent   │
└─────────────┘        └─────────────┘         └──────────────┘
```

---

## 📁 Repository Structure

```
Portfolio_Final/
├── README.md                           # Main project documentation
├── LICENSE                             # Open-source license
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
│   │   │   ├── CertificationSection.tsx # Unified certifications & Credly showcase
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
│   │   └── vite.config.ts              # Vite configuration & PWA manifest
│   │
└── Portfolio_Backend/                  # FastAPI Modular Microservice
    ├── app/
    │   ├── api/v1/endpoints/
    │   │   ├── portfolio.py            # Public & Admin GET/POST portfolio content
    │   │   ├── admin.py                # Admin authentication & token generation
    │   │   ├── analytics.py            # Real-time visitor tracking & views telemetry
    │   │   ├── messages.py             # Contact form submissions & mail inbox
    │   │   ├── upload.py               # Cloudinary direct image/document upload pipeline
    │   │   └── agent.py                # AI agent (Groq / Ollama) project generator
    │   ├── core/                       # Core authentication & password hashing
    │   ├── config.py                   # Pydantic BaseSettings & environment configs
    │   ├── db.py                       # Async Motor MongoDB connection client
    │   └── main.py                     # FastAPI application factory & middleware
    ├── Dockerfile                      # Production container recipe
    ├── main.py                         # ASGI entry point (`uvicorn main:app`)
    ├── requirements.txt                # Python package dependencies
    └── vercel.json                     # Serverless deployment configuration
```

---

## 🎯 Core Functional Scopes

### 1. Public Portfolio & Navigation
* **Futuristic Dark Atmosphere:** Technical cyberpunk theme, animated neon accents, interactive canvas telemetry, and responsive grid layouts.
* **Telemetry Radar / Intelligence Matrix:** Dynamic visualization of core competencies across Artificial Intelligence, Full-Stack Engineering, and Cloud Infrastructure.
* **Instant Visitor Inquiries:** In-app floating contact drawer that saves messages directly to the database and notifies the administrator.

### 2. Verified Credly Badges & Certifications System
* **Cloud-First Media Pipeline:** **Zero badge image files stored inside Git or build bundles.** All badges stream dynamically from the official **Credly CDN** (`images.credly.com`) or **Cloudinary** (`res.cloudinary.com`).
* **Canonical Deduplication:** Certifications and digital badges are mapped to single underlying achievements in [`src/data/certificationData.ts`](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/Portfolio_Frontend/src/data/certificationData.ts).
* **Parent-Child Progressive Hierarchy:**
  * **Google AI Professional Certificate:** 8-course modular program featuring dynamic completion tracking (`8 / 8 Courses Completed`), expandable curriculum tray, direct Coursera course links, and Credly verification badges for modular courses (AI Fundamentals, AI for Brainstorming and Planning).
  * **IBM Data Science Professional Certificate (V3):** 12-course comprehensive curriculum with 5 verified Credly badges (Databases & SQL, Data Visualization, Applied Capstone, GenAI Essentials, Career Guide & Interview Prep) and 7 verified Coursera milestones.
  * **IBM AI Engineering Specialization:** 13-course advanced track covering Machine Learning, Deep Learning (Keras, PyTorch, TensorFlow), Transformers, LLM Fine-Tuning, RAG, and AI Agent workflows with LangChain.
  * **IBM AI Developer Specialization:** 10-course software and generative AI track covering Python, Flask, HTML/CSS/JS, Prompt Engineering, and custom Generative AI application development.
  * **Dynamic Progression & Smart Links:** Automatically displays `🏅 Credly` for Credly badges, `↗ Coursera` for Coursera course links, or `✓ Completed` for finished milestones without dedicated badges.
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
  * **Production Mode:** Ultra-fast cloud inference powered by **Groq** (`llama3-8b-8192` or `mixtral-8x7b-32768`).
  * **Local / Zero-Cost Mode:** Local offline inference powered by **Ollama** (`openchat` or custom model files).

---

## 🔌 Backend Services & API Endpoints

| Endpoint | Method | Scope | Description |
|---|:---:|:---:|---|
| `/api/portfolio` | `GET` | Public | Retrieves full portfolio document from MongoDB (`portfolio_content`) |
| `/api/portfolio` | `POST` | Admin | Updates entire portfolio document in MongoDB (Protected via JWT) |
| `/api/portfolio/credly-image` | `GET` | Public | Scrapes and extracts official CDN badge image from any public Credly badge URL |
| `/api/admin/login` | `POST` | Public | Authenticates admin credentials and issues signed JWT bearer token |
| `/api/admin/verify` | `GET` | Admin | Validates existing session token |
| `/api/analytics` | `GET` | Public | Returns total website views count |
| `/api/analytics/track`| `POST` | Public | Increments visitor counter and records geolocation telemetry |
| `/api/messages` | `GET` | Admin | Fetches list of all visitor contact inquiries |
| `/api/messages` | `POST` | Public | Submits a new contact form message |
| `/api/messages/{id}` | `DELETE`| Admin | Deletes a processed message |
| `/api/upload` | `POST` | Admin | Streams images/documents directly to Cloudinary and returns secure URL |
| `/api/agent/generate-project` | `POST` | Admin | AI-assisted project generator using Groq/Ollama |
| `/api/health` | `GET` | Public | Verifies MongoDB and Cloudinary system health |

---

## 🔒 Security & Authentication

1. **JWT Bearer Token Authentication:**
   * Admin routes require an `Authorization: Bearer <token>` header signed with a cryptographic secret (`JWT_SECRET`).
   * Tokens carry an expiration period (default: 24 hours).
2. **Cryptographic Password Hashing:**
   * Passwords are encrypted using **BCrypt** with salted rounds. Plaintext credentials are never stored.
3. **CORS Hardening:**
   * Configured via FastAPI's `CORSMiddleware` with explicit methods and headers allowed.
4. **Environment Isolation:**
   * All production credentials (MongoDB URI, Cloudinary keys, Groq tokens) reside exclusively in `.env` files and are omitted from version control via `.gitignore`.
5. **PWA Standalone Sandboxing:**
   * Direct root route navigation (`/`) automatically detects if running inside an installed PWA window and routes the user directly to the `/login/admin` portal.

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
VITE_API_URL=http://localhost:8000
```

### Backend (`Portfolio_Backend/.env`)
```env
# Database
ATLAS_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=portfolio_data

# Admin Security
JWT_SECRET=your_super_secret_jwt_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Cloudinary (Badge & Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Agent (Optional)
GROQ_API_KEY=your_groq_api_key_here
ENVIRONMENT=production
```

---

## 📜 License & Acknowledgements

Created with passion by **Shah Abdul Mazid**. Distributed under the [MIT License](file:///c:/Users/LENOVO/Desktop/Portfolio_Final/LICENSE).
Digital credential badges are verified property of their respective issuers (**Google**, **IBM**, **AWS**, **Microsoft**, **DeepLearning.AI**, and **CertNexus**) via **Credly**.
