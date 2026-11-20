export type EventLevel = "beginner" | "coder" | "builder";

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: "Workshop" | "Bootcamp" | "Talk" | "Hackathon" | "CTF";
  status: "upcoming" | "past";
  level: EventLevel;
  date: string; // ISO date string or formatted date
  time: string;
  venue: string;
  posterImage?: string;
  description: string;
  highlights: string[];
  instructor?: {
    name: string;
    role: string;
    companyOrYear: string;
    avatarUrl?: string;
  };
  registrationOpen: boolean;
  registrationUrl?: string;
  calendarData: {
    title: string;
    description: string;
    location: string;
    startTime: string; // YYYYMMDDTHHmmssZ
    endTime: string;   // YYYYMMDDTHHmmssZ
  };
  prerequisites?: string[];
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "faculty" | "leads" | "core";
  track?: "Cloud" | "DevOps & CI/CD" | "Networking & SysAdmin" | "DevSecOps" | "Outreach";
  yearOrDesignation: string;
  bio: string;
  photoUrl: string;
  github?: string;
  linkedin?: string;
  email?: string;
  badges?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: "Infrastructure" | "Automation" | "Monitoring" | "Developer Tools";
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
  lead: string;
  featured: boolean;
}

export interface RoadmapStep {
  /** Level title, for example "Level 1: Foundation". */
  title: string;
  /** Skill band and phase, for example "BEGINNER · PHASE 01". */
  stage: string;
  topics: string[];
  tools?: string;
  projects: string[];
  milestone: string;
  /** Optional extra line shown under the level heading. */
  description?: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  /** Short label for the tab. */
  tabLabel: string;
  tagline: string;
  goal: string;
  /** Optional advice shown above the levels. */
  note?: string;
  steps: RoadmapStep[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "membership" | "events" | "tech";
}

