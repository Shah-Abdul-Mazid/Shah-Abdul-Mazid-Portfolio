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
    publication: { title: string; year: string; conference: string };
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
            company: "Softvence Agency",
            location: "Dhaka, Bangladesh",
            period: "Feb 2026 – May 2026",
            points: [
                "Developed RAG-based chatbots using Large Language Models for intelligent Q&A.",
                "Built scalable FastAPI backend services for AI model deployment.",
                "Developed Text-to-Speech and voice generation systems.",
                "Automated workflows using n8n for operational efficiency.",
                "Integrated APIs and external services for end-to-end AI solutions.",
                "Researched and implemented emerging GenAI and LLM techniques.",
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
        conference: "28th International Conference on Computer and Information Technology (ICCIT).",
    },
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
            description: "Built a full-stack enterprise AI platform for secure Q&A over private documents, spreadsheets, and web content.",
            points: [
                "Implemented RAG and multi-agent architecture.",
                "Integrated Pinecone vector search and live data routing.",
                "Added feedback memory, JWT auth, and PII detection.",
                "Developed Next.js frontend and FastAPI backend.",
            ],
            tech: ["FastAPI", "Next.js", "React", "TypeScript", "OpenAI", "Pinecone", "AWS"],
        },
        {
            title: "HR Policies RAG Chatbot",
            subtitle: "AI-Powered Document Q&A",
            description: "AI chatbot to answer HR policy questions from PDF documents using semantic retrieval and LLMs.",
            points: [
                "Implemented PDF processing and vector retrieval.",
                "Developed interactive Streamlit interface.",
            ],
            tech: ["Python", "FastAPI", "Streamlit", "Pinecone", "Llama 2"],
        },
        {
            title: "Bangladesh Traffic Flow Dataset",
            subtitle: "Deep Learning Vehicle Detection",
            description: "Deep learning system for vehicle detection under Bangladesh traffic conditions.",
            points: [
                "Implemented YOLO-based object detection & Grad-CAM.",
                "Built inference using Streamlit and Gradio.",
            ],
            tech: ["PyTorch", "YOLO", "OpenCV", "NumPy", "Pandas"],
        },
        {
            title: "Brain Tumor Detection",
            subtitle: "MobDenseNet with CBAM Attention",
            description: "Hybrid deep learning model combining MobileNet, DenseNet, and CBAM attention for MRI brain tumor classification.",
            points: [
                "Preprocessing, augmentation, and classification pipeline.",
                "Applied Grad-CAM interpretability & Streamlit deploy.",
            ],
            tech: ["PyTorch", "MobileNet", "DenseNet", "CBAM", "Streamlit"],
        },
        {
            title: "WhatsUpIn",
            subtitle: "AI Travel Recommendation Engine",
            description: "Automated AI travel recommendation platform generating personalized itineraries.",
            points: ["Integrated OpenAI, n8n, Google Maps, and Stripe."],
            tech: ["OpenAI", "n8n", "Google Maps", "Stripe"],
        },
    ],
    profiles: [
        { label: "Portfolio", url: "https://shah-abdul-mazid-portfolio.vercel.app", text: "shah-abdul-mazid-portfolio.vercel.app" },
        { label: "GitHub", url: "https://github.com/Shah-Abdul-Mazid", text: "github.com/Shah-Abdul-Mazid" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/shahabdulmazid", text: "linkedin.com/in/shahabdulmazid" },
        { label: "Nexus Intelligence", url: "https://ai-rag-project-llm-based.vercel.app/auth/login", text: "Live Demo" },
    ],
};
