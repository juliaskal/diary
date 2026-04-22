import type { Post } from "@/types/post";
import { PostCard } from "@/components/Post/PostCard";
import { Pagination } from "@heroui/pagination";


interface PostListProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  onDelete: (postId: string) => void;
  onPageChange: (page: number) => void;
}

function PostList({
  posts,
  currentPage,
  totalPages,
  onDelete,
  onPageChange,
}: PostListProps) {
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={onDelete}/>
      ))}

      {totalPages > 1 && (
        <footer className="flex w-full items-center justify-center py-3">
          <Pagination
            showControls
            page={currentPage}
            total={totalPages}
            className="mb-6"
            onChange={onPageChange}
          />
        </footer>
      )}

    </div>
  );
}

export { PostList }
