import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import {
  BRIEF_CONTENT_TYPES,
  MAX_BRIEF_FILE_BYTES,
  briefExtension,
  isBriefPathname,
} from "@/lib/brief-uploads";

// Issues short-lived client tokens so the quote wizard can upload brief files
// directly to the private Vercel Blob store. BLOB_READ_WRITE_TOKEN lives in
// .env.local (and in Vercel env vars for production).

const TOKEN_TTL_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const ext = briefExtension(pathname);
        if (!ext || !isBriefPathname(pathname)) {
          throw new Error(`Pathname not allowed: ${pathname}`);
        }
        return {
          allowedContentTypes: [BRIEF_CONTENT_TYPES[ext]],
          maximumSizeInBytes: MAX_BRIEF_FILE_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + TOKEN_TTL_MS,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    console.error("Quote upload: token request rejected", error);
    return Response.json({ error: "upload-rejected" }, { status: 400 });
  }
}
