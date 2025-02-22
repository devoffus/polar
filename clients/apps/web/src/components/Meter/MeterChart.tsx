import * as Plot from '@observablehq/plot'
import { TimeInterval } from '@polar-sh/api'
import { timeFormat } from 'd3'
import { GeistMono } from 'geist/font/mono'
import { useCallback, useEffect, useMemo, useState } from 'react'

const primaryColor = 'rgb(0 98 255)'
const primaryColorFaded = 'rgba(0, 98, 255, 0.3)'
const gradientId = 'chart-gradient'
const createAreaGradient = (id: string) => {
  // Create a <defs> element
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

  // Create a <linearGradient> element
  const linearGradient = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'linearGradient',
  )
  linearGradient.setAttribute('id', id)
  linearGradient.setAttribute('gradientTransform', 'rotate(90)')

  // Create the first <stop> element
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop1.setAttribute('offset', '0%')
  stop1.setAttribute('stop-color', primaryColorFaded)
  stop1.setAttribute('stop-opacity', '0.5')

  // Create the second <stop> element
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop2.setAttribute('offset', '100%')
  stop2.setAttribute('stop-color', primaryColorFaded)
  stop2.setAttribute('stop-opacity', '0')

  // Append the <stop> elements to the <linearGradient> element
  linearGradient.appendChild(stop1)
  linearGradient.appendChild(stop2)

  // Append the <linearGradient> element to the <defs> element
  defs.appendChild(linearGradient)

  return defs
}

class Callback extends Plot.Dot {
  private callbackFunction: (index: number | undefined) => void

  public constructor(
    data: Plot.Data,
    options: Plot.DotOptions,
    callbackFunction: (data: any) => void,
  ) {
    // @ts-ignore
    super(data, options)
    this.callbackFunction = callbackFunction
  }

  // @ts-ignore
  public render(
    index: number[],
    _scales: Plot.ScaleFunctions,
    _values: Plot.ChannelValues,
    _dimensions: Plot.Dimensions,
    _context: Plot.Context,
    _next?: Plot.RenderFunction,
  ): SVGElement | null {
    if (index.length) {
      this.callbackFunction(index[0])
    }
    return null
  }
}

const getTicks = (timestamps: Date[], maxTicks: number = 10): Date[] => {
  const step = Math.ceil(timestamps.length / maxTicks)
  return timestamps.filter((_, index) => index % step === 0)
}

const getTickFormat = (
  interval: TimeInterval,
  ticks: Date[],
): ((t: Date, i: number) => any) | string => {
  switch (interval) {
    case TimeInterval.HOUR:
      return (t: Date, i: number) => {
        const previousDate = ticks[i - 1]
        if (!previousDate || previousDate.getDate() < t.getDate()) {
          return timeFormat('%a %H:%M')(t)
        }
        return timeFormat('%H:%M')(t)
      }
    case TimeInterval.DAY:
      return '%b %d'
    case TimeInterval.WEEK:
      return '%b %d'
    case TimeInterval.MONTH:
      return '%b %y'
    case TimeInterval.YEAR:
      return '%Y'
  }
}

interface MeterChartProps {
  data: {
    timestamp: Date
    quantity: number
  }[]
  interval: TimeInterval
  height?: number
  maxTicks?: number
  onDataIndexHover?: (index: number | undefined) => void
}

export const MeterChart: React.FC<MeterChartProps> = ({
  data,
  interval,
  height: _height,
  maxTicks: _maxTicks,
  onDataIndexHover,
}) => {
  const [width, setWidth] = useState(0)
  const height = useMemo(() => _height || 400, [_height])
  const maxTicks = useMemo(() => _maxTicks || 10, [_maxTicks])

  const timestamps = useMemo(
    () => data.map(({ timestamp }) => timestamp),
    [data],
  )
  const ticks = useMemo(
    () => getTicks(timestamps, maxTicks),
    [timestamps, maxTicks],
  )
  const valueFormatter = useMemo(() => {
    const numberFormat = new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
      notation: 'compact',
    })
    return (value: number) => numberFormat.format(value)
  }, [])

  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver((_entries) => {
      if (containerRef) {
        setWidth(containerRef.clientWidth ?? 0)
      }
    })

    if (containerRef) {
      resizeObserver.observe(containerRef)
    }

    return () => {
      if (containerRef) {
        resizeObserver.unobserve(containerRef)
      }
    }
  }, [containerRef])

  const onMouseLeave = useCallback(() => {
    if (onDataIndexHover) {
      onDataIndexHover(undefined)
    }
  }, [onDataIndexHover])

  useEffect(() => {
    if (!containerRef) {
      return
    }

    const plot = Plot.plot({
      style: {
        background: 'none',
      },
      width,
      height,
      marks: [
        () => createAreaGradient(gradientId),
        Plot.axisX({
          tickFormat: getTickFormat(interval, ticks),
          ticks,
          label: null,
          stroke: 'none',
          fontFamily: GeistMono.style.fontFamily,
        }),
        Plot.axisY({
          tickFormat: valueFormatter,
          label: null,
          stroke: 'none',
          fontFamily: GeistMono.style.fontFamily,
        }),
        Plot.areaY(data, {
          x: 'timestamp',
          y: 'quantity',
          fill: `url(#${gradientId})`,
        }),
        Plot.lineY(data, {
          x: 'timestamp',
          y: 'quantity',
          stroke: primaryColor,
          strokeWidth: 2,
        }),
        Plot.ruleX(data, {
          x: 'timestamp',
          stroke: 'currentColor',
          strokeWidth: 1,
          strokeOpacity: 0.2,
        }),
        Plot.ruleX(
          data,
          Plot.pointerX({
            x: 'timestamp',
            stroke: 'currentColor',
            strokeOpacity: 0.5,
            strokeWidth: 2,
          }),
        ),
        Plot.dot(
          data,
          Plot.pointerX({
            x: 'timestamp',
            y: 'quantity',
            fill: primaryColor,
            r: 5,
          }),
        ),
        ...(onDataIndexHover
          ? [
              new Callback(
                data,
                Plot.pointerX({
                  x: 'timestamp',
                  y: 'quantity',
                  fill: primaryColor,
                  fillOpacity: 0.5,
                  r: 5,
                }),
                onDataIndexHover,
              ),
            ]
          : []),
      ],
    })
    containerRef.append(plot)

    return () => plot.remove()
  }, [
    data,
    containerRef,
    interval,
    ticks,
    valueFormatter,
    width,
    height,
    onDataIndexHover,
  ])

  return (
    <div
      className="dark:text-polar-500 w-full text-gray-500"
      ref={setContainerRef}
      onMouseLeave={onMouseLeave}
    />
  )
}
