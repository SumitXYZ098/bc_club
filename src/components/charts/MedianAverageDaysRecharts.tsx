"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import PoweredBy from "../common/poweredby/PoweredBy";
import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";
import ChartSignInOverlay from "../common/charts/ChartSignInOverlay";
import { monthName } from "@/src/utilities/utilities";

/* -------------------------------
   1️⃣ Data Generation Logic
-----------------------------------*/

const generateMedianAverageData = (range: string) => {
  let totalDays = 30;
  if (range === "12D") totalDays = 12;
  else if (range === "1M") totalDays = 30;
  else if (range === "3M") totalDays = 90;
  else if (range === "6M") totalDays = 180;
  const startDate = dayjs().subtract(totalDays - 1, "day");
  const points = 12; // Image shows 12 groups
  const interval = (totalDays - 1) / (points - 1);

  return Array.from({ length: points }, (_, i) => {
    const date = startDate.add(Math.round(i * interval), "day");
    const name = date.format("D MMM");

    // Median often slightly lower than average in typical distributions
    const median = Math.floor(Math.random() * 60 + 10);
    const average = median + Math.floor(Math.random() * 20 + 5);

    return {
      name,
      median,
      average,
    };
  });
};

/* -------------------------------
   2️⃣ Custom Tooltip Component
-----------------------------------*/

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col gap-2.5 min-w-[180px]">
        <p className="text-sm font-bold text-black border-b border-gray-100 pb-2 mb-1">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3"
                style={{
                  height: "12px",
                  backgroundColor: entry.fill,
                  borderRadius: "2px",
                }}
              />
              <span className="text-xs font-medium text-gray-500 capitalize">
                {entry.name.replace("Days", "").trim()} Days
              </span>
            </div>
            <span className="text-xs font-bold text-black">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* -------------------------------
   3️⃣ Main Component
-----------------------------------*/

const MedianAverageDaysRecharts = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { isLoggedIn, setOpenLogin } = useAuthContext();
  const [range, setRange] = useState("1M");

  const isProtectedRange = useMemo(
    () => !isLoggedIn && ["12D", "1M", "3M", "6M", "Custom"].includes(range),
    [isLoggedIn, range],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = useMemo(() => generateMedianAverageData(range), [range]);

  if (!isMounted) {
    return (
      <div className="w-full h-[450px] bg-white rounded-3xl animate-pulse" />
    );
  }

  return (
    <div className="p-4 bg-white border border-transparent rounded-[20px] shadow-sm space-y-6 w-full">
      {/* Header Row */}
      <div className="flex lg:flex-nowrap flex-wrap items-center justify-between gap-4">
        <h2 className="md:text-xl text-lg font-bold text-black">
          Median & Average Days
        </h2>
        <div className="flex items-center rounded-2xl gap-1">
          {["12D", "1M", "3M", "6M", "Custom"].map((r) => (
            <button
              key={r}
              onClick={() => {
                if (r === "Custom") {
                  router.push("/market-trends");
                } else {
                  setRange(r);
                }
              }}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                range === r
                  ? "bg-[#FFA500] text-white shadow-sm"
                  : "text-black70 hover:bg-gray-200 bg-gray"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[400px] relative">
        {isProtectedRange ? (
          <ChartSignInOverlay
            monthContent={monthName(range)}
            onSignIn={() => setOpenLogin(true)}
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
              barGap={2}
            >
              <CartesianGrid
                vertical={false}
                stroke="#F0F0F0"
                strokeDasharray="0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 500 }}
                dy={12}
              />
              <YAxis
                hide // Match the clean look if preferred, or keep minimal ticks
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip />}
              />
              <Bar
                name="Median Days"
                dataKey="median"
                fill="#FFA500"
                barSize={14}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Average Days"
                dataKey="average"
                fill="#1D4E89"
                barSize={14}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend Row */}
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center justify-center gap-8">
          {[
            { label: "Median Days", color: "#FFA500" },
            { label: "Average Days", color: "#1D4E89" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-0.5">
              <div
                className="w-4 h-4"
                style={{ backgroundColor: item.color, borderRadius: "4px" }}
              />
              <span className="text-xs text-black">{item.label}</span>
            </div>
          ))}
        </div>
        <PoweredBy className="justify-end" textStyle="text-xs!" />
      </div>
    </div>
  );
};

export default MedianAverageDaysRecharts;
