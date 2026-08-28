import { BookOpen } from "lucide-react";

interface BookInsightLogoProps {
  variant?: "light" | "dark";
}

export default function BookInsightLogo({
  variant = "light",
}: BookInsightLogoProps) {
  const isDark = variant === "dark";

  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          isDark ? "bg-white/10" : "bg-indigo-100 dark:bg-indigo-900/60"
        }`}
      >
        <BookOpen
          className={
            isDark
              ? "h-5 w-5 text-white"
              : "h-5 w-5 text-indigo-600 dark:text-indigo-300"
          }
          aria-hidden="true"
        />
      </span>
      <div>
        <p
          className={`text-lg font-bold leading-tight ${
            isDark ? "text-white" : "text-slate-900 dark:text-slate-100"
          }`}
        >
          Book Insight
        </p>
        {variant === "light" && (
          <p className="text-xs leading-tight text-slate-500 dark:text-slate-400">
            Smart recommendations.
            <br />
            Smarter learning.
          </p>
        )}
      </div>
    </div>
  );
}
