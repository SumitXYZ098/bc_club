"use client";

import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { year: "2020", price: 120000 },
  { year: "2021", price: 380000 },
  { year: "2022", price: 260000 },
  { year: "2023", price: 500000 },
  { year: "2024", price: 490000 },
  { year: "2025", price: 650000 },
];

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    value?: number;
  }[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg px-3 py-2 text-sm">
        <p className="text-gray-500">29 Feb 2021</p>
        <p className="font-semibold">${payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const AssessmentHistory = () => {
  return (
    <div className="w-full bg-background rounded-xl mt-10">
      <div className="flex  items-center mb-4">
        <h2 className="text-lg font-semibold">Assessment History</h2>
      </div>

      <div className="h-70">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F5AA8" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2F5AA8" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(val: number) => `$${val / 1000}K`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="price"
              stroke="#2F5AA8"
              strokeWidth={2}
              fill="url(#priceGradient)"
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: "#2F5AA8",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssessmentHistory;
