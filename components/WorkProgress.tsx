"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", containers: 12 },
  { month: "February", containers: 2 },
  { month: "March", containers: 0 },
  { month: "April", containers: 0 },
  { month: "May", containers: 0 },
  { month: "June", containers: 0 },
  { month: "July", containers: 0 },
  { month: "August", containers: 0 },
  { month: "September", containers: 0 },
  { month: "October", containers: 0 },
  { month: "November", containers: 0 },
  { month: "December", containers: 0 },
];

const chartConfig = {
  containers: {
    label: "Containers",
    color: "#f38633",
  },
} satisfies ChartConfig;

export function WorkProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Trends</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <CardContent className="text-black dark:text-white">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-black dark:text-white"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="containers" fill="var(--color-containers)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
