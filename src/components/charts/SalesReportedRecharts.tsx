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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import PoweredBy from "../common/poweredby/PoweredBy";
import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";
import ChartSignInOverlay from "../common/charts/ChartSignInOverlay";
import { monthName } from "@/src/utilities/utilities";

const timeRanges = ["12D", "1M", "3M", "6M", "Custom"];
type SeriesKey = "detached" | "apartment" | "townhouse";

/* -------------------------------
   1️⃣ Fake Dynamic Sample Data Generator
-----------------------------------*/
const generateDashboardData = (
  location: string,
  range: string,
  start?: string,
  end?: string,
) => {
  let totalDays = 15;
  let startDate = dayjs().subtract(14, "day");
  let endDate = dayjs();

  if (range === "15D") {
    totalDays = 15;
    startDate = dayjs().subtract(14, "day");
  } else if (range === "1M") {
    totalDays = 30;
    startDate = dayjs().subtract(29, "day");
  } else if (range === "3M") {
    totalDays = 90;
    startDate = dayjs().subtract(89, "day");
  } else if (range === "6M") {
    totalDays = 180;
    startDate = dayjs().subtract(179, "day");
  } else {
    totalDays = 15;
  }

  // Use 15 points for fixed ranges, but use daily resolution (one point per day) for Custom range
  const points = 15;
  const interval = totalDays > 1 ? (totalDays - 1) / (points - 1) : 0;

  const chartData = Array.from({ length: points }, (_, i) => {
    // For Custom range, it's exactly one point per day.
    // For fixed ranges, it samples 15 points across the duration.
    const date = startDate.add(Math.round(i * interval), "day");

    // Ensure we don't exceed the end date (especially for the last point in fixed ranges)
    const finalDate = i === points - 1 && range !== "Custom" ? endDate : date;
    const name = finalDate.format("D MMM");

    const d_sold = Math.floor(Math.random() * 40 + 10);
    const d_total = d_sold + Math.floor(Math.random() * 40 + 5);
    const a_sold = Math.floor(Math.random() * 40 + 10);
    const a_total = a_sold + Math.floor(Math.random() * 40 + 5);
    const t_sold = Math.floor(Math.random() * 40 + 10);
    const t_total = t_sold + Math.floor(Math.random() * 40 + 5);

    return {
      name,
      timestamp: finalDate.valueOf(),
      detached_sold: d_sold,
      detached_listed: d_total - d_sold,
      apartment_sold: a_sold,
      apartment_listed: a_total - a_sold,
      townhouse_sold: t_sold,
      townhouse_listed: t_total - t_sold,
    };
  });

  const totalSold = Math.floor(Math.random() * 2000 + 1000);
  const totalListed = Math.floor(totalSold * 1.5 + Math.random() * 500);

  return {
    summary: {
      sold: totalSold,
      newListings: totalListed,
    },
    chartData,
  };
};

/* Custom Tooltip Component */
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
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-xs font-medium text-gray-500 capitalize">
                {entry.name.replace("_", " ")}
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

/* Summary Card Component */
const SummaryCard = ({ title, value }: { title: string; value: number }) => (
  <div className="rounded-xl lg:p-6 p-4 bg-gray flex flex-col items-center justify-center gap-y-2 flex-1 w-1/2">
    <h3 className="text-foreground lg:text-sm text-xs font-medium opacity-70">
      {title}
    </h3>
    <p className="lg:text-4xl text-2xl font-bold text-black">
      {value.toLocaleString()}
    </p>
  </div>
);

/* -------------------------------
   2️⃣ SalesReportedRecharts Component
-----------------------------------*/

const SalesReportedRecharts = ({ location }: { location: string }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { isLoggedIn, setOpenLogin } = useAuthContext();
  const [range, setRange] = useState("1M");

  const isProtectedRange = useMemo(
    () => !isLoggedIn && ["12D", "1M", "3M", "6M", "Custom"].includes(range),
    [isLoggedIn, range],
  );
  const [customStart, setCustomStart] = useState(
    dayjs().subtract(7, "day").toISOString(),
  );
  const [customEnd, setCustomEnd] = useState(dayjs().toISOString());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = useMemo(
    () => generateDashboardData(location, range, customStart, customEnd),
    [location, range, customStart, customEnd],
  );

  const [visibleSeries, setVisibleSeries] = useState({
    detached: true,
    apartment: true,
    townhouse: true,
  });

  // Always show all names generated for the chart
  const xTicks = data.chartData.map((d) => d.name);

  if (!isMounted)
    return (
      <div className="p-8 space-y-8 bg-white border border-gray-100 rounded-3xl min-h-[500px] shadow-sm"></div>
    );

  return (
    <div className="lg:p-8 p-4 space-y-8 bg-white border border-transparent rounded-3xl">
      {/* 1st Row: Summary Cards */}
      <div className="flex flex-row flex-wrap gap-6 justify-center w-full">
        <SummaryCard title="Total properties sold" value={data.summary.sold} />
        <SummaryCard
          title="Total properties listed"
          value={data.summary.newListings}
        />
      </div>

      {/* 2nd Row: Filters and Series Toggles */}
      <div className="flex flex-wrap items-center gap-6 justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          {[
            { key: "detached", color: "#FF0400" },
            { key: "apartment", color: "#1D00FF" },
            { key: "townhouse", color: "#007E64" },
          ].map(({ key, color }) => (
            <button
              key={key}
              onClick={() =>
                setVisibleSeries((prev) => {
                  const nextState = {
                    ...prev,
                    [key as SeriesKey]: !prev[key as SeriesKey],
                  };
                  if (
                    !nextState.detached &&
                    !nextState.apartment &&
                    !nextState.townhouse
                  ) {
                    nextState.detached = true;
                  }
                  return nextState;
                })
              }
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border transition-all ${
                visibleSeries[key as keyof typeof visibleSeries]
                  ? "border-gray-200"
                  : "border-transparent opacity-40 shadow-none"
              } shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]`}
            >
              <span
                className="w-4 h-4 rounded-md"
                style={{ background: color }}
              />
              <span className="text-sm font-medium capitalize">{key}</span>
            </button>
          ))}
        </div>

        {/* Time Range */}
        <div className="flex flex-col gap-3 items-end">
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
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
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
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-black px-2">All Properties</h2>

        {/* Chart */}
        <div className="w-full h-[350px] relative">
          {isProtectedRange ? (
            <ChartSignInOverlay
              monthContent={monthName(range)}
              onSignIn={() => setOpenLogin(true)}
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barGap={6}
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
                  ticks={xTicks}
                  tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  ticks={[0, 25, 50, 100]}
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#9CA3AF", fontWeight: 500 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={<CustomTooltip />}
                />

                {visibleSeries.detached && (
                  <Bar
                    dataKey="detached_listed"
                    stackId="detached"
                    fill="#FF0400"
                    barSize={12}
                    radius={0}
                    background={{ fill: "#F2F2F2", radius: 4 }}
                  />
                )}
                {visibleSeries.detached && (
                  <Bar
                    dataKey="detached_sold"
                    stackId="detached"
                    fill="#FF8A88"
                    barSize={12}
                    radius={[4, 4, 0, 0] as [number, number, number, number]}
                  />
                )}

                {visibleSeries.apartment && (
                  <Bar
                    dataKey="apartment_listed"
                    stackId="apartment"
                    fill="#1D00FF"
                    barSize={12}
                    radius={0}
                    background={{ fill: "#F2F2F2", radius: 4 }}
                  />
                )}
                {visibleSeries.apartment && (
                  <Bar
                    dataKey="apartment_sold"
                    stackId="apartment"
                    fill="#8A88FF"
                    barSize={12}
                    radius={[4, 4, 0, 0] as [number, number, number, number]}
                  />
                )}

                {visibleSeries.townhouse && (
                  <Bar
                    dataKey="townhouse_listed"
                    stackId="townhouse"
                    fill="#007E64"
                    barSize={12}
                    radius={0}
                    background={{ fill: "#F2F2F2", radius: 4 }}
                  />
                )}
                {visibleSeries.townhouse && (
                  <Bar
                    dataKey="townhouse_sold"
                    stackId="townhouse"
                    fill="#80C1B3"
                    barSize={12}
                    radius={[4, 4, 0, 0] as [number, number, number, number]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <PoweredBy className="justify-end" />
    </div>
  );
};

export default SalesReportedRecharts;
