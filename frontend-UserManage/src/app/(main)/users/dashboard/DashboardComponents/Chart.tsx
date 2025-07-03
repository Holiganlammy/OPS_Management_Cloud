// app/dashboard/ChartSection.tsx
"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const chartData = [
  { date: "Apr 2", visitors: 1200, date_full: "April 2" },
  { date: "Apr 8", visitors: 1800, date_full: "April 8" },
  { date: "Apr 14", visitors: 1600, date_full: "April 14" },
  { date: "Apr 21", visitors: 2200, date_full: "April 21" },
  { date: "Apr 28", visitors: 1900, date_full: "April 28" },
  { date: "May 5", visitors: 2800, date_full: "May 5" },
  { date: "May 12", visitors: 2400, date_full: "May 12" },
  { date: "May 19", visitors: 2900, date_full: "May 19" },
  { date: "May 26", visitors: 2100, date_full: "May 26" },
  { date: "Jun 2", visitors: 2600, date_full: "June 2" },
  { date: "Jun 8", visitors: 2300, date_full: "June 8" },
  { date: "Jun 15", visitors: 2700, date_full: "June 15" },
  { date: "Jun 22", visitors: 2500, date_full: "June 22" },
  { date: "Jun 30", visitors: 2800, date_full: "June 30" },
]

type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{
    payload: { date_full: string }
    value: number
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{payload[0].payload.date_full}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visitors: <span className="font-semibold text-gray-900 dark:text-white">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    )
  }
  return null
}

interface ChartSectionProps {
  selectedPeriod: string
  setSelectedPeriod: (period: string) => void
  periods: string[]
}

export default function ChartSection({ selectedPeriod, setSelectedPeriod, periods }: ChartSectionProps) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Visitors
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total for the last 3 months
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={`text-xs px-3 py-1 h-8 ${selectedPeriod === period
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9CA3AF" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#9CA3AF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#9CA3AF" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#6B7280',
                  fontSize: 12,
                }}
                tickMargin={8}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#6B7280"
                strokeWidth={2}
                fill="url(#visitorGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#6B7280",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}