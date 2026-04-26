"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { siteConfig } from "@/config/site";
import type { Post } from "@/types/post";
import type { Folder } from "@/types/folder";
import { Search } from "@/components/Search";

interface SearchResult {
  posts: Post[];
  folders: Folder[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult>({ posts: [], folders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults({ posts: [], folders: [] });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${siteConfig.backendDomain}/api/search?q=${encodeURIComponent(query)}`
        );
        const data: SearchResult = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
        setResults({ posts: [], folders: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <Search query={query} results={results} />
  );
}
