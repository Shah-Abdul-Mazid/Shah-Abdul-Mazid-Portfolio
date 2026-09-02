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
            company: "Softvence Agency",
            location: "Dhaka, Bangladesh",
            period: "Feb 2026 -- May 2026",
            points: [
                "Developed Retrieval-Augmented Generation (RAG) chatbots using Large Language Models for intelligent question-answering systems.",
                "Built scalable backend APIs using FastAPI for AI model deployment, integration, and application development.",
                "Designed and implemented voice generation and Text-to-Speech systems for interactive AI applications.",
                "Automated workflows using n8n, reducing manual tasks and improving operational efficiency.",
                "Integrated multiple APIs and external services to build end-to-end AI-powered solutions.",
                "Researched and implemented emerging Generative AI, LLM, RAG, and AI agent techniques.",
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
                "Built a full-stack enterprise AI platform that transforms private company documents, spreadsheets, and web content into secure and grounded answers.",
                "Implemented multi-agent architecture, Retrieval-Augmented Generation, Pinecone vector search, live data routing, feedback memory, JWT authentication, and PII compliance.",
                "Developed Next.js frontend and FastAPI backend with AWS EC2 and PM2 deployment support.",
            ],
            technologies: ["FastAPI", "Next.js", "React", "TypeScript", "OpenAI API", "Pinecone", "RAG", "Multi-Agent AI", "JWT", "AWS", "EC2", "PM2"],
        },
        {
            title: "HR Policies RAG Chatbot",
            subtitle: "AI-Powered Document Q&A System",
            points: [
                "Developed an AI-powered RAG chatbot that answers HR policy questions by retrieving relevant PDF content and generating context-aware responses.",
                "Implemented semantic search, vector retrieval, document processing, and LLM-based response generation.",
            ],
            technologies: ["RAG", "LLMs", "FastAPI", "Streamlit", "Pinecone", "Llama 2", "NLP", "Sentence Transformers", "Python"],
        },
        {
            title: "WhatsUpIn",
            subtitle: "AI-Powered Personalized Travel Recommendation Engine",
            points: [
                "Developed an automated AI-powered travel engine that generates personalized travel itineraries.",
                "Integrated AI, mapping, payment, spreadsheet, and workflow automation services.",
            ],
            technologies: ["n8n", "Python", "OpenAI API", "Google Maps API", "Google Sheets", "Stripe API"],
        },
        {
            title: "Bangladesh Traffic Flow Dataset Using Machine Learning",
            subtitle: "Deep Learning Vehicle Detection & Classification",
            points: [
                "Developed a deep learning solution for vehicle detection and classification under Bangladesh traffic conditions.",
                "Applied YOLO-based object detection and Grad-CAM/EigenCAM for model interpretability.",
                "Deployed an interactive inference application using Streamlit and Gradio.",
            ],
            technologies: ["PyTorch", "YOLO", "OpenCV", "NumPy", "Pandas", "Plotly", "Streamlit", "Gradio", "Matplotlib", "EigenCAM"],
        },
        {
            title: "Brain Tumor Detection and Classification with MobDenseNet Hybrid Model",
            subtitle: "MRI Medical Imaging Classification",
            points: [
                "Developed a hybrid deep learning architecture combining MobileNet and DenseNet with CBAM attention for brain tumor classification from MRI images.",
                "Applied preprocessing, normalization, augmentation, model evaluation, and Grad-CAM-based interpretability.",
                "Evaluated models using accuracy, precision, recall, and F1-score.",
            ],
            technologies: ["PyTorch", "Deep Learning", "Computer Vision", "Medical Imaging", "CNN", "MobileNet", "DenseNet", "CBAM", "Grad-CAM", "Streamlit"],
        },
    ],
    publication: {
        title: "MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis",
        year: "2025",
        venue: "Published at the 28th International Conference on Computer and Information Technology (ICCIT 2025).",
    },
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
