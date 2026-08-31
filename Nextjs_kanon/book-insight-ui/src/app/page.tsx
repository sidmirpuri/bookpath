"use client";

import { useState } from "react";
import GoalForm from "@/components/GoalForm";
import ResultsScreen from "@/components/ResultsScreen";
import { getRecommendations } from "@/lib/api";
import type { Book, ReadingLevel } from "@/lib/books";

interface Submission {
  goal: string;
  level: ReadingLevel;
  books: Book[];
}

export default function Home() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(goal: string, level: ReadingLevel) {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const books = await getRecommendations(goal, level);
      setSubmission({ goal, level, books });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong finding your recommendations."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
      {submission ? (
        <ResultsScreen
          goal={submission.goal}
          level={submission.level}
          books={submission.books}
          onStartOver={() => setSubmission(null)}
        />
      ) : (
        <GoalForm
          initialGoal=""
          initialLevel="beginner"
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}
