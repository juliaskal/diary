import { siteConfig } from "@/config/site";
import type { Folder } from "@/types/folder";

export async function getFolderById(folderId: string): Promise<Folder> {
  const res = await fetch(
    `${siteConfig.backendDomain}/api/folder/${folderId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load folder");
  }

  return res.json();
}
