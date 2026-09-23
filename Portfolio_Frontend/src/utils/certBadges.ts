export interface CredlyBadge {
  id: string;
  name: string;
  issuer: string;
  imageUrl: string;
  publicUrl: string;
}

/**
 * Exact 9 verified Credly badges from Shah Abdul Mazid's Credly profile.
 * Using full-resolution image URLs (NOT linkedin_thumb variants).
 */
export const CREDLY_VERIFIED_BADGES: CredlyBadge[] = [
  {
    id: 'google-ai-fundamentals',
    name: 'Google AI Fundamentals',
    issuer: 'Google',
    imageUrl: 'https://images.credly.com/images/d6521452-e64b-4f96-bc20-4758b720757b/blob',
    publicUrl: 'https://www.credly.com/badges/d172156c-c193-4172-9c79-829d14b9d93e/public_url'
  },
  {
    id: 'google-ai-brainstorming',
    name: 'Google AI for Brainstorming and Planning',
    issuer: 'Google',
    imageUrl: 'https://images.credly.com/images/a1bec460-6545-4b61-9dd2-e56b7d6ccf63/blob',
    publicUrl: 'https://www.credly.com/badges/a257e2c0-3b13-4d63-aa31-1a2d358c4f99/public_url'
  },
  {
    id: 'ibm-data-science-prof',
    name: 'IBM Data Science Professional Certificate (V3)',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/42ce4209-8839-431a-9046-f2ce2e72e04b/Coursera_20Data_20Science_20Professional_20Certificate.png',
    publicUrl: 'https://www.credly.com/badges/6a8e7540-1d98-455d-af07-2559ed272e3b/public_url'
  },
  {
    id: 'ibm-databases-sql',
    name: 'Databases and SQL for Data Science',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/f2573aac-d21c-483d-acda-afaa366b4f51/image.png',
    publicUrl: 'https://www.credly.com/badges/dc581941-4adf-4d13-9672-5c7b5902b056/public_url'
  },
  {
    id: 'ibm-data-viz',
    name: 'Data Visualization with Python',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/9da3eedf-fda3-4e81-bb46-d174b4699bf1/image.png',
    publicUrl: 'https://www.credly.com/badges/cd320125-d418-4a23-883e-845afef9c6d9/public_url'
  },
  {
    id: 'ibm-genai-essentials',
    name: 'Generative AI Essentials for Data Science',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/1dc40257-c856-4e6b-9a92-29be936a9e7c/image.png',
    publicUrl: 'https://www.credly.com/badges/a6f34c20-aa81-43c2-be32-680ad03dbf9e/public_url'
  },
  {
    id: 'ibm-applied-ds-capstone',
    name: 'Applied Data Science Capstone',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/169512d3-cef6-43e3-bec8-e6af2723a076/image.png',
    publicUrl: 'https://www.credly.com/badges/56cc091b-a87c-4af4-8d23-8ea151100c3e/public_url'
  },
  {
    id: 'ibm-ds-career-guide',
    name: 'Data Scientist Career Guide and Interview Preparation',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/6eb08161-0425-4fc0-b66c-a1138dee7953/image.png',
    publicUrl: 'https://www.credly.com/badges/439040fd-48ae-47f7-87b1-bf7158c73659/public_url'
  },
  {
    id: 'ibm-ai-essentials-v2',
    name: 'Artificial Intelligence Essentials V2',
    issuer: 'IBM',
    imageUrl: 'https://images.credly.com/images/3e199561-bc4a-4621-9361-340fc43d997e/Coursera_20Artificial_20Intelligence_20Essentials_20V2.png',
    publicUrl: 'https://www.credly.com/badges/676e65a6-de2b-481b-a559-610a6f7417fb/public_url'
  }
];

/**
 * Returns EXACTLY ONE verified Credly badge for a certification.
 * STRICT: Each certification gets at most ONE badge. Never multiple.
 *
 * Always returns from CREDLY_VERIFIED_BADGES (full-resolution images).
 * Intentionally does NOT use cert.badgeUrl from MongoDB — those stored old
 * linkedin_thumb thumbnail URLs that render blurry.
 *
 * Returns null if no badge is mapped for this cert.
 */
export function getCredlyBadgeForCert(cert: {
  name: string;
  issuer?: string;
  credentialId?: string;
  badgeUrl?: string;
}): CredlyBadge | null {
  const name = (cert.name || '').trim().toLowerCase();
  const issuer = (cert.issuer || '').trim().toLowerCase();
  const credId = (cert.credentialId || '').trim();

  // 1. Google AI → Google AI Fundamentals
  if (
    name === 'google ai' ||
    credId === 'AGNE8JCWOITV' ||
    (name.includes('google') && name.includes('ai') && !name.includes('brainstorming'))
  ) {
    return CREDLY_VERIFIED_BADGES[0];
  }

  // 2. RAG for Generative AI Applications → Generative AI Essentials for Data Science
  if (name.includes('rag') && name.includes('generative')) {
    return CREDLY_VERIFIED_BADGES[5];
  }

  // 3. IBM Generative AI Engineering → Generative AI Essentials for Data Science
  if (
    name.includes('generative ai engineering') ||
    (name.includes('generative') && name.includes('engineering') && issuer.includes('ibm'))
  ) {
    return CREDLY_VERIFIED_BADGES[5];
  }

  // 4. IBM AI Engineering → Artificial Intelligence Essentials V2
  if (name.includes('ai engineering') && issuer.includes('ibm')) {
    return CREDLY_VERIFIED_BADGES[8];
  }

  // 5. IBM Data Science (not Foundations) → IBM Data Science Professional Certificate (V3)
  if (
    name.includes('data science') &&
    !name.includes('foundations') &&
    issuer.includes('ibm')
  ) {
    return CREDLY_VERIFIED_BADGES[2];
  }

  // No badge for any other cert
  return null;
}
