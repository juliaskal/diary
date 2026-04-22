import { siteConfig } from "@/config/site";
import type { PostPage } from "@/types/postPage";

export interface GetPostsPageParams {
  page?: number;
  pageSize?: number;
  folderId?: string;
  isArchived?: boolean;
  search?: string;
}

export async function getPostsPage({
  page = 1,
  pageSize = 10,
  folderId,
  isArchived,
  search,
}: GetPostsPageParams = {}): Promise<PostPage> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (folderId) {
    params.set("folder_id", folderId);
  }
  if (typeof isArchived === "boolean") {
    params.set("is_archived", String(isArchived));
  }
  if (search?.trim()) {
    params.set("search", search.trim());
  }

  const res = await fetch(`${siteConfig.backendDomain}/api/posts?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to load posts");
  }

  return res.json();
}
