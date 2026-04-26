"use client";

import { useEffect, useRef, useState } from "react";

import { getPostsPage, type GetPostsPageParams } from "@/shared/api/posts";
import type { Post } from "@/types/post";

interface UsePostsPageParams extends Omit<GetPostsPageParams, "page"> {
  initialPage?: number;
}

export function usePostsPage({
  initialPage = 1,
  pageSize = 10,
  folderId,
}: UsePostsPageParams = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const listTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage, folderId]);

  useEffect(() => {
    let isCancelled = false;

    setLoading(true);
    getPostsPage({
      page,
      pageSize,
      folderId,
    })
      .then((data) => {
        if (isCancelled) {
          return;
        }

        setPosts(data.items);
        setTotalPages(data.pages);
        setTotalItems(data.total);
        setLoading(false);
      })
      .catch((err) => {
        if (isCancelled) {
          return;
        }

        console.error(err);
        setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [page, pageSize, folderId]);

  function handlePostDelete(postId: string) {
    const nextPosts = posts.filter((post) => post.id !== postId);
    const nextTotalItems = Math.max(totalItems - 1, 0);
    const nextTotalPages = Math.ceil(nextTotalItems / pageSize);

    setPosts(nextPosts);
    setTotalItems(nextTotalItems);
    setTotalPages(nextTotalPages);

    if (nextPosts.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    listTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return {
    posts,
    page,
    totalPages,
    totalItems,
    loading,
    listTopRef,
    setPage,
    handlePageChange,
    handlePostDelete,
  };
}
