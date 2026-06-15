import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";
import {
  CHANNELS,
  PRODUCTS,
  type CatalogDetails,
  type CatalogEntry,
} from "./catalog-data";
import { CHANNEL_GALLERIES } from "./channel-galleries";

export { CHANNELS, PRODUCTS };
export type { CatalogDetails, CatalogEntry };

export type ResolvedPhoto = {
  src: string;
  displayType?: string;
  brand?: string;
  caption?: string;
  portrait?: boolean;
  hero?: boolean;
};

export type CatalogEntryWithImages = CatalogEntry & {
  images: string[];
  photos: ResolvedPhoto[];
  cover: string | null;
  tagline?: string;
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
  const photos: ResolvedPhoto[] = files.map((f) => ({
    src: `/uploads/products/${slug}/${encodeURIComponent(f)}`,
  }));
  return {
    ...entry,
    photos,
    images: photos.map((p) => p.src),
    cover: photos[0]?.src ?? null,
  };
}

export async function getChannel(slug: string): Promise<CatalogEntryWithImages | null> {
  const entry = CHANNELS.find((c) => c.slug === slug);
  if (!entry) return null;

  // Manifest-driven channels: explicit order, captions and a marked hero.
  const gallery = CHANNEL_GALLERIES[slug];
  if (gallery) {
    const photos: ResolvedPhoto[] = gallery.photos.map((p) => ({
      src: `/uploads/channels/${slug}/${encodeURIComponent(p.file)}`,
      displayType: p.displayType,
      brand: p.brand,
      caption: p.caption,
      portrait: p.portrait,
      hero: p.hero,
    }));
    const hero = photos.find((p) => p.hero) ?? photos[0];
    return {
      ...entry,
      photos,
      images: photos.map((p) => p.src),
      cover: hero?.src ?? null,
      tagline: gallery.tagline,
    };
  }

  // Fallback: list the folder (channels without a curated manifest yet).
  const files = await listImages(path.join(UPLOADS_ROOT, "channels", slug));
  const photos: ResolvedPhoto[] = files.map((f) => ({
    src: `/uploads/channels/${slug}/${encodeURIComponent(f)}`,
  }));
  return {
    ...entry,
    photos,
    images: photos.map((p) => p.src),
    cover: photos[0]?.src ?? null,
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
