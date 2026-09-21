export interface ATSCvData {
    personal: {
        name: string;
        title: string;
        location: string;
        email: string;
        phone: string;
        linkedin: string;
        github: string;
        portfolio: string;
    };
    summary: string;
    skills: { category: string; items: string[] }[];
    experience: {
        role: string;
        company: string;
        location: string;
        period: string;
        points: string[];
    }[];
    education: {
        degree: string;
        institution: string;
        location: string;
        period: string;
        major?: string;
        details?: string;
    }[];
    projects: {
        title: string;
        subtitle: string;
        points: string[];
        technologies: string[];
    }[];
    publication: {
        title: string;
        year: string;
        venue: string;
    };
    publications?: {
        title: string;
        year: string;
        venue: string;
    }[];
    certifications: {
        name: string;
        issuer: string;
        date: string;
    }[];
    competitions: {
        title: string;
        organizer: string;
        year: string;
    }[];
    onlineProfiles: {
        name: string;
        url: string;
        label: string;
    }[];
    languages: {
        name: string;
        level: string;
    }[];
}

export const atsCvData: ATSCvData = {
    personal: {
        name: "SHAH ABDUL MAZID",
        title: "AI/ML Engineer | Generative AI | LLMs | RAG | Computer Vision",
        location: "Dhaka, Bangladesh",
        email: "shahabdulmazid.ezan@yahoo.com",
        phone: "+880 1531329222",
        linkedin: "https://www.linkedin.com/in/shahabdulmazid",
        github: "https://github.com/Shah-Abdul-Mazid",
        portfolio: "https://shah-abdul-mazid-portfolio.vercel.app/",
    },
    summary:
        "AI/ML Engineer with a B.Sc. in Computer Science and Engineering, majoring in Intelligent Systems and Data Science. Hands-on experience in Artificial Intelligence, Machine Learning, Deep Learning, Computer Vision, Natural Language Processing, Generative AI, Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and AI application development. Skilled in Python, PyTorch, TensorFlow, FastAPI, React, Pinecone, OpenAI APIs, and AWS. Passionate about AI research, intelligent systems, healthcare AI, multi-agent systems, and building scalable real-world AI solutions.",
    skills: [
        {
            category: "Programming Languages",
            items: ["Python", "Java", "C", "C++", "JavaScript", "TypeScript", "SQL"],
        },
        {
            category: "Machine Learning",
            items: ["Machine Learning", "Deep Learning", "Transfer Learning", "Model Evaluation", "Feature Engineering", "Data Preprocessing"],
        },
        {
            category: "Generative AI",
            items: ["Generative AI", "Large Language Models (LLMs)", "Retrieval-Augmented Generation (RAG)", "Prompt Engineering", "AI Agents", "Agentic AI", "Multi-Agent Systems"],
        },
        {
            category: "Natural Language Processing",
            items: ["NLP", "Semantic Search", "Vector Search", "Sentence Transformers", "Text Embeddings", "Document Q&A", "AI Chatbots"],
        },
        {
            category: "Computer Vision",
            items: ["Computer Vision", "Object Detection", "Image Classification", "Medical Imaging", "YOLO", "OpenCV", "Grad-CAM", "CBAM Attention"],
        },
        {
            category: "AI Frameworks and Libraries",
            items: ["PyTorch", "TensorFlow", "Keras", "YOLO", "OpenCV", "NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Plotly", "Sentence Transformers"],
        },
        {
            category: "Backend Development",
            items: ["FastAPI", "REST API", "API Integration", "JWT Authentication", "PDF Processing"],
        },
        {
            category: "Frontend Development",
            items: ["React", "Next.js", "Streamlit", "Gradio"],
        },
        {
            category: "Databases and Vector Databases",
            items: ["Pinecone", "Vector Databases", "MongoDB", "MySQL", "SQLite"],
        },
        {
            category: "Cloud and DevOps",
            items: ["AWS", "EC2", "Docker", "PM2", "Git", "GitHub"],
        },
        {
            category: "Automation and Integration",
            items: ["n8n", "Workflow Automation", "Email Automation", "Stripe API", "Third-Party API Integration"],
        },
        {
            category: "Research and Documentation",
            items: ["Academic Research", "Academic Writing", "Technical Documentation", "LaTeX"],
        },
    ],
    experience: [
        {
            role: "AI Engineer",
            company: "Neuroxyte",
            location: "Narayanganj, Dhaka Division, Bangladesh",
            period: "July 2026 -- Current",
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
            period: "Feb 2026 -- July 2026",
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
            period: "Jan 2022 -- Jan 2025",
            points: [
                "Represented the organization on campus and promoted digital learning initiatives.",
                "Organized technology workshops, events, and student engagement programs.",
                "Collaborated with students and organizers to increase awareness of digital education programs.",
            ],
        },
    ],
    education: [
        {
            degree: "B.Sc. in Computer Science and Engineering",
            institution: "East West University",
            location: "Dhaka, Bangladesh",
            period: "2021 -- 2026",
            major: "Major: Intelligent Systems and Data Science",
        },
        {
            degree: "Higher Secondary Certificate (HSC)",
            institution: "Dhaka Ideal College",
            location: "Dhaka, Bangladesh",
            period: "2018 -- 2020",
            details: "Science",
        },
        {
            degree: "Secondary School Certificate (SSC)",
            institution: "Badshah Faisal Institute",
            location: "Dhaka, Bangladesh",
            period: "2016 -- 2018",
            details: "Science",
        },
    ],
    projects: [
        {
            title: "Nexus Intelligence",
            subtitle: "Enterprise Multi-Agent AI Platform",
            points: [
                "Built a full-stack enterprise AI platform for secure Q&A across private documents, spreadsheets, and web data.",
                "Implemented RAG, multi-agent routing, Pinecone retrieval, feedback memory, JWT authentication, and PII detection.",
            ],
            technologies: ["FastAPI", "Next.js", "React", "TypeScript", "OpenAI", "Pinecone", "AWS"],
        },
        {
            title: "HR Policies RAG Chatbot",
            subtitle: "AI-Powered Document Q&A",
            points: [
                "Built a citation-aware chatbot that answers HR policy questions from organizational PDF documents using RAG.",
                "Implemented PDF processing, semantic search, vector retrieval, and LLM-based response generation.",
            ],
            technologies: ["Python", "FastAPI", "Streamlit", "Pinecone", "Llama 2", "Sentence Transformers"],
        },
        {
            title: "WhatsUpIn",
            subtitle: "AI-Powered Travel Recommendation Engine",
            points: [
                "Built an AI travel platform that generates personalized itineraries and automates travel-related workflows.",
                "Integrated OpenAI, n8n, Google Maps, Google Sheets, and Stripe for end-to-end automation.",
            ],
            technologies: ["OpenAI", "n8n", "APIs", "Google Maps", "Google Sheets", "Stripe"],
        },
        {
            title: "Bangladesh Traffic Flow Dataset",
            subtitle: "Deep Learning Vehicle Detection",
            points: [
                "Developed a computer vision system for vehicle detection and classification under Bangladesh traffic conditions.",
                "Implemented YOLO detection with Grad-CAM/EigenCAM-based model interpretation and interactive inference.",
            ],
            technologies: ["PyTorch", "YOLO", "OpenCV", "NumPy", "Pandas", "Streamlit", "Gradio"],
        },
        {
            title: "Brain Tumor Detection and Classification",
            subtitle: "MobDenseNet with CBAM Attention",
            points: [
                "Developed a hybrid MobileNetV2–DenseNet121 model with CBAM attention for MRI-based brain tumor classification.",
                "Applied preprocessing, augmentation, classification, and Grad-CAM for explainable predictions.",
            ],
            technologies: ["PyTorch", "MobileNetV2", "DenseNet121", "CBAM", "Grad-CAM", "Streamlit"],
        },
    ],
    publication: {
        title: "MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis",
        year: "2025",
        venue: "Published at the 2025 28th International Conference on Computer and Information Technology (ICCIT), IEEE, pp. 2235–2240. DOI: 10.1109/ICCIT68739.2025.11490181",
    },
    publications: [
        {
            title: "MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis",
            year: "2025",
            venue: "Published at the 2025 28th International Conference on Computer and Information Technology (ICCIT), IEEE, pp. 2235–2240. DOI: 10.1109/ICCIT68739.2025.11490181",
        },
        {
            title: "Uncertainty-Aware Chest Pathology Detection with Vision and Language Transformers",
            year: "2026",
            venue: "Published in Innovations in Data Analytics, Springer Nature, 2026, pp. 397–417. DOI: 10.1007/978-3-032-27845-6_34",
        },
    ],
    certifications: [
        { name: "IBM Deep Learning with PyTorch, Keras and TensorFlow", issuer: "IBM", date: "May 2026" },
        { name: "DeepLearning.AI TensorFlow Developer", issuer: "DeepLearning.AI", date: "May 2026" },
        { name: "IBM Machine Learning", issuer: "IBM", date: "May 2026" },
        { name: "IBM RAG and Agentic AI", issuer: "IBM", date: "May 2026" },
        { name: "Building AI Agents and Agentic Workflows", issuer: "IBM", date: "May 2026" },
        { name: "IBM AI Developer", issuer: "IBM", date: "May 2026" },
        { name: "AWS Generative AI and AI Agents with Amazon Bedrock", issuer: "AWS", date: "May 2026" },
        { name: "IBM AI Engineering", issuer: "IBM", date: "May 2026" },
        { name: "IBM Data Science", issuer: "IBM", date: "May 2026" },
    ],
    competitions: [
        { title: "Network War", organizer: "EWU Telecommunication Club", year: "2024" },
        { title: "IT Olympiad", organizer: "CSE FEST, East West University", year: "2024" },
        { title: "In House Programming Battle", organizer: "EWUCoPC", year: "2022" },
    ],
    onlineProfiles: [
        { name: "Nexus Intelligence", url: "https://ai-rag-project-llm-based.vercel.app/auth/login", label: "ai-rag-project-llm-based.vercel.app" },
        { name: "Bangladesh Traffic Flow Project", url: "https://shahabdulmazid-ml-project.streamlit.app/", label: "shahabdulmazid-ml-project.streamlit.app" },
        { name: "GitHub", url: "https://github.com/Shah-Abdul-Mazid", label: "GitHub Profile" },
        { name: "LinkedIn", url: "https://www.linkedin.com/in/shahabdulmazid", label: "LinkedIn Profile" },
    ],
    languages: [
        { name: "Bengali", level: "Native" },
        { name: "English", level: "Professional Working Proficiency" },
    ],
};
