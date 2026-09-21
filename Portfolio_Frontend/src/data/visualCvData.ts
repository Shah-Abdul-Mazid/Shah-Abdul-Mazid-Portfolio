export interface VisualCvData {
    personal: {
        name: string;
        title: string;
        tags: string[];
        location: string;
        email: string;
        phone: string;
        linkedin: string;
        github: string;
        scholar?: string;
        avatarUrl: string;
    };
    summary: string;
    skills: { category: string; items: string[] }[];
    education: { degree: string; institution: string; period: string; details: string }[];
    languages: { name: string; proficiency: string }[];
    toolsAndPlatforms: { category: string; items: string[] }[];
    achievements: string[];
    highlights: { title: string; description: string }[];
    researchInterests: string[];
    careerFocus: string[];
    experience: { role: string; company: string; location: string; period: string; points: string[] }[];
    publication: {
        title: string;
        authors?: string;
        year: string;
        conference: string;
        doi?: string;
        url?: string;
    };
    publications?: {
        title: string;
        authors?: string;
        year: string;
        conference: string;
        doi?: string;
        url?: string;
    }[];
    certifications: string[];
    competitions: { title: string; organizer: string; year: string }[];
    projects: { title: string; subtitle: string; description: string; points: string[]; tech: string[] }[];
    profiles: { label: string; url: string; text: string }[];
}

export const visualCvData: VisualCvData = {
    personal: {
        name: "SHAH ABDUL MAZID",
        title: "AI/ML ENGINEER",
        tags: ["Generative AI", "LLMs", "RAG", "Computer Vision", "NLP"],
        location: "Dhaka, Bangladesh",
        email: "shahabdulmazid.ezan@yahoo.com",
        phone: "+880 1531329222",
        linkedin: "https://www.linkedin.com/in/shahabdulmazid",
        github: "https://github.com/Shah-Abdul-Mazid",
        scholar: "https://scholar.google.com/citations?user=TYkiwUgAAAAJ",
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
        { category: "Vector DBs & Search", items: ["Pinecone", "Weaviate", "Milvus", "Chroma", "FAISS"] },
        { category: "Deployment", items: ["Hugging Face Hub", "AWS SageMaker", "Docker Hub", "Streamlit Cloud"] },
        { category: "Dev Tools", items: ["VS Code", "Git", "GitHub", "Jupyter", "Google Colab", "Linux/Ubuntu"] },
        { category: "APIs & Integrations", items: ["OpenAI API", "Google Maps", "Stripe", "Google Sheets", "Anthropic API"] },
    ],
    achievements: [
        "Published research on interpretable ML for agricultural disease diagnosis (ICCIT 2025)",
        "Built enterprise RAG platform processing 10,000+ documents with 95%+ accuracy",
        "Developed traffic detection system for real-world Bangladesh traffic conditions",
        "Designed multi-agent AI system handling complex enterprise workflows",
        "9+ IBM and AWS certifications in AI/ML specializations",
    ],
    highlights: [
        { title: "Published Researcher", description: "MangoStack ensemble model published in ICCIT 2025" },
        { title: "RAG Specialist", description: "Built enterprise platforms for document-based Q&A systems" },
        { title: "Full-Stack AI", description: "End-to-end ML systems from training to production deployment" },
        { title: "Automation Expert", description: "n8n workflow automation for business process efficiency" },
    ],
    researchInterests: [
        "Generative AI and Large Language Models",
        "Retrieval-Augmented Generation",
        "Multi-Agent AI Systems",
        "Healthcare AI",
        "Computer Vision and Medical Imaging",
        "Natural Language Processing",
        "Intelligent Recommendation Systems",
        "Model Interpretability",
    ],
    careerFocus: [
        "AI/ML Engineering",
        "Generative AI",
        "LLM and RAG Systems",
        "AI Research",
        "Computer Vision",
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
    ],
    publication: {
        title: "MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis",
        authors: "Raiyan Gani, Yusuf Salehin, Md. Shakil Bhuiyan, Shah Abdul Mazid, Monisha Bani Nibedita Shuci, Shamim Ripon",
        year: "2025",
        conference: "2025 28th International Conference on Computer and Information Technology (ICCIT), IEEE, pp. 2235–2240.",
        doi: "10.1109/ICCIT68739.2025.11490181",
        url: "https://doi.org/10.1109/ICCIT68739.2025.11490181",
    },
    publications: [
        {
            title: "MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis",
            authors: "Raiyan Gani, Yusuf Salehin, Md. Shakil Bhuiyan, Shah Abdul Mazid, Monisha Bani Nibedita Shuci, Shamim Ripon",
            year: "2025",
            conference: "2025 28th International Conference on Computer and Information Technology (ICCIT), IEEE, pp. 2235–2240.",
            doi: "10.1109/ICCIT68739.2025.11490181",
            url: "https://doi.org/10.1109/ICCIT68739.2025.11490181",
        },
        {
            title: "Uncertainty-Aware Chest Pathology Detection with Vision and Language Transformers",
            authors: "Shah Abdul Mazid, Monisha Bani Nibedita Shuci, Mahia Mehrun Safa, Md. Ashikur Rahman Anik, Md. Omor Faruk Sejan, Khandhakar Shatu Moni, Md. Sazzad Hossain, Md. Adnan Morshed, Ahmed Wasif Reza",
            year: "2026",
            conference: "Innovations in Data Analytics, Springer Nature, 2026, pp. 397–417.",
            doi: "10.1007/978-3-032-27845-6_34",
            url: "https://doi.org/10.1007/978-3-032-27845-6_34",
        },
    ],
    certifications: [
        "IBM Deep Learning with PyTorch, Keras and TensorFlow",
        "DeepLearning.AI TensorFlow Developer",
        "IBM Machine Learning",
        "IBM RAG and Agentic AI",
        "Building AI Agents and Agentic Workflows",
        "IBM AI Developer",
        "AWS Generative AI and AI Agents with Amazon Bedrock",
        "IBM AI Engineering",
        "IBM Data Science",
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
        { label: "Portfolio", url: "https://shah-abdul-mazid-portfolio.vercel.app/home", text: "Portfolio Profile" },
        { label: "GitHub", url: "https://github.com/Shah-Abdul-Mazid", text: "Github Profile" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/shahabdulmazid", text: "LinkedIn Profile" },
        { label: "Nexus Intelligence", url: "https://ai-rag-project-llm-based.vercel.app/auth/login", text: "Live Demo" },
    ],
};
