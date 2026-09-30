// Checks the contact form's email settings without using the form.
//
//   npm run mail:check          logs in to the SMTP server and reports the result
//   npm run mail:check -- --send   also sends one test email to CONTACT_TO_EMAIL
//
// Reads .env.local (then the process environment) with the same defaults as
// src/lib/mail.ts: Google Workspace, smtp.gmail.com:465. Never prints secrets.
import { existsSync, readFileSync } from "node:fs";
import nodemailer from "nodemailer";

const fileEnv = existsSync(".env.local")
  ? Object.fromEntries(
      readFileSync(".env.local", "utf8")
        .split(/\r?\n/)
        .filter((line) => /^[A-Z0-9_]+=/.test(line))
        .map((line) => {
          const i = line.indexOf("=");
          return [line.slice(0, i), line.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
        }),
    )
  : {};
const env = (name) => (process.env[name] ?? fileEnv[name] ?? "").trim();

const user = env("SMTP_USER");
const pass = env("SMTP_PASS").replace(/\s+/g, "");
const host = env("SMTP_HOST") || "smtp.gmail.com";
const port = Number(env("SMTP_PORT") || 465);
const to = env("CONTACT_TO_EMAIL") || "info@neroes.tech";

console.log(`SMTP ${host}:${port} · user: ${user || "(missing)"} · password: ${pass ? "set" : "(missing)"} · to: ${to}`);
if (!user || !pass) {
  console.log("\nMissing SMTP_USER and/or SMTP_PASS in .env.local — see .env.example.");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 15_000,
});

try {
  await transport.verify();
  console.log("✓ Login accepted — the contact form can send email.");
} catch (error) {
  console.log(`✗ Login failed: ${error.code ?? ""} ${error.response ?? error.message}`.trim());
  if (/535|Username and Password not accepted|BadCredentials/i.test(String(error.response ?? error.message))) {
    console.log("  Google rejected the password. It must be an app password (16 characters) for " + user + ",");
    console.log("  created at https://myaccount.google.com/apppasswords with 2-Step Verification turned on.");
  }
  process.exit(1);
}

if (process.argv.includes("--send")) {
  await transport.sendMail({
    from: `"Site Neroes" <${user}>`,
    to,
    subject: "Teste do formulário de contacto — site Neroes",
    text: "Se recebeu este email, o formulário de contacto do site está a enviar mensagens corretamente.",
  });
  console.log(`✓ Test email sent to ${to}.`);
}
