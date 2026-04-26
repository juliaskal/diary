"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { cn } from "@/lib/utils";
import type { Folder } from "@/types/folder";
import { DeleteFolder } from "@/components/Folder/FolderList/DeleteFolder";
import { Pen } from "lucide-react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

interface FoldersPageProps {
  folders: Folder[];
  onDelete: (folderId: string) => void;
}

function FolderList({ folders, onDelete }: FoldersPageProps) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <FolderCards className="" folders={folders} onDelete={onDelete} />{" "}
    </div>
  );
};

export { FolderList };

const FolderCards = ({
  folders,
  onDelete,
  className,
}: {
  folders: Folder[];
  onDelete: (folderId: string) => void;
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-6xl px-5", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center gap-1">
          {folders.map((folder, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-3xl"
              initial={{ width: "2.5rem", height: "20rem" }}
              animate={{
                width: activeImage === index ? "24rem" : "7rem",
                height: activeImage === index ? "24rem" : "24rem",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute h-full w-full bg-gradient-to-t from-black/40 to-transparent"
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute flex h-full w-full justify-between items-end p-4"
                  >
                    <Link href={`/folders/${folder.id}`}>
                      <p className="text-left text-sm text-white/70">
                        {folder.name}
                      </p>
                    </Link>

                    <div className="flex gap-1">
                      <DeleteFolder folderId={folder.id} onDeleted={() => onDelete(folder.id)}/>

                      <Button as={Link}
                        href={`/folders/${folder.id}/edit`}
                        isIconOnly
                        size="sm"
                        variant="light"
                      >
                        <Pen className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <img
                src={folder.cover ?? '/images/folder-default.png'}
                className="size-full object-cover"
                alt={folder.name}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { FolderCards };
