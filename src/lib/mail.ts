import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";

/**
 * Email service.
 * Messages to the club inbox (contact queries, join applications) are sent over SMTP when SMTP_HOST, SMTP_USER and
 * SMTP_PASS are set in the environment. Without them the notification is only logged and the record is still saved.
 * Confirmations to visitors remain console stubs.
 */

export interface InboxNotification {
  kind: "contact" | "application";
  /** Visitor's name and address; used as the reply-to so replying goes to them. */
  fromName: string;
  fromEmail: string;
  subject: string;
  lines: [label: string, value: string][];
}

export interface EmailService {
  sendApplicationConfirmation(to: string, name: string, track: string): Promise<boolean>;
  sendEventRsvpConfirmation(
    to: string,
    name: string,
    eventTitle: string,
    eventDate?: string,
    venue?: string
  ): Promise<boolean>;
  sendContactAck(to: string, name: string, subject: string): Promise<boolean>;
  notifyInbox(note: InboxNotification): Promise<boolean>;
}

class ConsoleLoggerEmailService implements EmailService {
  private maskEmail(email: string): string {
    const [user, domain] = email.split("@");
    if (!domain) return "***";
    const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
    return `${maskedUser}@${domain}`;
  }

  async sendApplicationConfirmation(to: string, name: string, track: string): Promise<boolean> {
    console.log(
      `[MailService:Stub] Dispatching Application Confirmation to: ${this.maskEmail(to)} | Candidate: ${name} | Track: ${track}`
    );
    return true;
  }

  async sendEventRsvpConfirmation(
    to: string,
    name: string,
    eventTitle: string,
    eventDate?: string,
    venue?: string
  ): Promise<boolean> {
    console.log(
      `[MailService:Stub] Dispatching Event RSVP to: ${this.maskEmail(to)} | Attendee: ${name} | Event: "${eventTitle}" (${eventDate || "TBA"} @ ${venue || "Campus"})`
    );
    return true;
  }

  async notifyInbox(note: InboxNotification): Promise<boolean> {
    console.warn(
      `[MailService:Stub] SMTP is not configured, so this ${note.kind} was NOT emailed to the club inbox. It is saved in the database.`
    );
    return false;
  }

  async sendContactAck(to: string, name: string, subject: string): Promise<boolean> {
    console.log(
      `[MailService:Stub] Dispatching Contact Acknowledgment to: ${this.maskEmail(to)} | Name: ${name} | Subject: "${subject}"`
    );
    return true;
  }
}

const oneLine = (v: string) => v.replace(/[\r\n]+/g, " ").trim();

class SmtpEmailService extends ConsoleLoggerEmailService {
  private transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  async notifyInbox(note: InboxNotification): Promise<boolean> {
    const to = siteConfig.contact.email;
    if (!to) return false;
    const label = note.kind === "contact" ? "Contact" : "Join application";
    try {
      await this.transport.sendMail({
        from: `"${oneLine(siteConfig.name)} website" <${process.env.SMTP_USER}>`,
        to,
        replyTo: { name: oneLine(note.fromName), address: note.fromEmail },
        subject: `[${siteConfig.name} ${label}] ${oneLine(note.subject)}`,
        text: [`From: ${note.fromName} <${note.fromEmail}>`, "", ...note.lines.map(([k, v]) => `${k}: ${v}`)].join("\n"),
      });
      return true;
    } catch (error) {
      console.error("[MailService:SMTP] Send failed:", error instanceof Error ? error.message : "unknown");
      return false;
    }
  }
}

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export const emailService: EmailService = smtpConfigured ? new SmtpEmailService() : new ConsoleLoggerEmailService();

