import { siteConfig } from "@/config/site";
import type { PostPage } from "@/types/postPage";

export interface GetPostsPageParams {
  page?: number;
  pageSize?: number;
  folderId?: string;
}

export async function getPostsPage({
  page = 1,
  pageSize = 10,
  folderId,
}: GetPostsPageParams = {}): Promise<PostPage> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (folderId) {
    params.set("folder_id", folderId);
  }

  const res = await fetch(`${siteConfig.backendDomain}/api/posts?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to load posts");
  }

  return res.json();
}
