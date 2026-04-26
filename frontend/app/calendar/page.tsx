"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { Calendar } from "@/components/Calendar";
import type { Post } from "@/types/post";
import type { PostPage } from "@/types/postPage";
import { siteConfig } from "@/config/site";

export default function CalendarPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [month, setMonth] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const year = month.getFullYear();
        const monthNum = month.getMonth() + 1;
        const monthDate = `${year}-${String(monthNum).padStart(2, "0")}-01`;

        const response = await fetch(
          `${siteConfig.backendDomain}/api/posts-of-month?month_date=${monthDate}`
        );
        const data: PostPage = await response.json();
        setPosts(data.items || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [month]);

  const handlePrevMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
      <Calendar
        posts={posts}
        month={month}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
  );
}
