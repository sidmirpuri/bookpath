"use client";

import { useId, useState } from "react";
import { ArrowRight, Leaf, BarChart3, Flag, Lock, Loader2, AlertCircle } from "lucide-react";
import BookPathLogo from "./BookPathLogo";
import StepIndicator from "./StepIndicator";
import ReadingLevelCard from "./ReadingLevelCard";
import { READING_LEVELS, type ReadingLevel } from "@/lib/books";

const GOAL_MAX_LENGTH = 300;

const LEVEL_ICONS: Record<ReadingLevel, typeof Leaf> = {
  beginner: Leaf,
  intermediate: BarChart3,
  advanced: Flag,
};

interface GoalFormProps {
  initialGoal: string;
  initialLevel: ReadingLevel;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: (goal: string, level: ReadingLevel) => void;
}

export default function GoalForm({
  initialGoal,
  initialLevel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: GoalFormProps) {
  const [goal, setGoal] = useState(initialGoal);
  const [level, setLevel] = useState<ReadingLevel>(initialLevel);
  const [touched, setTouched] = useState(false);
  const goalId = useId();

  const trimmedGoal = goal.trim();
  const isGoalValid = trimmedGoal.length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (!isGoalValid || isSubmitting) return;
    onSubmit(trimmedGoal, level);
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
      <div className="flex items-start justify-between gap-4">
        <BookPathLogo />
        <StepIndicator currentStep={1} variant="light" />
      </div>

      <form className="mt-8" onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend className="text-xl font-bold text-slate-900 dark:text-slate-100">
            What&rsquo;s your learning goal?
          </legend>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tell us what you want to learn or achieve.
          </p>

          <div className="mt-4">
            <label htmlFor={goalId} className="sr-only">
              Learning goal
            </label>
            <textarea
              id={goalId}
              value={goal}
              maxLength={GOAL_MAX_LENGTH}
              onChange={(event) => setGoal(event.target.value)}
              onBlur={() => setTouched(true)}
              rows={4}
              placeholder="e.g. I have just become the chief financial officer of a start up."
              aria-invalid={touched && !isGoalValid}
              aria-describedby={`${goalId}-count ${goalId}-error`}
              className={`w-full resize-none rounded-xl border bg-white p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900 ${
                touched && !isGoalValid
                  ? "border-red-400 focus:border-red-500 dark:border-red-500"
                  : "border-indigo-300 focus:border-indigo-500 dark:border-indigo-700"
              }`}
            />
            <div className="mt-1 flex items-center justify-between">
              <p
                id={`${goalId}-error`}
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {touched && !isGoalValid
                  ? "Please tell us your learning goal."
                  : ""}
              </p>
              <p
                id={`${goalId}-count`}
                className="shrink-0 text-xs text-slate-400 dark:text-slate-500"
              >
                {goal.length}/{GOAL_MAX_LENGTH}
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Select your reading level
          </legend>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This helps us match content to your current level.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {READING_LEVELS.map((option) => (
              <ReadingLevelCard
                key={option.value}
                option={option}
                icon={LEVEL_ICONS[option.value]}
                selected={level === option.value}
                onSelect={setLevel}
              />
            ))}
          </div>
        </fieldset>

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Finding your recommendations…
            </>
          ) : (
            <>
              Find My Recommendations
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Your input is private and secure.
        </p>
      </form>
    </div>
  );
}
