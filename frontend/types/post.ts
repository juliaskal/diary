import type { Folder } from './folder';
import type { Emotion } from './emotion';

export interface Post {
  id: string;
  title: string | null;
  content_html: string;
  created_at: string;
  folder: Folder | null;
  emotion: Emotion | null;
}
