import { del, list } from "@vercel/blob";
import { BRIEF_UPLOAD_PREFIX } from "@/lib/brief-uploads";

// Daily Vercel Cron (see vercel.json). Deletes brief files that were uploaded
// but never sent, e.g. the visitor abandoned the wizard. Files that were sent
// are already deleted by /api/contact right after the email goes out.
// Vercel calls this with "Authorization: Bearer $CRON_SECRET".

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const cutoff = Date.now() - MAX_AGE_MS;
  let cursor: string | undefined;
  let deleted = 0;
  do {
    const page = await list({ prefix: BRIEF_UPLOAD_PREFIX, cursor });
    const stale = page.blobs
      .filter((blob) => new Date(blob.uploadedAt).getTime() < cutoff)
      .map((blob) => blob.url);
    if (stale.length > 0) {
      await del(stale);
      deleted += stale.length;
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return Response.json({ ok: true, deleted });
}
