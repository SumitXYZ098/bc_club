/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Heading, { IHeadingTypes } from "@/src/components/heading/Heading";
import Description, {
  IDescriptionTypes,
} from "@/src/components/description/Description";
import { GitCompareArrows, Heart } from "lucide-react";
import { DocumentPrintFilled } from "@fluentui/react-icons";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import { FormControl, MenuItem, Select } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";

const useStyles = makeStyles(() => ({
  formControl: {
    "& .MuiInputBase-root": {
      borderColor: "#0F0F0F3D",
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: "100px",
      minWidth: "120px",
      justifyContent: "center",
    },
    "& .MuiSelect-select.MuiSelect-select": {
      paddingRight: "0px",
      paddingLeft: "16px",
      paddingBlock: "10px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  select: {
    borderRadius: 3,
    fontSize: "14px",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  selectIcon: {
    position: "relative",
    color: "#22558b",
    fontSize: "28px",
  },
  paper: {
    borderRadius: 12,
    marginTop: 8,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    "& li": {
      fontWeight: 500,
      paddingTop: 8,
      paddingBottom: 8,
      fontSize: "14px",
    },
    "& li.Mui-selected": {
      color: "white",
      background: "#22558b",
    },
    "& li.Mui-selected:hover": {
      background: "#22558b",
    },
  },
}));

const PropertyAssessmentTopSection = ({ data }: { data: any }) => {
  const classes = useStyles();

  if (!data) return null;

  // const years: string[] = Array.isArray(data?.valueHistory)
  //   ? data.valueHistory.map((item: any) => item.year.toString())
  //   : [];

  // const [val, setVal] = useState(data?.valueHistory?.[0]?.year?.toString() || "");

  // useEffect(() => {
  //   if (data?.valueHistory?.length) {
  //     setVal(data.valueHistory[data.valueHistory.length - 1].year.toString());
  //   }
  // }, [data]);

  // const handleChange = (event: any) => setVal(event.target.value);

  // const selectedYearData = data?.valueHistory?.find(
  //   (item: any) => item.year.toString() === val
  // );
  // const selectedValue = selectedYearData?.value || data?.totalValue;

  const chartData = (data?.valueHistory || [])
    .map((item: any, index: number, arr: any[]) => {
      const numericVal =
        typeof item.value === "string"
          ? parseInt(item.value.replace(/[^0-9]/g, ""))
          : item.value;

      let change = 0;
      if (index > 0) {
        const prevVal =
          typeof arr[index - 1].value === "string"
            ? parseInt(arr[index - 1].value.replace(/[^0-9]/g, ""))
            : arr[index - 1].value;
        if (prevVal > 0) change = ((numericVal - prevVal) / prevVal) * 100;
      }

      return {
        year: item.year.toString(),
        value: numericVal,
        displayValue: item.value,
        change: Math.round(change),
      };
    })
    .sort((a: any, b: any) => Number(a.year) - Number(b.year));

  // Background columns height set to match Y-Axis max
  const finalChartData = chartData.map((d: any) => ({ ...d, bg: 1000000 }));

  const formatYAxis = (tickItem: number) =>
    tickItem === 0 ? "0" : `$${tickItem / 1000}K`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[payload.length - 1].payload;
      return (
        <div className="bg-white px-2 py-1 shadow-[0_15px_40px_rgba(2,0,0,0.1)] rounded-xl border border-gray-50 flex items-center gap-3 transition-all duration-200">
          <span className="text-[#22558B] text-base tracking-tight">
            {d.displayValue}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#e8eff6] text-[#22558b]">
            {d.change >= 0 ? "+" : ""}
            {d.change}%
          </span>
        </div>
      );
    }
    return null;
  };

  const CustomActiveDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <g>
        {/* Vertical line from dot to bottom with gradient */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + 1.1} // Tiny offset to give the line a bounding box for the gradient
          y2={345} // Fixed height to stop near the X-axis
          stroke="url(#verticalLineGradient)"
          strokeWidth={2}
        />
        {/* The dot itself */}
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="#fff"
          stroke="#22558b"
          strokeWidth={2}
        />
      </g>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex justify-between items-center-safe md:py-1">
        <div className="flex flex-col">
          <Heading
            tagType="h1"
            type={IHeadingTypes.heading24}
            content={data?.address}
          />
          <Description type={IDescriptionTypes.dec1614} content={data?.roll} />
        </div>
        {/* <div className="md:flex gap-x-2.5 hidden">
            <Heart className="text-primary bg-primary/10 w-10.5 h-10.5 p-2.25 rounded-lg cursor-pointer" />
            <GitCompareArrows className="text-primary bg-primary/10 w-10.5 h-10.5 p-2.25 rounded-lg cursor-pointer" />
            <DocumentPrintFilled className="text-primary bg-primary/10 w-10.5 h-10.5 p-2.25 rounded-lg cursor-pointer" />
          </div> */}
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-6 mt-6">
        {/* CHART SECTION */}
        <div className="xl:w-[56%] w-full relative bg-white shadow-[0_0_25px_0_rgba(0,0,0,0.08)] p-8 rounded-4xl flex flex-col border border-gray-50">
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900">
              Property Value history
            </h3>
          </div>
          <div className="w-full xl:h-96 md:h-80 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={finalChartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                barGap={0}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="2" x2="0" y2="0">
                    <stop offset="5%" stopColor="#22558b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="barBg" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#c8d9ed" stopOpacity={0.7} />
                    <stop
                      offset="100%"
                      stopColor="#f0f5fa"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient id="lineStroke" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22558b" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7aaed6" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient
                    id="verticalLineGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22558b" stopOpacity={1} />
                    <stop offset="70%" stopColor="#22558b" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#22558b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: "#111", fontWeight: 500 }}
                  dy={4}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#111", fontWeight: 500 }}
                  tickFormatter={formatYAxis}
                  width={60}
                  domain={[0, 1000000]}
                  ticks={[0, 200000, 400000, 600000, 800000, 1000000]}
                />

                {/* Tooltip comes after Grid/Axis */}
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={false}
                  offset={-100} // Negative offset in Recharts can often center/move tooltip above
                  wrapperStyle={{ zIndex: 100 }}
                />
                <Bar
                  dataKey="bg"
                  fill="url(#barBg)"
                  barSize={80}
                  isAnimationActive={false}
                  radius={[6, 6, 0, 0]}
                  opacity={0.4}
                />

                {/* 2. RENDER AREA LAST (Foreground Layer - line always on top) */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#lineStroke)"
                  strokeWidth={4}
                  fill="url(#colorValue)"
                  fillOpacity={1}
                  activeDot={<CustomActiveDot />}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="xl:w-[43%] w-full shadow-[0_0_20px_0_rgba(0,0,0,0.12)] p-6 rounded-2xl bg-white flex flex-col gap-y-5">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-1">
              <Description
                type={IDescriptionTypes.dec16}
                content="Total Value"
              />
              <span className="md:text-[32px] md:leading-10 text-2xl text-[#22558b] font-bold">
                {data?.totalValue}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-md text-gray-400 mb-1">Year</span>
              <span className="text-[16px] font-semibold text-[#22558b]">
                {new Date().getFullYear()}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between md:text-lg text-base font-medium">
              <span className="text-gray-600">Land</span>
              <span className="text-[#22558b]">{data?.landValue}</span>
            </div>
            <div className="flex justify-between md:text-lg text-base font-medium">
              <span className="text-gray-600">Buildings</span>
              <span className="text-[#22558b]">{data?.buildingValue}</span>
            </div>
            <LineGradient />
            <div className="flex justify-between md:text-lg text-base font-medium">
              <span className="text-gray-600">Previous Year Value</span>
              <span className="text-[#22558b]">{data?.previousTotalValue}</span>
            </div>
            <div className="flex justify-between md:text-lg text-base font-medium">
              <span className="text-gray-600">Land</span>
              <span className="text-[#22558b]">{data?.previousLandValue}</span>
            </div>
            <div className="flex justify-between md:text-lg text-base font-medium">
              <span className="text-gray-600">Buildings</span>
              <span className="text-[#22558b]">
                {data?.previousBuildingValue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAssessmentTopSection;
