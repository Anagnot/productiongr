import { Resend } from "resend";

// Emails are sent through Resend from the verified production.gr domain.
// RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL live in .env.local
// (and in Vercel env vars for production).

const FORM_SUBJECTS: Record<string, string> = {
  contact: "Νέο μήνυμα επικοινωνίας",
  quote: "Νέο αίτημα προσφοράς (brief)",
};

const MAX_FIELDS = 40;
const MAX_VALUE_LENGTH = 5000;

type SubmissionBody = {
  form: string;
  name: string;
  email: string;
  // Honeypot: real visitors never fill this hidden field.
  website?: string;
  // Pre-localized [label, value] rows, rendered in order.
  fields: [string, string][];
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function parseBody(raw: unknown): SubmissionBody | null {
  if (typeof raw !== "object" || raw === null) return null;
  const body = raw as Record<string, unknown>;
  if (typeof body.form !== "string" || !(body.form in FORM_SUBJECTS)) {
    return null;
  }
  if (typeof body.name !== "string" || body.name.trim() === "") return null;
  if (typeof body.email !== "string" || !isValidEmail(body.email.trim())) {
    return null;
  }
  if (!Array.isArray(body.fields) || body.fields.length > MAX_FIELDS) {
    return null;
  }
  const fields: [string, string][] = [];
  for (const row of body.fields) {
    if (
      !Array.isArray(row) ||
      row.length !== 2 ||
      typeof row[0] !== "string" ||
      typeof row[1] !== "string"
    ) {
      return null;
    }
    fields.push([
      row[0].slice(0, 200),
      row[1].slice(0, MAX_VALUE_LENGTH),
    ]);
  }
  return {
    form: body.form,
    name: body.name.trim().slice(0, 200),
    email: body.email.trim().slice(0, 320),
    website: typeof body.website === "string" ? body.website : "",
    fields,
  };
}

function renderHtml(submission: SubmissionBody): string {
  const rows = submission.fields
    .filter(([, value]) => value.trim() !== "")
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 16px 6px 0;color:#6b6b6b;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">${escapeHtml(value).replaceAll("\n", "<br/>")}</td>
        </tr>`,
    )
    .join("");
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;">
      <h2 style="font-size:16px;color:#1a1a1a;">${escapeHtml(FORM_SUBJECTS[submission.form])} — production.gr</h2>
      <table style="border-collapse:collapse;">${rows}</table>
      <p style="margin-top:24px;font-size:12px;color:#9a9a9a;">
        Στάλθηκε από τη φόρμα «${submission.form === "quote" ? "Ζητήστε προσφορά" : "Επικοινωνία"}» του production.gr.
        Απαντήστε απευθείας σε αυτό το email για να επικοινωνήσετε με τον αποστολέα.
      </p>
    </div>`;
}

function renderText(submission: SubmissionBody): string {
  return submission.fields
    .filter(([, value]) => value.trim() !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const submission = parseBody(raw);
  if (!submission) {
    return Response.json({ ok: false, error: "invalid-body" }, { status: 400 });
  }

  // Bots fill the honeypot; report success so they move on, send nothing.
  if (submission.website && submission.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    console.error("Contact API: missing RESEND/CONTACT env vars");
    return Response.json({ ok: false, error: "server-config" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: to.split(",").map((address) => address.trim()),
    replyTo: `${submission.name} <${submission.email}>`,
    subject: `${FORM_SUBJECTS[submission.form]} — ${submission.name}`,
    html: renderHtml(submission),
    text: renderText(submission),
  });

  if (error) {
    console.error("Contact API: Resend error", error);
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
