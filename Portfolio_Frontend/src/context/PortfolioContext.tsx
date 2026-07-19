import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';


export interface SkillCategory {
    name: string;
    items: string[];
    proficiencies?: Record<string, number>; // skill name -> 0–100
    projectAssociations?: Record<string, string[]>; // skill name -> manual project titles
}

export interface EducationItem {
    degree: string;
    school: string;
    year: string;
    major: string;
    attachmentUrl?: string;
    attachmentLabel?: string;
    certificateUrl?: string;
    logoUrl?: string; // Newly added
}

export interface ExperienceItem {
    role: string;
    company: string;
    period: string;
    desc: string;
    attachmentUrl?: string;
    attachmentLabel?: string;
    certificateUrl?: string;
    logoUrl?: string; // Newly added
}

export interface WorkItem {
    role: string;
    company: string;
    startDate: string; // ISO format (e.g., 2022-01-03)
    endDate?: string;  // ISO format, null/empty = "Ongoing"
    details: string[];
    attachmentUrl?: string;
    attachmentLabel?: string;
    certificateUrl?: string;
    appointmentLetterUrl?: string;
    experienceLetterUrl?: string;
    logoUrl?: string; // Newly added
}

export interface ProjectItem {
    title: string;
    desc: string;
    tags: string[];
    showcase: number;
    projectUrl?: string;
    certificateUrl?: string;
    githubUrl?: string;
    thumbnailUrl?: string;
    problem?: string;
    approach?: string;
    result?: string;
    category?: 'active' | 'past' | 'funded';
    period?: string;
    status?: string;
    institution?: string;
    fundingOrg?: string;
    refCode?: string;
    details?: string;
}

export interface PaperItem {
    title: string;
    authors: string;
    venue: string;
    publisher?: string; // Journal/Publisher name (e.g. IEEE, Elsevier)
    year: string;
    keywords: string;
    doi: string;
    type?: 'journal' | 'conference' | 'book-chapter'; // Publication type for filtering
    link?: string; // Newly added to support publication URLs
    documentUrl?: string; // New: PDF/Document viewer link
    certificateUrl?: string; // New: Certificate/Image viewer link
}

export interface ActivityItem {
    role: string;
    organization: string;
    period: string;
    desc: string;
    certificateUrl?: string; // Newly added
    attachmentUrl?: string; // Newly added
}

export interface ReferenceItem {
    name: string;
    title: string;
    company: string;
    email: string;
    phone?: string;
    relation: string;
}

export interface BlogItem {
    title: string;
    date: string;
    excerpt: string;
    url: string;
}

export interface CertificationItem {
    name: string;
    issuer: string;
    instructor?: string;
    date: string;
    credentialId?: string;
    credentialUrl?: string;
    links?: { label: string; url: string }[];
    skills?: string[];
}

export interface SectionConfig {
    navLabel: string;
    adminLabel: string;
    subtitle: string;
    title: string;
}

export interface PortfolioData {
    sections: {
        about: SectionConfig;
        education: SectionConfig;
        work: SectionConfig;
        experience: SectionConfig;
        skills: SectionConfig;
        projects: SectionConfig;
        papers: SectionConfig;
        activities: SectionConfig; // New section
        references: SectionConfig; // New section
        blogs: SectionConfig; // New section
        certifications: SectionConfig; // New section
        contact: SectionConfig;
    };
    hero: {
        name: string;
        title: string;
        roles?: string[]; // Newly added for rotating text
        description: string;
        avatarUrl?: string; // Newly added
    };
    about: {
        bio: string;
        age: string;
        projects: string;
        bioLinks?: { label: string; url: string; icon?: string }[];
    };
    skills: SkillCategory[];
    education: EducationItem[];
    experience: ExperienceItem[];
    work: WorkItem[];
    projects: ProjectItem[];
    papers: PaperItem[];
    activities: ActivityItem[]; // New
    references: ReferenceItem[]; // New
    blogs: BlogItem[]; // New
    certifications: CertificationItem[]; // New
    contact: {
        email: string;
        phone: string;
        location: string;
        whatsapp: string;
        messenger: string;
        facebook: string;
        github?: string;
        linkedin?: string;
        nationality?: string;
        dob?: string;
        pob?: string;
    };
}

const defaultData: PortfolioData = {
    sections: {
        about: { navLabel: 'About', adminLabel: 'Intro & Profile', subtitle: 'About Me', title: 'A Digital Craftsman with a Passion' },
        education: { navLabel: 'Education', adminLabel: 'Education', subtitle: 'Education', title: 'My Academic Journey' },
        work: { navLabel: 'Experience', adminLabel: 'Work History', subtitle: 'Career Journey', title: 'Professional Experience' },
        experience: { navLabel: 'Achievements', adminLabel: 'Achievements', subtitle: 'Achievements', title: 'Hackathons & Competitions' },
        skills: { navLabel: 'Skills', adminLabel: 'Tech Stack', subtitle: 'Technical Stack', title: 'Core Expertise' },
        projects: { navLabel: 'Projects', adminLabel: 'Portfolio', subtitle: 'Projects', title: 'Featured Projects' },
        papers: { navLabel: 'Research', adminLabel: 'Research Papers', subtitle: 'Publications', title: 'Research Papers' },
        activities: { navLabel: 'Activities', adminLabel: 'Extracurriculars', subtitle: 'Involvement', title: 'Extracurricular Activities' },
        references: { navLabel: 'References', adminLabel: 'References', subtitle: 'Recommendations', title: 'Professional References' },
        blogs: { navLabel: 'Blog', adminLabel: 'Blog Posts', subtitle: 'Writing', title: 'Recent Blog Posts' },
        certifications: { navLabel: 'Certificates', adminLabel: 'Certifications', subtitle: 'Licenses', title: 'Licenses & Certifications' },
        contact: { navLabel: 'Contact', adminLabel: 'Contact Details', subtitle: 'Contact', title: 'Let\'s Start a Conversation' }
    },
    hero: {
        name: "Shah Abdul Mazid",
        title: "Data Scientist | AI Developer",
        roles: [
            "Data Scientist",
            "AI Developer",
            "ML Engineer",
            "Software Engineer"
        ],
        description: "Passionate Data Scientist and AI Developer dedicated to building scalable, intelligent solutions."
    },
    about: {
        bio: "I am a Computer Science and Engineering student majoring in Intelligent Systems and Data Science at East West University.\n\nPassionate about AI innovation, research, and hackathon projects. Skilled in deep learning, computer vision, NLP, and ML deployment with strong analytical and research abilities.\n\nMy journey in AI and Data Science revolves around developing intelligent systems that solve real-world problems. With a strong foundation in Computer Science, I aim to contribute to research, innovation, and impactful projects. | (FastAPI Verified 2026)",
        age: "24",
        projects: "15+",
        bioLinks: [
            { label: 'GitHub Profile', url: 'https://github.com/Shah-Abdul-Mazid', icon: 'github' },
            { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=TYkiwUgAAAAJ', icon: 'scholar' }
        ]
    },
    skills: [
        { 
            name: 'Core Frameworks', 
            items: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'NumPy', 'Pandas'],
            proficiencies: { 'PyTorch': 90, 'TensorFlow': 85, 'Scikit-Learn': 85, 'NumPy': 95, 'Pandas': 95 }
        },
        { 
            name: 'Generative AI & LLMs', 
            items: ['LangChain', 'LlamaIndex', 'Hugging Face', 'Pinecone', 'ChromaDB', 'SentenceTransformers', 'RAG'],
            proficiencies: { 'LangChain': 85, 'LlamaIndex': 80, 'Hugging Face': 85, 'Pinecone': 80, 'ChromaDB': 80, 'SentenceTransformers': 85, 'RAG': 90 }
        },
        { 
            name: 'Production & MLOps', 
            items: ['Docker', 'Kubernetes', 'FastAPI', 'MLflow', 'Weights & Biases', 'GitHub Actions', 'Streamlit'],
            proficiencies: { 'Docker': 80, 'Kubernetes': 75, 'FastAPI': 90, 'MLflow': 80, 'Weights & Biases': 80, 'GitHub Actions': 85, 'Streamlit': 90 }
        },
        { 
            name: 'Data/Cloud Systems', 
            items: ['AWS/GCP', 'SQL', 'PostgreSQL', 'MongoDB', 'Apache Spark', 'Cloudflare R2'],
            proficiencies: { 'AWS/GCP': 80, 'SQL': 90, 'PostgreSQL': 85, 'MongoDB': 90, 'Apache Spark': 75, 'Cloudflare R2': 80 }
        }
    ],
    education: [
        { degree: 'B.Sc. in Computer Science & Engineering', school: 'East West University', year: '2021 – 2026', major: 'Major: Intelligent Systems & Data Science' },
        { degree: 'Higher Secondary Certificate (HSC)', school: 'Dhaka Ideal College', year: '2018 – 2020', major: 'Science' },
        { degree: 'Secondary School Certificate (SSC)', school: 'Badshah Faisal Institute', year: '2016 – 2018', major: 'Science' }
    ],
    experience: [
        { role: 'Network War', company: 'EWU Telecommunication Club', period: '2024', desc: 'Participated in the specialized networking competition.', certificateUrl: '/data/work-certificate.png' },
        { role: 'IT Olympiad', company: 'CSE FEST 2024', period: '2024', desc: 'Department of Computer Science & Engineering, East West University.' },
        { role: 'In House Programming Battle', company: 'EWUCoPC', period: '2022', desc: 'Certified participant in the campus-wide coding battle.' }
    ],
    work: [
        { 
            role: 'AI Engineer', 
            company: 'Softvence Agency', 
            startDate: '2026-02-01', 
            endDate: '', 
            details: [
                'Developing and deploying AI-driven solutions, including automation systems, AI chatbots, and RAG-based applications.',
                'Designing and implementing scalable backend architectures using FastAPI and modern AI frameworks.',
                'Working with LLMs, NLP pipelines, and vector databases to build intelligent, production-ready systems.',
                'Contributing to research-oriented projects and integrating cutting-edge AI technologies into real-world applications.'
            ]
        },
        { 
            role: 'Campus Ambassador', 
            company: 'eShikhon', 
            startDate: '2022-01-01', 
            endDate: '2025-12-30', 
            details: [
                'Represented organization as campus lead.',
                'Organized technical workshops and knowledge sessions.',
                'Collaborated with cross-functional teams for student outreach.'
            ],
            appointmentLetterUrl: '/data/eshikhon-appointment-letter.pdf'
        }
    ],
    projects: [
        { 
            title: 'HR Policies RAG Chatbot', 
            desc: 'An enterprise-grade Retrieval-Augmented Generation (RAG) system for HR queries with local caching and low inference latency.', 
            tags: ['RAG', 'LLM', 'FastAPI', 'Streamlit', 'Pinecone', 'Llama2', 'SentenceTransformers', 'Docker', 'Kubernetes'], 
            showcase: 1,
            problem: 'Employee onboarding and policy inquiries were overloading the HR support desk, resulting in response latencies of over 24 hours for standard questions.',
            approach: 'Engineered a RAG pipeline utilizing Llama-2-7B and SentenceTransformers for semantic chunking. Implemented Pinecone vector database for high-velocity embeddings indexing. Built FastAPI backend containerized with Docker and deployed via Kubernetes.',
            result: 'Reduced HR inquiry resolution times by 85%, achieved a 94.2% retrieval accuracy, and cut question-answering latency to under 120ms (p95) while saving 40% in token costs.',
            projectUrl: 'https://huggingface.co/spaces/Shah-Abdul-Mazid/HR-RAG-Chatbot',
            githubUrl: 'https://github.com/Shah-Abdul-Mazid/HR-RAG-Chatbot',
            category: 'active',
            period: '2025 - Present',
            status: 'ACTIVE',
            institution: 'EWUCRT',
            fundingOrg: 'East West University CRT',
            refCode: 'Ref: EWUCRT-RG-17(14)/2025(5)',
            details: 'Key research components include EEG signal acquisition, preprocessing, real-time intent decoding using machine learning models, and embedded system integration. The system targets low-latency response and practical deployment in real mobility-support scenarios.'
        },
        { 
            title: 'Hate Speech Detection from Live Stream', 
            desc: 'A real-time toxicity and hate speech classification pipeline for live streaming audio feeds with millisecond inference.', 
            tags: ['BERT', 'PyAudio', 'TensorFlow', 'PyTorch', 'Deep Learning', 'FastAPI', 'MLflow', 'Docker'], 
            showcase: 2,
            problem: 'Live streaming platforms lacked low-latency moderating systems capable of detecting toxic speech or harassment under 100ms, causing brand safety issues.',
            approach: 'Formulated a pipeline combining PyAudio streaming data ingestion with a fine-tuned BERT transformer model optimized via TensorRT. Handled latency constraints using PyTorch mixed-precision training (AMP) and batching mechanisms. Containerized using FastAPI and tracked experiments with MLflow.',
            result: 'Realized a 92.4% F1-score for hate speech classification, reduced inference latency from 240ms to 45ms (p95), and successfully scaled to handle 10,000 concurrent streaming feeds.',
            projectUrl: 'https://huggingface.co/spaces/Shah-Abdul-Mazid/Live-Stream-Hate-Speech',
            githubUrl: 'https://github.com/Shah-Abdul-Mazid/Live-Stream-Hate-Speech',
            category: 'active',
            period: '2025 - Present',
            status: 'ACTIVE',
            institution: 'EWU',
            fundingOrg: 'East West University',
            refCode: 'Ref: EWU-CSE-2025-01',
            details: 'Includes audio feed ingestion, acoustic feature extraction, and real-time inference using a quantized transformer model. Integrates with existing RTMP streaming servers.'
        },
        { 
            title: 'WhatsUpIn AI Agent Automation', 
            desc: 'Self-correcting autonomous AI agents orchestrating business competitive intelligence and scraping pipelines.', 
            tags: ['n8n', 'OpenAI API', 'LangChain', 'LlamaIndex', 'Supabase', 'Weights & Biases', 'AI Agents'], 
            showcase: 3,
            problem: 'E-commerce competitors used manual competitor monitoring and inventory scraping workflows, costing hundreds of analyst hours weekly.',
            approach: 'Developed self-correcting AI agents built on LangChain and LlamaIndex to orchestrate scraping pipelines, evaluate product matches via embeddings, and automate updates. Utilized n8n for agent orchestration, Supabase for state storage, and Weights & Biases to track prompt evaluation runs.',
            result: 'Automated 95% of competitor monitoring tasks, reduced workflow execution costs by 60%, and processed over 50,000 competitor listings daily with a data drift detection trigger in production.',
            projectUrl: 'https://huggingface.co/spaces/Shah-Abdul-Mazid/WhatsUpIn-Agent',
            githubUrl: 'https://github.com/Shah-Abdul-Mazid/WhatsUpIn-Agent',
            category: 'past',
            period: '2018 - 2021',
            status: 'EU H2020',
            institution: 'LINKS Foundation, Italy',
            fundingOrg: 'European Union Horizon 2020 Research and Innovation Programme',
            refCode: 'Grant Agreement No. 825123',
            details: 'Research and deployment of decentralized, model-based orchestration frameworks for intelligent IoT systems. Focused on dependability, self-healing architectures, and low-footprint scraping pipelines.'
        },
        { 
            title: 'TrackMyBus System', 
            desc: 'Real-time bus tracking application and spatial analysis system for university transport fleet management.', 
            tags: ['Flutter', 'Firebase', 'Firestore', 'Geolocation', 'Google Maps API', 'FastAPI'], 
            showcase: 4,
            problem: 'University transport fleets suffered from irregular arrival schedules and lack of visibility, causing students to miss transit.',
            approach: 'Developed a real-time GPS tracking solution with Flutter frontend and Firebase Firestore for fast spatial queries. Built a FastAPI administration portal monitoring route deviations and calculating average transit delays across time frames.',
            result: 'Reduced student wait times by average of 18 minutes, tracked 100% of university transit buses, and generated analytics reports on route bottlenecks for fleet scheduling.',
            projectUrl: 'https://huggingface.co/spaces/Shah-Abdul-Mazid/TrackMyBus-Spaces',
            githubUrl: 'https://github.com/Shah-Abdul-Mazid/TrackMyBus',
            category: 'past',
            period: '2017 - 2018',
            status: 'EU SPIRE',
            institution: 'LINKS Foundation, Italy',
            fundingOrg: 'European Union Sustainable Process Industry through Resource and Energy Efficiency',
            refCode: 'Grant Agreement No. 768783',
            details: 'Spatial analytics and optimization for public and private transport fleets. Addressed resource efficiency, latency, and real-time geofencing scheduling.'
        }
    ],
    papers: [
        {
            title: 'BDFlower: Growth stage flower image dataset for precision agriculture and floriculture',
            authors: 'Aritra Das, Mohammad Rifat Ahmmad Rashid, Md. Rakibul Hasan, Karib Shams, Raihan Ul Islam',
            venue: 'Data in Brief',
            publisher: 'Elsevier',
            year: '2026',
            keywords: 'BDFlower;Flower growth stage;Data augmentation;Image dataset;Floriculture',
            type: 'journal',
            doi: 'https://doi.org/10.1016/j.dib.2026.112745',
            link: 'https://www.sciencedirect.com/science/article/pii/S2352340926002982'
        },
        {
            title: 'MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis',
            authors: 'Raiyan Gani, Yusuf Salehin, Md Shakil Bhuiyan, Shah Abdul Mazid, Monisha Bani Nibedita Shuci, Shamim Ripon',
            venue: '2025 28th International Conference on Computer and Information Technology (ICCIT)',
            publisher: 'IEEE',
            year: '2025',
            keywords: 'Mango Disease;Ensemble Learning;Interpretable AI;Plant Pathology',
            type: 'conference',
            doi: '',
            link: ''
        }
    ],

    activities: [
        { role: 'Event Organizer', organization: 'EWU Computer Club', period: '2022 - 2023', desc: 'Organized national programming contests and technical workshops for over 500 participants.' }
    ],
    references: [
        { name: 'Dr. Example Professor', title: 'Head of CSE Department', company: 'East West University', email: 'professor@ewubd.edu', relation: 'Academic Advisor' }
    ],
    blogs: [
        { title: 'The Future of AI in Web Development', date: 'October 2024', excerpt: 'Exploring how large language models are fundamentally changing how we approach UI engineering.', url: '#' }
    ],
    certifications: [
        { name: 'Machine Learning Specialization', issuer: 'Coursera (Stanford)', date: '2023', credentialId: 'ABC-123', credentialUrl: 'https://coursera.org/verify/123' }
    ],
    contact: {
        email: "shahabdulmazid.ezan@yahoo.com",
        phone: "(+88015) 3132-9222",
        location: "Dhaka, Bangladesh",
        whatsapp: "https://wa.me/8801531329222",
        messenger: "https://m.me/shahabdulmazid.ezan",
        facebook: "https://facebook.com/shahabdulmazid.ezan",
        github: "https://github.com/Shah-Abdul-Mazid",
        linkedin: "https://linkedin.com/in/shahabdulmazid",
        nationality: "Bangladeshi",
        dob: "01/06/2001",
        pob: "Dhaka, Bangladesh"
    }
};

interface PortfolioContextType {
    data: PortfolioData;
    updateData: (newData: PortfolioData) => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Helper to resolve document URLs (Supports Local, GridFS, and Cloudinary)
export const resolveUrl = (url: string | undefined): string => {
    if (!url) return '';

    // 1. If it's already a full Cloudinary or generic HTTPS URL, return as is
    if (url.startsWith('https://') || (url.startsWith('http://') && !url.includes('localhost'))) {
        return url;
    }

    // 2. Handle localhost URLs from old data
    if (url.includes('localhost:3001/')) {
        const path = url.split('localhost:3001')[1];
        const isDev = window.location.hostname === 'localhost';
        return isDev ? `http://localhost:3001${path}` : path;
    }

    // 3. Handle relative paths (e.g., /uploads/ or /api/upload/)
    const isDev = window.location.hostname === 'localhost';
    const backendUrl = 'http://localhost:3001'; // Default dev backend
    
    if (url.startsWith('/') && isDev) {
        // In dev, prefix relative paths with the backend URL
        return `${backendUrl}${url}`;
    }

    // 4. In production, relative paths work fine if proxied or on same origin
    return url;
};


const sanitizeData = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        if (typeof obj === 'string' && obj.startsWith('/data/')) {
            return obj.replace(/ /g, '-');
        }
        return obj;
    }
    if (Array.isArray(obj)) return obj.map(sanitizeData);
    const newObj: any = {};
    for (const key in obj) {
        newObj[key] = sanitizeData(obj[key]);
    }
    return newObj;
};

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<PortfolioData>(defaultData);

    // Load portfolio data: try backend API first, then localStorage, then defaultData
    useEffect(() => {
        const load = async () => {
            // 1. Try backend API first
            try {
                const res = await fetch('/api/portfolio');
                if (res.ok) {
                    const apiData = await res.json();
                    if (apiData && typeof apiData === 'object' && Object.keys(apiData).length > 0) {
                        const merged = {
                            ...defaultData,
                            ...apiData,
                            sections: { ...defaultData.sections, ...(apiData.sections || {}) },
                            contact: { ...defaultData.contact, ...(apiData.contact || {}) }
                        };
                        const sanitized = sanitizeData(merged);
                        setData(sanitized);
                        localStorage.setItem('portfolio_data', JSON.stringify(sanitized));
                        return;
                    }
                }
            } catch (err) {
                console.warn('Backend API unreachable, falling back to localStorage...', err);
            }

            // 2. Fallback: localStorage cache
            const saved = localStorage.getItem('portfolio_data');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const merged = {
                        ...defaultData,
                        ...parsed,
                        sections: { ...defaultData.sections, ...(parsed.sections || {}) },
                        contact: { ...defaultData.contact, ...(parsed.contact || {}) }
                    };
                    setData(sanitizeData(merged));
                    return;
                } catch {
                    // fallback to default
                }
            }
            setData(defaultData);
        };
        load();
    }, []);

    useEffect(() => {
        const syncTabs = (e: StorageEvent) => {
            if (e.key === 'portfolio_data' && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    setData(parsed);
                } catch (err) {
                    console.error('Error syncing tab data:', err);
                }
            }
        };
        window.addEventListener('storage', syncTabs);
        return () => window.removeEventListener('storage', syncTabs);
    }, []);

    const updateData = async (newData: PortfolioData): Promise<boolean> => {
        const sanitized = sanitizeData(newData);
        setData(sanitized);
        
        // Always save to localStorage as instant cache (triggers 'storage' event in other tabs)
        localStorage.setItem('portfolio_data', JSON.stringify(sanitized));
        
        // Save to MongoDB via FastAPI backend
        try {
            console.log('📡 Syncing portfolio to backend MongoDB...');
            const token = localStorage.getItem('admin_token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const res = await fetch('/api/portfolio', {
                method: 'POST',
                headers,
                body: JSON.stringify(sanitized)
            });
            if (res.ok) {
                console.log('✅ Portfolio data saved to MongoDB');
                return true;
            }
            console.warn('⚠️ Failed to save portfolio data to backend status:', res.status);
            return false;
        } catch (err) {
            console.warn('⚠️ Could not reach backend to save portfolio data:', err);
            return false;
        }
    };



    return (
        <PortfolioContext.Provider value={{ data, updateData }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error("usePortfolio must be used within a PortfolioProvider");
    }
    return context;
};
