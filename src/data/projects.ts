import { ProjectItem } from "@/types";

/** Add real projects here. Nothing is listed until you do. */
export const projectsData: ProjectItem[] = [
  {
    id: "ebpf-kubernetes-containment",
    title: "Automated Containment of Compromised Kubernetes Workloads",
    description:
      "A measurement study of automated runtime-security responses on Kubernetes using eBPF tooling. Six responses to a compromised container, from deleting the pod to killing the process in the kernel, are compared on speed, durability, evidence, abuse resistance and cost.",
    category: "Monitoring",
    techStack: ["eBPF", "Falco", "Tetragon", "KubeArmor", "Kubernetes", "Python"],
    githubUrl: "https://github.com/Naveen4421/real_time_security_using_ebpf",
    lead: "Naveen S",
    featured: true,
  },
];
