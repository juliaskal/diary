"use client";
import { useEffect, useRef, useState } from "react";
import type { Post } from "@/types/post";
import type { PostPage } from "@/types/postPage";
import { PostList } from "@/components/Post/PostList";
import {Spinner} from "@heroui/spinner";
import { siteConfig } from "@/config/site";

const PAGE_SIZE = 10;

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const listTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${siteConfig.backendDomain}/api/posts?page=${page}&page_size=${PAGE_SIZE}`)
      .then((res) => res.json())
      .then((data: PostPage) => {
        setPosts(data.items);
        setTotalPages(data.pages);
        setTotalItems(data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [page]);

  function handlePostDelete(postId: string) {
    const nextPosts = posts.filter((post) => post.id !== postId);
    const nextTotalItems = Math.max(totalItems - 1, 0);
    const nextTotalPages = Math.ceil(nextTotalItems / PAGE_SIZE);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div ref={listTopRef} className="max-w-4xl mx-auto px-4 py-6">
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
