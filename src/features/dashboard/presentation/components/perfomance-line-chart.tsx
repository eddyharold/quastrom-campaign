import { cn } from "@/domain/utils/common";
import { Line } from "recharts";
import {
  CartesianGrid,
  Legend,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PerformanceLineChartProps {
  data: unknown[];
  categories: string[];
  colors?: string[];
  yAxisWidth?: number;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGridLines?: boolean;
  className?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
}

export const PerformanceLineChart = ({
  data,
  categories,
  colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"],
  yAxisWidth = 40,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  className,
  height = 300,
  valueFormatter = (value: number) => `${value}`,
}: PerformanceLineChartProps) => {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}

          {showXAxis && <XAxis dataKey="name" tickLine={false} axisLine={false} />}

          {showYAxis && <YAxis width={yAxisWidth} tickLine={false} axisLine={false} tickFormatter={valueFormatter} />}

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">{payload[0].name}</div>
                      <div className="font-medium text-right">{valueFormatter(payload[0].value as number)}</div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {showLegend && <Legend />}

          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
