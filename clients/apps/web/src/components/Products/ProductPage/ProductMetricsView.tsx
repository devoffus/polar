import MetricChartBox from '@/components/Metrics/MetricChartBox'
import { ParsedMetricPeriod } from '@/hooks/queries'
import { dateToInterval } from '@/utils/metrics'
import { Metrics } from '@polar-sh/api'

export interface ProductMetricsViewProps {
  metrics?: Metrics
  periods?: ParsedMetricPeriod[]
  loading: boolean
}

export const ProductMetricsView = ({
  metrics,
  loading,
  periods,
}: ProductMetricsViewProps) => {
  return (
    <div className="flex flex-col gap-y-12">
      <MetricChartBox
        data={periods ?? []}
        loading={loading}
        metric={metrics?.orders}
        interval={dateToInterval(periods?.[0]?.timestamp ?? new Date())}
      />
      <MetricChartBox
        data={periods ?? []}
        loading={loading}
        metric={metrics?.revenue}
        interval={dateToInterval(periods?.[0]?.timestamp ?? new Date())}
      />
    </div>
  )
}
