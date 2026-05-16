interface SectionHeaderProps {
  eyebrow?: string
  title: string
  action?: React.ReactNode
}

export function SectionHeader({ eyebrow, title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        {eyebrow && (
          <div className="text-[10px] font-medium tracking-[0.16em] uppercase text-white/40 mb-1.5">
            {eyebrow}
          </div>
        )}
        <h3 className="text-[15px] font-semibold text-bone">{title}</h3>
      </div>
      {action}
    </div>
  )
}
