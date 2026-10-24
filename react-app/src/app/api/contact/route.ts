import { del, get } from "@vercel/blob";
import { Resend } from "resend";
import {
  BRIEF_UPLOAD_PREFIX,
  MAX_BRIEF_FILES,
  MAX_BRIEF_TOTAL_BYTES,
  briefExtension,
  isBriefPathname,
} from "@/lib/brief-uploads";

// Emails are sent through Resend from the verified production.gr domain.
// RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL live in .env.local
// (and in Vercel env vars for production). Quote brief files are read from
// the private Vercel Blob store (BLOB_READ_WRITE_TOKEN) and attached.

const FORM_SUBJECTS: Record<string, string> = {
  contact: "Νέο μήνυμα επικοινωνίας",
  quote: "Νέο αίτημα προσφοράς (brief)",
};

const MAX_FIELDS = 40;
const MAX_VALUE_LENGTH = 5000;

type BriefAttachment = {
  // Blob pathname returned by the client upload.
  pathname: string;
  // Original filename, used for the email attachment.
  name: string;
};

type SubmissionBody = {
  form: string;
  name: string;
  email: string;
  // Honeypot: real visitors never fill this hidden field.
  website?: string;
  // Pre-localized [label, value] rows, rendered in order.
  fields: [string, string][];
  attachments: BriefAttachment[];
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

// Keeps the visitor's filename when it is safe and matches the stored file's
// extension; falls back to the blob's own name otherwise.
function attachmentFilename(name: string, pathname: string): string {
  const cleaned = name.replace(/[\p{Cc}\\/]/gu, "").trim().slice(-150);
  return briefExtension(cleaned) === briefExtension(pathname)
    ? cleaned
    : pathname.slice(BRIEF_UPLOAD_PREFIX.length);
}

function parseAttachments(raw: unknown): BriefAttachment[] | null {
  if (raw === undefined) return [];
  if (!Array.isArray(raw) || raw.length > MAX_BRIEF_FILES) return null;
  const attachments: BriefAttachment[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;
    const { pathname, name } = item as Record<string, unknown>;
    if (
      typeof pathname !== "string" ||
      typeof name !== "string" ||
      !isBriefPathname(pathname)
    ) {
      return null;
    }
    attachments.push({ pathname, name: attachmentFilename(name, pathname) });
  }
  return attachments;
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
  const attachments = parseAttachments(body.attachments);
  if (!attachments || (attachments.length > 0 && body.form !== "quote")) {
    return null;
  }
  return {
    form: body.form,
    name: body.name.trim().slice(0, 200),
    email: body.email.trim().slice(0, 320),
    website: typeof body.website === "string" ? body.website : "",
    fields,
    attachments,
  };
}

async function loadAttachments(files: BriefAttachment[]) {
  let totalBytes = 0;
  const loaded: { filename: string; content: Buffer }[] = [];
  for (const file of files) {
    const result = await get(file.pathname, {
      access: "private",
      useCache: false,
    });
    if (!result || result.statusCode !== 200) {
      throw new Error(`Brief file not found: ${file.pathname}`);
    }
    totalBytes += result.blob.size;
    if (totalBytes > MAX_BRIEF_TOTAL_BYTES) {
      await result.stream.cancel();
      throw new Error("Brief files exceed the total size limit");
    }
    loaded.push({
      filename: file.name,
      content: Buffer.from(await new Response(result.stream).arrayBuffer()),
    });
  }
  return loaded;
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

  let attachments: Awaited<ReturnType<typeof loadAttachments>>;
  try {
    attachments = await loadAttachments(submission.attachments);
  } catch (error) {
    console.error("Contact API: attachment error", error);
    return Response.json(
      { ok: false, error: "attachment-failed" },
      { status: 400 },
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: to.split(",").map((address) => address.trim()),
    replyTo: `${submission.name} <${submission.email}>`,
    subject: `${FORM_SUBJECTS[submission.form]} — ${submission.name}`,
    html: renderHtml(submission),
    text: renderText(submission),
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (error) {
    console.error("Contact API: Resend error", error);
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }

  // The email now carries the files; drop them from storage. Anything left
  // behind is removed by the daily cleanup cron.
  if (submission.attachments.length > 0) {
    try {
      await del(submission.attachments.map((file) => file.pathname));
    } catch (error) {
      console.error("Contact API: blob cleanup failed", error);
    }
  }

  return Response.json({ ok: true });
}
