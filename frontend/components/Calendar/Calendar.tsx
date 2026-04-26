import type { Post } from "@/types/post";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { ChevronLeft, ChevronRight, Pen } from "lucide-react";
import { DeletePost } from "@/components/Post/PostCard/DeletePost";
import { siteConfig } from "@/config/site";
import { Link } from "@heroui/link";

interface CalendarProps {
  posts: Post[];
  month: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function Calendar({
  posts,
  month,
  onPrevMonth,
  onNextMonth,
}: CalendarProps) {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  let startingDayOfWeek = firstDay.getDay();
  startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const postsByDate = new Map<string, Post[]>();
  posts.forEach((post) => {
    const postDate = new Date(post.created_at);
    const dateKey = postDate.toISOString().split("T")[0];
    if (!postsByDate.has(dateKey)) {
      postsByDate.set(dateKey, []);
    }
    postsByDate.get(dateKey)!.push(post);
  });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleDelete = async (postId: string) => {
    try {
      setDeleteLoading(postId);
      const response = await fetch(`${siteConfig.backendDomain}/api/post/${postId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getDateKey = (day: number) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    return date.toISOString().split("T")[0];
  };

  const monthName = month.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <Button isIconOnly onClick={onPrevMonth} variant="light">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-passions text-8xl">{monthName}</h1>
        <Button isIconOnly onClick={onNextMonth} variant="light">
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-0 bg-gray-200">
          {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
            <div
              key={day}
              className="p-4 text-center font-semibold text-gray-700 tracking-widest"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0 border-t border-gray-200">
          {calendarDays.map((day, index) => {
            const dateKey = day ? getDateKey(day) : null;
            const dayPosts = dateKey ? postsByDate.get(dateKey) : null;
            const hasPost = dayPosts && dayPosts.length > 0;

            return (
              <div
                key={index}
                className="min-h-[120px] p-3 border-r border-b border-gray-200 relative"
              >
                {day ? (
                  <>
                    <div className="font-semibold text-gray-800 mb-2">
                      {day}
                    </div>
                    {hasPost && (
                      <div className="space-y-1">
                        {dayPosts.map((post) => (
                          <Popover key={post.id} placement="right">
                            <PopoverTrigger>
                              <div
                                className="text-xs bg-pink-400 hover:bg-pink-500 text-white p-1 rounded-full cursor-pointer truncate transition"
                                title={post.title || "без названия"}
                              >
                                {post.title || "без названия"}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-72">
                              <Link href={`/posts/${post.id}`} className="block">
                                <div className="px-1 py-2">
                                  <div className="font-bold text-sm mb-2">
                                    {post.title || "без названия"}
                                  </div>
                                  <div className="text-sm mb-4 max-h-32 overflow-y-auto text-default-700">
                                    { post.content.substring(0, 200).concat("...") }
                                  </div>

                                  <div className="relative flex gap-1">
                                    <DeletePost postId={post.id} onDeleted={() => handleDelete(post.id)} />

                                    <Button
                                      as={Link}
                                      href={`/posts/${post.id}/edit`}
                                      isIconOnly
                                      size="sm"
                                      variant="light"
                                    >
                                      <Pen className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  
                                </div>
                              </Link>
                            </PopoverContent>
                          </Popover>
                        ))}
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { Calendar };
