"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
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

const metrics = ["New Listings", "Sold", "Active", "Canceled"];
const timeRanges = ["15D", "1M", "3M", "6M", "Custom"];
type SeriesKey = "detached" | "apartment" | "townhouse";

/* -------------------------------
   1️⃣ Fake Dynamic Sample Data Generator
-----------------------------------*/
const generateRandomSeries = (days: number) => {
  return Array.from({ length: days }, () =>
    Math.floor(Math.random() * (200 - 30) + 30),
  );
};

const generateDashboardData = (
  location: string,
  range: string,
  start?: string,
  end?: string,
) => {
  let days = 30;
  if (range === "15D") days = 15;
  else if (range === "1M") days = 30;
  else if (range === "3M") days = 90;
  else if (range === "6M") days = 180;
  else if (range === "Custom") {
    if (start && end) {
      const diffTime = Math.abs(
        new Date(end).getTime() - new Date(start).getTime(),
      );
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (isNaN(days) || days < 1) days = 30;
    } else {
      days = 30;
    }
  }

  const detached = generateRandomSeries(days);
  const apartment = generateRandomSeries(days);
  const townhouse = generateRandomSeries(days);
  const sold = Array.from({ length: days }, () =>
    Math.floor(Math.random() * (200 - 100) + 100),
  );
  const listed = Array.from({ length: days }, () =>
    Math.floor(Math.random() * (150 - 80) + 80),
  );

  // Recharts expects an array of objects where each object represents a point on the X axis
  const chartData = Array.from({ length: days }, (_, i) => ({
    name: `Day ${i + 1}`,
    detached: detached[i],
    apartment: apartment[i],
    townhouse: townhouse[i],
    sold: sold[i],
    listed: listed[i],
  }));

  return {
    summary: {
      sold: Math.floor(Math.random() * 1500 + 400),
      newListings: Math.floor(Math.random() * 2000 + 500),
    },
    chartData,
  };
};

/* Summary Card Component */
const SummaryCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <div className="rounded p-2.5 bg-gray flex flex-col justify-center gap-y-0.5">
    <h3 className="text-foreground text-xs">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
  </div>
);

/* -------------------------------
   2️⃣ SalesReportedRecharts Component
-----------------------------------*/

export default function SalesReportedRecharts({
  location,
}: {
  location: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [range, setRange] = useState("15D");
  const [customStart, setCustomStart] = useState(
    new Date().setDate(new Date().getDate() - 7).toLocaleString(),
  );
  const [customEnd, setCustomEnd] = useState(new Date().toISOString());
  const [metric, setMetric] = useState("New Listings");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate dynamic data
  const data = useMemo(
    () => generateDashboardData(location, range, customStart, customEnd),
    [location, range, customStart, customEnd],
  );

  /* Legends toggling */
  const [visibleSeries, setVisibleSeries] = useState({
    detached: true,
    apartment: true,
    townhouse: true,
  });

  if (!isMounted)
    return (
      <div className="p-6 space-y-6 bg-background rounded-2xl min-h-[400px]"></div>
    );

  return (
    <div className="p-6 space-y-6 bg-background rounded-2xl">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        {/* Summary Cards */}
        <div className="flex flex-row gap-x-1.5 items-center">
          <SummaryCard
            title="Total Properties Sold"
            value={data.summary.sold}
            color="text-[#E3A82A]"
          />
          <SummaryCard
            title="Total Properties Listed"
            value={data.summary.newListings}
            color="text-[#377E22]"
          />
        </div>

        {/* Legends */}
        <div className="flex gap-4 items-center overflow-clip overflow-x-scroll p-5">
          {["detached", "apartment", "townhouse"].map((key) => (
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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-background border ${
                visibleSeries[key as keyof typeof visibleSeries]
                  ? "border-[#00568F]"
                  : "border-[#E7EAEE]"
              }`}
            >
              <span
                className="w-4 h-4 rounded"
                style={{
                  background:
                    key === "detached"
                      ? "#FF0400"
                      : key === "apartment"
                        ? "#1D00FF"
                        : "#007E64",
                }}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* Time Range */}
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            {timeRanges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-md text-base ${
                  range === r
                    ? "bg-secondary text-background"
                    : "bg-gray text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {range === "Custom" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex items-center gap-2 bg-gray p-2 rounded-lg border border-[#E7EAEE]">
                <DatePicker
                  value={dayjs(customStart)}
                  format="DD/MM/YYYY"
                  onChange={(newValue) =>
                    setCustomStart(newValue?.toISOString() || "")
                  }
                  sx={{
                    width: 160,
                    "& .MuiInputBase-input": {
                      py: 1,
                      px: 1.5,
                      fontSize: "14px",
                    },
                    "& .MuiPickersInputBase-sectionsContainer": {
                      padding: 0,
                    },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.default",
                      borderRadius: 1,
                    },
                  }}
                />
                <span className="text-sm text-foreground px-1">to</span>
                <DatePicker
                  value={dayjs(customEnd)}
                  format="DD/MM/YYYY"
                  onChange={(newValue) =>
                    setCustomEnd(newValue?.toISOString() || "")
                  }
                  sx={{
                    width: 160,

                    "& .MuiInputBase-input": {
                      py: 1,
                      px: 1.5,
                      fontSize: "14px",
                    },
                    "& .MuiPickersInputBase-sectionsContainer": {
                      padding: 0,
                    },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.default",
                      borderRadius: 1,
                    },
                  }}
                />
              </div>
            </LocalizationProvider>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-black opacity-50 font-bold text-xl">
          Properties
        </span>
        {/* Metrics */}
        <div className="px-3 py-2 rounded-4xl bg-gray">
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="focus:outline-0 "
          >
            {metrics.map((m) => (
              <option
                key={m}
                className="text-black opacity-50 text-base font-medium"
              >
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data.chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="transparent"
            />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: "#E7EAEE" }}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis
              axisLine={{ stroke: "#E7EAEE" }}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            {visibleSeries.detached && (
              <Line
                type="step"
                dataKey="detached"
                stroke="#FF0400"
                strokeWidth={1}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}
            {visibleSeries.apartment && (
              <Line
                type="step"
                dataKey="apartment"
                stroke="#1D00FF"
                strokeWidth={1}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}
            {visibleSeries.townhouse && (
              <Line
                type="step"
                dataKey="townhouse"
                stroke="#007E64"
                strokeWidth={1}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}
            <Line
              type="linear"
              dataKey="sold"
              stroke="#E3A82A"
              strokeWidth={1}
              dot={{ r: 3, fill: "#E3A82A", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="linear"
              dataKey="listed"
              stroke="#008001"
              strokeWidth={1}
              dot={{ r: 3, fill: "#008001", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
