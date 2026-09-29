import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, phone, message } = parsed.data;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "info@neroes.tech";

  // Two independent channels: a copy in Supabase and an email to the team.
  // One failing must not stop the other, and the visitor is only told "sent"
  // if at least one of them actually worked — never a silent loss.
  let saved = false;
  if (supabaseAdmin) {
    try {
      const { error: dbError } = await supabaseAdmin
        .from("contact_submissions")
        .insert({ name, email, phone: phone ?? null, message: message ?? null });
      if (dbError) console.warn("Failed to save contact submission to Supabase:", dbError.message);
      else saved = true;
    } catch (err) {
      console.warn("Supabase unreachable — contact submission not saved:", err);
    }
  } else {
    console.warn("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — skipping DB insert");
  }

  let sent = false;
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP not configured — no notification email sent");
  } else {
    try {
      await transporter.sendMail({
        from: `"Neroes Website" <${process.env.SMTP_USER}>`,
        to: toEmail,
        replyTo: email,
        subject: `New contact from ${name} — neroes.tech`,
        text: [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : null, "", message ?? "(No message)"]
          .filter(Boolean)
          .join("\n"),
        html: `<h2 style="color:#2F465E">New contact — neroes.tech</h2>
               <p><strong>Name:</strong> ${escapeHtml(name)}</p>
               <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
               ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
               ${message ? `<h3>Message</h3><p style="white-space:pre-wrap">${escapeHtml(message)}</p>` : ""}`,
      });
      sent = true;
    } catch (err) {
      console.error("Failed to send contact email:", err);
    }
  }

  if (!saved && !sent) {
    return NextResponse.json(
      { error: "Message not delivered. Please try again or email us directly." },
      { status: 503 },
    );
  }
  return NextResponse.json({ success: true });
}
