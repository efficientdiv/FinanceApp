import { HeroSummarySkeleton, MetricRowSkeleton, AccountsStripSkeleton, CardSkeleton } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="max-w-[1480px] mx-auto px-8 py-8 space-y-6">
      {/* Page header skeleton */}
      <div className="h-20 flex flex-col justify-center space-y-2">
        <div className="h-3 w-40 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-10 w-80 rounded bg-white/[0.04] animate-pulse" />
      </div>

      <HeroSummarySkeleton />
      <MetricRowSkeleton />
      <AccountsStripSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CardSkeleton lines={5} height="h-[420px]" />
        </div>
        <CardSkeleton lines={4} height="h-[420px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CardSkeleton lines={3} height="h-[280px]" />
        </div>
        <CardSkeleton lines={6} height="h-[280px]" />
      </div>
    </div>
  )
}
