"use client";

import { GlassCard } from "@/components/GlassCard";
import { StatusMessage } from "@/components/StatusMessage";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Sparkles, CheckCircle2, ShieldCheck, Send, Loader2 } from "lucide-react";
import { useTurnstile } from "@/hooks/useTurnstile";

export default function JoinPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
    year: "1st Year",
    branch: "CSE",
    track: "DevOps & CI/CD",
    experienceLevel: "Curious Beginner",
    githubUrl: "",
    motivation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const turnstile = useTurnstile();

  const steps = [
    {
      step: "01",
      title: "Online Application",
      desc: "Fill out the registration form detailing your background and which tech track interests you.",
    },
    {
      step: "02",
      title: "Guided Mini-Task",
      desc: "Complete a fun, 3-day beginner-friendly mini-challenge (e.g. running a Dockerized web server or writing a shell script).",
    },
    {
      step: "03",
      title: "Informal Peer Chat",
      desc: "A 10-minute casual conversation with club leads to discuss your interests, goals, and team fit.",
    },
    {
      step: "04",
      title: "Cluster Onboarding",
      desc: "Get invited to our private Discord tracks, receive cloud sandbox access, and join weekly lab cohorts.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          turnstileToken: turnstile.token,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.message || "Failed to submit application. Please check your fields.");
      }
    } catch {
      setErrorMessage("Network error connecting to the registration server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <PageHeader
        icon={Sparkles}
        badge="Membership Recruitment 2026"
        title="Join the Cloud & DevOps Club"
        description={
          <>
            Open to all branches and skill levels. Whether you have never opened a Linux terminal or already run a
            homelab cluster, there is a place for you.
          </>
        }
      />

      {/* Recruitment Process Steps */}
      <div className="space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-brand font-semibold">How It Works</span>
          <h2 className="text-xl sm:text-2xl font-bold text-ink mt-1">Recruitment Process</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div key={st.step} className="panel p-6 space-y-3 relative hover:border-line-strong transition">
              <div className="text-xs font-mono font-bold text-brand">STEP {st.step}</div>
              <h3 className="text-base font-bold text-ink">{st.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Criteria & Application Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Criteria & Expectations */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard title="~/join/requirements">
            <div className="p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand" />
                <span>Eligibility & Requirements</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-ink-soft">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <span>
                    <strong>All Disciplines Welcome:</strong> CSE, IT, ECE, Mechanical, Data Science — enthusiasm
                    matters far more than major.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <span>
                    <strong>Curiosity over Credentials:</strong> We don&apos;t expect you to know Kubernetes on day one.
                    We teach from scratch.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <span>
                    <strong>Weekly Commitment:</strong> ~3 to 4 hours per week for lab sessions, workshops, and group
                    projects.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <span>
                    <strong>Team Mindset:</strong> Collaborative, helpful, and eager to give back to fellow students.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-canvas/80 border border-line text-xs text-muted space-y-2">
                <p className="font-semibold text-ink-soft">Got questions before applying?</p>
                {siteConfig.contact.email ? (
                  <p>
                    Reach out anytime by email at{" "}
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-brand hover:underline">
                      {siteConfig.contact.email}
                    </a>
                    .
                  </p>
                ) : (
                  <p>Use the Contact page to send us a message and we will get back to you.</p>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right: Application Form */}
        <div className="lg:col-span-7">
          <GlassCard title="~/join/apply">
            <div className="p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-brand border border-primary/40">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-ink">Application Submitted!</h3>
                  <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-ink-soft">{formData.fullName}</strong>. We have received your
                    recruitment form for the <strong className="text-brand">{formData.track}</strong> track.
                  </p>
                  <div className="p-4 rounded-lg bg-canvas border border-line text-xs text-muted max-w-sm mx-auto text-left space-y-1">
                    <p className="font-medium text-ink-soft">Next Step:</p>
                    <p>
                      Check your email ({formData.email}) for the Discord onboarding invitation and mini-task briefing!
                    </p>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: "",
                          email: "",
                          phone: "",
                          studentId: "",
                          year: "1st Year",
                          branch: "CSE",
                          track: "DevOps & CI/CD",
                          experienceLevel: "Curious Beginner",
                          githubUrl: "",
                          motivation: "",
                        });
                      }}
                      className="rounded-lg bg-sunken hover:bg-line-strong px-4 py-2 text-xs font-semibold text-ink-soft transition"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-ink">Member Sign-Up Form</h3>
                    <p className="text-xs text-muted">
                      Takes less than 3 minutes. All fields marked with * are required.
                    </p>
                    {errorMessage && (
                      <StatusMessage tone="error" className="mt-3">
                        {errorMessage}
                      </StatusMessage>
                    )}
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="join-field-1" className="block text-xs font-medium text-ink-soft mb-1">Full Name *</label>
                      <input id="join-field-1"
                        type="text"
                        required
                        placeholder="e.g. Maya Sharma"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="join-field-2" className="block text-xs font-medium text-ink-soft mb-1">College / Personal Email *</label>
                      <input id="join-field-2"
                        type="email"
                        required
                        placeholder="maya@college.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone & Student ID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="join-field-3" className="block text-xs font-medium text-ink-soft mb-1">Phone / WhatsApp Number</label>
                      <input id="join-field-3"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="join-field-4" className="block text-xs font-medium text-ink-soft mb-1">Student ID / Roll No. *</label>
                      <input id="join-field-4"
                        type="text"
                        required
                        placeholder="23CSE401"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  {/* Year & Branch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="join-field-5" className="block text-xs font-medium text-ink-soft mb-1">Academic Year *</label>
                      <select id="join-field-5"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="1st Year">1st Year (Freshman)</option>
                        <option value="2nd Year">2nd Year (Sophomore)</option>
                        <option value="3rd Year">3rd Year (Junior)</option>
                        <option value="4th Year">4th Year (Senior)</option>
                        <option value="Postgraduate">Postgraduate (M.Tech/MCA/MS)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="join-field-6" className="block text-xs font-medium text-ink-soft mb-1">Branch / Department *</label>
                      <select id="join-field-6"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="CSE">Computer Science & Engineering</option>
                        <option value="IT">Information Technology</option>
                        <option value="CyberSec">Cyber Security</option>
                        <option value="DataScience">Data Science / AI</option>
                        <option value="ECE">Electronics & Communication</option>
                        <option value="Other">Other Engineering Major</option>
                      </select>
                    </div>
                  </div>

                  {/* Track Interest & Skill Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="join-field-7" className="block text-xs font-medium text-ink-soft mb-1">Primary Track Interest *</label>
                      <select id="join-field-7"
                        value={formData.track}
                        onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                        className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="DevOps & CI/CD">DevOps & CI/CD Pipelines</option>
                        <option value="Cloud Computing">Cloud Computing (AWS/GCP)</option>
                        <option value="Networking & SysAdmin">Computer Networking & SysAdmin</option>
                        <option value="DevSecOps">DevSecOps & Cloud Security</option>
                        <option value="Outreach & Design">Events, Outreach & Media</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="join-field-8" className="block text-xs font-medium text-ink-soft mb-1">
                        Current Familiarity Level *
                      </label>
                      <select id="join-field-8"
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="Curious Beginner">Curious Beginner (Zero CLI experience)</option>
                        <option value="Basic Git & Linux">Basic Git & Linux commands</option>
                        <option value="Used Docker/Cloud">Have built Docker containers / used AWS</option>
                        <option value="Experienced">Experienced (Homelabs, K8s, CI/CD)</option>
                      </select>
                    </div>
                  </div>

                  {/* GitHub / Portfolio */}
                  <div>
                    <label htmlFor="join-field-9" className="block text-xs font-medium text-ink-soft mb-1">
                      GitHub / LinkedIn / Portfolio URL (Optional)
                    </label>
                    <input id="join-field-9"
                      type="url"
                      placeholder="https://github.com/username"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Motivation */}
                  <div>
                    <label htmlFor="join-field-10" className="block text-xs font-medium text-ink-soft mb-1">
                      Why do you want to join? What do you hope to learn or build? *
                    </label>
                    <textarea id="join-field-10"
                      required
                      rows={3}
                      placeholder="Tell us what excites you about systems, cloud, or automation..."
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover py-3 text-sm font-bold text-on-primary transition active:scale-[0.99] disabled:opacity-50 shadow-md shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Transmitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Club Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
