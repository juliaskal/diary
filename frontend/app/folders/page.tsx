"use client";
import { useEffect, useState } from "react";
import type { Folder } from "@/types/folder";
import {Spinner} from "@heroui/spinner";
import { siteConfig } from "@/config/site";
import { FoldersPage } from "@/components/Folder";


export default function Folders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${siteConfig.backendDomain}/api/folders`)
      .then((res) => res.json())
      .then((data: Folder[]) => {
        setFolders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  function handleFolderDelete(folderId: string) {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
  }

  if (loading) return
  <div className="flex justify-center items-center min-h-[40vh]">
    <Spinner size="lg" />
  </div>;

  return (
      <FoldersPage folders={folders} onDelete={handleFolderDelete}/>
  );
}
