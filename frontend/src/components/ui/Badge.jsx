export default function Badge({
  children,
  variant = "default",
  status,
  priority,
  size = "md",
  className = "",
}) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  let resolvedVariant = variant;
  let label = children;

  if (status) {
    const s = String(status).toLowerCase().replace(/[_\s]+/g, "");
    if (s === "open") resolvedVariant = "blue";
    else if (s === "pending") resolvedVariant = "yellow";
    else if (s === "inprogress") resolvedVariant = "blue";
    else if (s === "resolved") resolvedVariant = "green";
    else if (s === "closed") resolvedVariant = "gray";
    else resolvedVariant = "gray";
  } else if (priority) {
    const p = String(priority).toLowerCase();
    if (p === "low") resolvedVariant = "gray";
    else if (p === "medium") resolvedVariant = "yellow";
    else if (p === "high") resolvedVariant = "orange";
    else if (p === "urgent") resolvedVariant = "red";
    else resolvedVariant = "gray";
  }

  const variantClasses = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    red: "bg-red-50 text-red-700 border-red-200",
    gray: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeClasses[size] || sizeClasses.md} ${variantClasses[resolvedVariant] || variantClasses.default} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      <span>{label || children}</span>
    </span>
  );
}
