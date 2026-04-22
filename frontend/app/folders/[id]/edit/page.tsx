import type { Folder } from "@/types/folder";
import { FolderForm } from "@/components/Folder/FolderForm";
import { siteConfig } from "@/config/site";
import clsx from "clsx";
import { title } from "@/components/primitives";

type Props = {
  params: { id: string };
};

async function getFolder(id: string): Promise<Folder> {
  const res = await fetch(
    `${siteConfig.backendDomain}/api/folder/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Не удалось загрузить папку");
  }

  return res.json();
}

export default async function EditFoldersPage({ params }: Props) {
  const folder = await getFolder(params.id);

  return (
    <div className="flex flex-col gap-10">
      <h1 className={clsx(title(), "tracking-wider")}>
        изменить папку
      </h1>

      <FolderForm folder={folder} isNew={false} />
    </div>
  );
}
