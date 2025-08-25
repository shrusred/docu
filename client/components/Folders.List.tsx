// client/components/Folders.List.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Folder as FolderIcon, Users, Clock } from "lucide-react";

/** Types */
type Folder = {
  id: string;
  name: string;
  color?: string;
  membersCount?: number;
  lastUpdatedISO?: string;
};

export default function FoldersList() {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement | null>(null);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [canScrollMore, setCanScrollMore] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  /** ---- MOCK: seed folders (replace with your API later) ---- */
  useEffect(() => {
    const mock: Folder[] = Array.from({ length: 22 }).map((_, i) => ({
      id: String(i + 1),
      name:
        [
          "Medical Records",
          "Insurance",
          "Legal",
          "Personal",
          "Taxes",
          "Receipts",
          "Wills & Estate",
          "Education",
          "Investments",
          "Travel",
          "Utilities",
          "Home Docs",
        ][i % 12] + ` ${Math.ceil((i + 1) / 12)}`,
      color: [
        "var(--color-medium-blue)",
        "var(--color-primary)",
        "#305c89",
        "#6fa8dc",
        "var(--color-teal-blue)",
      ][i % 5],
      membersCount: (i * 2) % 5,
      lastUpdatedISO: new Date(Date.now() - i * 86400000).toISOString(),
    }));
    setFolders(mock);
  }, []);

  /** ---- API integration (commented) ---- */
  // useEffect(() => {
  //   let alive = true;
  //   (async () => {
  //     try {
  //       const res = await fetch("/api/folders", { method: "GET" });
  //       if (!res.ok) throw new Error("Failed to fetch folders");
  //       const data: Folder[] = await res.json();
  //       if (alive) setFolders(data);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   })();
  //   return () => {
  //     alive = false;
  //   };
  // }, []);

  /** ---- Show/hide “more …” indicator when overflow exists ---- */
  const checkScroll = () => {
    const scrollEl = document.scrollingElement || document.documentElement;
    // can the page scroll?
    const canScroll =
      (scrollEl?.scrollHeight || 0) > (window.innerHeight || 0) + 2;
    setCanScrollMore(canScroll);
    // are we at (or very near) the bottom?
    const bottomReached =
      (scrollEl?.scrollTop || 0) + (window.innerHeight || 0) >=
      (scrollEl?.scrollHeight || 0) - 2;
    setAtBottom(bottomReached);
  };

  useEffect(() => {
    checkScroll();
    const onScroll = () => checkScroll();
    const onResize = () => checkScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [folders]);

  /** ---- Click handlers ---- */
  const openFolder = (id: string) => {
    router.push(`/dashboard/main/docfolders/${id}`);
  };

  /** ---- Render ---- */
  return (
    <section className="w-full min-h-screen bg-[var(--color-very-light-grey-blue)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* GRID: auto-fit responsive layout */}
        <div
          ref={gridRef}
          className="
            grid gap-4 sm:gap-5 lg:gap-6
            [grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr))]
          "
        >
          {folders.map((folder) => (
            <article
              key={folder.id}
              onClick={() => openFolder(folder.id)}
              className="
                group relative cursor-pointer select-none
                bg-white border border-[var(--color-light-med-grey-blue)]
                rounded-2xl shadow-sm hover:shadow-md transition-shadow
                p-4 sm:p-5
                /* Height scales with viewport while staying usable on small screens */
                h-[clamp(9rem,22vh,14rem)]
                flex flex-col
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl
                    flex items-center justify-center border
                  "
                  style={{
                    background: folder.color || "var(--color-light-med-blue)",
                    borderColor: "var(--color-light-med-grey-blue)",
                  }}
                >
                  <FolderIcon className="w-8 h-8 text-white" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-[15px] sm:text-base md:text-lg text-[var(--color-dark-ink-blue)] font-semibold leading-tight line-clamp-2">
                    {folder.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-[13px] text-[var(--color-mid-greyish-blue)]">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {folder.membersCount ?? 0}
                    </span>
                    {folder.lastUpdatedISO && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(folder.lastUpdatedISO).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional footer area (keeps card heights consistent) */}
              <div className="mt-auto pt-3 text-xs text-[var(--color-mid-greyish-blue)] opacity-80">
                Click to open →
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* “More …” indicator (sticky at bottom) */}
      {canScrollMore && !atBottom && (
        <div
          className="
            pointer-events-none
            fixed bottom-0 inset-x-0 z-40
            flex items-end justify-center
            h-16
            bg-gradient-to-t from-[var(--color-very-light-grey-blue)]/95 to-transparent
          "
        >
          <div className="pointer-events-auto mb-3 rounded-full px-3 py-1 text-sm font-medium text-[var(--color-dark-ink-blue)] bg-white/90 border border-[var(--color-light-med-grey-blue)] shadow-sm">
            …
          </div>
        </div>
      )}
    </section>
  );
}
