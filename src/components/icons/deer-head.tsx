import { SVGProps } from 'react'

export function DeerHead(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Left antler - 5 points */}
      <path d="M7 11 L5 8 L4 5" />
      <path d="M5 8 L3 7" />
      <path d="M5 8 L6 6 L5 4" />
      <path d="M6 6 L8 5" />
      <path d="M6 6 L7 4 L6 2" />

      {/* Right antler - 5 points */}
      <path d="M17 11 L19 8 L20 5" />
      <path d="M19 8 L21 7" />
      <path d="M19 8 L18 6 L19 4" />
      <path d="M18 6 L16 5" />
      <path d="M18 6 L17 4 L18 2" />

      {/* Head */}
      <path d="M12 22 C12 22 8 20 8 16 C8 14 9 12 12 11 C15 12 16 14 16 16 C16 20 12 22 12 22" />

      {/* Ears */}
      <path d="M8 12 L6 10 L7 11" />
      <path d="M16 12 L18 10 L17 11" />

      {/* Eyes */}
      <circle cx="10" cy="15" r="0.5" fill="currentColor" />
      <circle cx="14" cy="15" r="0.5" fill="currentColor" />

      {/* Nose */}
      <ellipse cx="12" cy="18" rx="1.5" ry="1" />
    </svg>
  )
}
