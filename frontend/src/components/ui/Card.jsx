export default function Card({
  children,
  className = "",
  padding = "p-5",
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-xs ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
