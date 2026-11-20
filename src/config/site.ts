export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  college: {
    name: string;
    department: string;
    campus: string;
    city: string;
  };
  contact: {
    email: string;
    discord: string;
    whatsapp: string;
    linkedin: string;
    github: string;
    instagram: string;
    x: string;
  };
  /** Shown as the live indicator in the footer. Edit when the cohort changes. */
  recruitment: {
    open: boolean;
    label: string;
  };
  seo: {
    /** Emit schema.org Event data for upcoming events. Turn off if the listed events are placeholders. */
    publishEventStructuredData: boolean;
  };
  nav: {
    title: string;
    href: string;
  }[];
  /** Labels only: values come from the database (live) or the site's own content data. */
  stats: {
    id: "members" | "registrations" | "events" | "projects";
    label: string;
    description: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: "NexOps",
  shortName: "NexOps",
  tagline: "Think what’s next. Do what’s best.",
  description:
    "The premier student-led technical society for Cloud Computing, Computer Networking, Systems Engineering, and modern DevOps practices at SIET Tumakuru.",
  college: {
    name: "Shridevi Institute of Engineering and Technology (SIET)",
    department: "Departments of Artificial Intelligence & Data Science and Artificial Intelligence & Machine Learning",
    campus: "NH-4, Sira Road",
    city: "Tumakuru, Karnataka 572106",
  },
  /** Fill these in with real values. Anything left empty is hidden across the site. */
  contact: {
    email: "",
    discord: "",
    whatsapp: "",
    linkedin: "",
    github: "",
    instagram: "",
    x: "",
  },
  /** Set open to true and add a label (for example the cohort name) to show the recruiting indicator. */
  recruitment: { open: false, label: "" },
  // Keep false until the listed events are verified real. The Event JSON-LD builder stays available.
  seo: { publishEventStructuredData: false },
  nav: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Events", href: "/events" },
    { title: "Projects", href: "/projects" },
    { title: "Roadmaps", href: "/resources" },
    { title: "Team", href: "/team" },
    { title: "Contact", href: "/contact" },
  ],
  stats: [
    { id: "members", label: "Accepted Members", description: "Applications accepted into the club" },
    { id: "registrations", label: "Event Registrations", description: "Seats booked across our sessions" },
    { id: "events", label: "Events Hosted", description: "Workshops, talks & CTFs run so far" },
    { id: "projects", label: "Member Projects", description: "Tools built by club members" },
  ],
};
