/**
 * Visual CV Data - Auto-scraped from Shah_Abdul_Mazid_Visual_CV_Version_2.tex
 * DO NOT edit manually! Run `python src/utils/scrape_tex.py` or `npm run scrape:cv` to regenerate.
 */

export interface VisualCvPersonal {
    name: string;
    title: string;
    tags: string[];
    location: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    scholar: string;
    portfolio?: string;
    orcid?: string;
    researchgate?: string;
    avatarUrl: string;
}

export interface VisualCvSkill {
    category: string;
    items: string[];
}

export interface VisualCvEducation {
    degree: string;
    institution: string;
    period: string;
    major: string;
    details: string;
    result: string;
}

export interface VisualCvLanguage {
    name: string;
    proficiency: string;
}

export interface VisualCvHighlight {
    title: string;
    description: string;
}

export interface VisualCvExperience {
    role: string;
    company: string;
    location: string;
    period: string;
    points: string[];
}

export interface VisualCvProject {
    title: string;
    subtitle: string;
    description: string;
    points: string[];
    tech: string[];
    githubUrl?: string;
    liveUrl?: string;
}

export interface VisualCvPublication {
    title: string;
    authors: string;
    year: string;
    conference: string;
    doi: string;
    url: string;
}

export interface VisualCvCompetition {
    title: string;
    organizer: string;
    year: string;
}

export interface VisualCvReference {
    label: string;
    name: string;
    affiliation: string;
    email: string;
}

export interface VisualCvData {
    personal: VisualCvPersonal;
    summary: string;
    skills: VisualCvSkill[];
    education: VisualCvEducation[];
    languages: VisualCvLanguage[];
    researchInterests: string[];
    careerFocus: string[];
    toolsAndPlatforms: VisualCvSkill[];
    achievements: string[];
    highlights: VisualCvHighlight[];
    experience: VisualCvExperience[];
    projects: VisualCvProject[];
    publications: VisualCvPublication[];
    certifications: string[];
    competitions: VisualCvCompetition[];
    references?: VisualCvReference[];
    profiles: { label: string; url: string; text: string }[];
}

export const visualCvData: VisualCvData = {
    personal: {
        name: "SHAH ABDUL MAZID",
        title: "AI/ML Engineer & Researcher",
        tags: ["Generative AI", "LLMs & RAG", "Computer Vision", "NLP", "Deep Learning"],
        location: "Dhaka, Bangladesh",
        phone: "+880 1531329222",
        email: "shahabdulmazid.ezan@yahoo.com",
        linkedin: "https://www.linkedin.com/in/shahabdulmazid",
        github: "https://github.com/Shah-Abdul-Mazid",
        scholar: "https://scholar.google.com/citations?user=TYkiwUgAAAAJ",
        portfolio: "https://shahabdulmazidezan.me",
        orcid: "https://orcid.org/0009-0009-6864-5343",
        researchgate: "https://www.researchgate.net/profile/Shah-Abdul-Mazid",
        avatarUrl: "/resume/FD-109767.jpg",
    },
    summary: "AI/ML Engineer with a B.Sc. in Computer Science and Engineering from East West University, majoring in Intelligent Systems and Data Science. Experienced in Generative AI, LLMs, RAG, Machine Learning, Deep Learning, Computer Vision, and NLP. Skilled in building AI applications using Python, PyTorch, TensorFlow, FastAPI, Pinecone, OpenAI APIs, and AWS. Passionate about AI research and developing intelligent solutions for real-world problems.",
    skills: [
        { category: "Languages", items: ["Python", "Java", "C/C++", "JavaScript", "TypeScript", "SQL"] },
        { category: "AI / ML", items: ["Machine Learning", "Deep Learning", "Transfer Learning", "Model Evaluation", "Data Preprocessing"] },
        { category: "Generative AI", items: ["Generative AI", "LLMs", "RAG", "Prompt Engineering", "AI Agents", "Agentic AI", "Multi-Agent Systems"] },
        { category: "NLP", items: ["Natural Language Processing", "Semantic Search", "Vector Search", "Embeddings", "Sentence Transformers", "Document Q&A", "AI Chatbots"] },
        { category: "Computer Vision", items: ["Object Detection", "Image Classification", "Medical Imaging", "YOLO", "OpenCV", "Grad-CAM", "CBAM Attention"] },
        { category: "Frameworks", items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "NumPy", "Pandas", "Matplotlib", "Plotly"] },
        { category: "Backend", items: ["FastAPI", "REST APIs", "JWT Authentication", "API Integration", "PDF Processing"] },
        { category: "Frontend", items: ["React", "Next.js", "Streamlit", "Gradio"] },
        { category: "Databases", items: ["Pinecone", "Vector Databases", "MongoDB", "MySQL", "SQLite"] },
        { category: "Cloud / DevOps", items: ["AWS", "EC2", "Docker", "PM2", "Git", "GitHub"] },
        { category: "Automation", items: ["n8n", "Workflow Automation", "API Integration"] },
    ],
    education: [
        {
            degree: "B.Sc. in Computer Science & Engineering",
            institution: "East West University",
            period: "2021 \u2013 2026",
            major: "",
            details: "",
            result: "",
        },
        {
            degree: "Higher Secondary Certificate",
            institution: "Dhaka Ideal College",
            period: "2018 \u2013 2020",
            major: "",
            details: "",
            result: "",
        },
        {
            degree: "Secondary School Certificate",
            institution: "Badshah Faisal Institute",
            period: "2016 \u2013 2018",
            major: "",
            details: "",
            result: "",
        },
    ],
    languages: [
        { name: "Bengali", proficiency: "Native" },
        { name: "English", proficiency: "Professional Working Proficiency" },
    ],
    researchInterests: ["Generative AI and Large Language Models", "Retrieval-Augmented Generation", "Multi-Agent AI Systems", "Healthcare AI", "Computer Vision and Medical Imaging", "Natural Language Processing", "Intelligent Recommendation Systems", "Model Interpretability"],
    careerFocus: ["AI/ML Engineering", "Generative AI", "LLM and RAG Systems", "AI Research", "Computer Vision", "Data Science"],
    toolsAndPlatforms: [
        { category: "Models & APIs", items: ["OpenAI API", "Llama 2", "Mistral", "Claude API", "HuggingFace Models"] },
        { category: "Vector DBs & Search", items: ["Pinecone", "Weaviate", "Milvus", "Chroma", "FAISS"] },
        { category: "Deployment", items: ["Hugging Face Hub", "AWS SageMaker", "Docker Hub", "Streamlit Cloud"] },
        { category: "Dev Tools", items: ["VS Code", "Git", "GitHub", "Jupyter", "Google Colab", "Linux/Ubuntu"] },
        { category: "APIs & Integrations", items: ["OpenAI API", "Google Maps", "Stripe", "Google Sheets", "Anthropic API"] },
    ],
    achievements: ["Published 2 research papers in agricultural AI and medical imaging (ICCIT 2025, Springer ICIDA 2026)", "Built enterprise RAG platform processing 10,000+ documents with 95%+ accuracy", "Developed traffic detection system for real-world Bangladesh traffic conditions", "Designed multi-agent AI system handling complex enterprise workflows", "17+ IBM and AWS certifications in AI/ML specializations"],
    highlights: [
        { title: "Published Research", description: "2 publications in agricultural AI and medical imaging, including IEEE ICCIT 2025 and Springer ICIDA 2026.\nservices." },
        { title: "Generative AI & RAG", description: "Built enterprise document Q&A, retrieval-augmented, and multi-agent AI systems." },
        { title: "End-to-End AI", description: "Developed ML systems spanning model development, backend integration, and production deployment." },
        { title: "AI Automation", description: "Built n8n-based workflows integrating AI models, APIs, and external" },
    ],
    experience: [
        {
            role: "AI Engineer",
            company: "Neuroxyte",
            location: "Narayanganj, Dhaka Division, Bangladesh",
            period: "July 2026 \u2013 Current",
            points: ["Develop and deploy AI solutions using Generative AI, LLMs, RAG, and intelligent automation.", "Build AI applications and scalable backend services using Python and FastAPI.", "Design LLM-based workflows, conversational AI systems, and retrieval-augmented applications.", "Integrate AI models, external APIs, and third-party services to deliver reliable end-to-end solutions."],
        },
        {
            role: "AI Engineer",
            company: "Softvence Agency",
            location: "Dhaka, Bangladesh",
            period: "Feb 2026 \u2013 July 2026",
            points: ["Developed RAG-based chatbots using Large Language Models for intelligent question answering.", "Built FastAPI backend services and integrated AI models and external APIs.", "Developed Text-to-Speech and voice generation systems for interactive AI applications.", "Automated business workflows using n8n and implemented Generative AI and RAG solutions."],
        },
    ],
    projects: [
        {
            title: "Nexus Intelligence",
            subtitle: "Enterprise Multi-Agent AI Platform",
            description: "Built a full-stack enterprise AI platform for secure question answering across private documents, spreadsheets, and web data.",
            points: ["Implemented RAG, multi-agent routing, Pinecone retrieval, feedback memory, JWT authentication, and PII detection."],
            tech: ["FastAPI", "Next.js", "React", "TypeScript", "OpenAI", "Pinecone", "AWS"],
            githubUrl: "https://github.com/Shah-Abdul-Mazid/Nexus-Enterprise-Intelligence-Platform",
            liveUrl: "https://nexus-enterprise-intelligence-platform.vercel.app/auth",
        },
        {
            title: "HR Policies RAG Chatbot",
            subtitle: "AI-Powered Document Q&A",
            description: "Built a citation-aware RAG chatbot for answering HR policy questions from organizational PDF documents.",
            points: ["Implemented PDF ingestion, semantic search, vector retrieval, and LLM-based response generation with source-aware answers."],
            tech: ["Python", "FastAPI", "Streamlit", "Pinecone", "Llama 2", "Sentence Transformers"],
            githubUrl: "https://github.com/Shah-Abdul-Mazid/DevelopRag.git",
            liveUrl: "",
        },
        {
            title: "Bangladesh Traffic Flow Dataset",
            subtitle: "Deep Learning Vehicle Detection",
            description: "Developed a computer vision system for vehicle detection and classification under real-world Bangladesh traffic conditions.",
            points: ["Implemented YOLO-based detection with Grad-CAM/EigenCAM interpretability and interactive inference workflows."],
            tech: ["PyTorch", "YOLO", "OpenCV", "NumPy", "Pandas", "Streamlit", "Gradio"],
            githubUrl: "https://github.com/Shah-Abdul-Mazid/CSE475FinalProject",
            liveUrl: "",
        },
        {
            title: "Brain Tumor Detection and Classification",
            subtitle: "MobDenseNet with CBAM Attention",
            description: "Developed a hybrid MobileNetV2 \u2013 DenseNet121 architecture with CBAM attention for MRI-based brain tumor classification.",
            points: ["Applied patient-level data splitting, augmentation, classification, and Grad-CAM for interpretable predictions."],
            tech: ["PyTorch", "MobileNetV2", "DenseNet121", "CBAM", "Grad-CAM", "Streamlit"],
            githubUrl: "https://github.com/Shah-Abdul-Mazid/CapstoneProjectFinal",
            liveUrl: "",
        },
        {
            title: "WhatsUpIn",
            subtitle: "AI-Powered Travel Recommendation Engine",
            description: "Built an AI-powered travel platform that generates personalized itineraries and automates travel-related workflows.",
            points: ["Integrated OpenAI, n8n, Google Maps, Google Sheets, and Stripe to automate itinerary generation and travel operations."],
            tech: ["OpenAI", "n8n", "Google Maps", "Google Sheets", "Stripe", "REST APIs"],
            githubUrl: "https://github.com/Shah-Abdul-Mazid/Office_Projects/tree/master/jenstemebel",
            liveUrl: "",
        },
    ],
    publications: [
        {
            title: "MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis",
            authors: "Raiyan Gani, Yusuf Salehin, Md. Shakil Bhuiyan,  Shah Abdul Mazid, Monisha Bani Nibedita Shuci, Shamim Ripon",
            year: "2025",
            conference: "2025 28th International Conference on Computer and Information Technology (ICCIT), IEEE",
            doi: "https://doi.org/10.1109/ICCIT68739.2025.11490181",
            url: "https://doi.org/10.1109/ICCIT68739.2025.11490181",
        },
        {
            title: "Uncertainty-Aware Chest Pathology Detection with Vision and Language Transformers",
            authors: "Shah Abdul Mazid, Monisha Bani Nibedita Shuci,  Mahia Mehrun Safa, Md. Ashikur Rahman Anik, Md. Omor Faruk Sejan,  Khandhakar Shatu Moni, Md. Sazzad Hossain, Md. Adnan Morshed, Ahmed Wasif Reza",
            year: "2026",
            conference: "Innovations in Data Analytics",
            doi: "https://doi.org/10.1007/978-3-032-27845-6_34",
            url: "https://doi.org/10.1007/978-3-032-27845-6_34",
        },
    ],
    certifications: ["IBM Deep Learning with PyTorch, Keras and TensorFlow", "DeepLearning.AI TensorFlow Developer", "IBM Machine Learning", "IBM RAG and Agentic AI", "Building AI Agents and Agentic Workflows", "IBM AI Developer", "AWS Generative AI and AI Agents with Amazon Bedrock", "IBM AI Engineering", "IBM Data Science"],
    competitions: [
        { title: "Network War", organizer: "EWU Telecommunication Club", year: "2024" },
        { title: "IT Olympiad", organizer: "CSE FEST, East West University", year: "2024" },
        { title: "In House Programming Battle", organizer: "EWUCoPC", year: "2022" },
    ],
    references: [
        {
            label: "Reference 1",
            name: "Dr. Mohammad Rifat Ahmed Rashid",
            affiliation: "Associate Professor, East West University",
            email: "rifat.rashid@ewubd.edu",
        },
        {
            label: "Reference 2",
            name: "Dr. Raihan Ul Islam",
            affiliation: "Associate Professor, East West University",
            email: "raihan.islam@ewubd.edu",
        },
    ],
    profiles: [
        { label: "Portfolio", url: "https://shahabdulmazidezan.me", text: "shahabdulmazidezan.me" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/shahabdulmazid", text: "in/shahabdulmazid" },
        { label: "GitHub", url: "https://github.com/Shah-Abdul-Mazid", text: "github.com/Shah-Abdul-Mazid" },
        { label: "Scholar", url: "https://scholar.google.com/citations?user=TYkiwUgAAAAJ", text: "Google Scholar" },
        { label: "ORCID", url: "https://orcid.org/0009-0009-6864-5343", text: "0009-0009-6864-5343" },
        { label: "ResearchGate", url: "https://www.researchgate.net/profile/Shah-Abdul-Mazid", text: "ResearchGate" },
    ],
};
