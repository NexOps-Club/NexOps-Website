import type { Tone } from "@/components/3d/topology";

export type DomainId = "cn" | "cc" | "devops";

export interface DomainInfo {
  id: DomainId;
  /** Index of the anchor (hub) node in the hero topology. */
  hub: number;
  short: string;
  name: string;
  tone: Tone;
  analogy: string;
  tools: string[];
  build: string;
}

export const DOMAINS: DomainInfo[] = [
  {
    id: "cn",
    hub: 0,
    short: "CN",
    name: "Computer Networks",
    tone: "blue",
    analogy: "The plumbing and traffic rules of the internet: how data travels from your phone to a server across the globe.",
    tools: ["Wireshark", "Linux iptables", "BGP", "DNS"],
    build: "Configure a multi-VLAN lab network from scratch.",
  },
  {
    id: "cc",
    hub: 1,
    short: "CC",
    name: "Cloud Computing",
    tone: "cyan",
    analogy: "Renting and scaling supercomputers on demand instead of buying hardware.",
    tools: ["AWS", "Google Cloud", "Terraform", "Kubernetes"],
    build: "Provision a VPC and deploy a load-balanced app with Terraform.",
  },
  {
    id: "devops",
    hub: 2,
    short: "DevOps",
    name: "DevOps",
    tone: "violet",
    analogy: "Automating how code goes from a laptop to millions of users without breaking.",
    tools: ["Git", "Docker", "GitHub Actions", "Prometheus"],
    build: "A CI/CD pipeline that tests, builds and ships your app on every push.",
  },
];
