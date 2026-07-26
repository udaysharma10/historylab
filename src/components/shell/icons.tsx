// V2 shell icon set — inline stroke icons per DESIGN_LANGUAGE_V2.md.
// Every svg carries viewBox="0 0 24 24" (clipping lesson from the mockup rounds).

interface IconProps {
  className?: string
}

function base(className?: string) {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: className ?? 'w-[18px] h-[18px] shrink-0',
  }
}

export function IconHome({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  )
}

export function IconPencil({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5l4 4L7 21H3v-4z" />
    </svg>
  )
}

export function IconTarget({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.5" />
    </svg>
  )
}

export function IconLayers({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  )
}

export function IconCalendar({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  )
}

export function IconMap({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  )
}

export function IconImage({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="M21 15l-5-5-9 9" />
    </svg>
  )
}

export function IconBook({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z" />
    </svg>
  )
}

export function IconClock({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

export function IconChevronLeft({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

export function IconClose({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function IconQuiz({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 .3c0 1.7-2.5 2.2-2.5 3.7" />
      <path d="M12 17h.01" />
    </svg>
  )
}
