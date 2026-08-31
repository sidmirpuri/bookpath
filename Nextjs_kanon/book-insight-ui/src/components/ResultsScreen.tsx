"use client";

import { useState } from "react";
import { Target, BarChart3, RotateCcw, Bookmark, Check } from "lucide-react";
import BookInsightLogo from "./BookInsightLogo";
import StepIndicator from "./StepIndicator";
import BookCard from "./BookCard";
import { READING_LEVELS, type Book, type ReadingLevel } from "@/lib/books";

interface ResultsScreenProps {
  goal: string;
  level: ReadingLevel;
  books: Book[];
  onStartOver: () => void;
}

export default function ResultsScreen({
  goal,
  level,
  books,
  onStartOver,
}: ResultsScreenProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const levelLabel =
    READING_LEVELS.find((option) => option.value === level)?.title ?? level;

  function handleSave() {
    const lines = [
      "Book Insight — Top 5 Recommendations",
      `Goal: ${goal}`,
      `Reading level: ${levelLabel}`,
      "",
      ...books.map(
        (book, index) =>
          `${index + 1}. ${book.title}${book.author ? ` — ${book.author}` : ""}\n   ${book.description}\n   Why this book? ${book.whyThisBook}`
      ),
    ];
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "book-insight-recommendations.txt";
    anchor.click();
    URL.revokeObjectURL(url);

    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2000);
  }

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 px-6 pb-6 pt-6 sm:px-8 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <BookInsightLogo variant="dark" />
          <StepIndicator currentStep={2} variant="dark" />
        </div>

        <h1 className="mt-8 text-2xl font-bold text-white sm:text-3xl">
          Top 5 Recommendations
        </h1>
        <p className="mt-1 text-sm text-indigo-100/80">
          Based on your goal and reading level
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 sm:grid-cols-2 sm:px-8 dark:border-slate-800 dark:bg-slate-800/50">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/60">
            <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Your Goal</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{goal}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/60">
            <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Reading Level
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{levelLabel}</p>
          </div>
        </div>
      </div>

      <ol className="flex flex-col gap-3 px-6 py-6 sm:px-8">
        {books.map((book, index) => (
          <BookCard
            key={book.title}
            book={book}
            rank={index + 1}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </ol>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-6 sm:flex-row sm:px-8 dark:border-slate-800">
        <button
          type="button"
          onClick={onStartOver}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Start Over
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
        >
          {justSaved ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" aria-hidden="true" />
              Save Recommendations
            </>
          )}
        </button>
      </div>
    </div>
  );
}
