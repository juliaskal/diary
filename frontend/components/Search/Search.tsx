"use client";
import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import type { Post } from "@/types/post";
import { Folder } from "@/types/folder";

interface SearchProps {
  query: string;
  results: {
    posts: Post[];
    folders: Folder[];
  };
}

function Search({ query, results }: SearchProps) {

  return (
    <div className="w-full">
      <h1 className="tracking-[0.04em] text-4xl font-bold mb-8">
        результаты поиска <span className="text-pink-400">"{query}"</span>
      </h1>

      {results.posts.length === 0 && results.folders.length === 0 ? (
        <div className="text-center text-default-500 text-lg py-12">
          результаты поиска не найдены
        </div>
      ) : (
        <>
          {results.posts.length > 0 && (
            <div className="mb-12">
              <h2 className="font-bold text-default-700 tracking-wider text-2xl mb-6">
                записи <span className="text-pink-300">({results.posts.length})</span>
              </h2>
              <div className="grid gap-4">
                {results.posts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/posts/${post.id}`} 
                    className="block no-underline"
                  >
                    <Card 
                      className="p-6 hover:shadow-xl transition-shadow cursor-pointer border border-default-200 hover:border-pink-400 transition-all duration-300"
                    >
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-default-700 mb-2">
                          {post.title || ""}
                        </h3>
                        <p className="text-sm text-default-500 font-medium">
                          {new Date(post.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </p>
                        <div
                          className="text-sm text-default-600"
                          dangerouslySetInnerHTML={{
                            __html: post.content_html.substring(0, 350).concat("..."),
                          }}
                        />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.folders.length > 0 && (
            <div>
              <h2 className="font-bold text-default-700 tracking-wider text-2xl mb-6">
                папки <span className="text-blue-300">({results.folders.length})</span>
              </h2>
              <div className="grid gap-4">
                {results.folders.map((folder) => (
                  <Link 
                    key={folder.id} 
                    href={`/folders/${folder.id}`} 
                    className="block no-underline transition-all duration-300"
                  >
                    <Card className="overflow-hidden rounded-3xl w-1/3 h-80 hover:shadow-xl transition-shadow cursor-pointer">
                        <img
                            alt="folder cover"
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full object-cover"
                            src={folder.cover ?? '/images/folder-default.png'}
                        />
                        <CardHeader className="z-10 text-white">
                        <div className="text-sm tracking-widest items-center rounded-full bg-black/25 px-6 py-2 backdrop-blur-sm">
                            {folder.name}
                        </div>
                        </CardHeader>
                        <CardFooter className="z-10 mt-auto flex items-center justify-between">
                            <div className="text-white tracking-widest text-xs items-center rounded-full bg-black/25 px-6 py-2 backdrop-blur-sm">
                            {new Date(folder.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                            </div>
                        </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
    );
}

export { Search };
