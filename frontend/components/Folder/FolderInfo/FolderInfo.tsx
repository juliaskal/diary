"use client";

import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { DeleteFolder } from "@/components/Folder/FolderList/DeleteFolder";
import type { Folder } from "@/types/folder";
import { Pen } from "lucide-react";
import { FOLDER_ICONS, type FolderIconName } from "@/shared/icons";

interface FolderInfoPageProps {
  folder: Folder;
  onDelete: (folderId: string) => void;
}

function FolderInfo({ folder, onDelete }: FolderInfoPageProps) {
  const Icon = folder.icon ? FOLDER_ICONS[folder.icon as FolderIconName] : null;
  const formattedDate = new Date(folder.created_at).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative">
      {folder.cover && (
        <img
          src={folder.cover}
          alt={folder.name}
          className="ml-[calc(50%-50vw)] mt-[calc(0%-12vh)] block w-2xl max-w-none"
        />
      )}

      <div className="absolute inset-0 flex items-center">
        <div className="ml-auto space-y-6 text-right">
          <h1 className="font-passions text-8xl">
            {folder.name}
          </h1>

          <p className="text-sm tracking-[0.15em]">
            изменена: {formattedDate}
          </p>

          <div className="ml-auto flex w-min items-center rounded-full bg-black/25 px-4 py-2 backdrop-blur-sm">
            <span className="text-sm tracking-[0.15em]">icon:</span>
            {Icon && <Icon className="ml-2 h-5 w-5" />}
          </div>

          <div className="flex justify-end gap-1">
            <DeleteFolder
              folderId={folder.id}
              onDeleted={() => onDelete(folder.id)}
            />

            <Button
              as={Link}
              href={`/folders/${folder.id}/edit`}
              isIconOnly
              size="sm"
              variant="light"
            >
              <Pen className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { FolderInfo };
