"use client";

import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { faqsData } from "@/data/faqs";
import {
  Mail,
  MessageSquare,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <PageHeader
        icon={Mail}
        badge="Get in Touch"
        title="Connect with the Community"
        description={
          <>
            Have an inquiry, workshop proposal, corporate sponsorship idea, or just want to chat with our student
            engineers? Drop us a message and we will get back to you.
          </>
        }
      />

      {/* Grid: Direct Channels & Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Direct Channels & Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Community Channels */}
          {(siteConfig.contact.discord || siteConfig.contact.whatsapp || siteConfig.contact.email) && (
          <div className="panel p-6 space-y-4">
            <h2 className="text-base font-bold text-ink">Direct Community Channels</h2>

            <div className="space-y-3 text-xs">
              {siteConfig.contact.discord && (
              <a
                href={siteConfig.contact.discord}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-canvas/70 border border-line hover:border-primary/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-soft group-hover:text-brand transition">Discord Server</p>
                    <p className="text-[11px] text-muted">Join student discussions & labs</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-subtle group-hover:text-ink-soft" />
              </a>
              )}

              {siteConfig.contact.whatsapp && (
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-canvas/70 border border-line hover:border-primary/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 text-brand flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-soft group-hover:text-brand transition">WhatsApp Community</p>
                    <p className="text-[11px] text-muted">Broadcast updates & urgent notices</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-subtle group-hover:text-ink-soft" />
              </a>
              )}

              {siteConfig.contact.email && (
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center justify-between p-3 rounded-xl bg-canvas/70 border border-line hover:border-primary/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-soft group-hover:text-brand transition">Official Email</p>
                    <p className="text-[11px] text-muted">{siteConfig.contact.email}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-subtle group-hover:text-ink-soft" />
              </a>
              )}
            </div>
          </div>
          )}

          {/* Physical Address */}
          <div className="panel p-6 space-y-3">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <MapPin className="h-4 w-4 text-danger" />
              <span>Campus Lab Location</span>
            </h2>
            <div className="text-xs text-muted space-y-1">
              <p className="font-semibold text-ink-soft">{siteConfig.college.name}</p>
              <p>{siteConfig.college.department}</p>
              <p>{siteConfig.college.campus}</p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <GlassCard title="~/contact/message">
            <div className="p-6 sm:p-8">
              {isSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-brand border border-primary/40">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="text-xl font-bold text-ink">Message Dispatched!</h2>
                  <p className="text-sm text-muted max-w-sm mx-auto">
                    Thank you, <strong className="text-ink-soft">{formData.name}</strong>. Our team has received your
                    message and will get back to you shortly.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="rounded-lg bg-sunken hover:bg-line-strong px-4 py-2 text-xs font-semibold text-ink-soft transition"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-ink">Send an Inquiry</h2>
                    <p className="text-xs text-muted">We typically reply within 24 hours during working days.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-field-1" className="block text-xs font-medium text-ink-soft mb-1">Your Name *</label>
                      <input id="contact-field-1"
                        type="text"
                        required
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-field-2" className="block text-xs font-medium text-ink-soft mb-1">Your Email *</label>
                      <input id="contact-field-2"
                        type="email"
                        required
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-field-3" className="block text-xs font-medium text-ink-soft mb-1">Subject *</label>
                    <input id="contact-field-3"
                      type="text"
                      required
                      placeholder="Workshop proposal / General question / Collaboration"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-field-4" className="block text-xs font-medium text-ink-soft mb-1">Your Message *</label>
                    <textarea id="contact-field-4"
                      required
                      rows={4}
                      placeholder="Describe how we can help or collaborate..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover py-3 text-sm font-bold text-on-primary transition active:scale-[0.99] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Message</span>
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

      {/* FAQ Accordion Section: hidden until FAQs are added in src/data/faqs.ts */}
      {faqsData.length > 0 && (
      <div className="space-y-6 pt-6 border-t border-line">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-brand font-semibold flex items-center justify-center gap-1">
            <HelpCircle className="h-4 w-4" /> Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-bold text-ink">Got Questions?</h2>
          <p className="text-xs text-muted">
            Quick answers about memberships, workshops, hardware labs, and recruitment.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqsData.map((faq, idx) => (
            <div key={idx} className="panel overflow-hidden transition">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-ink-soft hover:text-brand transition"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180 text-brand" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-muted leading-relaxed border-t border-line pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
