import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-white/[0.04]',
        className
      )}
    />
  )
}

export function HeroSummarySkeleton() {
  return (
    <div className="card rounded-2xl ring-soft p-7 pb-2">
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-14 w-72 mb-4" />
      <Skeleton className="h-4 w-48 mb-6" />
      <Skeleton className="h-[220px] w-full rounded-xl" />
    </div>
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="card rounded-2xl ring-soft p-5">
      <Skeleton className="h-3 w-28 mb-4" />
      <Skeleton className="h-8 w-36 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}

export function MetricRowSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => <MetricCardSkeleton key={i} />)}
    </div>
  )
}

export function AccountsStripSkeleton() {
  return (
    <div className="card rounded-2xl ring-soft p-2.5">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-3 w-28 mb-3" />
            <Skeleton className="h-7 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton({ lines = 3, height = 'h-64' }: { lines?: number; height?: string }) {
  return (
    <div className={`card rounded-2xl ring-soft p-6 ${height}`}>
      <Skeleton className="h-4 w-36 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-12 w-full rounded-xl mb-2 ${i === lines - 1 ? 'opacity-50' : ''}`} />
      ))}
    </div>
  )
}
