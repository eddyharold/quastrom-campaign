"use client";

import { cn } from "@/domain/utils/common";
import { Bar, Line } from "recharts";
import {
  Area,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const recharts = {
  PieChart: RechartsPieChart,
  Pie,
  Cell,
};

interface ChartProps {
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

export const BarChart = ({
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
}: ChartProps) => {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showXAxis && <XAxis dataKey="name" tickLine={false} axisLine={false} />}
          {showYAxis && <YAxis width={yAxisWidth} tickLine={false} axisLine={false} tickFormatter={valueFormatter} />}
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">{label}</div>
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
            <Bar
              key={category}
              dataKey={category}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LineChart = ({
  data,
  categories,
  colors = ["#2563eb", "#4ade80", "#f97316"],
  yAxisWidth = 40,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  className,
  height = 300,
  valueFormatter = (value: number) => `${value}`,
}: ChartProps) => {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showXAxis && <XAxis dataKey="name" tickLine={false} axisLine={false} />}
          {showYAxis && <YAxis width={yAxisWidth} tickLine={false} axisLine={false} tickFormatter={valueFormatter} />}
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">{label}</div>
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

export const AreaChart = ({
  data,
  categories,
  colors = ["#2563eb", "#4ade80", "#f97316"],
  yAxisWidth = 40,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  className,
  height = 300,
  valueFormatter = (value: number) => `${value}`,
}: ChartProps) => {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showXAxis && <XAxis dataKey="name" tickLine={false} axisLine={false} />}
          {showYAxis && <YAxis width={yAxisWidth} tickLine={false} axisLine={false} tickFormatter={valueFormatter} />}
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">{label}</div>
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
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChart = ({
  data,
  categories,
  colors = ["#2563eb", "#4ade80", "#f97316", "#eab308", "#ec4899", "#6366f1"],
  showLegend = true,
  className,
  height = 300,
  valueFormatter = (value: number) => `${value}`,
}: Omit<ChartProps, "yAxisWidth" | "showXAxis" | "showYAxis" | "showGridLines">) => {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <recharts.PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
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
          {showLegend && (
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              iconSize={10}
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
          )}
          <recharts.Pie
            data={data}
            nameKey="name"
            dataKey={categories[0]}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={2}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, index) => (
              <recharts.Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </recharts.Pie>
        </recharts.PieChart>
      </ResponsiveContainer>
    </div>
  );
};
