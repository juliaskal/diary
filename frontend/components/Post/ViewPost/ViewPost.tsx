"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import Link from "next/link";
import { Pen } from "lucide-react";
import type { Post } from "@/types/post";
import { EMOTION_ICONS } from "@/shared/icons";
import { PostHeaderInfo } from "@/components/Post/PostCard/PostHeaderInfo";
import { DeletePost } from "@/components/Post/PostCard/DeletePost";
import { Spinner } from "@heroui/spinner";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/navigation";

type ViewPostProps = { postId: string };

function ViewPost({ postId }: ViewPostProps) {
  const router = useRouter();

  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    setLoading(true);
    fetch(`${siteConfig.backendDomain}/api/post/${postId}`)
      .then((res) => res.json())
      .then((data: Post) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [postId]);

  function handlePostDelete() {
    router.push(`/`);
  }

  if (loading) return <Spinner />;

  if (!post) return <div>Запись не найдена</div>;

  const EmotionIcon = post.emotion ? EMOTION_ICONS[post.emotion] : null;

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-passions text-8xl">{post.title}</h1>

      <Card className="mb-4 w-full p-3">
        <CardHeader className="flex items-start justify-between gap-4">
          <PostHeaderInfo post={post} />

          <div className="flex gap-1">
            <DeletePost postId={post.id} onDeleted={handlePostDelete} />

            <Button
              as={Link}
              href={`/posts/${post.id}/edit`}
              isIconOnly
              size="sm"
              variant="light"
            >
              <Pen className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <div className="sun-content">
            <div
              className="whitespace-pre-line text-default-700"
              dangerouslySetInnerHTML={{ __html: post.content_html }}
            />
          </div>
        </CardBody>
      </Card>

      {post.emotion && (
        <span className="inline-flex items-center gap-2 self-start text-left">
          Дневник распознал эмоцию как: {post.emotion}
          {EmotionIcon && <EmotionIcon className="h-5 w-5" />}
        </span>
      )}

      <Link href="/">
        <Button
          size="sm"
          className="bg-linear-to-tr from-rose-300 to-pink-400 px-8 tracking-widest shadow-lg"
          radius="full"
        >
          на главную
        </Button>
      </Link>
    </div>
  );
}

export { ViewPost };
