"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import Link from "next/link";
import { title } from "@/components/primitives";
import { Pen } from "lucide-react";
import type { Post } from "@/types/post";
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

  return (
    <div className="flex flex-col gap-10">

    <h1 className="font-passions text-8xl">
      {post.title}
    </h1>

    <Card className="mb-4 p-3 w-full">
      <CardHeader className="flex justify-between items-start gap-4">

        <PostHeaderInfo post={post} />

        <div className="flex gap-1">
          <DeletePost postId={post.id} onDeleted={handlePostDelete}/>

          <Button as={Link}
            href={`/posts/${post.id}/edit`}
            isIconOnly
            size="sm"
            variant="light"
          >
            <Pen className="w-4 h-4" />
          </Button>

        </div>
      </CardHeader>

      <CardBody>
        <div className="sun-content">
          <div className="text-default-700 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
        </div>
      </CardBody>
    </Card>

    <Link href="/">
      <Button
          size="sm"
          className="bg-linear-to-tr from-rose-300 to-pink-400 shadow-lg tracking-widest px-8"
          radius="full"
      >
        на главную
      </Button>
    </Link>

    </div>
  );
}

export { ViewPost }
