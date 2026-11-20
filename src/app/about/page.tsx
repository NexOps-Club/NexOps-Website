import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Terminal, Server, HeartHandshake, ArrowRight } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Meet NexOps, the student-driven infrastructure community at SIET Tumakuru: our mission, vision and the principles behind how we learn Cloud, Networking and DevOps.",
  path: "/about",
  keywords: ["about NexOps", "student DevOps community", "SIET Tumakuru"],
});

export default function AboutPage() {
  // Add real milestones here (year, title, desc). The timeline stays hidden until you do.
  const milestones: { year: string; title: string; desc: string }[] = [];

  const values = [
    {
      title: "Zero Gatekeeping",
      desc: "DevOps and cloud can feel intimidating. We believe every beginner can understand containers and networks with welcoming mentors.",
      icon: HeartHandshake,
    },
    {
      title: "Learn by Breaking Things",
      desc: "Real learning happens when you inspect kernel panics, broken ingress controllers, and race conditions in safe sandboxes.",
      icon: Terminal,
    },
    {
      title: "Open Source First",
      desc: "Everything we build — from our recruitment portal to our campus cluster tools — is open-source and free for everyone.",
      icon: Server,
    },
    {
      title: "Production Realism",
      desc: "No toy projects. We focus on real problems: high availability, multi-region latency, automated rollbacks, and security scans.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      <PageHeader
        icon={Terminal}
        badge={`About ${siteConfig.name}`}
        title="Engineering the digital backbone of the campus."
        description={
          <>
            We are the student-driven infrastructure community at {siteConfig.college.name}, dedicated to cultivating
            world-class talent in Cloud Computing, Computer Networking, and Site Reliability Engineering.
          </>
        }
      />

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard title="~/about/mission">
          <div className="p-8 space-y-4 relative overflow-hidden">
            <div className="h-2 w-24 bg-primary rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-ink">Our Mission</h2>
            <p className="text-sm text-muted leading-relaxed">
              To empower students with practical, industry-standard systems knowledge. We eliminate the gap between
              theoretical classroom concepts and real-world production engineering by providing hands-on cloud labs,
              live deployment environments, and peer-to-peer mentorship.
            </p>
          </div>
        </GlassCard>

        <GlassCard title="~/about/vision">
          <div className="p-8 space-y-4 relative overflow-hidden">
            <div className="h-2 w-24 bg-accent rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-ink">Our Vision</h2>
            <p className="text-sm text-muted leading-relaxed">
              To become a premier student hub for systems engineering, recognized nationally for producing exceptional
              cloud architects, SREs, and open-source contributors who build reliable, secure, and scalable software for
              the world.
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-brand font-semibold">Our DNA</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">Principles We Live By</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="panel-inset p-6 space-y-3 hover:border-line-strong transition">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 text-brand flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-ink">{val.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline / Milestones: invented history stays hidden until verified */}
      {milestones.length > 0 && (
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">Evolution</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">Our Journey So Far</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {milestones.map((m) => (
            <div key={m.year} className="panel p-6 space-y-3 relative">
              <div className="text-2xl font-extrabold font-mono text-brand">{m.year}</div>
              <h3 className="text-base font-bold text-ink">{m.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center py-6">
        <p className="text-sm text-muted mb-4">Want to be part of our next chapter?</p>
        <Link
          href="/join"
          className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-6 py-3 text-sm font-bold text-on-primary transition active:scale-95 shadow-md shadow-primary/20"
        >
          <span>Join the Club Community</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
