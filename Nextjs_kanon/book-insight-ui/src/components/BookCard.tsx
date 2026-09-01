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
  const showCover = book.coverImageUrl && !coverFailed;

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/20">
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
          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{book.title}</h3>
              {book.author && (
                <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex shrink-0 items-center gap-1 self-start text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:underline dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Why this book?
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{book.description}</p>

          {book.amazonUrl && (
            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 hover:underline dark:text-slate-400 dark:hover:text-indigo-400"
            >
              View on Amazon
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}

          {isOpen && (
            <div
              id={panelId}
              className="mt-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200"
            >
              {book.whyThisBook}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
