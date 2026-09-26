type IconProps = {
  className?: string;
};

export function PlusIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function MoreIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <circle cx="3" cy="8" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="13" cy="8" r="1.25" />
    </svg>
  );
}
