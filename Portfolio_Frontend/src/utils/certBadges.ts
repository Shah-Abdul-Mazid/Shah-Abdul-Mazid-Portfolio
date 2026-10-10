export interface CredlyBadge {
  id: string;
  name: string;
  issuer: string;
  imageUrl: string;
  publicUrl?: string;
}

/**
 * EXACT 9 genuine verified Credly badges from Shah Abdul Mazid's official Credly profile:
 * https://www.credly.com/users/shah-abdul-mazid
 * All images hosted directly on Credly's official CDN (images.credly.com).
 * No local static badge files in public/ or dist/.
 */
export const CREDLY_VERIFIED_BADGES: CredlyBadge[] = [
  {
    id: "ibm-data-science-prof",
    name: "IBM Data Science Professional Certificate (V3)",
    issuer: "IBM",
    imageUrl: "https://images.credly.com/images/42ce4209-8839-431a-9046-f2ce2e72e04b/Coursera_20Data_20Science_20Professional_20Certificate.png",
    publicUrl: "https://www.credly.com/badges/6a8e7540-1d98-455d-af07-2559ed272e3b/public_url",
  },
  {
    id: "ibm-databases-sql",
    name: "Databases and SQL for Data Science",
    issuer: "IBM",
    imageUrl: "https://images.credly.com/images/f2573aac-d21c-483d-acda-afaa366b4f51/image.png",
    publicUrl: "https://www.credly.com/badges/dc581941-4adf-4d13-9672-5c7b5902b056/public_url",
  },
  {
    id: "ibm-data-viz",
    name: "Data Visualization with Python",
    issuer: "IBM",
    imageUrl: "https://images.credly.com/images/9da3eedf-fda3-4e81-bb46-d174b4699bf1/image.png",
    publicUrl: "https://www.credly.com/badges/cd320125-d418-4a23-883e-845afef9c6d9/public_url",
  },
  {
    id: "ibm-genai-essentials",
    name: "Generative AI Essentials for Data Science",
    issuer: "IBM",
    imageUrl: "https://images.credly.com/images/1dc40257-c856-4e6b-9a92-29be936a9e7c/image.png",
    publicUrl: "https://www.credly.com/badges/a6f34c20-aa81-43c2-be32-680ad03dbf9e/public_url",
  },
  {
    id: "ibm-applied-ds-capstone",
    name: "Applied Data Science Capstone",
    issuer: "IBM",
    imageUrl: "https://images.credly.com/images/169512d3-cef6-43e3-bec8-e6af2723a076/image.png",
    publicUrl: "https://www.credly.com/badges/56cc091b-a87c-4af4-8d23-8ea151100c3e/public_url",
  },
  {
    id: "ibm-ds-career-guide",
    name: "Data Scientist Career Guide and Interview Preparation",
    issuer: "IBM",
    imageUrl: "https://images.credly.com/images/6eb08161-0425-4fc0-b66c-a1138dee7953/image.png",
    publicUrl: "https://www.credly.com/badges/439040fd-48ae-47f7-87b1-bf7158c73659/public_url",
  },
  {
    id: "ibm-ai-essentials-v2",
    name: "Artificial Intelligence Essentials V2",
    issuer: "IBM",
    imageUrl: "https://images.credly.com/images/3e199561-bc4a-4621-9361-340fc43d997e/Coursera_20Artificial_20Intelligence_20Essentials_20V2.png",
    publicUrl: "https://www.credly.com/badges/676e65a6-de2b-481b-a559-610a6f7417fb/public_url",
  },
  {
    id: "google-ai-fundamentals",
    name: "Google AI Fundamentals",
    issuer: "Google",
    imageUrl: "https://images.credly.com/images/36ecc7ff-8ccf-4bd8-83a7-6f35797e0b64/blob",
    publicUrl: "https://www.credly.com/badges/d172156c-c193-4172-9c79-829d14b9d93e/public_url",
  },
  {
    id: "google-ai-brainstorming",
    name: "Google AI for Brainstorming and Planning",
    issuer: "Google",
    imageUrl: "https://images.credly.com/images/fb6dc8be-1471-4aab-b2ab-da1f76080ecf/blob",
    publicUrl: "https://www.credly.com/badges/a257e2c0-3b13-4d63-aa31-1a2d358c4f99/public_url",
  },
];

/**
 * Returns a verified Credly badge ONLY when the credential is confirmed to match
 * one of the genuine 9 Credly badges, or when the user explicitly set a verified Credly URL / remote badge.
 */
export function getCredlyBadgeForCert(cert: {
  name: string;
  issuer?: string;
  credentialId?: string;
  badgeUrl?: string;
  badgePublicUrl?: string;
}): CredlyBadge | null {
  const name = (cert.name || "").trim().toLowerCase();
  const issuer = (cert.issuer || "").trim().toLowerCase();
  const credId = (cert.credentialId || "").trim();
  const customBadgeUrl = (cert.badgeUrl || "").trim();
  const customPublicUrl = (cert.badgePublicUrl || "").trim();

  // If a public Credly URL is explicitly present, find the matching verified badge
  if (customPublicUrl && customPublicUrl.includes("credly.com/badges/")) {
    const matchedByUrl = CREDLY_VERIFIED_BADGES.find(
      (b) => b.publicUrl && customPublicUrl.includes(b.publicUrl.split("/badges/")[1]?.split("/")[0])
    );
    if (matchedByUrl) return matchedByUrl;
  }

  // 1. Google AI Fundamentals
  if (
    name === "google ai fundamentals" ||
    credId === "AGNE8JCWOITV"
  ) {
    return CREDLY_VERIFIED_BADGES.find((b) => b.id === "google-ai-fundamentals") || null;
  }

  // 2. Google AI for Brainstorming and Planning
  if (name.includes("brainstorming") && name.includes("google")) {
    return CREDLY_VERIFIED_BADGES.find((b) => b.id === "google-ai-brainstorming") || null;
  }

  // 3. IBM Data Science Professional Certificate
  if (
    (name.includes("data science") && issuer.includes("ibm") && !name.includes("foundations") && !name.includes("essentials")) ||
    credId === "CJ6JB12049ER"
  ) {
    return CREDLY_VERIFIED_BADGES.find((b) => b.id === "ibm-data-science-prof") || null;
  }

  // 4. Databases and SQL for Data Science
  if (name.includes("databases") && name.includes("sql")) {
    return CREDLY_VERIFIED_BADGES.find((b) => b.id === "ibm-databases-sql") || null;
  }

  // 5. Data Visualization with Python
  if (name.includes("data visualization") && name.includes("python")) {
    return CREDLY_VERIFIED_BADGES.find((b) => b.id === "ibm-data-viz") || null;
  }

  // 6. Generative AI Essentials for Data Science
  if (name.includes("generative ai essentials") && name.includes("data science")) {
    return CREDLY_VERIFIED_BADGES.find((b) => b.id === "ibm-genai-essentials") || null;
  }

  // 7. Applied Data Science Capstone
  if (name.includes("applied data science capstone") || name.includes("data science capstone")) {
    return CREDLY_VERIFIED_BADGES.find((b) => b.id === "ibm-applied-ds-capstone") || null;
  }

  // 8. Data Scientist Career Guide
  if (name.includes("data scientist career guide") || name.includes("interview preparation")) {
    return CREDLY_VERIFIED_BADGES.find((b) => b.id === "ibm-ds-career-guide") || null;
  }

  // 9. AI Essentials V2
  if (name.includes("artificial intelligence essentials v2") || name.includes("ai essentials v2")) {
    return CREDLY_VERIFIED_BADGES.find((b) => b.id === "ibm-ai-essentials-v2") || null;
  }

  // If a remote badge URL was uploaded via Admin Dashboard (e.g. Cloudinary)
  if (customBadgeUrl && (customBadgeUrl.startsWith("http://") || customBadgeUrl.startsWith("https://"))) {
    // If it's a legacy linkedin_thumb, strip it
    const cleanImg = customBadgeUrl.replace(/linkedin_thumb_/, "");
    return {
      id: `custom-${name.replace(/[^a-z0-9]/g, "-")}`,
      name: cert.name,
      issuer: cert.issuer || "Verified",
      imageUrl: cleanImg,
      publicUrl: customPublicUrl || undefined,
    };
  }

  return null;
}
