"use client";

import { Button } from "@heroui/button";
import { useState } from "react";
import type { Post } from "@/types/post";
import { Input } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { Checkbox } from "@heroui/checkbox";
import {
  fromDate,
  now,
  getLocalTimeZone,
  ZonedDateTime,
} from "@internationalized/date";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/navigation";
import { FolderSelect } from "@/components/Post/PostForm/FolderSelect";
import { Editor } from "@/components/Post/PostForm/SunEditor/Editor";

interface PostFormProps {
  post: Post | null;
  isNew: boolean;
}

function PostForm({ post, isNew = true }: PostFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(post?.title ?? "");
  const [date, setDate] = useState<ZonedDateTime | null>(
    post?.created_at
      ? fromDate(new Date(post.created_at), getLocalTimeZone())
      : now(getLocalTimeZone()),
  );
  const [folder, setFolder] = useState<string | null>(post?.folder?.id ?? null);
  const [get_emotion, setEmotion] = useState<boolean>(false);
  const [content_html, setContent] = useState<string>(post?.content_html ?? "");

  const handleSubmit = async () => {
    const payload = {
      id: post?.id,
      title,
      folder,
      get_emotion,
      content_html,
      created_at: date?.toDate().toISOString(),
    };

    if (!isNew) {
      payload.id = post!.id;
    }

    const url = isNew
      ? `${siteConfig.backendDomain}/api/post/new`
      : `${siteConfig.backendDomain}/api/post/update`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Ошибка при сохранении");
        return;
      }

      const data = await res.json();
      router.push(`/posts/${data.id}`);
    } catch (err) {
      console.error("Ошибка при отправке:", err);
    }
  };

  return (
    <div className="w-full flex flex-col items-start gap-4 text-left">
      <Input
        label="Заголовок"
        labelPlacement="outside"
        variant="bordered"
        value={title}
        onValueChange={setTitle}
      />

      <DatePicker
        hideTimeZone
        showMonthAndYearPickers
        value={date}
        label="Дата"
        variant="bordered"
        hourCycle={24}
        className="max-w-xs"
        onChange={setDate}
      />

      <FolderSelect value={folder} onChange={setFolder} />

      <Checkbox
        id="get_emotion"
        isSelected={get_emotion}
        onValueChange={setEmotion}
      >
        <span className="text-small text-foreground">Распознать эмоцию</span>
      </Checkbox>

      <Editor onChange={setContent} content_html={post?.content_html ?? ""} />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button
          size="sm"
          className="bg-linear-to-tr from-rose-300 to-pink-400 px-8 tracking-widest shadow-lg"
          radius="full"
          onPress={handleSubmit}
        >
          сохранить
        </Button>

        <Link href="/">
          <Button
            size="sm"
            className="bg-linear-to-tr from-neutral-500 to-gray-700 px-8 text-white shadow-lg tracking-widest"
            radius="full"
          >
            отменить
          </Button>
        </Link>
      </div>
    </div>
  );
}

export { PostForm };
