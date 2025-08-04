import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface PerformanceData {
  date: string
  score: number
  duration: number
  questions: number
}

interface PerformanceChartProps {
  data: PerformanceData[]
  type?: 'line' | 'bar'
}

export const PerformanceChart = ({ data, type = 'line' }: PerformanceChartProps) => {
  const Chart = type === 'line' ? LineChart : BarChart

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>Your interview performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <Chart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'score' ? `${value}%` : 
                name === 'duration' ? `${value} min` : value,
                name === 'score' ? 'Score' :
                name === 'duration' ? 'Duration' : 'Questions'
              ]}
            />
            {type === 'line' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--secondary))" }}
                />
              </>
            ) : (
              <>
                <Bar dataKey="score" fill="hsl(var(--primary))" />
                <Bar dataKey="duration" fill="hsl(var(--secondary))" />
              </>
            )}
          </Chart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}