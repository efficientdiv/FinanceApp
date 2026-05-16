import React from 'react'

interface IcoProps {
  d: React.ReactNode
  size?: number
  stroke?: number
  className?: string
}

function Ico({ d, size = 16, stroke = 1.6, className = '' }: IcoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {d}
    </svg>
  )
}

export const Icons = {
  search: (
    <Ico d={<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>} />
  ),
  bell: (
    <Ico d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" /><path d="M10 21a2 2 0 0 0 4 0" /></>} />
  ),
  settings: (
    <Ico d={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>} />
  ),
  up: (
    <Ico d={<path d="m7 14 5-5 5 5" />} />
  ),
  down: (
    <Ico d={<path d="m7 10 5 5 5-5" />} />
  ),
  arrowUpRight: (
    <Ico d={<><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>} />
  ),
  arrowDownRight: (
    <Ico d={<><path d="M7 7l10 10" /><path d="M17 8v9H8" /></>} />
  ),
  plus: (
    <Ico d={<><path d="M12 5v14" /><path d="M5 12h14" /></>} />
  ),
  filter: (
    <Ico d={<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />} />
  ),
  more: (
    <Ico d={<><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>} />
  ),
  download: (
    <Ico d={<><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>} />
  ),
  close: (
    <Ico d={<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>} />
  ),
  check: (
    <Ico d={<path d="m20 6-11 11-5-5" />} />
  ),
  // category icons
  home: (
    <Ico d={<><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10" /></>} />
  ),
  cart: (
    <Ico d={<><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 7H6" /></>} />
  ),
  car: (
    <Ico d={<><path d="M5 17h14M3 11h18l-2-5H5L3 11Z" /><circle cx="7.5" cy="17" r="1.5" /><circle cx="16.5" cy="17" r="1.5" /></>} />
  ),
  film: (
    <Ico d={<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" /></>} />
  ),
  zap: (
    <Ico d={<path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" />} />
  ),
  coffee: (
    <Ico d={<><path d="M3 8h14v5a5 5 0 0 1-10 0V8Z" /><path d="M17 10h2a2 2 0 1 1 0 4h-2" /><path d="M5 22h14" /></>} />
  ),
  heart: (
    <Ico d={<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />} />
  ),
  shirt: (
    <Ico d={<path d="m4 7 4-3 4 2 4-2 4 3-2 4h-2v9H8v-9H6L4 7Z" />} />
  ),
  briefcase: (
    <Ico d={<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></>} />
  ),
  // nav icons
  dash: (
    <Ico d={<><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>} />
  ),
  wallet: (
    <Ico d={<><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" /><path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-3" /><path d="M21 12h-5a2 2 0 1 0 0 4h5v-4Z" /></>} />
  ),
  chart: (
    <Ico d={<><path d="M3 3v18h18" /><path d="m7 15 3-4 4 3 5-7" /></>} />
  ),
  list: (
    <Ico d={<><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3.5" cy="6" r=".8" /><circle cx="3.5" cy="12" r=".8" /><circle cx="3.5" cy="18" r=".8" /></>} />
  ),
  goal: (
    <Ico d={<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>} />
  ),
  user: (
    <Ico d={<><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></>} />
  ),
  logOut: (
    <Ico d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />
  ),
  arrowLeft: (
    <Ico d={<><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>} />
  ),
  repeat: (
    <Ico d={<><path d="m17 2 4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></>} />
  ),
  edit: (
    <Ico d={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>} />
  ),
  splitSquare: (
    <Ico d={<><path d="M8 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" /><path d="M16 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" /><line x1="12" y1="5" x2="12" y2="19" /></>} />
  ),
  sun: (
    <Ico d={<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>} />
  ),
  moon: (
    <Ico d={<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />} />
  ),
} as const

export type IconKey = keyof typeof Icons
