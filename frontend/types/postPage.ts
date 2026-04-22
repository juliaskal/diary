import type { Post } from "./post";

export interface PostPage {
  items: Post[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
