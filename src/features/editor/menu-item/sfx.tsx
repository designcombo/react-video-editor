"use client";
import { useState, useEffect, useCallback } from "react";
import { AudioItem } from "./audio-item";
import { Search, Loader2, Music2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { generateId } from "@designcombo/timeline";
import { dispatch } from "@designcombo/events";
import { ADD_AUDIO } from "@designcombo/state";
import { IAudio } from "@designcombo/types";
import { Input } from "@/components/ui/input";

export function SFX() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IAudio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchSFX = async (query: string, pageNumber: number = 1) => {
    if (pageNumber === 1) {
      setIsLoading(true);
    } else {
      setIsMoreLoading(true);
    }

    try {
      const response = await fetch("/api/audio/sfx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          limit: 30,
          page: pageNumber,
          query: query ? { keys: [query] } : {}
        })
      });
      const data = await response.json();
      if (data.soundEffects) {
        const mappedSFX = data.soundEffects.map((sfx: any) => ({
          id: sfx.id,
          details: {
            src: sfx.src
          },
          name: sfx.name,
          type: sfx.type,
          metadata: {
            author: sfx.description || ""
          }
        }));
        if (pageNumber === 1) {
          setSearchResults(mappedSFX);
        } else {
          setSearchResults((prev: IAudio[]) => [...prev, ...mappedSFX]);
        }
        setHasMore(data.pagination?.hasMore || false);
      } else {
        if (pageNumber === 1) {
          setSearchResults([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch SFX:", error);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((query: string) => {
      setPage(1);
      fetchSFX(query, 1);
    }, 500),
    []
  );
  useEffect(() => {
    fetchSFX("");
  }, []);

  const handleAddAudio = (payload: Partial<IAudio>) => {
    payload.id = generateId();
    console.log(payload);
    dispatch(ADD_AUDIO, {
      payload,
      options: {}
    });
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetch(query);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSFX(searchQuery, nextPage);
  };

  const uniqueResults = Array.from(
    new Map(searchResults.map((item: IAudio) => [item.id, item])).values()
  );

  return (
    <div className="flex flex-1 flex-col max-w-full h-full">
      <div className="flex items-center gap-2 p-4">
        <div className="relative flex-1">
          <Button
            size="sm"
            variant="ghost"
            className="absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
            onClick={() => fetchSFX(searchQuery)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Search className="h-3 w-3" />
            )}
          </Button>
          <Input
            placeholder="Search sound effects..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                fetchSFX(searchQuery);
              }
            }}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <Button
            size="sm"
            variant="outline"
            // onClick={handleClearSearch}
            disabled={isLoading}
          >
            Clear
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1  max-w-full px-4">
        {isLoading && uniqueResults.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : uniqueResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <Music2 size={32} className="opacity-50" />
            <span className="text-sm">No music found</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {uniqueResults.map((audio, index) => (
              <AudioItem
                onAdd={handleAddAudio}
                item={audio}
                key={index}
                playingId={playingId}
                setPlayingId={setPlayingId}
              />
            ))}
          </div>
        )}

        {hasMore && uniqueResults.length > 0 && (
          <div className="py-4 flex justify-center">
            <Button
              onClick={loadMore}
              disabled={isMoreLoading}
              className="bg-primary/60 hover:bg-primary/80"
            >
              {isMoreLoading && <Loader2 className="animate-spin" size={12} />}
              Load More
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
