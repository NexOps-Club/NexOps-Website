import { eventsData } from "../data/events";
import { projectsData } from "../data/projects";

/** Counts derived from the site's own content (no estimates). */
export function getContentStats() {
  return {
    events: eventsData.filter((e) => e.status === "past").length,
    projects: projectsData.length,
  };
}

/** Shape returned by GET /api/stats (live database counts). */
export interface LiveStats {
  members: number;
  registrations: number;
}
