"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronDown, ImageOff, ExternalLink } from "lucide-react";
import type { Book } from "@/lib/books";

interface BookCardProps {
  book: Book;
  rank: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function BookCard({ book, rank, isOpen, onToggle }: BookCardProps) {
  const panelId = useId();
  const [coverFailed, setCoverFailed] = useState(false);
  const [titleExpanded, setTitleExpanded] = useState(false);
  const showCover = book.coverImageUrl && !coverFailed;
  const isFeatured = rank <= 2;

  return (
    <li
      className={`rounded-xl bg-white p-4 shadow-sm shadow-slate-100 dark:bg-slate-800 dark:shadow-black/20 ${
        isFeatured
          ? "border-2 border-indigo-300 dark:border-indigo-500"
          : "border border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
          {rank}
        </span>

        {showCover ? (
          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-900">
            <Image
              src={book.coverImageUrl!}
              alt={`${book.title} cover`}
              fill
              sizes="48px"
              className="object-cover"
              onError={() => setCoverFailed(true)}
            />
          </div>
        ) : (
          <div
            className="flex h-16 w-12 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-600 dark:bg-slate-900"
            aria-hidden="true"
          >
            <ImageOff className="h-4 w-4 text-slate-300 dark:text-slate-500" />
            <span className="text-[8px] font-medium leading-none text-slate-400 dark:text-slate-500">
              No image
            </span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            <button
              type="button"
              onClick={() => setTitleExpanded((expanded) => !expanded)}
              className={`text-left hover:underline focus:outline-none focus:underline ${
                titleExpanded ? "" : "line-clamp-2"
              }`}
            >
              {book.title}
            </button>
          </h3>
          {book.author && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
          )}
          <p className="mt-1 line-clamp-5 text-sm text-slate-600 dark:text-slate-400">{book.description}</p>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            {book.amazonUrl && (
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 hover:underline dark:text-slate-400 dark:hover:text-indigo-400"
              >
                View on Amazon
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {book.category}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={panelId}
            className="mt-2 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:underline dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Do you want to check table of contents?
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {isOpen && (
            <div
              id={panelId}
              className="mt-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200"
            >
              <span>{book.whyThisBook}</span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
