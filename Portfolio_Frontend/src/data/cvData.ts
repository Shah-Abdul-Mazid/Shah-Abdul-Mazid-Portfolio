export interface CVSkillCategory {
    category: string;
    items: string[];
}

export interface CVEducationItem {
    degree: string;
    institution: string;
    period: string;
    details: string;
}

export interface CVExperienceItem {
    role: string;
    company: string;
    location: string;
    period: string;
    points: string[];
}

export interface CVProjectItem {
    title: string;
    subtitle: string;
    description: string;
    points: string[];
    tech: string[];
}

export interface CVPublicationItem {
    title: string;
    year: string;
    conference: string;
}

export interface CVCompetitionItem {
    title: string;
    organizer: string;
    year: string;
}

export interface CVProfileItem {
    label: string;
    url: string;
    text: string;
}

export interface CVHighlightItem {
    title: string;
    description: string;
}

export interface CVData {
    personal: {
        name: string;
        title: string;
        tags: string[];
        location: string;
        email: string;
        phone: string;
        linkedin: string;
        github: string;
        avatarUrl: string;
    };
    summary: string;
    skills: CVSkillCategory[];
    education: CVEducationItem[];
    languages: { name: string; proficiency: string }[];
    toolsAndPlatforms: CVSkillCategory[];
    achievements: string[];
    highlights: CVHighlightItem[];
    researchInterests: string[];
    careerFocus: string[];
    experience: CVExperienceItem[];
    publication: CVPublicationItem;
    publications?: CVPublicationItem[];
    certifications: string[];
    competitions: CVCompetitionItem[];
    projects: CVProjectItem[];
    profiles: CVProfileItem[];
}

export const cvData: CVData = {
    personal: {
        name: "SHAH ABDUL MAZID",
        title: "AI/ML ENGINEER",
        tags: ["Generative AI", "LLMs", "RAG", "Computer Vision", "NLP"],
        location: "Dhaka, Bangladesh",
        email: "shahabdulmazid.ezan@yahoo.com",
        phone: "+880 1531329222",
        linkedin: "https://www.linkedin.com/in/shahabdulmazid",
        github: "https://github.com/Shah-Abdul-Mazid",
        avatarUrl: "/resume/FD=109767.jpg",
    },
    summary:
        "AI/ML Engineer with a B.Sc. in Computer Science and Engineering from East West University, majoring in Intelligent Systems and Data Science. Experienced in Generative AI, LLMs, RAG, Machine Learning, Deep Learning, Computer Vision, and NLP. Skilled in building AI applications using Python, PyTorch, TensorFlow, FastAPI, Pinecone, OpenAI APIs, and AWS. Passionate about AI research and developing intelligent solutions for real-world problems.",
    skills: [
        { category: "Languages", items: ["Python", "Java", "C/C++", "JavaScript", "TypeScript", "SQL"] },
        { category: "AI / ML", items: ["Machine Learning", "Deep Learning", "Transfer Learning", "Model Evaluation", "Data Preprocessing"] },
        { category: "Generative AI", items: ["Generative AI", "LLMs", "RAG", "Prompt Engineering", "AI Agents", "Agentic AI", "Multi-Agent Systems"] },
        { category: "NLP", items: ["Natural Language Processing", "Semantic Search", "Vector Search", "Embeddings", "Sentence Transformers", "AI Chatbots"] },
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
            period: "2021–2026",
            details: "Major: Intelligent Systems & Data Science",
        },
        {
            degree: "Higher Secondary Certificate",
            institution: "Dhaka Ideal College",
            period: "2018–2020",
            details: "Science",
        },
        {
            degree: "Secondary School Certificate",
            institution: "Badshah Faisal Institute",
            period: "2016–2018",
            details: "Science",
        },
    ],
    languages: [
        { name: "Bengali", proficiency: "Native" },
        { name: "English", proficiency: "Professional Working Proficiency" },
    ],
    toolsAndPlatforms: [
        { category: "Models & APIs", items: ["OpenAI API", "Llama 2", "Mistral", "Claude API", "HuggingFace Models"] },
        { category: "Vector DBs", items: ["Pinecone", "Weaviate", "Milvus", "Chroma", "FAISS"] },
        { category: "Deployment", items: ["Hugging Face Hub", "AWS SageMaker", "Docker Hub", "Streamlit Cloud"] },
        { category: "Dev Tools", items: ["VS Code", "Git", "GitHub", "Jupyter", "Google Colab", "Linux/Ubuntu"] },
        { category: "Integrations", items: ["OpenAI API", "Google Maps", "Stripe", "Google Sheets", "Anthropic API"] },
    ],
    achievements: [
        "Published research on interpretable ML for agricultural disease diagnosis (ICCIT 2025)",
        "Built enterprise RAG platform processing 10,000+ documents with 95%+ accuracy",
        "Developed traffic detection system for real-world Bangladesh traffic conditions",
        "Designed multi-agent AI system handling complex enterprise workflows",
        "9+ IBM and AWS certifications in AI/ML specialisations",
    ],
    highlights: [
        { title: "Published Researcher", description: "MangoStack ensemble model published in ICCIT 2025" },
        { title: "RAG Specialist", description: "Built enterprise platforms for document Q&A systems" },
        { title: "Full-Stack AI", description: "End-to-end ML systems from training to production" },
        { title: "Automation Expert", description: "n8n workflow automation for business efficiency" },
    ],
    researchInterests: [
        "Generative AI, LLMs & RAG Architecture",
        "Multi-Agent AI Systems & Autonomous Workflows",
        "Healthcare AI & Medical Image Diagnosis",
        "Computer Vision, Grad-CAM & Model Interpretability",
    ],
    careerFocus: [
        "AI/ML Engineering",
        "Generative AI",
        "RAG Systems",
        "Computer Vision",
        "AI Research",
        "Data Science",
    ],
    experience: [
        {
            role: "AI Engineer",
            company: "Neuroxyte",
            location: "Narayanganj, Dhaka Division, Bangladesh",
            period: "July 2026 – Current",
            points: [
                "Develop and deploy AI solutions using Generative AI, LLMs, RAG, and intelligent automation.",
                "Build AI applications and scalable backend services using Python and FastAPI.",
                "Design LLM-based workflows, conversational AI systems, and retrieval-augmented applications.",
                "Integrate AI models, external APIs, and third-party services to deliver reliable end-to-end solutions.",
            ],
        },
        {
            role: "AI Engineer",
            company: "Softvence Agency",
            location: "Dhaka, Bangladesh",
            period: "Feb 2026 – July 2026",
            points: [
                "Developed RAG-based chatbots using Large Language Models for intelligent question answering.",
                "Built FastAPI backend services and integrated AI models and external APIs.",
                "Developed Text-to-Speech and voice generation systems for interactive AI applications.",
                "Automated business workflows using n8n and implemented Generative AI and RAG solutions.",
            ],
        },
        {
            role: "Campus Ambassador",
            company: "eShikhon",
            location: "Dhaka, Bangladesh",
            period: "Jan 2022 – Jan 2025",
            points: [
                "Represented the organisation at East West University.",
                "Organised technology workshops and student events.",
                "Promoted digital learning and technology initiatives.",
            ],
        },
    ],
    publication: {
        title: "MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis",
        year: "2025",
        conference: "2025 28th International Conference on Computer and Information Technology (ICCIT), IEEE, pp. 2235–2240.",
    },
    publications: [
        {
            title: "MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis",
            year: "2025",
            conference: "2025 28th International Conference on Computer and Information Technology (ICCIT), IEEE, pp. 2235–2240. DOI: 10.1109/ICCIT68739.2025.11490181",
        },
        {
            title: "Uncertainty-Aware Chest Pathology Detection with Vision and Language Transformers",
            year: "2026",
            conference: "Innovations in Data Analytics, Springer Nature, 2026, pp. 397–417. DOI: 10.1007/978-3-032-27845-6_34",
        },
    ],
    certifications: [
        "IBM Deep Learning with PyTorch, Keras and TensorFlow",
        "DeepLearning.AI TensorFlow Developer",
        "IBM Machine Learning & AI Engineering",
        "IBM RAG, Agentic AI & AI Developer",
        "AWS Generative AI and AI Agents with Amazon Bedrock",
    ],
    competitions: [
        { title: "Network War", organizer: "EWU Telecommunication Club", year: "2024" },
        { title: "IT Olympiad", organizer: "CSE FEST, East West University", year: "2024" },
        { title: "In House Programming Battle", organizer: "EWUCoPC", year: "2022" },
    ],
    projects: [
        {
            title: "Nexus Intelligence",
            subtitle: "Enterprise Multi-Agent AI Platform",
            description: "Built a full-stack enterprise AI platform for secure Q&A across private documents, spreadsheets, and web data.",
            points: [
                "Implemented RAG, multi-agent routing, Pinecone retrieval, feedback memory, JWT authentication, and PII detection.",
            ],
            tech: ["FastAPI", "Next.js", "React", "TypeScript", "OpenAI", "Pinecone", "AWS"],
        },
        {
            title: "HR Policies RAG Chatbot",
            subtitle: "AI-Powered Document Q&A",
            description: "Built a citation-aware chatbot that answers HR policy questions from organizational PDF documents using RAG.",
            points: [
                "Implemented PDF processing, semantic search, vector retrieval, and LLM-based response generation.",
            ],
            tech: ["Python", "FastAPI", "Streamlit", "Pinecone", "Llama 2", "Sentence Transformers"],
        },
        {
            title: "Bangladesh Traffic Flow Dataset",
            subtitle: "Deep Learning Vehicle Detection",
            description: "Developed a computer vision system for vehicle detection and classification under Bangladesh traffic conditions.",
            points: [
                "Implemented YOLO detection with Grad-CAM/EigenCAM-based model interpretation and interactive inference.",
            ],
            tech: ["PyTorch", "YOLO", "OpenCV", "NumPy", "Pandas", "Streamlit", "Gradio"],
        },
        {
            title: "Brain Tumor Detection and Classification",
            subtitle: "MobDenseNet with CBAM Attention",
            description: "Developed a hybrid MobileNetV2–DenseNet121 model with CBAM attention for MRI-based brain tumor classification.",
            points: [
                "Applied preprocessing, augmentation, classification, and Grad-CAM for explainable predictions.",
            ],
            tech: ["PyTorch", "MobileNetV2", "DenseNet121", "CBAM", "Grad-CAM", "Streamlit"],
        },
        {
            title: "WhatsUpIn",
            subtitle: "AI-Powered Travel Recommendation Engine",
            description: "Built an AI travel platform that generates personalized itineraries and automates travel-related workflows.",
            points: [
                "Integrated OpenAI, n8n, Google Maps, Google Sheets, and Stripe for end-to-end automation.",
            ],
            tech: ["OpenAI", "n8n", "APIs", "Google Maps", "Google Sheets", "Stripe"],
        },
    ],
    profiles: [
        { label: "Portfolio", url: "https://shah-abdul-mazid-portfolio.vercel.app", text: "shah-abdul-mazid-portfolio.vercel.app" },
        { label: "GitHub", url: "https://github.com/Shah-Abdul-Mazid", text: "github.com/Shah-Abdul-Mazid" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/shahabdulmazid", text: "linkedin.com/in/shahabdulmazid" },
        { label: "Nexus Intelligence", url: "https://ai-rag-project-llm-based.vercel.app/auth/login", text: "Live Demo" },
    ],
};
