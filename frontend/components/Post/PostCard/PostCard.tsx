"use client";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Pen } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Emoji } from "react-apple-emojis";
import type { Post } from "@/types/post";
import { EMOTION_ICONS } from "@/shared/icons";
import { DeletePost } from "@/components/Post/PostCard/DeletePost";
import { PostHeaderInfo } from "@/components/Post/PostCard/PostHeaderInfo";

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
}

function PostCard({ post, onDelete }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const emotionIconName = post.emotion ? EMOTION_ICONS[post.emotion] : null;

  const COLLAPSED_HEIGHT = 250;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkHeight = () => {
      setShowToggle(el.scrollHeight > COLLAPSED_HEIGHT);
    };

    checkHeight();

    const images = el.querySelectorAll("img");
    images.forEach((img) => {
      img.addEventListener("load", checkHeight);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", checkHeight);
      });
    };
  }, [post.content_html]);

  return (
      <Card className="mb-4 p-3">
        <CardHeader className="flex justify-between items-start gap-4">
          <div>
              <h2 className="text-lg font-semibold text-default-700 mb-2">
                {post.title ?? ""}
              </h2>

            <PostHeaderInfo post={post} />
          </div>

          <div className="relative flex gap-1">
            <DeletePost postId={post.id} onDeleted={() => onDelete(post.id)} />

            <Button
              as={Link}
              href={`/posts/${post.id}/edit`}
              isIconOnly
              size="sm"
              variant="light"
            >
              <Pen className="w-4 h-4" />
            </Button>

            {emotionIconName && (
              <Emoji
                name={emotionIconName}
                alt={post.emotion ?? "emotion"}
                className="absolute right-0 top-full mt-3 mr-1 h-5 w-5"
                width={20}
                height={20}
              />
            )}
          </div>
        </CardHeader>

        <CardBody>
          <Link 
            key={post.id} 
            href={`/posts/${post.id}`} 
            className="block no-underline"
          >
            <div className="sun-content relative">
              <div
                ref={contentRef}
                className="text-default-700 whitespace-pre-line overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  maxHeight: expanded ? contentRef.current?.scrollHeight : COLLAPSED_HEIGHT,
                }}
                dangerouslySetInnerHTML={{ __html: post.content_html }}
              />

              {showToggle && !expanded && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[hsl(var(--heroui-content1))] to-transparent" />
              )}
            </div>
          </Link>

          {showToggle && (
            <Button
              size="sm"
              className="bg-linear-to-tr from-rose-300 to-pink-400 shadow-lg tracking-widest px-8 inline-flex self-start mt-4 mb-2"
              radius="full"
              onPress={() => setExpanded(!expanded)}
            >
              {expanded ? "свернуть" : "читать далее…"}
            </Button>
          )}
        </CardBody>
      </Card>
  );
}

export { PostCard };
