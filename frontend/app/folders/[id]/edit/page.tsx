import type { Folder } from "@/types/folder";
import { FolderForm } from "@/components/Folder/FolderForm";
import clsx from "clsx";
import { title } from "@/components/primitives";
import { getFolderById } from "@/shared/api/folders";

type Props = {
  params: { id: string };
};

export default async function EditFoldersPage({ params }: Props) {
  const folder: Folder = await getFolderById(params.id);

  return (
    <div className="flex flex-col gap-10">
      <h1 className={clsx(title(), "tracking-wider")}>
        изменить папку
      </h1>

      <FolderForm folder={folder} isNew={false} />
    </div>
  );
}
