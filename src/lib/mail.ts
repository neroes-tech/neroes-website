import nodemailer from "nodemailer";

/**
 * SMTP settings for the contact form. The neroes.tech mailboxes are hosted on
 * Google Workspace (MX: aspmx.l.google.com), so the defaults point there:
 * only SMTP_USER (a neroes.tech Google account) and SMTP_PASS (an app
 * password for that account) are required. Any other provider works by also
 * setting SMTP_HOST / SMTP_PORT. scripts/check-mail.mjs uses the same rules.
 */
export function getMailConfig() {
  const user = process.env.SMTP_USER?.trim();
  // Google shows app passwords in groups of four ("abcd efgh ijkl mnop").
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT?.trim() || 465);
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "info@neroes.tech";
  return { host, port, user, pass, to, configured: Boolean(user && pass) };
}

export type MailConfig = ReturnType<typeof getMailConfig>;

export function createMailTransport(config: MailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    // Fail fast instead of holding the request open until the platform's
    // function timeout.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}
