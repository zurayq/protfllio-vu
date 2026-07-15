export type ProjectCategory = "game" | "software" | "experiment";

export type ProjectStatus =
  | "concept"
  | "prototype"
  | "in-development"
  | "playable"
  | "shipped"
  | "archived";

export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  shortTitle?: string;
  category: ProjectCategory;
  eyebrow?: string;
  status: ProjectStatus;
  featured: boolean;
  summary: string;
  description: string;
  year?: string;
  role?: string;
  teamSize?: string;
  stack: string[];
  coverImage?: string;
  coverAlt?: string;
  gallery?: GalleryItem[];
  videoUrl?: string;
  liveUrl?: string;
  sourceUrl?: string;
  devlogUrl?: string;
  problem?: string;
  approach?: string;
  technicalDecisions?: string[];
  features?: {
    available: string[];
    inProgress: string[];
    planned: string[];
  };
  challenges?: string[];
  learnings?: string[];
  nextSteps?: string[];
};

export type Experience = {
  organization: string;
  role: string;
  location?: string;
  workMode?: "remote" | "hybrid" | "on-site";
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
  logo?: string;
  gallery?: GalleryItem[];
};

export type ExperienceEntry = Experience & {
  enabled: boolean;
  placeholder?: boolean;
};

export type Quest = {
  label: string;
  title: string;
  description: string;
  state: "researching" | "building" | "playtesting" | "shipped" | "ongoing";
  marker: string;
};
