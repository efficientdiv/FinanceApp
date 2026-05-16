import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function Card({ className = '', children, onClick }: CardProps) {
  return (
    <div className={cn('card rounded-2xl ring-soft', className)} onClick={onClick}>
      {children}
    </div>
  )
}
