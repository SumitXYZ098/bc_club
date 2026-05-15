/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Heading, { IHeadingTypes } from "@/src/components/heading/Heading";
import Description, {
  IDescriptionTypes,
} from "@/src/components/description/Description";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import { makeStyles } from "@mui/styles";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  BarChart,
  Cell,
  LabelList,
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

  // Calculate maxValue for the second chart
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map((d: any) => d.value)) : 0;

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
          x2={cx + 1.1}
          y2={345}
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

  // Give 15% headroom for the bar track so the longest bar doesn't touch the very edge
  const barMax = maxValue > 0 ? maxValue * 1.15 : 100000;

  // Reverse data to show newest year first, as per design
  const displayChartData = [...chartData].reverse();

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
        <div className="flex flex-col text-right">
          <span className="text-gray-500 font-medium text-sm mb-1">
            Total Value Year {new Date().getFullYear()}
          </span>
          <span className="text-3xl font-bold text-[#22558b]">
            {data?.totalValue}
          </span>
        </div>
      </div>

      <div className="w-full  flex flex-col xl:flex-row gap-6 mt-6">
        {/* CHART SECTION 1 (Recharts) */}
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
                    <stop offset="5%" stopColor="#22558b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="barBg" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#22558b" stopOpacity={0.1} />
                    <stop
                      offset="100%"
                      stopColor="#22558b"
                      stopOpacity={0.02}
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

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={false}
                  offset={-100}
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

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22558b"
                  strokeWidth={4}
                  fill="url(#colorValue)"
                  fillOpacity={1}
                  activeDot={<CustomActiveDot />}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECOND CHART (Horizontal Bar) */}
        <div className="xl:w-[48%] w-full relative bg-white p-5 rounded-[16px] flex flex-col border border-[#33333333]">
          <div className="mb-15px]">
            <h3 className="text-xl font-medium text-gray-800 mb-5">
              Property value history
            </h3>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayChartData}
                layout="vertical"
                margin={{ top: 0, right: 0, left: 10, bottom: 0 }}
                barCategoryGap={24}
              >
                <XAxis type="number" hide domain={[0, barMax]} />
                <YAxis
                  type="category"
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  width={75}
                  tick={(props: any) => {
                    const { x, y, payload } = props;
                    return (
                      <g transform={`translate(${x - 75},${y - 22})`}>
                        <rect width="69" height="44" rx="8" fill="#f3f4f6" />
                        <text
                          x="34.5"
                          y="27"
                          textAnchor="middle"
                          fill="#4b5563"
                          style={{ fontSize: "14px", fontWeight: "500" }}
                        >
                          {payload.value}
                        </text>
                      </g>
                    );
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 8, 8]}
                  barSize={51}
                  background={{ fill: "#f3f4f6", radius: 8 }}
                >
                  {displayChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill="#E1A22A" />
                  ))}
                  <LabelList
                    dataKey="value"
                    content={(props: any) => {
                      const { x, y, width, value, index } = props;
                      const entry = displayChartData[index];
                      if (!entry) return null;
                      return (
                        <g>
                          {/* Change Badge */}
                          <rect
                            x={x + 12}
                            y={y + 13}
                            width="55"
                            height="25"
                            rx="6"
                            fill="rgba(255,255,255,0.25)"
                          />
                          <text
                            x={x + 39.5}
                            y={y + 30}
                            textAnchor="middle"
                            fill="white"
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            {entry.change >= 0 ? "+" : ""}
                            {entry.change}%
                          </text>
                          {/* Value Label */}
                          <text
                            x={x + width - 15}
                            y={y + 31}
                            textAnchor="end"
                            fill="white"
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                            }}
                          >
                            {entry.displayValue}
                          </text>
                        </g>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAssessmentTopSection;
