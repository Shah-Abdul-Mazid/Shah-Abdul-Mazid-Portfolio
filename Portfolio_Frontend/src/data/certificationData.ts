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
    programNote: "Comprehensive 8-course track mastering generative AI workflow, prompting, and application development.",
    skills: ["Generative AI", "Prompt Engineering", "Large Language Models", "Workflow Automation", "Responsible AI"],
    subCourses: [
      {
        id: "google-ai-c1",
        order: 1,
        title: "AI Fundamentals",
        status: "verified",
        credlyBadgeId: "d172156c-c193-4172-9c79-829d14b9d93e",
        credlyUrl: "https://www.credly.com/badges/d172156c-c193-4172-9c79-829d14b9d93e/public_url",
        badgeImageUrl: "https://images.credly.com/images/36ecc7ff-8ccf-4bd8-83a7-6f35797e0b64/blob",
        completionDate: "Sep 2026"
      },
      {
        id: "google-ai-c2",
        order: 2,
        title: "AI for Brainstorming and Planning",
        status: "verified",
        credlyBadgeId: "a257e2c0-3b13-4d63-aa31-1a2d358c4f99",
        credlyUrl: "https://www.credly.com/badges/a257e2c0-3b13-4d63-aa31-1a2d358c4f99/public_url",
        badgeImageUrl: "https://images.credly.com/images/fb6dc8be-1471-4aab-b2ab-da1f76080ecf/blob",
        completionDate: "Sep 2026"
      },
      {
        id: "google-ai-c3",
        order: 3,
        title: "AI for Research and Insights",
        status: "in-progress"
      },
      {
        id: "google-ai-c4",
        order: 4,
        title: "AI for Writing and Communicating",
        status: "in-progress"
      },
      {
        id: "google-ai-c5",
        order: 5,
        title: "AI for Content Creation",
        status: "in-progress"
      },
      {
        id: "google-ai-c6",
        order: 6,
        title: "AI for Data Analysis",
        status: "in-progress"
      },
      {
        id: "google-ai-c7",
        order: 7,
        title: "AI for App Building",
        status: "in-progress"
      },
      {
        id: "google-ai-c8",
        order: 8,
        title: "AI for App Deployment",
        status: "in-progress"
      }
    ]
  },

  // ── 2. IBM DATA SCIENCE PROFESSIONAL CERTIFICATE (V3) (PARENT WITH CONFIRMED CHILD BADGES) ──
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
    programNote: "Rigorous 10-course program covering Python, SQL, data analysis, visualization, ML algorithms, and applied capstone.",
    skills: ["Python", "SQL", "Data Analysis", "Data Visualization", "Machine Learning", "Jupyter", "Dashboards"],
    subCourses: [
      {
        id: "ibm-ds-c1",
        order: 1,
        title: "Databases and SQL for Data Science",
        status: "verified",
        credlyBadgeId: "dc581941-4adf-4d13-9672-5c7b5902b056",
        credlyUrl: "https://www.credly.com/badges/dc581941-4adf-4d13-9672-5c7b5902b056/public_url",
        badgeImageUrl: "https://images.credly.com/images/f2573aac-d21c-483d-acda-afaa366b4f51/image.png"
      },
      {
        id: "ibm-ds-c2",
        order: 2,
        title: "Data Visualization with Python",
        status: "verified",
        credlyBadgeId: "cd320125-d418-4a23-883e-845afef9c6d9",
        credlyUrl: "https://www.credly.com/badges/cd320125-d418-4a23-883e-845afef9c6d9/public_url",
        badgeImageUrl: "https://images.credly.com/images/9da3eedf-fda3-4e81-bb46-d174b4699bf1/image.png"
      },
      {
        id: "ibm-ds-c3",
        order: 3,
        title: "Generative AI Essentials for Data Science",
        status: "verified",
        credlyBadgeId: "a6f34c20-aa81-43c2-be32-680ad03dbf9e",
        credlyUrl: "https://www.credly.com/badges/a6f34c20-aa81-43c2-be32-680ad03dbf9e/public_url",
        badgeImageUrl: "https://images.credly.com/images/1dc40257-c856-4e6b-9a92-29be936a9e7c/image.png"
      },
      {
        id: "ibm-ds-c4",
        order: 4,
        title: "Applied Data Science Capstone",
        status: "verified",
        credlyBadgeId: "56cc091b-a87c-4af4-8d23-8ea151100c3e",
        credlyUrl: "https://www.credly.com/badges/56cc091b-a87c-4af4-8d23-8ea151100c3e/public_url",
        badgeImageUrl: "https://images.credly.com/images/169512d3-cef6-43e3-bec8-e6af2723a076/image.png"
      },
      {
        id: "ibm-ds-c5",
        order: 5,
        title: "Data Scientist Career Guide and Interview Preparation",
        status: "verified",
        credlyBadgeId: "439040fd-48ae-47f7-87b1-bf7158c73659",
        credlyUrl: "https://www.credly.com/badges/439040fd-48ae-47f7-87b1-bf7158c73659/public_url",
        badgeImageUrl: "https://images.credly.com/images/6eb08161-0425-4fc0-b66c-a1138dee7953/image.png"
      }
    ]
  },

  // ── 3. OTHER PROFESSIONAL CERTIFICATES ──
  {
    id: "ibm-ai-developer",
    title: "IBM AI Developer",
    issuer: "IBM",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "May 18, 2026",
    credentialId: "EK2UWJK3XJTE",
    verificationUrl: "https://www.coursera.org/verify/professional-cert/EK2UWJK3XJTE",
    sourcePlatform: "IBM",
    status: "verified",
    skills: ["AI Workflows", "ChatGPT", "Computer Vision", "Data Ethics", "Data Science", "Generative AI", "IBM Cloud", "LangChain", "LLM", "Prompt Engineering"]
  },
  {
    id: "ibm-ai-engineering",
    title: "IBM AI Engineering",
    issuer: "IBM",
    category: "professional",
    credentialType: "Professional Certificate",
    date: "May 16, 2026",
    credentialId: "CRH40FK3BKPQ",
    verificationUrl: "https://coursera.org/verify/professional-cert/CRH40FK3BKPQ",
    sourcePlatform: "IBM",
    status: "verified",
    skills: ["Apache Spark", "Computer Vision", "Data Science", "Fine-tuning", "Generative AI", "Keras", "Machine Learning", "Prompt Engineering"]
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
    skills: ["Generative AI", "Prompt Engineering", "Large Language Models", "Fine-tuning", "Vector Databases", "Embeddings"]
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
    skills: ["Amazon Bedrock", "Generative AI Agents", "Agentic Workflows", "LangChain", "Responsible AI", "Model Optimization"]
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
    skills: ["Azure Machine Learning", "Model Training", "Pipeline Automation", "MLOps", "Model Deployment"]
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
    skills: ["Machine Learning", "Deep Learning", "Azure Cognitive Services", "Natural Language Processing", "Computer Vision"]
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
    skills: ["Data Pipelines", "ETL Architecture", "Data Modeling", "Distributed Systems", "SQL & NoSQL"]
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
    skills: ["Data Science Methodology", "Model Evaluation", "Cross-Validation", "Ethical AI", "Predictive Analytics"]
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
    skills: ["Data Science Methodology", "Exploratory Data Analysis", "Big Data", "Jupyter Notebooks"]
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
    skills: ["Retrieval-Augmented Generation", "Vector Search", "LangChain", "Embeddings", "LLM Applications"]
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
    skills: ["PyTorch", "TensorFlow", "Keras", "Convolutional Neural Networks", "GANs", "Deep Learning"]
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
    skills: ["TensorFlow", "Neural Networks", "Computer Vision", "NLP", "Time Series Forecasting"]
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
    skills: ["Supervised Learning", "Unsupervised Learning", "Deep Learning", "Reinforcement Learning", "Dimensionality Reduction"]
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
    skills: ["Agentic Systems", "LangGraph", "LangChain", "Model Context Protocol", "AI Orchestration"]
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
    skills: ["Agentic Workflows", "LangChain", "LangGraph", "Autonomous Agents", "Prompt Chaining"]
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
      return false;
    });

    if (matchingApi) {
      matched.add(matchingApi.credentialId || matchingApi.name);
      // If badgeUrl from API is a local path like /badges/..., ignore it in favor of remote URL
      const cleanApiBadgeUrl = (matchingApi.badgeUrl && !matchingApi.badgeUrl.startsWith('/badges/')) 
        ? matchingApi.badgeUrl 
        : canon.badgeUrl;

      results.push({
        ...canon,
        title: matchingApi.name || canon.title,
        issuer: matchingApi.issuer || canon.issuer,
        date: matchingApi.date || canon.date,
        credentialId: matchingApi.credentialId || canon.credentialId,
        verificationUrl: matchingApi.credentialUrl || canon.verificationUrl,
        badgeUrl: cleanApiBadgeUrl,
        credlyUrl: matchingApi.badgePublicUrl || canon.credlyUrl,
        skills: matchingApi.skills && matchingApi.skills.length > 0 ? matchingApi.skills : canon.skills
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
        category: nameLower.includes('professional') || nameLower.includes('engineer') ? 'professional' : 'course',
        credentialType: nameLower.includes('specialization') ? 'Specialization' : 'Course',
        date: ac.date || '',
        credentialId: ac.credentialId,
        verificationUrl: ac.credentialUrl,
        badgeUrl: cleanBadge,
        credlyUrl: ac.badgePublicUrl,
        sourcePlatform: (ac.issuer?.includes('IBM') ? 'IBM' : ac.issuer?.includes('Google') ? 'Google' : 'Coursera') as any,
        status: 'verified',
        skills: ac.skills
      });
    }
  });

  return results;
}
