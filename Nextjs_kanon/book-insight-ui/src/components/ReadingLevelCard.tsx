import type { LucideIcon } from "lucide-react";
import type { ReadingLevelOption } from "@/lib/books";

interface ReadingLevelCardProps {
  option: ReadingLevelOption;
  icon: LucideIcon;
  selected: boolean;
  onSelect: (value: ReadingLevelOption["value"]) => void;
}

export default function ReadingLevelCard({
  option,
  icon: Icon,
  selected,
  onSelect,
}: ReadingLevelCardProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
        selected
          ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/40"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
      }`}
    >
      <input
        type="radio"
        name="reading-level"
        value={option.value}
        checked={selected}
        onChange={() => onSelect(option.value)}
        className="peer sr-only"
      />
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          selected ? "bg-indigo-100 dark:bg-indigo-900/60" : "bg-slate-100 dark:bg-slate-700"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            selected
              ? "text-indigo-600 dark:text-indigo-300"
              : "text-slate-500 dark:text-slate-400"
          }`}
          aria-hidden="true"
        />
      </span>
      <span className="flex-1">
        <span className="block font-semibold text-slate-900 dark:text-slate-100">
          {option.title}
        </span>
        <span className="block text-sm text-slate-500 dark:text-slate-400">
          {option.description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-indigo-600 dark:border-indigo-400" : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}
      </span>
    </label>
  );
}
