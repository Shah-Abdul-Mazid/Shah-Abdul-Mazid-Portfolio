import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { GITHUB_URL, SCHOLAR_URL, ORCID_URL, RESEARCHGATE_URL } from '../constants/researchLinks';

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
    logoUrl?: string;
}

export interface ExperienceItem {
    role: string;
    company: string;
    period: string;
    desc: string;
    attachmentUrl?: string;
    attachmentLabel?: string;
    certificateUrl?: string;
    logoUrl?: string;
}

export interface WorkItem {
    role: string;
    company: string;
    startDate: string;
    endDate?: string;
    details: string[];
    attachmentUrl?: string;
    attachmentLabel?: string;
    certificateUrl?: string;
    appointmentLetterUrl?: string;
    experienceLetterUrl?: string;
    logoUrl?: string;
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
    role?: string;
    goal?: string;
    solution?: string;
    architectureUrl?: string;
    architectureDesc?: string;
    contributions?: string;
    challenges?: string;
    solutions?: string;
    backendStack?: string;
    aiStack?: string;
    databaseStack?: string;
    cloudStack?: string;
    features?: string;
    impact?: string;
    lessons?: string;
    future?: string;
    screenshots?: string;
    docsUrl?: string;
    apiDocsUrl?: string;
}

export interface PaperItem {
    title: string;
    authors: string;
    venue: string;
    publisher?: string;
    year: string;
    keywords?: string;
    doi?: string;
    type?: 'journal' | 'conference' | 'book-chapter';
    link?: string;
    documentUrl?: string;
    certificateUrl?: string;
    bibtex?: string;
}

export interface ActivityItem {
    role: string;
    organization: string;
    period: string;
    desc: string;
    certificateUrl?: string;
    attachmentUrl?: string;
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
        activities: SectionConfig;
        references: SectionConfig;
        blogs: SectionConfig;
        certifications: SectionConfig;
        contact: SectionConfig;
    };
    hero: {
        name: string;
        title: string;
        roles?: string[];
        description: string;
        avatarUrl?: string;
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
    activities: ActivityItem[];
    references: ReferenceItem[];
    blogs: BlogItem[];
    certifications: CertificationItem[];
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

const defaultPapers: PaperItem[] = [
    {
        title: "BDFlower: Growth stage flower image dataset for precision agriculture and floriculture",
        authors: "Aritra Das, Mohammad Rifat Ahmmad Rashid, Md Rakibul Hasan, Karib Shams, Raihan Ul Islam",
        venue: "Data in Brief",
        publisher: "Elsevier",
        year: "2026",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340926002982",
        type: "journal"
    },
    {
        title: "Temperature-Optimized Self-Supervised Contrastive Learning Enables Data-Efficient and Explainable Fabric Defect Detection",
        authors: "Raihan Ul Islam, Israt Jahan, Md Samiul Islam, Tomal Ahmed Pantho, Md Atik Ahammed, Mohammad Rifat Ahmmad Rashid, Ahmed Wasif Reza, Shamim H Ripon",
        venue: "IEEE Access",
        publisher: "IEEE",
        year: "2026",
        link: "https://ieeexplore.ieee.org/abstract/document/11457882",
        type: "journal"
    },
    {
        title: "Real-Time Sunflower Detection Using Semi-Supervised and Self-Supervised Deep Learning for Precision Agriculture",
        authors: "Fathhur Rahaman Sams, Sanjana Kazi Supti, Shayma Binte Hamid, Radin Junayed, KM Fahim A Bari, Md Junaeid Ali, Raiyan Gani, Karib Shams, Mohammad Rifat Ahmmad Rashid, Raihan Ul Islam",
        venue: "Smart Agricultural Technology",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2772375525009153",
        type: "journal"
    },
    {
        title: "Attention guided convolutional neural network with explainable AI for papaya leaf disease detection in edge and drone agricultural systems",
        authors: "Raiyan Gani, Maherun Nessa Isty, Mohammad Rifat Ahmmad Rashid, Jubaer Ahmed, Tasmia Islam, Mahamudul Hasan, Raihan Ul Islam, Shamim H Ripon, Ahmed Wasif Reza",
        venue: "Scientific Reports",
        publisher: "Nature Publishing Group UK",
        year: "2025",
        link: "https://www.nature.com/articles/s41598-025-25374-w",
        type: "journal"
    },
    {
        title: "A smartphone-based multi-criteria vegetable object detection dataset from Bangladesh",
        authors: "Sabrina Jahan, BM Shahria Alam, Ishraque Manzur, Tawhidur Rahman, Mahamudul Hasan, Raiyan Gani, Md Miskat Hossain, Karib Shams, Mohammad Rifat Ahmmad Rashid",
        venue: "Data in Brief",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340925010029",
        type: "journal"
    },
    {
        title: "A comprehensive coin dataset highlighting the numismatic heritage of Bangladesh",
        authors: "Mahamudul Hasan, Krittika Roy, Nowshin Tasnia, Mohammad Rifat Ahmmad Rashid",
        venue: "Data in Brief",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340925009333",
        type: "journal"
    },
    {
        title: "BERT-KAN: Enhancing bilingual sentiment analysis in bangladeshi E-commerce through fine-tuned large language models",
        authors: "Mohammad Rifat Ahmmad Rashid, Aritra Das, Kazi Ferdous Hasan, Md Rakibul Hasan, Mithila Sultana, Mahamudul Hasan, Raihan Ul Islam, Rashedul Amin Tuhin, M Saddam Hossain Khan",
        venue: "Natural Language Processing Journal",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2949719125000664",
        type: "journal"
    },
    {
        title: "Real-Time Monitoring of Oyster Mushroom Cultivation Using CCTV and Attention-Enhanced ShuffleNet-Based Explainable AI Techniques",
        authors: "Redown Ahmed, Tasnuva Tasnim Nova, Taniz Fatema Jarin, Md Miskat Hossain, Karib Shams, Mohammad Rifat Ahmmad Rashid",
        venue: "Smart Agricultural Technology",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2772375525008020",
        type: "journal"
    },
    {
        title: "Smartphone image dataset for turmeric plant leaf disease from Bangladesh spice fields",
        authors: "Jubaer Ahmed, Md Riyad Hossain, Raiyan Gani, Mohammad Rifat Ahmmad Rashid, Md Mahamudur Rahman, Tasfia Binte Jahangir, Md Samir Hossain",
        venue: "Data in Brief",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340925009059",
        type: "journal"
    },
    {
        title: "Grain by grain: A microscopic image dataset of rice varieties from Bangladeshi rice markets",
        authors: "Md Tahsin, Kazi Isat Mahazabin, Maksura Binte Rabbani Nuha, Akil Rahman Efad, Mariya Rahman Momo, Nishat Tasnim Niloy, M Saddam Hossain Khan, Rashedul Amin Tuhin, Mohammad Rifat Ahmmad Rashid, Raihan Ul Islam",
        venue: "Data in Brief",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340925007802",
        type: "journal"
    },
    {
        title: "Leveraging pre-trained models within a semi-supervised and explainable AI real-time framework: a pioneering paradigm for betel leaf disease detection",
        authors: "Tahsin, M., Nuha, M.B.R., Akter, S., Al Hossain, M., Rashid, M.R.A., Islam, R.U. and Hossain, M.S.",
        venue: "Journal of Agriculture and Food Research, 102142",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2666154325005137",
        type: "journal"
    },
    {
        title: "An ensemble learning framework with explainable AI for interpretable leaf disease detection",
        authors: "Rashid, M.R.A., Korim, M.A.E., Hasan, M., Ali, M.S., Islam, M.M., Jabid, T., Islam, R.U. and Islam, M.",
        venue: "Array, 26, 100386",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S259000562500013X",
        type: "journal"
    },
    {
        title: "RiceKernelEngine: benchmarking transfer learning models for microscopic images of rice kernel",
        authors: "Arnab, M.I., Nafisa, A.T., Tahsin, M., Morshed, M.M., Nuha, M.B., Ali, M.S., Hasan, M., Islam, M., Jabid, T., Rashid, M.R.A. and Islam, M.M.",
        venue: "Array, 100429",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2590005625000566",
        type: "journal"
    },
    {
        title: "Smartphone image dataset for machine learning-based monitoring and analysis of mango growth stages",
        authors: "Kabir, S., Akon, M.F., Rashid, M.R.A., Islam, M., Jabid, T., Islam, M.M. and Ali, M.S.",
        venue: "Data in Brief, 111780",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340925005074",
        type: "journal"
    },
    {
        title: "PaddyVarietyBD: classifying paddy variations of Bangladesh with a novel image dataset",
        authors: "Tahsin, M., Ibrahim, M., Nafisa, A.T., Nuha, M.B., Arnab, M.I., Ferdaus, M.H., Islam, M.M., Rashid, M.R., Jabid, T., Ali, M.S. and Niloy, N.T.",
        venue: "Data in Brief, 60, 111514",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S235234092500246X",
        type: "journal"
    },
    {
        title: "Comprehensive smartphone image dataset for fish species identification in Bangladesh's freshwater ecosystems",
        authors: "Sunny, S., Prodhan, S., Shakib, N., Rashid, M.R.A. and Mansoor, N.",
        venue: "Data in Brief, 111629",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340925003609",
        type: "journal"
    },
    {
        title: "A FixMatch framework for Alzheimer's disease classification: exploring the trade-off between supervision and performance",
        authors: "Hossain, A., Konok, U.H., Tahsin, M., Islam, R.U., Rashid, M.R.A., Hossain, M.S. and Andersson, K.",
        venue: "IEEE Access",
        publisher: "IEEE",
        year: "2025",
        link: "https://ieeexplore.ieee.org/document/10946883/",
        type: "journal"
    },
    {
        title: "Revival of muslin by phuti karpas plant identification with convolution neural network",
        authors: "Rizvee, R.A., Farrok, O., Hasan, M., Farhan, F., Islam, M.H., Hasan, M.K., Rahman, A., Islam, M., Ali, M.S., Jabid, T. and Rashid, M.R.",
        venue: "Array, 100428",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2590005625000554",
        type: "journal"
    },
    {
        title: "Drone-based dataset of annotated sunflower images from Bangladesh",
        authors: "Hossain, M.S., Rashid, M.R.A., Fahim, M., Ali, M.S., Islam, M., Islam, M.M., Ferdaus, M.H. and Niloy, N.T.",
        venue: "Data in Brief, 59, 111417",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340925001490",
        type: "journal"
    },
    {
        title: "Enhancing land management policy in Bangladesh: a blockchain-based framework for transparent and efficient land management",
        authors: "Rashid, M.R.A., Al Rafi, A., Islam, M.A., Sharkar, S.U., Rafi, Z.H., Hasan, M., Ali, M.S. and Khan, M.S.",
        venue: "Land Use Policy, 150, 107436",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/abs/pii/S0264837724003892",
        type: "journal"
    },
    {
        title: "TFP-BD: an image dataset for traffic flow and pedestrian movement analysis on Bangladeshi urban roads",
        authors: "Islam, M.M., Das, A., Shams, K., Hasan, M.R., Hasan, K.F., Rashid, M.R.A., Chowdhury, A., Ali, M.S., Islam, M., Shahjalal, M. and Masum, S.",
        venue: "Data in Brief, 59, 111398",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340925001301",
        type: "journal"
    },
    {
        title: "Smartphone image dataset for radish plant leaf disease classification from Bangladesh",
        authors: "Hasan, M., Gani, R., Rashid, M.R.A., Isty, M.N., Kamara, R. and Tarin, T.K.",
        venue: "Data in Brief, 58, 111263",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340924012253",
        type: "journal"
    },
    {
        title: "BDMANGO: an image dataset for identifying the variety of mango based on the mango leaves",
        authors: "Islam, M.M., Ahmed, M.J., Shafi, M.B., Das, A., Hasan, M.R., Al Rafi, A., Rashid, M.R.A., Niloy, N.T., Ali, M.S., Chowdhury, A. and Rasel, A.A.",
        venue: "Data in Brief, 58, 111241",
        publisher: "Elsevier",
        year: "2025",
        link: "https://www.sciencedirect.com/science/article/pii/S2352340924012034",
        type: "journal"
    },
    {
        title: "Improving sleep disorder diagnosis through optimized machine learning approaches",
        authors: "Jabid, T., Ali, M.S., Rashid, M.R.A., Islam, M.M., Ferdaus, M.H., Rasel, M.M.K., Jahan, M.R., Sharmin, S., Matin, M.M.H. and Ali, M.A.",
        venue: "IEEE Access, IEEE",
        publisher: "IEEE",
        year: "2025",
        link: "https://ieeexplore.ieee.org/document/10856004",
        type: "journal"
    },
    {
        title: "An extensive photographic dataset to classify laptop components for automating e-waste management by recycling old laptops",
        authors: "Islam, M., Niloy, N.T., Hasan, I., Rupin, R.J., Chowdhury, M., Fahim, S.F., Ashhab, M.M., Islam, M.M., Ali, M.S. and Rashid, M.R.A.",
        venue: "Data in Brief, 57, 111122",
        publisher: "Elsevier",
        year: "2024",
        type: "journal"
    },
    {
        title: "An extensive image dataset for deep learning-based classification of rice kernel varieties in Bangladesh",
        authors: "Tahsin, M., Matin, M.M.H., Khandaker, M., Reemu, R.S., Arnab, M.I., Rashid, M.R.A., Rasel, M.M.K., Islam, M.M., Islam, M. and Ali, M.S.",
        venue: "Data in Brief, 57, 111109",
        publisher: "Elsevier",
        year: "2024",
        type: "journal"
    },
    {
        title: "Comprehensive smartphone image dataset for bean and cowpea plant leaf disease detection and freshness assessment from Bangladesh vegetable fields",
        authors: "Hasan, M., Gani, R., Rashid, M.R.A., Kamara, R., Tarin, T.K. and Rabbi, S.F.",
        venue: "Data in Brief, 57, 111023",
        publisher: "Elsevier",
        year: "2024",
        type: "journal"
    },
    {
        title: "REMP: a unique dataset of rare and endangered medicinal plants in Bangladesh for sustainable healing and biodiversity conservation",
        authors: "Islam, M.M., Rahman, S., Hoque, N., Mamun, M.A., Moheuddin, M.S., Ali, M.S., Rashid, M.R.A. and others",
        venue: "Data in Brief, 57, 110895",
        publisher: "Elsevier",
        year: "2024",
        type: "journal"
    },
    {
        title: "Transforming agri-food value chains in Bangladesh: a practical application of blockchain for traceability and fair pricing",
        authors: "Rashid, M.R.A., Hasan, M., Islam, M.A., Tasnim, S.T., Taifa, R.J., Mahbub, S., Mansoor, N. and others",
        venue: "Heliyon, 10(21)",
        publisher: "Elsevier",
        year: "2024",
        type: "journal"
    },
    {
        title: "Comprehensive smartphone image dataset for plant leaf disease detection and freshness assessment from Bangladesh vegetable fields",
        authors: "Hasan, M., Gani, R., Rashid, M.R.A., Tarin, T.K., Kamara, R., Mou, M.Y. and Rabbi, S.F.",
        venue: "Data in Brief, 56, 110775",
        publisher: "Elsevier",
        year: "2024",
        type: "journal"
    },
    {
        title: "A comprehensive dataset and deep learning approach for misinformation detection on social media in Bangladesh",
        authors: "Rashid, M.R.A., Roy, R., Rahman, D.M.S., Saleh, M.A., Khan, A.A.H., Rayhan, M.A., Ahmed, K.F., Monsoor, N. and Hasan, M.",
        venue: "International Journal of Computing and Digital Systems, 16(1), 1–10",
        year: "2024",
        type: "journal"
    },
    {
        title: "Smartphone image dataset to distinguish healthy and unhealthy leaves in papaya orchards in Bangladesh",
        authors: "Gani, R., Rashid, M.R.A., Ahmed, J., Isty, M.N., Islam, M., Hasan, M., Ferdaus, M.H. and Ali, M.S.",
        venue: "Data in Brief, 55, 110599",
        publisher: "Elsevier",
        year: "2024",
        type: "journal"
    },
    {
        title: "ArsenicSkinImageBD: A comprehensive image dataset to classify affected and healthy skin of arsenic-affected people",
        authors: "Emu, I.A., Niloy, N.T., Karim, B.M.A., Chowdhury, A., Johora, F.T., Hasan, M., Mittra, T., Rashid, M.R.A., Jabid, T., Islam, M., Ali, M.S.",
        venue: "Data in Brief, 52, 110016",
        publisher: "Elsevier",
        year: "2024",
        type: "journal"
    },
    {
        title: "Design of a real-time crime monitoring system using deep learning techniques",
        authors: "Mukto, M.M., Hasan, M., Mahmud, M.M.A., Haque, I., Ahmed, M.A., Jabid, T., Ali, M.S., Rashid, M.R.A., Islam, M.M., Islam, M.",
        venue: "Intelligent Systems with Applications, 21, 200311",
        publisher: "Elsevier",
        year: "2024",
        type: "journal"
    },
    {
        title: "Comprehensive dataset of annotated rice panicle image from Bangladesh",
        authors: "M.R.A. Rashid, Md S. Hossain, M.D. Fahim, Md S. Islam, R.H. Prito, Md S.A. Sheikh, Md S. Ali, M. Hasan, and M. Islam",
        venue: "Data in Brief, 51, 109772",
        publisher: "Elsevier",
        year: "2023",
        link: "https://doi.org/10.1016/j.dib.2023.109772",
        type: "journal"
    },
    {
        title: "A Comprehensive Dataset for Sentiment and Emotion Classification from Bangladesh E-Commerce Reviews",
        authors: "M.R.A. Rashid, K.F. Hasan, Md. R. Hasan, A. Das, M. Sultana, M. Hasan",
        venue: "Data in Brief, 2023",
        publisher: "Elsevier",
        year: "2023",
        type: "journal"
    },
    {
        title: "LeafNet: A proficient convolutional neural network for detecting seven prominent mango leaf diseases",
        authors: "Rizvee, R.A., Orpa, T.H., Ahnaf, A., Kabir, M.A., Rashid, M.R.A., Islam, M.M., Islam, M., Jabid, T., Ali, M.S.",
        venue: "Journal of Agriculture and Food Research, 14, 100787",
        publisher: "Elsevier",
        year: "2023",
        link: "https://doi.org/10.1016/j.jafr.2023.100787",
        type: "journal"
    },
    {
        title: "Contactless Surveillance for Preventing Wind-Borne Disease using Deep Learning Approach",
        authors: "Joy, M.M.A., Bushra, I.J., Ayshee, R., Hasan, S., Hassan, S.B., Ali, M.S., Farrok, O., Rashid, M.R.A. and Islam, M.",
        venue: "IJACSA, 13(11)",
        year: "2022",
        link: "http://dx.doi.org/10.14569/IJACSA.2022.0131190",
        type: "journal"
    },
    {
        title: "Image based surface damage detection of renewable energy installations using a unified deep learning approach",
        authors: "ASM Shihavuddin, Mohammad Rifat Ahmmad Rashid, Md Hasan Maruf, Muhammad Abul Hasan, Mohammad Asif ul Haq, Ratil H. Ashique, Ahmed Al Mansur",
        venue: "Energy Reports, 7, 4566–4576",
        publisher: "Elsevier",
        year: "2021",
        type: "journal"
    },
    {
        title: "Comprehensive Interaction Model for Cloud Management",
        authors: "Md. Nasim Adnan, Md. Majharul Haque, Mohammad Rifat Ahmmad Rashid, Mohammod Akbar Kabir, Abu Sadat Mohammad Yasin, Muhammad Shakil Pervez",
        venue: "IJACSA, 11(8), 2020",
        year: "2020",
        type: "journal"
    },
    {
        title: "A quality assessment approach for evolving knowledge bases",
        authors: "Rashid, Mohammad, Marco Torchiano, Giuseppe Rizzo, Nandana Mihindukulasooriya, and Oscar Corcho",
        venue: "Semantic Web, 10(2), 349–383",
        publisher: "IOS Press",
        year: "2019",
        type: "journal"
    },
    {
        title: "Completeness and consistency analysis for evolving knowledge bases",
        authors: "Rashid, Mohammad Rifat Ahmmad, Giuseppe Rizzo, Marco Torchiano, Nandana Mihindukulasooriya, Oscar Corcho, and Raul Garcia-Castro",
        venue: "Journal of Web Semantics, 54, 48–71",
        publisher: "Elsevier",
        year: "2019",
        type: "journal"
    },
    {
        title: "MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis",
        authors: "Shah Abdul Mazid, Mohammad Rifat Ahmmad Rashid",
        venue: "28th International Conference on Computer and Information Technology (ICCIT 2025)",
        year: "2025",
        type: "conference"
    }
];

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
        description: "A CSE student focused on Intelligent Systems & Data Science."
    },
    about: {
        bio: "I am an AI Engineer at Neuroxyte and a Computer Science & Engineering graduate from East West University (majoring in Intelligent Systems & Data Science). Driven by AI innovation, research, and hackathons, my work focuses on building explainable, data-driven systems that bridge the gap between academic research and production engineering.\n\n**Engineering Focus**\n- **Production AI Systems:** Architecting Multi-Agent RAG platforms, production LLM pipelines, and computer vision applications.\n- **System Deployment:** Scaling AI microservices and optimizing model latency for real-time inference.\n\n**Research Focus**\n- **Medical Imaging & Vision:** Diagnostics, interpretable machine learning using Grad-CAM, and Vision-Language Transformers.\n- **Academic Contribution:** Bridging production-grade engineering with explainable AI research.",
        age: "24",
        projects: "15+",
        bioLinks: [
            { label: 'GitHub Profile', url: GITHUB_URL, icon: 'github' },
            { label: 'Google Scholar', url: SCHOLAR_URL, icon: 'scholar' },
            { label: 'ORCID iD', url: ORCID_URL, icon: 'orcid' },
            { label: 'ResearchGate', url: RESEARCHGATE_URL, icon: 'researchgate' }
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
    projects: [],
    papers: defaultPapers,

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
        github: GITHUB_URL,
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

export const resolveUrl = (url: string | undefined): string => {
    if (!url) return '';

    if (url.startsWith('https://') || (url.startsWith('http://') && !url.includes('localhost'))) {
        return url;
    }

    if (url.includes('localhost:3001/')) {
        const path = url.split('localhost:3001')[1];
        const isDev = window.location.hostname === 'localhost';
        return isDev ? `http://localhost:3001${path}` : path;
    }

    const isDev = window.location.hostname === 'localhost';
    const backendUrl = 'http://localhost:3001';
    
    if (url.startsWith('/') && isDev) {
        return `${backendUrl}${url}`;
    }

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

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/portfolio');
                if (res.ok) {
                    const apiData = await res.json();
                    if (apiData && typeof apiData === 'object' && Object.keys(apiData).length > 0) {
                        const merged = {
                            ...defaultData,
                            ...apiData,
                            sections: { ...defaultData.sections, ...(apiData.sections || {}) },
                            contact: { ...defaultData.contact, ...(apiData.contact || {}) },
                            papers: (apiData.papers && apiData.papers.length > 0) ? apiData.papers : defaultData.papers
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

            const saved = localStorage.getItem('portfolio_data');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const merged = {
                        ...defaultData,
                        ...parsed,
                        sections: { ...defaultData.sections, ...(parsed.sections || {}) },
                        contact: { ...defaultData.contact, ...(parsed.contact || {}) },
                        papers: (parsed.papers && parsed.papers.length > 0) ? parsed.papers : defaultData.papers
                    };
                    setData(sanitizeData(merged));
                    return;
                } catch {
                    // fallback
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
        
        localStorage.setItem('portfolio_data', JSON.stringify(sanitized));
        
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
