export interface CredlyBadge {
  id: string;
  name: string;
  issuer: string;
  imageUrl: string;
  /** Optional — can be added later once the Credly badge URL is known */
  publicUrl?: string;
}

/**
 * Exact 9 verified Credly badges from Shah Abdul Mazid's Credly profile.
 * Using full-resolution image URLs (NOT linkedin_thumb variants).
 */
export const CREDLY_VERIFIED_BADGES: CredlyBadge[] = [
  {
    id: "google-ai-fundamentals",
    name: "Google AI Fundamentals",
    issuer: "Google",
    imageUrl: "/badges/google-ai-fundamentals.png",
    publicUrl:
      "https://www.credly.com/badges/d172156c-c193-4172-9c79-829d14b9d93e/public_url",
  },
  {
    id: "google-ai-brainstorming",
    name: "Google AI for Brainstorming and Planning",
    issuer: "Google",
    imageUrl: "/badges/google-ai-for-brainstorming-and-planning.png",
    publicUrl:
      "https://www.credly.com/badges/a257e2c0-3b13-4d63-aa31-1a2d358c4f99/public_url",
  },
  {
    id: "google-ai-professional",
    name: "Google AI Professional Certificate",
    issuer: "Google",
    imageUrl: "/badges/Google AI Professional Certificate.png",
  },
  {
    id: "ibm-data-science-prof",
    name: "IBM Data Science Professional Certificate (V3)",
    issuer: "IBM",
    imageUrl: "/badges/ibm-data-science-professional-certificate-v3.png",
    publicUrl:
      "https://www.credly.com/badges/6a8e7540-1d98-455d-af07-2559ed272e3b/public_url",
  },
  {
    id: "ibm-databases-sql",
    name: "Databases and SQL for Data Science",
    issuer: "IBM",
    imageUrl:
      "https://images.credly.com/images/f2573aac-d21c-483d-acda-afaa366b4f51/image.png",
    publicUrl:
      "https://www.credly.com/badges/dc581941-4adf-4d13-9672-5c7b5902b056/public_url",
  },
  {
    id: "ibm-data-viz",
    name: "Data Visualization with Python",
    issuer: "IBM",
    imageUrl:
      "https://images.credly.com/images/9da3eedf-fda3-4e81-bb46-d174b4699bf1/image.png",
    publicUrl:
      "https://www.credly.com/badges/cd320125-d418-4a23-883e-845afef9c6d9/public_url",
  },
  {
    id: "ibm-genai-essentials",
    name: "Generative AI Essentials for Data Science",
    issuer: "IBM",
    imageUrl:
      "https://images.credly.com/images/1dc40257-c856-4e6b-9a92-29be936a9e7c/image.png",
    publicUrl:
      "https://www.credly.com/badges/a6f34c20-aa81-43c2-be32-680ad03dbf9e/public_url",
  },
  {
    id: "ibm-applied-ds-capstone",
    name: "Applied Data Science Capstone",
    issuer: "IBM",
    imageUrl:
      "https://images.credly.com/images/169512d3-cef6-43e3-bec8-e6af2723a076/image.png",
    publicUrl:
      "https://www.credly.com/badges/56cc091b-a87c-4af4-8d23-8ea151100c3e/public_url",
  },
  {
    id: "ibm-ds-career-guide",
    name: "Data Scientist Career Guide and Interview Preparation",
    issuer: "IBM",
    imageUrl:
      "https://images.credly.com/images/6eb08161-0425-4fc0-b66c-a1138dee7953/image.png",
    publicUrl:
      "https://www.credly.com/badges/439040fd-48ae-47f7-87b1-bf7158c73659/public_url",
  },
  {
    id: "ibm-ai-essentials-v2",
    name: "Artificial Intelligence Essentials V2",
    issuer: "IBM",
    imageUrl:
      "https://images.credly.com/images/3e199561-bc4a-4621-9361-340fc43d997e/Coursera_20Artificial_20Intelligence_20Essentials_20V2.png",
    publicUrl:
      "https://www.credly.com/badges/676e65a6-de2b-481b-a559-610a6f7417fb/public_url",
  },
];

const getBadgeById = (id: string): CredlyBadge | null =>
  CREDLY_VERIFIED_BADGES.find((b) => b.id === id) || null;

/**
 * Returns EXACTLY ONE verified Credly badge for a certification.
 *
 * Priority order:
 * 1. Explicitly uploaded/custom badge in cert.badgeUrl (e.g., Cloudinary, custom image)
 *    - If it's a legacy blurry linkedin_thumb, we upgrade it to full resolution or verified badge.
 *    - Otherwise, the uploaded image URL is used directly.
 * 2. Predefined high-resolution verified badges matched by certification name / credential ID.
 *
 * Returns null if no badge is available or mapped.
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

  // Find fallback / matching predefined badge for publicUrl or high-res image
  const getPredefinedBadge = (): CredlyBadge | null => {
    // 1a. Google AI Professional Certificate → Google AI Professional Certificate badge
    if (
      name.includes("google") &&
      name.includes("ai") &&
      name.includes("professional")
    ) {
      return getBadgeById("google-ai-professional");
    }

    // 1b. Google AI Fundamentals / generic Google AI → Google AI Fundamentals badge
    if (
      name === "google ai" ||
      credId === "AGNE8JCWOITV" ||
      (name.includes("google") &&
        name.includes("ai") &&
        !name.includes("brainstorming"))
    ) {
      return getBadgeById("google-ai-fundamentals");
    }

    // 2. RAG for Generative AI Applications → Generative AI Essentials for Data Science
    if (name.includes("rag") && name.includes("generative")) {
      return getBadgeById("ibm-genai-essentials");
    }

    // 3. IBM Generative AI Engineering → Generative AI Essentials for Data Science
    if (
      name.includes("generative ai engineering") ||
      (name.includes("generative") &&
        name.includes("engineering") &&
        issuer.includes("ibm"))
    ) {
      return getBadgeById("ibm-genai-essentials");
    }

    // 4. IBM AI Engineering → Artificial Intelligence Essentials V2
    if (name.includes("ai engineering") && issuer.includes("ibm")) {
      return getBadgeById("ibm-ai-essentials-v2");
    }

    // 5. IBM Data Science (not Foundations) → IBM Data Science Professional Certificate (V3)
    if (
      name.includes("data science") &&
      !name.includes("foundations") &&
      issuer.includes("ibm")
    ) {
      return getBadgeById("ibm-data-science-prof");
    }

    return null;
  };

  const matchedPredefined = getPredefinedBadge();

  // 1. If an image was uploaded (e.g. Cloudinary, local file, or custom URL)
  if (customBadgeUrl) {
    // If it's an old legacy blurry linkedin_thumb, prefer verified high-res or strip the thumb prefix
    if (customBadgeUrl.includes("linkedin_thumb_")) {
      if (matchedPredefined) {
        return matchedPredefined;
      }
      return {
        id: `badge-${name.replace(/[^a-z0-9]/g, "-") || "custom"}`,
        name: cert.name,
        issuer: cert.issuer || "Verified",
        imageUrl: customBadgeUrl.replace(/linkedin_thumb_/, ""),
        publicUrl: customPublicUrl || undefined,
      };
    }

    // Explicit custom badge uploaded via Admin Dashboard (e.g., Cloudinary)
    return {
      id: `badge-${name.replace(/[^a-z0-9]/g, "-") || "custom"}`,
      name: cert.name,
      issuer: cert.issuer || "Verified",
      imageUrl: customBadgeUrl,
      publicUrl: customPublicUrl || matchedPredefined?.publicUrl || undefined,
    };
  }

  // 2. No custom image uploaded; use matched predefined verified Credly badge if any
  return matchedPredefined;
}
