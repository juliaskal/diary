"use client";
import { useParams, useRouter } from "next/navigation";
import { PostList } from "@/components/Post/PostList";
import { Spinner } from "@heroui/spinner";
import { usePostsPage } from "@/hooks/usePostsPage";
import { useFolder } from "@/hooks/useFolder";
import { FolderInfo } from "@/components/Folder/FolderInfo";

export default function Folder() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const folderId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { folder, loading: folderLoading } = useFolder(folderId);
  const {
    posts,
    page,
    totalPages,
    loading,
    listTopRef,
    handlePageChange,
    handlePostDelete,
  } = usePostsPage({
    folderId,
  });

  function handleFolderDelete() {
    router.push("/folders");
  }

  if (loading || folderLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!folder) {
    return <div className="mx-auto max-w-4xl px-4 py-6">Папка не найдена</div>;
  }

  return (
    <>
      <FolderInfo folder={folder} onDelete={handleFolderDelete} />
      
      <div ref={listTopRef} className="max-w-4xl mx-auto px-4 py-6">
        <PostList
          posts={posts}
          currentPage={page}
          totalPages={totalPages}
          onDelete={handlePostDelete}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
