import type { EventLevel } from "@/types";

export interface LevelInfo {
  id: EventLevel;
  index: string;
  label: string;
  hint: string;
}

export const LEVELS: LevelInfo[] = [
  { id: "beginner", index: "01", label: "New to Tech", hint: "Zero prerequisites, conceptual and guided labs" },
  { id: "coder", index: "02", label: "Know Basic Coding", hint: "Git, APIs, basic Python or JS" },
  { id: "builder", index: "03", label: "Ready to Build Infra", hint: "Docker, K8s, Terraform, networking labs" },
];

export const LEVEL_LABEL: Record<EventLevel, string> = {
  beginner: "New to Tech",
  coder: "Basic Coding",
  builder: "Build Infra",
};
