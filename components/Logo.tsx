export default function Logo() {
  return (
    <svg
      className="logo-drop"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gota"
    >
      <defs>
        <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--primary-dark)" />
        </linearGradient>
      </defs>
      <path
        d="M24 4C24 4 10 22 10 31a14 14 0 0 0 28 0C38 22 24 4 24 4z"
        fill="url(#dropGrad)"
      />
      <ellipse cx="19" cy="28" rx="3.4" ry="5" fill="#ffffff" opacity="0.65" />
    </svg>
  );
}
