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
import { timeRanges } from "./SalesReportedRecharts";

/* -------------------------------
   1️⃣ Data Generation Logic
-----------------------------------*/

const generateMedianAveragePriceData = (range: string) => {
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

    // Sample prices in thousands ($500k to $1.5M range)
    const median = Math.floor(Math.random() * 500 + 700);
    const average = median + Math.floor(Math.random() * 200 - 50);

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
      <div className="bg-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col gap-2.5 min-w-45">
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
                {entry.name.replace("Price", "").trim()} Price
              </span>
            </div>
            <span className="text-xs font-bold text-black">
              ${entry.value.toLocaleString()}k
            </span>
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

const MedianAveragePriceRecharts = () => {
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

  const data = useMemo(() => generateMedianAveragePriceData(range), [range]);

  if (!isMounted) {
    return (
      <div className="w-full h-112.5 bg-white rounded-3xl animate-pulse" />
    );
  }

  return (
    <div className="p-4 bg-background border border-transparent rounded-[20px] shadow-sm space-y-6 w-full">
      {/* Header Row */}
      <div className="flex lg:flex-nowrap flex-wrap items-center justify-between gap-4">
        <h2 className="md:text-xl text-lg font-bold text-black">
          Median & Average Price
        </h2>
        <div className="flex flex-wrap bg-[#F5F5F5] p-1.5 rounded-xl gap-1">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => {
                if (r === "Custom") {
                  router.push("/market-trends");
                } else {
                  setRange(r);
                }
              }}
              className={`md:px-5 md:py-2 px-3 py-1 rounded-lg md:text-sm text-xs font-medium transition-all cursor-pointer ${
                range === r
                  ? "bg-[#FFA500] text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-100 relative overflow-x-auto touch-pan-x scrollbar-hide">
        {isProtectedRange ? (
          <ChartSignInOverlay
            monthContent={monthName(range)}
            onSignIn={() => setOpenLogin(true)}
          />
        ) : (
          <div
            style={{
              minWidth: `${Math.max(500, (data?.length || 0) * 40)}px`,
              width: "100%",
              height: "100%",
            }}
          >
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
                <YAxis hide axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={<CustomTooltip />}
                />
                <Bar
                  name="Median Price"
                  dataKey="median"
                  fill="#FFA500"
                  barSize={14}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  name="Average Price"
                  dataKey="average"
                  fill="#1D4E89"
                  barSize={14}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Legend Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {[
            { label: "Median Price", color: "#FFA500" },
            { label: "Average Price", color: "#1D4E89" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded-xs shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-black">{item.label}</span>
            </div>
          ))}
        </div>
        <PoweredBy className="justify-end shrink-0" textStyle="text-xs!" />
      </div>
    </div>
  );
};

export default MedianAveragePriceRecharts;
