export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
