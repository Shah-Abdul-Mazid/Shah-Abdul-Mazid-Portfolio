export const SCHOLAR_URL: string = import.meta.env.VITE_SCHOLAR_URL ;
export const ORCID_URL: string = import.meta.env.VITE_ORCID_URL;
export const RESEARCHGATE_URL: string = import.meta.env.VITE_RESEARCHGATE_URL;
export const GITHUB_URL: string = import.meta.env.VITE_GITHUB_URL ;
export const LINKEDIN_URL: string = import.meta.env.VITE_LINKEDIN_URL;

export const CORE_RESEARCH_PROFILES = [
  { label: 'Google Scholar', url: SCHOLAR_URL, icon: 'scholar', title: 'Google Scholar Profile & Citations' },
  { label: 'ORCID iD', url: ORCID_URL, icon: 'orcid', title: 'ORCID iD' },
  { label: 'ResearchGate', url: RESEARCHGATE_URL, icon: 'researchgate', title: 'ResearchGate Profile' },
  { label: 'GitHub', url: GITHUB_URL, icon: 'github', title: 'GitHub Profile & Repositories' },
];
