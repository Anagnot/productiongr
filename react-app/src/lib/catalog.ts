import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";
import {
  CHANNELS,
  PRODUCTS,
  type CatalogDetails,
  type CatalogEntry,
} from "./catalog-data";

export { CHANNELS, PRODUCTS };
export type { CatalogDetails, CatalogEntry };

export type CatalogEntryWithImages = CatalogEntry & {
  images: string[];
  cover: string | null;
};

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function listImages(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase()))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<CatalogEntryWithImages | null> {
  const entry = PRODUCTS.find((p) => p.slug === slug);
  if (!entry) return null;
  const files = await listImages(path.join(UPLOADS_ROOT, "products", slug));
  return {
    ...entry,
    images: files.map((f) => `/uploads/products/${slug}/${encodeURIComponent(f)}`),
    cover: files[0] ? `/uploads/products/${slug}/${encodeURIComponent(files[0])}` : null,
  };
}

export async function getChannel(slug: string): Promise<CatalogEntryWithImages | null> {
  const entry = CHANNELS.find((c) => c.slug === slug);
  if (!entry) return null;
  const files = await listImages(path.join(UPLOADS_ROOT, "channels", slug));
  return {
    ...entry,
    images: files.map((f) => `/uploads/channels/${slug}/${encodeURIComponent(f)}`),
    cover: files[0] ? `/uploads/channels/${slug}/${encodeURIComponent(files[0])}` : null,
  };
}

export async function getAllProducts(): Promise<CatalogEntryWithImages[]> {
  return Promise.all(
    PRODUCTS.map(async (p) => (await getProduct(p.slug)) as CatalogEntryWithImages),
  );
}

export async function getAllChannels(): Promise<CatalogEntryWithImages[]> {
  return Promise.all(
    CHANNELS.map(async (c) => (await getChannel(c.slug)) as CatalogEntryWithImages),
  );
}
