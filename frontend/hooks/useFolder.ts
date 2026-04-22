"use client";

import { useEffect, useState } from "react";

import { getFolderById } from "@/shared/api/folders";
import type { Folder } from "@/types/folder";

export function useFolder(folderId?: string) {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!folderId) {
      setFolder(null);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    setLoading(true);
    getFolderById(folderId)
      .then((data) => {
        if (isCancelled) {
          return;
        }

        setFolder(data);
        setLoading(false);
      })
      .catch((err) => {
        if (isCancelled) {
          return;
        }

        console.error(err);
        setFolder(null);
        setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [folderId]);

  return {
    folder,
    loading,
  };
}
