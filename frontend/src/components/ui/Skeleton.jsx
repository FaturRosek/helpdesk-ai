export default function Skeleton({
  className = "",
  lines = 1,
}) {
  if (lines > 1) {
    return (
      <div className="space-y-2.5 animate-pulse">
        {Array.from({ length: lines }).map((_, idx) => (
          <div
            key={idx}
            className={`h-4 bg-slate-200/70 rounded-md ${idx === lines - 1 ? "w-2/3" : "w-full"} ${className}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`animate-pulse bg-slate-200/70 rounded-md ${className}`} />
  );
}
