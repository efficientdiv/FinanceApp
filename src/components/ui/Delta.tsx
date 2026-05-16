import { Icons } from './Icons'

interface DeltaProps {
  value: number
  suffix?: string
  size?: 'xs' | 'sm' | 'lg'
  digits?: number
  arrow?: boolean
}

export function Delta({ value, suffix = '%', size = 'sm', digits = 2, arrow = true }: DeltaProps) {
  const positive = value >= 0
  const cls = positive ? 'text-gain' : 'text-loss'
  const txt = (positive ? '+' : '') + value.toFixed(digits) + suffix
  const sz = size === 'lg' ? 'text-base' : size === 'xs' ? 'text-[11px]' : 'text-xs'
  return (
    <span className={`inline-flex items-center gap-0.5 tnum ${cls} ${sz} font-medium`}>
      {arrow && (positive ? Icons.up : Icons.down)}
      {txt}
    </span>
  )
}
