interface StepIndicatorProps {
  currentStep: 1 | 2;
  variant?: "light" | "dark";
}

export default function StepIndicator({
  currentStep,
  variant = "light",
}: StepIndicatorProps) {
  const isDark = variant === "dark";

  const circleClasses = (step: 1 | 2) => {
    const isActive = step === currentStep;
    if (isActive) {
      return "bg-indigo-600 text-white border-indigo-600";
    }
    return isDark
      ? "bg-transparent text-white/70 border-white/40"
      : "bg-white text-slate-400 border-slate-300 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-600";
  };

  const lineClasses = isDark ? "bg-white/30" : "bg-slate-300 dark:bg-slate-600";

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label={`Step ${currentStep} of 2`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${circleClasses(1)}`}
        aria-current={currentStep === 1 ? "step" : undefined}
      >
        1
      </span>
      <span className={`h-0.5 w-6 rounded-full ${lineClasses}`} />
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${circleClasses(2)}`}
        aria-current={currentStep === 2 ? "step" : undefined}
      >
        2
      </span>
    </div>
  );
}
