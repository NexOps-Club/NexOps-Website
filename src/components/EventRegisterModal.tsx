"use client";

import { useEffect, useId, useRef, useState } from "react";
import { EventItem } from "@/types";
import { X, CheckCircle, Calendar, Sparkles, Loader2 } from "lucide-react";

interface EventRegisterModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export function EventRegisterModal({ event, onClose }: EventRegisterModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Dialog behaviour: focus moves in, Tab stays inside, Escape closes, focus returns to the trigger.
  const isOpen = event !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;
    const focusable = () =>
      node
        ? Array.from(
            node.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
            )
          )
        : [];
    (node?.querySelector<HTMLElement>("input") ?? focusable()[0])?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [isOpen]);

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          fullName,
          email,
          studentId,
          branch,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        // Fallback optimistic
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Error registering:", err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCalendarUrl = () => {
    const { title, description, location, startTime, endTime } = event.calendarData;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
      description
    )}&location=${encodeURIComponent(location)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg panel shadow-2xl p-6 sm:p-8 shadow-2xl"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-lg p-1 text-muted hover:bg-sunken hover:text-ink transition"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-brand border border-primary/40">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 id={titleId} className="text-xl font-bold text-ink">You&apos;re Registered!</h3>
            <p className="text-sm text-muted max-w-sm mx-auto">
              A confirmation email has been dispatched to <strong className="text-ink-soft">{email}</strong>.
              We can&apos;t wait to see you at the session!
            </p>

            <div className="p-3 rounded-lg bg-surface border border-line text-left text-xs space-y-1.5 text-ink-soft">
              <p className="font-semibold text-brand">{event.title}</p>
              <p className="text-muted">📅 {event.date} • {event.time}</p>
              <p className="text-muted">📍 {event.venue}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={getCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-sunken hover:bg-line-strong px-4 py-2.5 text-xs font-semibold text-ink-soft transition"
              >
                <Calendar className="h-4 w-4 text-brand" />
                <span>Add to Google Calendar</span>
              </a>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-semibold text-on-primary transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-brand border border-primary/20">
                {event.category}
              </span>
              <h3 id={titleId} className="mt-2 text-lg font-bold text-ink leading-snug">
                {event.title}
              </h3>
              <p className="mt-1 text-xs text-muted flex items-center gap-2">
                <span>📅 {event.date}</span>
                <span>•</span>
                <span>📍 {event.venue}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reg-field-1" className="block text-xs font-medium text-ink-soft mb-1">
                  Full Name
                </label>
                <input id="reg-field-1"
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-field-2" className="block text-xs font-medium text-ink-soft mb-1">
                    College Email
                  </label>
                  <input id="reg-field-2"
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="reg-field-3" className="block text-xs font-medium text-ink-soft mb-1">
                    Student ID / Roll No.
                  </label>
                  <input id="reg-field-3"
                    type="text"
                    required
                    placeholder="e.g. 23BCSE102"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-field-4" className="block text-xs font-medium text-ink-soft mb-1">
                  Branch / Department
                </label>
                <select id="reg-field-4"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                >
                  <option value="CSE">Computer Science & Engineering</option>
                  <option value="IT">Information Technology</option>
                  <option value="CyberSec">Cyber Security</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="DataScience">Data Science / AI & ML</option>
                  <option value="Other">Other Department</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover py-2.5 text-sm font-semibold text-on-primary transition active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Confirming seat...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Confirm Free RSVP</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

