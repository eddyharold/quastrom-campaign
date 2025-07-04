import { cn } from "@/domain/utils/common";
import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/presentation/components/ui/chart";
import { PerformanceAreaChartData } from "@/domain/entities/dashboard";

interface PerformanceLineChartProps {
  data: PerformanceAreaChartData[];
  className?: string;
  valueFormatter?: (value: number) => string;
}
const CHART_CONFIG = {
  clicks: {
    label: "Clics",
    color: "var(--chart-1)",
  },
  leads: {
    label: "Leads",
    color: "var(--chart-2)",
  },
  conversions: {
    label: "Conversions",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export const PerformanceAreaChart = ({
  data,
  className,
  valueFormatter = (value: number) => `${value}`,
}: PerformanceLineChartProps) => {
  return (
    <ChartContainer config={CHART_CONFIG} className={cn("aspect-auto h-full w-full", className)}>
      {/* zxczxc */}
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-clicks)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-clicks)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-leads)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-leads)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillConversions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-conversions)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-conversions)" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />

        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        {/* <XAxis dataKey="name" tickLine={false} axisLine={false} /> */}

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />

        <YAxis tickLine={false} axisLine={false} tickFormatter={valueFormatter} />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              indicator="dot"
            />
          }
        />
        <Area dataKey="clicks" type="natural" fill="url(#fillClicks)" stroke="var(--color-clicks)" stackId="a" />
        <Area dataKey="leads" type="natural" fill="url(#fillLeads)" stroke="var(--color-leads)" stackId="a" />
        <Area
          dataKey="conversions"
          type="natural"
          fill="url(#fillConversions)"
          stroke="var(--color-conversions)"
          stackId="a"
        />

        <ChartLegend content={<ChartLegendContent />} />

        {/* {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))} */}
      </AreaChart>
    </ChartContainer>
  );
};
