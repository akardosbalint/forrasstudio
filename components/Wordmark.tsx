type WordmarkProps = {
  className?: string;
  toneClassName?: string;
};

// Single source of truth for the brand mark — a small gradient "spark" plus
// "MI" carrying the gradient (landing the AI/we wordplay at a glance), used
// identically across Nav, Footer, the public layout, and the CRM chrome.
export function Wordmark({ className = "", toneClassName = "" }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-semibold tracking-tight ${className}`}>
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gradient-brand shadow-[0_0_12px_-1px] shadow-amber/70"
      />
      <span>
        <span className="text-gradient-brand">MI</span> <span className={toneClassName}>Építettük</span>
      </span>
    </span>
  );
}
