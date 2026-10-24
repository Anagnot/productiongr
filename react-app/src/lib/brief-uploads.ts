// Files attached to the quote brief. The browser uploads them straight to the
// private Vercel Blob store (bypassing Vercel's 4.5MB function body limit);
// /api/contact attaches them to the email and then deletes them. The wizard
// checks these limits for instant feedback, the API routes enforce them.

export const BRIEF_UPLOAD_PREFIX = "quote-briefs/";

export const MAX_BRIEF_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_BRIEF_FILES = 10;
// Base64 in the email adds ~33%, so 20MB stays under Resend's 40MB cap and
// common inbox limits.
export const MAX_BRIEF_TOTAL_BYTES = 20 * 1024 * 1024;

export const BRIEF_CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function briefExtension(name: string): string | null {
  const lower = name.toLowerCase();
  return (
    Object.keys(BRIEF_CONTENT_TYPES).find((ext) => lower.endsWith(ext)) ?? null
  );
}

// A flat path inside the brief folder, with an accepted extension.
export function isBriefPathname(pathname: string): boolean {
  return (
    pathname.startsWith(BRIEF_UPLOAD_PREFIX) &&
    !pathname.slice(BRIEF_UPLOAD_PREFIX.length).includes("/") &&
    briefExtension(pathname) !== null
  );
}
