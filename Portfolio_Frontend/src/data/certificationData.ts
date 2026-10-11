export type CredentialCategory = 'professional' | 'course' | 'badge';

export type CredentialType = 
  | 'Professional Certificate'
  | 'Specialization'
  | 'Course'
  | 'Exam Prep';

export type VerificationStatus = 'verified' | 'completed' | 'in-progress' | 'curriculum';

export interface SubCourseItem {
  id: string;
  order: number;
  title: string;
  status: VerificationStatus;
  credlyBadgeId?: string;
  credlyUrl?: string;
  badgeImageUrl?: string;
  completionDate?: string;
  credentialId?: string;
}

export interface CredentialRecord {
  id: string;
  title: string;
  issuer: string;
  category: CredentialCategory;
  credentialType: CredentialType;
  date?: string;
  credentialId?: string;
  verificationUrl?: string;
  badgeUrl?: string;
  credlyUrl?: string;
  credlyBadgeId?: string;
  sourcePlatform: 'Coursera' | 'Credly' | 'AWS' | 'Microsoft' | 'CertNexus' | 'Google' | 'IBM';
  status: VerificationStatus;
  skills?: string[];
  subCourses?: SubCourseItem[];
  programNote?: string;
}

export interface CredlyBadgeItem {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  imageUrl: string;
  publicUrl: string;
  parentRecordId?: string;
}

/**
 * EXACT 9 Verified Credly Badges from official profile:
 * https://www.credly.com/users/shah-abdul-mazid
 * Uses official Credly CDN image URLs — NO local badges stored in public/ or dist/.
 */
export const OFFICIAL_CREDLY_BADGES: CredlyBadgeItem[] = [
  {
    id: "6a8e7540-1d98-455d-af07-2559ed272e3b",
    name: "IBM Data Science Professional Certificate (V3)",
    issuer: "IBM",
    issuedDate: "Sep 23, 2026",
    imageUrl: "https://images.credly.com/images/42ce4209-8839-431a-9046-f2ce2e72e04b/Coursera_20Data_20Science_20Professional_20Certificate.png",
    publicUrl: "https://www.credly.com/badges/6a8e7540-1d98-455d-af07-2559ed272e3b/public_url",
    parentRecordId: "ibm-data-science-prof"
  },
  {
    id: "dc581941-4adf-4d13-9672-5c7b5902b056",
    name: "Databases and SQL for Data Science",
    issuer: "IBM",
    issuedDate: "Sep 23, 2026",
    imageUrl: "https://images.credly.com/images/f2573aac-d21c-483d-acda-afaa366b4f51/image.png",
    publicUrl: "https://www.credly.com/badges/dc581941-4adf-4d13-9672-5c7b5902b056/public_url",
    parentRecordId: "ibm-data-science-prof"
  },
  {
    id: "cd320125-d418-4a23-883e-845afef9c6d9",
    name: "Data Visualization with Python",
    issuer: "IBM",
    issuedDate: "Sep 23, 2026",
    imageUrl: "https://images.credly.com/images/9da3eedf-fda3-4e81-bb46-d174b4699bf1/image.png",
    publicUrl: "https://www.credly.com/badges/cd320125-d418-4a23-883e-845afef9c6d9/public_url",
    parentRecordId: "ibm-data-science-prof"
  },
  {
    id: "a6f34c20-aa81-43c2-be32-680ad03dbf9e",
    name: "Generative AI Essentials for Data Science",
    issuer: "IBM",
    issuedDate: "Sep 23, 2026",
    imageUrl: "https://images.credly.com/images/1dc40257-c856-4e6b-9a92-29be936a9e7c/image.png",
    publicUrl: "https://www.credly.com/badges/a6f34c20-aa81-43c2-be32-680ad03dbf9e/public_url",
    parentRecordId: "ibm-data-science-prof"
  },
  {
    id: "56cc091b-a87c-4af4-8d23-8ea151100c3e",
    name: "Applied Data Science Capstone",
    issuer: "IBM",
    issuedDate: "Sep 23, 2026",
    imageUrl: "https://images.credly.com/images/169512d3-cef6-43e3-bec8-e6af2723a076/image.png",
    publicUrl: "https://www.credly.com/badges/56cc091b-a87c-4af4-8d23-8ea151100c3e/public_url",
    parentRecordId: "ibm-data-science-prof"
  },
  {
    id: "439040fd-48ae-47f7-87b1-bf7158c73659",
    name: "Data Scientist Career Guide and Interview Preparation",
    issuer: "IBM",
    issuedDate: "Sep 23, 2026",
    imageUrl: "https://images.credly.com/images/6eb08161-0425-4fc0-b66c-a1138dee7953/image.png",
    publicUrl: "https://www.credly.com/badges/439040fd-48ae-47f7-87b1-bf7158c73659/public_url",
    parentRecordId: "ibm-data-science-prof"
  },
  {
    id: "676e65a6-de2b-481b-a559-610a6f7417fb",
    name: "Artificial Intelligence Essentials V2",
    issuer: "IBM",
    issuedDate: "Sep 23, 2026",
    imageUrl: "https://images.credly.com/images/3e199561-bc4a-4621-9361-340fc43d997e/Coursera_20Artificial_20Intelligence_20Essentials_20V2.png",
    publicUrl: "https://www.credly.com/badges/676e65a6-de2b-481b-a559-610a6f7417fb/public_url"
  },
  {
    id: "d172156c-c193-4172-9c79-829d14b9d93e",
    name: "Google AI Fundamentals",
    issuer: "Google",
    issuedDate: "Sep 23, 2026",
    imageUrl: "https://images.credly.com/images/36ecc7ff-8ccf-4bd8-83a7-6f35797e0b64/blob",
    publicUrl: "https://www.credly.com/badges/d172156c-c193-4172-9c79-829d14b9d93e/public_url",
    parentRecordId: "google-ai-prof"
  },
  {
    id: "a257e2c0-3b13-4d63-aa31-1a2d358c4f99",
    name: "Google AI for Brainstorming and Planning",
    issuer: "Google",
    issuedDate: "Sep 23, 2026",
    imageUrl: "https://images.credly.com/images/fb6dc8be-1471-4aab-b2ab-da1f76080ecf/blob",
    publicUrl: "https://www.credly.com/badges/a257e2c0-3b13-4d63-aa31-1a2d358c4f99/public_url",
    parentRecordId: "google-ai-prof"
  }
];

/**
 * Master canonical records for certifications.
 * Uses remote official CDN URLs or Cloudinary URLs (from Admin Dashboard upload).
 */
export const CANONICAL_CREDENTIALS: CredentialRecord[] = [
  // ── 1. GOOGLE AI PROFESSIONAL CERTIFICATE (PARENT WITH 8 SUB-COURSES) ──
  {
    id: "google-ai-prof",
    title: "Google AI Professional Certificate",
    issuer: "Google",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "2026",
    credentialId: "3KU5TQJHFBO2",
    verificationUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/3KU5TQJHFBO2",
    badgeUrl: "https://res.cloudinary.com/dxjv3zwse/image/upload/v1791369593/portfolio_uploads/stream_raryfe.png",
    sourcePlatform: "Google",
    status: "verified",
    programNote: "Designed by Google experts to build career-ready AI fluency across 6 domains with 20+ hands-on projects, from prompt engineering and data analysis to vibe coding and custom AI app deployment.",
    skills: ["Artificial Intelligence", "Generative AI", "Prompt Engineering", "Planning", "Machine Learning", "Brainstorming", "Data Wrangling", "Business Communication", "Data Visualization", "AI powered creativity", "Research", "Application Development", "Debugging", "Vibe coding"],
    subCourses: [
      {
        id: "google-ai-c1",
        order: 1,
        title: "AI Fundamentals (3h)",
        status: "verified",
        credlyBadgeId: "d172156c-c193-4172-9c79-829d14b9d93e",
        credlyUrl: "https://www.credly.com/badges/d172156c-c193-4172-9c79-829d14b9d93e/public_url",
        badgeImageUrl: "https://images.credly.com/images/36ecc7ff-8ccf-4bd8-83a7-6f35797e0b64/blob",
        completionDate: "Sep 2026"
      },
      {
        id: "google-ai-c2",
        order: 2,
        title: "AI for Brainstorming and Planning (1h)",
        status: "verified",
        credlyBadgeId: "a257e2c0-3b13-4d63-aa31-1a2d358c4f99",
        credlyUrl: "https://www.credly.com/badges/a257e2c0-3b13-4d63-aa31-1a2d358c4f99/public_url",
        badgeImageUrl: "https://images.credly.com/images/fb6dc8be-1471-4aab-b2ab-da1f76080ecf/blob",
        completionDate: "Sep 2026"
      },
      {
        id: "google-ai-c3",
        order: 3,
        title: "AI for Research and Insights (1h)",
        status: "completed",
        credlyUrl: "https://www.coursera.org/learn/google-ai-for-research-and-insights?specialization=google-ai",
        completionDate: "Sep 2026"
      },
      {
        id: "google-ai-c4",
        order: 4,
        title: "AI for Writing and Communicating (1h)",
        status: "completed",
        credlyUrl: "https://www.coursera.org/learn/google-ai-for-writing-and-communicating?specialization=google-ai",
        completionDate: "Sep 2026"
      },
      {
        id: "google-ai-c5",
        order: 5,
        title: "AI for Content Creation (2h)",
        status: "completed",
        credlyUrl: "https://www.coursera.org/learn/google-ai-for-content-creation?specialization=google-ai",
        completionDate: "Sep 2026"
      },
      {
        id: "google-ai-c6",
        order: 6,
        title: "AI for Data Analysis (1h)",
        status: "completed",
        credlyUrl: "https://www.coursera.org/learn/google-ai-for-data-analysis?specialization=google-ai",
        completionDate: "Sep 2026"
      },
      {
        id: "google-ai-c7",
        order: 7,
        title: "AI for App Building (2h)",
        status: "completed",
        credlyUrl: "https://www.coursera.org/learn/google-ai-for-app-building?specialization=google-ai",
        completionDate: "Sep 2026"
      },
      {
        id: "google-ai-c8",
        order: 8,
        title: "AI for App Deployment (2h)",
        status: "completed",
        credlyUrl: "https://www.coursera.org/learn/google-ai-for-app-deployment?specialization=google-ai",
        completionDate: "Sep 2026"
      }
    ]
  },

  // ── 2. IBM DATA SCIENCE PROFESSIONAL CERTIFICATE (V3) (PARENT WITH 12-COURSE CURRICULUM) ──
  {
    id: "ibm-data-science-prof",
    title: "IBM Data Science Professional Certificate (V3)",
    issuer: "IBM",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "May 25, 2026",
    credentialId: "CJ6JB12049ER",
    verificationUrl: "https://www.coursera.org/verify/professional-cert/CJ6JB12049ER",
    credlyUrl: "https://www.credly.com/badges/6a8e7540-1d98-455d-af07-2559ed272e3b/public_url",
    credlyBadgeId: "6a8e7540-1d98-455d-af07-2559ed272e3b",
    badgeUrl: "https://images.credly.com/images/42ce4209-8839-431a-9046-f2ce2e72e04b/Coursera_20Data_20Science_20Professional_20Certificate.png",
    sourcePlatform: "IBM",
    status: "verified",
    programNote: "Demonstrated career readiness in data science: Python development (SciPy, Pandas, NumPy), SQL & relational databases, machine learning model construction & evaluation, Jupyter notebooks, and Generative AI techniques.",
    skills: ["Data Science", "Python", "SQL", "Machine Learning", "Generative AI", "Data Analysis", "Data Visualization", "Jupyter Notebooks", "Pandas", "NumPy", "SciPy", "SciKitLearn", "Matplotlib", "Seaborne", "Classification", "Clustering", "Regression", "Model Selection", "Recommender Systems", "Db2", "Watson", "RStudio"],
    subCourses: [
      {
        id: "ibm-ds-c1",
        order: 1,
        title: "What is Data Science?",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c2",
        order: 2,
        title: "Tools for Data Science",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c3",
        order: 3,
        title: "Data Science Methodology",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c4",
        order: 4,
        title: "Python for Data Science, AI & Development",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c5",
        order: 5,
        title: "Python Project for Data Science",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c6",
        order: 6,
        title: "Databases and SQL for Data Science with Python",
        status: "verified",
        credlyBadgeId: "dc581941-4adf-4d13-9672-5c7b5902b056",
        credlyUrl: "https://www.credly.com/badges/dc581941-4adf-4d13-9672-5c7b5902b056/public_url",
        badgeImageUrl: "https://images.credly.com/images/f2573aac-d21c-483d-acda-afaa366b4f51/image.png",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c7",
        order: 7,
        title: "Data Analysis with Python",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c8",
        order: 8,
        title: "Data Visualization with Python",
        status: "verified",
        credlyBadgeId: "cd320125-d418-4a23-883e-845afef9c6d9",
        credlyUrl: "https://www.credly.com/badges/cd320125-d418-4a23-883e-845afef9c6d9/public_url",
        badgeImageUrl: "https://images.credly.com/images/9da3eedf-fda3-4e81-bb46-d174b4699bf1/image.png",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c9",
        order: 9,
        title: "Machine Learning with Python",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c10",
        order: 10,
        title: "Applied Data Science Capstone",
        status: "verified",
        credlyBadgeId: "56cc091b-a87c-4af4-8d23-8ea151100c3e",
        credlyUrl: "https://www.credly.com/badges/56cc091b-a87c-4af4-8d23-8ea151100c3e/public_url",
        badgeImageUrl: "https://images.credly.com/images/169512d3-cef6-43e3-bec8-e6af2723a076/image.png",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c11",
        order: 11,
        title: "Generative AI: Elevate Your Data Science Career",
        status: "verified",
        credlyBadgeId: "a6f34c20-aa81-43c2-be32-680ad03dbf9e",
        credlyUrl: "https://www.credly.com/badges/a6f34c20-aa81-43c2-be32-680ad03dbf9e/public_url",
        badgeImageUrl: "https://images.credly.com/images/1dc40257-c856-4e6b-9a92-29be936a9e7c/image.png",
        completionDate: "May 2026"
      },
      {
        id: "ibm-ds-c12",
        order: 12,
        title: "Data Scientist Career Guide and Interview Preparation",
        status: "verified",
        credlyBadgeId: "439040fd-48ae-47f7-87b1-bf7158c73659",
        credlyUrl: "https://www.credly.com/badges/439040fd-48ae-47f7-87b1-bf7158c73659/public_url",
        badgeImageUrl: "https://images.credly.com/images/6eb08161-0425-4fc0-b66c-a1138dee7953/image.png",
        completionDate: "May 2026"
      }
    ]
  },

  // ── 3. OTHER PROFESSIONAL CERTIFICATES ──
  {
    id: "ibm-ai-developer",
    title: "IBM AI Developer",
    issuer: "IBM",
    category: "professional",
    credentialType: "Specialization",
    date: "May 18, 2026",
    credentialId: "EK2UWJK3XJTE",
    verificationUrl: "https://www.coursera.org/verify/professional-cert/EK2UWJK3XJTE",
    sourcePlatform: "IBM",
    status: "verified",
    programNote: "Comprehensive 10-course IBM Specialization covering software engineering, Python, Flask, HTML/CSS/JS, Generative AI application development, and career preparation.",
    skills: ["Software Engineering", "Artificial Intelligence", "Generative AI", "Prompt Engineering", "HTML, CSS, & JavaScript", "Python", "Flask", "AI Applications", "ChatGPT", "LLM", "IBM Cloud", "LangChain"],
    subCourses: [
      {
        id: "ibm-aid-c1",
        order: 1,
        title: "Introduction to Software Engineering",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aid-c2",
        order: 2,
        title: "Introduction to Artificial Intelligence (AI)",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aid-c3",
        order: 3,
        title: "Generative AI: Introduction and Applications",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aid-c4",
        order: 4,
        title: "Generative AI: Prompt Engineering Basics",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aid-c5",
        order: 5,
        title: "Introduction to HTML, CSS, & JavaScript",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aid-c6",
        order: 6,
        title: "Python for Data Science, AI & Development",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aid-c7",
        order: 7,
        title: "Developing AI Applications with Python and Flask",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aid-c8",
        order: 8,
        title: "Building Generative AI-Powered Applications with Python",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aid-c9",
        order: 9,
        title: "Generative AI: Elevate your Software Development Career",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aid-c10",
        order: 10,
        title: "Software Developer Career Guide and Interview Preparation",
        status: "completed",
        completionDate: "May 2026"
      }
    ]
  },
  {
    id: "ibm-ai-engineering",
    title: "IBM AI Engineering",
    issuer: "IBM",
    category: "professional",
    credentialType: "Specialization",
    date: "May 16, 2026",
    credentialId: "CRH40FK3BKPQ",
    verificationUrl: "https://coursera.org/verify/professional-cert/CRH40FK3BKPQ",
    sourcePlatform: "IBM",
    status: "verified",
    programNote: "Comprehensive 13-course IBM Specialization covering Machine Learning, Deep Learning (Keras, PyTorch, TensorFlow), Transformers, LLM fine-tuning, RAG, and AI agent architectures with LangChain.",
    skills: ["Deep Learning", "Machine Learning", "PyTorch", "TensorFlow", "Keras", "Neural Networks", "Generative AI", "LLMs", "Transformers", "Fine-Tuning", "RAG", "LangChain", "AI Agents", "Computer Vision", "NLP"],
    subCourses: [
      {
        id: "ibm-aie-c1",
        order: 1,
        title: "Machine Learning with Python",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c2",
        order: 2,
        title: "Introduction to Deep Learning & Neural Networks with Keras",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c3",
        order: 3,
        title: "Deep Learning with Keras and Tensorflow",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c4",
        order: 4,
        title: "Introduction to Neural Networks and PyTorch",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c5",
        order: 5,
        title: "Deep Learning with PyTorch",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c6",
        order: 6,
        title: "AI Capstone Project with Deep Learning",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c7",
        order: 7,
        title: "Generative AI and LLMs: Architecture and Data Preparation",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c8",
        order: 8,
        title: "Gen AI Foundational Models for NLP & Language Understanding",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c9",
        order: 9,
        title: "Generative AI Language Modeling with Transformers",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c10",
        order: 10,
        title: "Generative AI Engineering and Fine-Tuning Transformers",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c11",
        order: 11,
        title: "Generative AI Advanced Fine-Tuning for LLMs",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c12",
        order: 12,
        title: "Fundamentals of AI Agents Using RAG and LangChain",
        status: "completed",
        completionDate: "May 2026"
      },
      {
        id: "ibm-aie-c13",
        order: 13,
        title: "Project: Generative AI Applications with RAG and LangChain",
        status: "completed",
        completionDate: "May 2026"
      }
    ]
  },
  {
    id: "ibm-genai-engineering",
    title: "IBM Generative AI Engineering",
    issuer: "IBM",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "2026",
    credentialId: "DSNNEP85OO8Z",
    verificationUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/DSNNEP85OO8Z",
    sourcePlatform: "IBM",
    status: "verified",
    programNote: "16-course IBM Specialization covering the full stack of Generative AI engineering: prompt engineering, Python, Flask, deep learning, LLMs, fine-tuning transformers, RAG, and agentic AI.",
    skills: ["Generative AI", "Prompt Engineering", "Large Language Models", "Fine-tuning", "Vector Databases", "Embeddings"],
    subCourses: [
      { id: "ibm-genaie-c1", order: 1, title: "Introduction to Artificial Intelligence (AI)", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c2", order: 2, title: "Generative AI: Introduction and Applications", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c3", order: 3, title: "Generative AI: Prompt Engineering Basics", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c4", order: 4, title: "Python for Data Science, AI & Development", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c5", order: 5, title: "Developing AI Applications with Python and Flask", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c6", order: 6, title: "Building Generative AI-Powered Applications with Python", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c7", order: 7, title: "Data Analysis with Python", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c8", order: 8, title: "Machine Learning with Python", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c9", order: 9, title: "Introduction to Deep Learning & Neural Networks with Keras", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c10", order: 10, title: "Generative AI and LLMs: Architecture and Data Preparation", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c11", order: 11, title: "Gen AI Foundational Models for NLP & Language Understanding", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c12", order: 12, title: "Generative AI Language Modeling with Transformers", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c13", order: 13, title: "Generative AI Engineering and Fine-Tuning Transformers", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c14", order: 14, title: "Generative AI Advanced Fine-Tuning for LLMs", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c15", order: 15, title: "Fundamentals of AI Agents Using RAG and LangChain", status: "completed", completionDate: "2026" },
      { id: "ibm-genaie-c16", order: 16, title: "Project: Generative AI Applications with RAG and LangChain", status: "completed", completionDate: "2026" }
    ]
  },
  {
    id: "aws-bedrock-genai",
    title: "AWS Generative AI and AI Agents with Amazon Bedrock",
    issuer: "AWS",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "May 17, 2026",
    credentialId: "IEBJJK8W4GA0",
    verificationUrl: "https://www.coursera.org/verify/professional-cert/IEBJJK8W4GA0",
    sourcePlatform: "AWS",
    status: "verified",
    programNote: "3-course AWS specialization covering generative AI application development, Amazon Bedrock usage, and advanced customization, optimization & automation of AI agents.",
    skills: ["Amazon Bedrock", "Generative AI Agents", "Agentic Workflows", "LangChain", "Responsible AI", "Model Optimization"],
    subCourses: [
      { id: "aws-bedrock-c1", order: 1, title: "Getting Started with AWS Generative AI for Developers", status: "completed", completionDate: "May 2026" },
      { id: "aws-bedrock-c2", order: 2, title: "Generative AI Applications with Amazon Bedrock", status: "completed", completionDate: "May 2026" },
      { id: "aws-bedrock-c3", order: 3, title: "Amazon Bedrock Customization, Optimization & Automation", status: "completed", completionDate: "May 2026" }
    ]
  },
  {
    id: "ms-azure-dp100",
    title: "Microsoft Azure Data Scientist Associate (DP-100) Exam Prep",
    issuer: "Microsoft",
    category: "professional",
    credentialType: "Exam Prep",
    date: "2026",
    credentialId: "IMA89TK87FLE",
    verificationUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/IMA89TK87FLE",
    sourcePlatform: "Microsoft",
    status: "verified",
    programNote: "5-course Microsoft Azure specialization preparing for the DP-100 exam: machine learning, Azure ML workspace, model pipelines, Azure Databricks, and exam preparation.",
    skills: ["Azure Machine Learning", "Model Training", "Pipeline Automation", "MLOps", "Model Deployment"],
    subCourses: [
      { id: "ms-dp100-c1", order: 1, title: "Create Machine Learning Models in Microsoft Azure", status: "completed", completionDate: "2026" },
      { id: "ms-dp100-c2", order: 2, title: "Microsoft Azure Machine Learning for Data Scientists", status: "completed", completionDate: "2026" },
      { id: "ms-dp100-c3", order: 3, title: "Build and Operate Machine Learning Solutions with Azure", status: "completed", completionDate: "2026" },
      { id: "ms-dp100-c4", order: 4, title: "Perform data science with Azure Databricks", status: "completed", completionDate: "2026" },
      { id: "ms-dp100-c5", order: 5, title: "Prepare for DP-100: Data Science on Microsoft Azure Exam", status: "completed", completionDate: "2026" }
    ]
  },
  {
    id: "ms-ai-ml-engineering",
    title: "Microsoft AI & ML Engineering",
    issuer: "Microsoft",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "2026",
    credentialId: "BY0I1QB14V0Q",
    verificationUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/BY0I1QB14V0Q",
    badgeUrl: "https://res.cloudinary.com/dxjv3zwse/image/upload/v1791368527/portfolio_uploads/stream_sydx3e.png",
    sourcePlatform: "Microsoft",
    status: "verified",
    programNote: "5-course Microsoft specialization spanning AI/ML foundations, algorithms, Azure deployment, intelligent agent building, and advanced ML capstone techniques.",
    skills: ["Machine Learning", "Deep Learning", "Azure Cognitive Services", "Natural Language Processing", "Computer Vision"],
    subCourses: [
      { id: "ms-aiml-c1", order: 1, title: "Foundations of AI and Machine Learning", status: "completed", completionDate: "2026" },
      { id: "ms-aiml-c2", order: 2, title: "AI and Machine Learning Algorithms and Techniques", status: "completed", completionDate: "2026" },
      { id: "ms-aiml-c3", order: 3, title: "Building Intelligent Troubleshooting Agents", status: "completed", completionDate: "2026" },
      { id: "ms-aiml-c4", order: 4, title: "Microsoft Azure for AI and Machine Learning", status: "completed", completionDate: "2026" },
      { id: "ms-aiml-c5", order: 5, title: "Advanced AI and Machine Learning Techniques and Capstone", status: "completed", completionDate: "2026" }
    ]
  },
  {
    id: "deeplearning-dataeng",
    title: "DeepLearning.AI Data Engineering",
    issuer: "DeepLearning.AI",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "2026",
    credentialId: "MOHN5RMGP99D",
    verificationUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/MOHN5RMGP99D",
    sourcePlatform: "Coursera",
    status: "verified",
    programNote: "4-course specialization by DeepLearning.AI & AWS covering the full data engineering lifecycle: ingestion, storage, modeling, transformation, and serving.",
    skills: ["Data Pipelines", "ETL Architecture", "Data Modeling", "Distributed Systems", "SQL & NoSQL"],
    subCourses: [
      { id: "dlai-de-c1", order: 1, title: "Introduction to Data Engineering", status: "completed", completionDate: "2026" },
      { id: "dlai-de-c2", order: 2, title: "Source Systems, Data Ingestion, and Pipelines", status: "completed", completionDate: "2026" },
      { id: "dlai-de-c3", order: 3, title: "Data Storage and Queries", status: "completed", completionDate: "2026" },
      { id: "dlai-de-c4", order: 4, title: "Data Modeling, Transformation, and Serving", status: "completed", completionDate: "2026" }
    ]
  },
  {
    id: "certnexus-cdsp",
    title: "CertNexus Certified Data Science Practitioner (CDSP)",
    issuer: "CertNexus",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "2026",
    credentialId: "GVQQ9VG3UVN6",
    verificationUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/GVQQ9VG3UVN6",
    sourcePlatform: "CertNexus",
    status: "verified",
    programNote: "5-course CertNexus CDSP specialization covering the complete data science project lifecycle: business framing, data extraction, analysis, ML model training, and project finalization.",
    skills: ["Data Science Methodology", "Model Evaluation", "Cross-Validation", "Ethical AI", "Predictive Analytics"],
    subCourses: [
      { id: "certnexus-c1", order: 1, title: "Address Business Issues with Data Science", status: "completed", completionDate: "2026" },
      { id: "certnexus-c2", order: 2, title: "Extract, Transform, and Load Data", status: "completed", completionDate: "2026" },
      { id: "certnexus-c3", order: 3, title: "Analyze Data", status: "completed", completionDate: "2026" },
      { id: "certnexus-c4", order: 4, title: "Train Machine Learning Models", status: "completed", completionDate: "2026" },
      { id: "certnexus-c5", order: 5, title: "Finalize a Data Science Project", status: "completed", completionDate: "2026" }
    ]
  },
  {
    id: "ibm-data-science-foundations",
    title: "Data Science Foundations",
    issuer: "IBM",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "2026",
    credentialId: "MDA6GAQG73OZ",
    verificationUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/MDA6GAQG73OZ",
    sourcePlatform: "IBM",
    status: "verified",
    programNote: "8-course University of London & IBM specialization covering data science career fundamentals, Python, statistics, clustering, algorithms, and a capstone predicting bicycle rentals.",
    skills: ["Data Science Methodology", "Exploratory Data Analysis", "Big Data", "Jupyter Notebooks"],
    subCourses: [
      { id: "ibm-dsf-c1", order: 1, title: "The Data Science Profession – Student View", status: "completed", completionDate: "2026" },
      { id: "ibm-dsf-c2", order: 2, title: "What is Data Science?", status: "completed", completionDate: "2026" },
      { id: "ibm-dsf-c3", order: 3, title: "Tools for Data Science", status: "completed", completionDate: "2026" },
      { id: "ibm-dsf-c4", order: 4, title: "Problems, Algorithms and Flowcharts", status: "completed", completionDate: "2026" },
      { id: "ibm-dsf-c5", order: 5, title: "Python for Data Science, AI & Development", status: "completed", completionDate: "2026" },
      { id: "ibm-dsf-c6", order: 6, title: "Statistics and Clustering in Python", status: "completed", completionDate: "2026" },
      { id: "ibm-dsf-c7", order: 7, title: "Data Science Project Capstone: Predicting Bicycle Rental", status: "completed", completionDate: "2026" },
      { id: "ibm-dsf-c8", order: 8, title: "Python Project for Data Science", status: "completed", completionDate: "2026" }
    ]
  },
  {
    id: "ibm-rag-genai-apps",
    title: "RAG for Generative AI Applications",
    issuer: "IBM",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "2026",
    credentialId: "42VGENM9PAIW",
    verificationUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/42VGENM9PAIW",
    sourcePlatform: "IBM",
    status: "verified",
    programNote: "4-course IBM specialization on building Retrieval-Augmented Generation systems: from getting started with GenAI apps to advanced RAG with vector databases and retrievers.",
    skills: ["Retrieval-Augmented Generation", "Vector Search", "LangChain", "Embeddings", "LLM Applications"],
    subCourses: [
      { id: "ibm-rag-c1", order: 1, title: "Develop Generative AI Applications: Get Started", status: "completed", completionDate: "2026" },
      { id: "ibm-rag-c2", order: 2, title: "Build RAG Applications: Get Started", status: "completed", completionDate: "2026" },
      { id: "ibm-rag-c3", order: 3, title: "Vector Databases for RAG: An Introduction", status: "completed", completionDate: "2026" },
      { id: "ibm-rag-c4", order: 4, title: "Advanced RAG with Vector Databases and Retrievers", status: "completed", completionDate: "2026" }
    ]
  },

  // ── 4. COURSES & SPECIALIZATIONS (STANDALONE) ──
  {
    id: "ibm-deep-learning",
    title: "IBM Deep Learning with PyTorch, Keras and Tensorflow",
    issuer: "IBM",
    category: "course",
    credentialType: "Specialization",
    date: "May 11, 2026",
    credentialId: "TENLZY3OX867",
    verificationUrl: "https://www.coursera.org/account/accomplishments/specialization/TENLZY3OX867",
    sourcePlatform: "IBM",
    status: "verified",
    programNote: "5-course IBM Specialization covering deep learning fundamentals through Keras, TensorFlow, and PyTorch frameworks with a final AI capstone project.",
    skills: ["PyTorch", "TensorFlow", "Keras", "Convolutional Neural Networks", "GANs", "Deep Learning"],
    subCourses: [
      { id: "ibm-dl-c1", order: 1, title: "Introduction to Deep Learning & Neural Networks with Keras", status: "completed", completionDate: "May 2026" },
      { id: "ibm-dl-c2", order: 2, title: "Deep Learning with Keras and Tensorflow", status: "completed", completionDate: "May 2026" },
      { id: "ibm-dl-c3", order: 3, title: "Introduction to Neural Networks and PyTorch", status: "completed", completionDate: "May 2026" },
      { id: "ibm-dl-c4", order: 4, title: "Deep Learning with PyTorch", status: "completed", completionDate: "May 2026" },
      { id: "ibm-dl-c5", order: 5, title: "AI Capstone Project with Deep Learning", status: "completed", completionDate: "May 2026" }
    ]
  },
  {
    id: "deeplearning-tensorflow",
    title: "DeepLearning.AI TensorFlow Developer",
    issuer: "DeepLearning.AI",
    category: "course",
    credentialType: "Specialization",
    date: "May 09, 2026",
    credentialId: "QBAPQLI938QW",
    verificationUrl: "https://www.coursera.org/account/accomplishments/specialization/QBAPQLI938QW",
    sourcePlatform: "Coursera",
    status: "verified",
    programNote: "4-course DeepLearning.AI specialization teaching TensorFlow for building and training deep learning models including CNNs, NLP systems, and time series forecasting.",
    skills: ["TensorFlow", "Neural Networks", "Computer Vision", "NLP", "Time Series Forecasting"],
    subCourses: [
      { id: "dlai-tf-c1", order: 1, title: "Introduction to TensorFlow for Artificial Intelligence, Machine Learning, and Deep Learning", status: "completed", completionDate: "May 2026" },
      { id: "dlai-tf-c2", order: 2, title: "Convolutional Neural Networks in TensorFlow", status: "completed", completionDate: "May 2026" },
      { id: "dlai-tf-c3", order: 3, title: "Natural Language Processing in TensorFlow", status: "completed", completionDate: "May 2026" },
      { id: "dlai-tf-c4", order: 4, title: "Sequences, Time Series and Prediction", status: "completed", completionDate: "May 2026" }
    ]
  },
  {
    id: "ibm-machine-learning",
    title: "IBM Machine Learning",
    issuer: "IBM",
    category: "course",
    credentialType: "Specialization",
    date: "May 06, 2026",
    credentialId: "FH70V3MBDOKA",
    verificationUrl: "https://www.coursera.org/account/accomplishments/specialization/FH70V3MBDOKA",
    sourcePlatform: "IBM",
    status: "verified",
    programNote: "6-course IBM Machine Learning specialization covering EDA, supervised regression & classification, unsupervised learning, deep learning, reinforcement learning, and a final capstone.",
    skills: ["Supervised Learning", "Unsupervised Learning", "Deep Learning", "Reinforcement Learning", "Dimensionality Reduction"],
    subCourses: [
      { id: "ibm-ml-c1", order: 1, title: "Exploratory Data Analysis for Machine Learning", status: "completed", completionDate: "May 2026" },
      { id: "ibm-ml-c2", order: 2, title: "Supervised Machine Learning: Regression", status: "completed", completionDate: "May 2026" },
      { id: "ibm-ml-c3", order: 3, title: "Supervised Machine Learning: Classification", status: "completed", completionDate: "May 2026" },
      { id: "ibm-ml-c4", order: 4, title: "Unsupervised Machine Learning", status: "completed", completionDate: "May 2026" },
      { id: "ibm-ml-c5", order: 5, title: "Deep Learning and Reinforcement Learning", status: "completed", completionDate: "May 2026" },
      { id: "ibm-ml-c6", order: 6, title: "Machine Learning Capstone", status: "completed", completionDate: "May 2026" }
    ]
  },
  {
    id: "ibm-rag-agentic-ai",
    title: "IBM RAG and Agentic AI",
    issuer: "IBM",
    category: "course",
    credentialType: "Specialization",
    date: "May 01, 2026",
    credentialId: "TC68B12KZMGK",
    verificationUrl: "https://www.coursera.org/account/accomplishments/specialization/TC68B12KZMGK",
    sourcePlatform: "IBM",
    status: "verified",
    programNote: "10-course IBM specialization covering the complete RAG and agentic AI stack: from foundational GenAI apps to multimodal generation, LangChain/LangGraph agents, CrewAI, AutoGen, MCP, and a capstone project.",
    skills: ["Agentic Systems", "LangGraph", "LangChain", "Model Context Protocol", "AI Orchestration"],
    subCourses: [
      { id: "ibm-raa-c1", order: 1, title: "Develop Generative AI Applications: Get Started", status: "completed", completionDate: "May 2026" },
      { id: "ibm-raa-c2", order: 2, title: "Build RAG Applications: Get Started", status: "completed", completionDate: "May 2026" },
      { id: "ibm-raa-c3", order: 3, title: "Vector Databases for RAG: An Introduction", status: "completed", completionDate: "May 2026" },
      { id: "ibm-raa-c4", order: 4, title: "Advanced RAG with Vector Databases and Retrievers", status: "completed", completionDate: "May 2026" },
      { id: "ibm-raa-c5", order: 5, title: "Build Multimodal Generative AI Applications", status: "completed", completionDate: "May 2026" },
      { id: "ibm-raa-c6", order: 6, title: "Fundamentals of Building AI Agents", status: "completed", completionDate: "May 2026" },
      { id: "ibm-raa-c7", order: 7, title: "Agentic AI with LangChain and LangGraph", status: "completed", completionDate: "May 2026" },
      { id: "ibm-raa-c8", order: 8, title: "Agentic AI with LangGraph, CrewAI, AutoGen and BeeAI", status: "completed", completionDate: "May 2026" },
      { id: "ibm-raa-c9", order: 9, title: "Build AI Agents using MCP", status: "completed", completionDate: "May 2026" },
      { id: "ibm-raa-c10", order: 10, title: "RAG and Agentic AI Capstone Project", status: "completed", completionDate: "May 2026" }
    ]
  },
  {
    id: "ibm-ai-agents-workflows",
    title: "Building AI Agents and Agentic Workflows",
    issuer: "IBM",
    category: "course",
    credentialType: "Specialization",
    date: "May 06, 2026",
    credentialId: "XS7OUKLSLYDK",
    verificationUrl: "https://coursera.org/verify/specialization/XS7OUKLSLYDK",
    sourcePlatform: "IBM",
    status: "verified",
    programNote: "3-course IBM specialization on building autonomous AI agents with LangChain, LangGraph, CrewAI, AutoGen, and BeeAI frameworks for orchestrated agentic workflows.",
    skills: ["Agentic Workflows", "LangChain", "LangGraph", "Autonomous Agents", "Prompt Chaining"],
    subCourses: [
      { id: "ibm-aiaw-c1", order: 1, title: "Fundamentals of Building AI Agents", status: "completed", completionDate: "May 2026" },
      { id: "ibm-aiaw-c2", order: 2, title: "Agentic AI with LangChain and LangGraph", status: "completed", completionDate: "May 2026" },
      { id: "ibm-aiaw-c3", order: 3, title: "Agentic AI with LangGraph, CrewAI, AutoGen and BeeAI", status: "completed", completionDate: "May 2026" }
    ]
  }
];

/**
 * Normalizes input list from API/MongoDB while preserving the canonical structure,
 * hierarchies, and Credly links.
 */
export function getNormalizedCertifications(apiCerts?: Array<{
  name: string;
  issuer?: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
  badgePublicUrl?: string;
  date?: string;
  skills?: string[];
  category?: CredentialCategory;
  credentialType?: CredentialType;
  programNote?: string;
  subCourses?: SubCourseItem[];
}>): CredentialRecord[] {
  if (!apiCerts || apiCerts.length === 0) {
    return CANONICAL_CREDENTIALS;
  }

  const matched = new Set<string>();
  const results: CredentialRecord[] = [];

  // Match canonical records with any custom edits in apiCerts
  CANONICAL_CREDENTIALS.forEach((canon) => {
    const canonTitle = canon.title.toLowerCase().trim();
    const canonId = (canon.credentialId || "").toLowerCase().trim();

    const matchingApi = apiCerts.find((ac) => {
      const acName = (ac.name || "").toLowerCase().trim();
      const acId = (ac.credentialId || "").toLowerCase().trim();
      if (canonId && acId && canonId === acId) return true;
      if (canonTitle === acName) return true;
      if (canon.id === "google-ai-prof" && (acName === "google ai" || acName.includes("google ai"))) return true;
      if (canon.id === "ibm-data-science-prof" && (acName === "ibm data science" || acName === "data science")) return true;
      if (canon.id === "ibm-ai-developer" && (acName.includes("ibm ai developer") || acName.includes("ai developer"))) return true;
      if (canon.id === "ibm-ai-engineering" && (acName.includes("ibm ai engineering") || acName.includes("ai engineering"))) return true;
      return false;
    });

    if (matchingApi) {
      matched.add(matchingApi.credentialId || matchingApi.name);
      // If badgeUrl from API is a local path like /badges/..., ignore it in favor of remote URL
      const cleanApiBadgeUrl = (matchingApi.badgeUrl && !matchingApi.badgeUrl.startsWith('/badges/')) 
        ? matchingApi.badgeUrl 
        : canon.badgeUrl;

      // Merge subCourses if matchingApi provides them, otherwise use canonical
      const mergedSubCourses = (matchingApi.subCourses && matchingApi.subCourses.length > 0)
        ? matchingApi.subCourses
        : canon.subCourses;

      results.push({
        ...canon,
        title: matchingApi.name || canon.title,
        issuer: matchingApi.issuer || canon.issuer,
        date: matchingApi.date || canon.date,
        credentialId: matchingApi.credentialId || canon.credentialId,
        verificationUrl: matchingApi.credentialUrl || canon.verificationUrl,
        badgeUrl: cleanApiBadgeUrl,
        credlyUrl: matchingApi.badgePublicUrl || canon.credlyUrl,
        skills: matchingApi.skills && matchingApi.skills.length > 0 ? matchingApi.skills : canon.skills,
        programNote: matchingApi.programNote !== undefined && matchingApi.programNote !== '' ? matchingApi.programNote : canon.programNote,
        category: (matchingApi.category || canon.category) as CredentialCategory,
        credentialType: (matchingApi.credentialType || canon.credentialType) as CredentialType,
        subCourses: mergedSubCourses
      });
    } else {
      results.push(canon);
    }
  });

  // Include any extra custom certifications added by the user in Admin Dashboard
  apiCerts.forEach((ac) => {
    const key = ac.credentialId || ac.name;
    if (!matched.has(key)) {
      const nameLower = (ac.name || "").toLowerCase();
      if (nameLower === "google ai" || nameLower === "ibm data science") return;

      const cleanBadge = (ac.badgeUrl && !ac.badgeUrl.startsWith('/badges/')) ? ac.badgeUrl : undefined;

      results.push({
        id: `custom-${(ac.credentialId || ac.name).toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        title: ac.name,
        issuer: ac.issuer || 'Professional',
        category: (ac.category || (nameLower.includes('professional') || nameLower.includes('engineer') ? 'professional' : 'course')) as CredentialCategory,
        credentialType: (ac.credentialType || (nameLower.includes('specialization') ? 'Specialization' : 'Course')) as CredentialType,
        date: ac.date || '',
        credentialId: ac.credentialId,
        verificationUrl: ac.credentialUrl,
        badgeUrl: cleanBadge,
        credlyUrl: ac.badgePublicUrl,
        sourcePlatform: (ac.issuer?.includes('IBM') ? 'IBM' : ac.issuer?.includes('Google') ? 'Google' : 'Coursera') as any,
        status: 'verified',
        skills: ac.skills,
        programNote: ac.programNote,
        subCourses: ac.subCourses
      });
    }
  });

  return results;
}
