export function Logo({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      {/* Outer circle (globe) */}
      <circle cx="24" cy="24" r="20" stroke="url(#logoGradient)" strokeWidth="2.5" fill="none" />
      {/* Vertical meridian */}
      <ellipse cx="24" cy="24" rx="8" ry="20" stroke="url(#logoGradient)" strokeWidth="2" fill="none" />
      {/* Horizontal latitude lines */}
      <ellipse cx="24" cy="16" rx="16" ry="4" stroke="url(#logoGradient)" strokeWidth="1.5" fill="none" />
      <ellipse cx="24" cy="32" rx="16" ry="4" stroke="url(#logoGradient)" strokeWidth="1.5" fill="none" />
      {/* Orbital arc */}
      <path
        d="M 8 12 A 24 24 0 0 1 40 36"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small dot at orbit end */}
      <circle cx="40" cy="36" r="3" fill="url(#logoGradient)" />
    </svg>
  );
}
