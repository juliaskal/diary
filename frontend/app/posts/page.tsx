"use client";
import { PostList } from "@/components/Post/PostList";
import {Spinner} from "@heroui/spinner";
import { usePostsPage } from "@/hooks/usePostsPage";

export default function Posts() {
  const {
    posts,
    page,
    totalPages,
    loading,
    listTopRef,
    handlePageChange,
    handlePostDelete,
  } = usePostsPage();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div ref={listTopRef} className="max-w-4xl mx-auto px-4 pb-6">
      <PostList
        posts={posts}
        currentPage={page}
        totalPages={totalPages}
        onDelete={handlePostDelete}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
