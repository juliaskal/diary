"use client";

import { FolderList } from "./FolderList";
import NextLink from "next/link";
import { Button } from "@heroui/button";
import { FolderPlus } from 'lucide-react';
import type { Folder } from "@/types/folder";

interface FoldersPageProps {
  folders: Folder[];
  onDelete: (folderId: string) => void;
}

function FoldersPage({ folders, onDelete }: FoldersPageProps) {
  return (
    <div className="flex flex-col gap-10">
      <NextLink href={'/folders/new'}>
        <Button
          className="bg-linear-to-tr from-rose-300 to-pink-400 shadow-lg tracking-widest text-sm px-8"
          radius="full"
        >
          <FolderPlus />
          new folder
        </Button>
      </NextLink>

      <FolderList folders={folders} onDelete={onDelete}/>

    </div>
  );
};

export { FoldersPage };
