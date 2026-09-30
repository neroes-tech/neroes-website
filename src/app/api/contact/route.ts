import { NextResponse } from "next/server";
import { z } from "zod";

import { createMailTransport, getMailConfig } from "@/lib/mail";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().max(5000).optional(),
  locale: z.enum(["pt", "en"]).optional(),
  // Honeypot: a field real visitors never see. Bots that fill it get a fake
  // success and nothing is sent.
  website: z.string().max(500).optional(),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Submission = z.infer<typeof ContactSchema>;

/** The notification the team receives. Replying answers the visitor directly. */
async function sendEmail({ name, email, phone, message, locale }: Submission) {
  const config = getMailConfig();
  if (!config.configured) return { ok: false as const, reason: "not_configured" as const };

  const lines = [
    `Nome: ${name}`,
    `Email: ${email}`,
    phone ? `Telefone: ${phone}` : null,
    `Idioma do site: ${locale === "en" ? "inglês" : "português"}`,
    "",
    message || "(sem mensagem)",
  ].filter((line) => line !== null);

  await createMailTransport(config).sendMail({
    from: `"Site Neroes" <${config.user}>`,
    to: config.to,
    replyTo: `"${name.replace(/["\r\n]/g, "")}" <${email}>`,
    subject: `Novo contacto no site — ${name}`,
    text: lines.join("\n"),
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#0a0a0a">
      <h2 style="margin:0 0 16px;font-size:18px">Novo contacto no site neroes.tech</h2>
      <table cellpadding="4" style="border-collapse:collapse">
        <tr><td style="color:#5c5c5c">Nome</td><td><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="color:#5c5c5c">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${phone ? `<tr><td style="color:#5c5c5c">Telefone</td><td>${escapeHtml(phone)}</td></tr>` : ""}
        <tr><td style="color:#5c5c5c">Idioma</td><td>${locale === "en" ? "inglês" : "português"}</td></tr>
      </table>
      <p style="margin:20px 0 6px;color:#5c5c5c">Mensagem</p>
      <p style="margin:0;white-space:pre-wrap">${message ? escapeHtml(message) : "(sem mensagem)"}</p>
      <p style="margin:24px 0 0;font-size:13px;color:#5c5c5c">Responder a este email responde diretamente a ${escapeHtml(name)}.</p>
    </div>`,
  });
  return { ok: true as const };
}

/** Optional copy in Supabase — only when the project is configured and reachable. */
async function saveCopy({ name, email, phone, message }: Submission) {
  if (!supabaseAdmin) return false;
  const { error } = await supabaseAdmin
    .from("contact_submissions")
    .insert({ name, email, phone: phone || null, message: message || null });
  if (error) throw new Error(error.message);
  return true;
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
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }
  const submission = parsed.data;
  if (submission.website) return NextResponse.json({ success: true });

  // Both channels at once; one failing never stops the other. The visitor is
  // told "sent" only if at least one of them really worked.
  const [emailResult, copyResult] = await Promise.allSettled([sendEmail(submission), saveCopy(submission)]);

  const sent = emailResult.status === "fulfilled" && emailResult.value.ok;
  const saved = copyResult.status === "fulfilled" && copyResult.value;

  const why = (reason: unknown) => (reason instanceof Error ? reason.message : String(reason));
  if (emailResult.status === "rejected") {
    console.error(`[contact] email not sent (${why(emailResult.reason)}) — check SMTP_USER / SMTP_PASS.`);
  } else if (!emailResult.value.ok) {
    console.warn(
      "[contact] email not configured — set SMTP_USER and SMTP_PASS (a Google Workspace app password). See .env.example.",
    );
  }
  if (copyResult.status === "rejected") {
    console.warn(`[contact] Supabase copy not saved (${why(copyResult.reason)}).`);
  }

  if (!sent && !saved) {
    const notConfigured = emailResult.status === "fulfilled" && !emailResult.value.ok;
    return NextResponse.json(
      { error: "Message not delivered", reason: notConfigured ? "not_configured" : "delivery_failed" },
      { status: 503 },
    );
  }
  return NextResponse.json({ success: true });
}
