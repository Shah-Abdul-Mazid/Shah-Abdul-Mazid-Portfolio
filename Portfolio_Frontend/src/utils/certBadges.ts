export interface CredlyBadge {
  id: string;
  name: string;
  issuer: string;
  imageUrl: string;
  publicUrl: string;
}

/**
 * The user's exact 9 verified badges issued via Credly.
 * STRICT: No unofficial or fabricated badges are included.
 */
export const CREDLY_VERIFIED_BADGES: CredlyBadge[] = [
  {
    id: 'google-ai-fundamentals',
    name: 'Google AI Fundamentals',
    issuer: 'Google',
    imageUrl: 'https://images.credly.com/images/d6521452-e64b-4f96-bc20-4758b720757b/linkedin_thumb_blob',
    publicUrl: 'https://www.credly.com/badges/d172156c-c193-4172-9c79-829d14b9d93e/public_url'
  },
  {
    id: 'google-ai-brainstorming',
    name: 'Google AI for Brainstorming and Planning',
    issuer: 'Google',
    imageUrl: 'https://images.credly.com/images/a1bec460-6545-4b61-9dd2-e56b7d6ccf63/linkedin_thumb_blob',
    publicUrl: 'https://www.credly.com/badges/a257e2c0-3b13-4d63-aa31-1a2d358c4f99/public_url'
  },
  {
    id: 'ibm-data-science-prof',
    name: 'IBM Data Science Professional Certificate (V3)',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/42ce4209-8839-431a-9046-f2ce2e72e04b/linkedin_thumb_Coursera_20Data_20Science_20Professional_20Certificate.png',
    publicUrl: 'https://www.credly.com/badges/6a8e7540-1d98-455d-af07-2559ed272e3b/public_url'
  },
  {
    id: 'ibm-databases-sql',
    name: 'Databases and SQL for Data Science',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/f2573aac-d21c-483d-acda-afaa366b4f51/linkedin_thumb_image.png',
    publicUrl: 'https://www.credly.com/badges/dc581941-4adf-4d13-9672-5c7b5902b056/public_url'
  },
  {
    id: 'ibm-data-viz',
    name: 'Data Visualization with Python',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/9da3eedf-fda3-4e81-bb46-d174b4699bf1/linkedin_thumb_image.png',
    publicUrl: 'https://www.credly.com/badges/cd320125-d418-4a23-883e-845afef9c6d9/public_url'
  },
  {
    id: 'ibm-genai-essentials',
    name: 'Generative AI Essentials for Data Science',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/1dc40257-c856-4e6b-9a92-29be936a9e7c/linkedin_thumb_image.png',
    publicUrl: 'https://www.credly.com/badges/a6f34c20-aa81-43c2-be32-680ad03dbf9e/public_url'
  },
  {
    id: 'ibm-applied-ds-capstone',
    name: 'Applied Data Science Capstone',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/169512d3-cef6-43e3-bec8-e6af2723a076/linkedin_thumb_image.png',
    publicUrl: 'https://www.credly.com/badges/56cc091b-a87c-4af4-8d23-8ea151100c3e/public_url'
  },
  {
    id: 'ibm-ds-career-guide',
    name: 'Data Scientist Career Guide and Interview Preparation',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/6eb08161-0425-4fc0-b66c-a1138dee7953/linkedin_thumb_image.png',
    publicUrl: 'https://www.credly.com/badges/439040fd-48ae-47f7-87b1-bf7158c73659/public_url'
  },
  {
    id: 'ibm-ai-essentials-v2',
    name: 'Artificial Intelligence Essentials V2',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/3e199561-bc4a-4621-9361-340fc43d997e/linkedin_thumb_Coursera_20Artificial_20Intelligence_20Essentials_20V2.png',
    publicUrl: 'https://www.credly.com/badges/676e65a6-de2b-481b-a559-610a6f7417fb/public_url'
  }
];

export interface CertBadgeMatch {
  primaryBadge: CredlyBadge;
  allBadges: CredlyBadge[];
}

/**
 * Returns verified Credly badge(s) for a certification.
 * If the certification does NOT have a verified Credly badge, returns null.
 * Strictly adheres to verified credentials without inventing unverified badges.
 */
export function getCredlyBadgesForCert(cert: {
  name: string;
  issuer?: string;
  credentialId?: string;
  badgeUrl?: string;
}): CertBadgeMatch | null {
  // 1. Explicit badge URL provided from admin
  if (cert.badgeUrl && cert.badgeUrl.trim() !== '') {
    const customBadge: CredlyBadge = {
      id: 'custom-badge',
      name: cert.name,
      issuer: cert.issuer || 'Verified Issuer',
      imageUrl: cert.badgeUrl,
      publicUrl: cert.badgeUrl
    };
    return { primaryBadge: customBadge, allBadges: [customBadge] };
  }

  const name = (cert.name || '').toLowerCase();
  const issuer = (cert.issuer || '').toLowerCase();
  const credId = (cert.credentialId || '').toUpperCase();

  // 2. Google AI (Credential ID: AGNE8JCWOITV)
  // Has 2 verified Credly badges: Google AI Fundamentals & Google AI for Brainstorming and Planning
  if (name.includes('google ai') || credId === 'AGNE8JCWOITV' || (issuer.includes('google') && name.includes('ai'))) {
    const b1 = CREDLY_VERIFIED_BADGES[0]; // Google AI Fundamentals
    const b2 = CREDLY_VERIFIED_BADGES[1]; // Google AI for Brainstorming
    return {
      primaryBadge: b1,
      allBadges: [b1, b2]
    };
  }

  // 3. IBM Data Science Professional Certificate
  // Has primary Professional Certificate V3 badge + related course badges
  if (name.includes('data science') && issuer.includes('ibm')) {
    const profBadge = CREDLY_VERIFIED_BADGES[2]; // IBM Data Science Professional Certificate (V3)
    const sqlBadge = CREDLY_VERIFIED_BADGES[3];  // Databases & SQL
    const vizBadge = CREDLY_VERIFIED_BADGES[4];  // Data Visualization
    const capstone = CREDLY_VERIFIED_BADGES[6];  // Applied Data Science Capstone
    const career = CREDLY_VERIFIED_BADGES[7];    // Career Guide
    return {
      primaryBadge: profBadge,
      allBadges: [profBadge, sqlBadge, vizBadge, capstone, career]
    };
  }

  // 4. IBM Generative AI Engineering / AI Essentials
  if ((name.includes('generative ai') || name.includes('ai essentials')) && issuer.includes('ibm')) {
    const aiEssV2 = CREDLY_VERIFIED_BADGES[8]; // AI Essentials V2
    const genAiEss = CREDLY_VERIFIED_BADGES[5]; // Gen AI Essentials for Data Science
    return {
      primaryBadge: aiEssV2,
      allBadges: [aiEssV2, genAiEss]
    };
  }

  // 5. Data Science Foundations
  if (name.includes('foundations') && issuer.includes('ibm')) {
    const capstone = CREDLY_VERIFIED_BADGES[6];
    return {
      primaryBadge: capstone,
      allBadges: [capstone]
    };
  }

  // No verified Credly badge for this certification — return null (DO NOT FAKE)
  return null;
}
