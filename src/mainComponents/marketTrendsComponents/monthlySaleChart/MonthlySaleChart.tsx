"use client";

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import {
  Bar,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuthContext } from "../../auth/AuthContext";
import ChartSignInOverlay from "@/src/components/common/charts/ChartSignInOverlay";
import {
  DATA_OPTIONS,
  OptionGroup,
  PROPERTY_OPTIONS,
  REGION_DATA,
  YEAR_OPTIONS,
} from "..";
import { useGetMonthlySalesChart } from "@/src/hooks/listing/useListingQueries";
import {
  MonthlySalesChartItem,
  MonthlySalesChartParams,
} from "@/src/api/listing/listingApi";

interface CustomSelectProps {
  label: string;
  options: string[] | OptionGroup[];
  value: string;
  onChange: (value: string) => void;
}

const REGION_OPTIONS = REGION_DATA.map((r) => r.region);

const isGrouped = (
  opts: string[] | OptionGroup[]
): opts is OptionGroup[] => {
  return (
    opts.length > 0 && typeof opts[0] === "object" && "category" in opts[0]
  );
};

/* ================= CUSTOM SELECT ================= */
const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={selectRef} className="relative w-full">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex justify-between items-center border border-[#E6EAEE] rounded-[31px] px-4 py-2 text-sm bg-white cursor-pointer"
      >
        <span className="truncate">{value}</span>
        <FiChevronDown
          size={18}
          className={`text-[#EEA500] shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full bg-white rounded-xl shadow-lg border border-[#E6EAEE] max-h-80 overflow-auto divide-y divide-gray-100">
          {isGrouped(options) ? (
            options.map((group) => (
              <div key={group.category} className="py-1">
                <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/90 sticky top-0 z-10">
                  {group.category}
                </div>
                {group.items.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                    className={`px-4 py-2 pl-6 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
                      value === opt
                        ? "font-semibold text-[#EEA500] bg-amber-50/50"
                        : "text-gray-700"
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            ))
          ) : (
            options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
                  value === opt
                    ? "font-semibold text-[#EEA500] bg-amber-50/50"
                    : "text-gray-700"
                }`}
              >
                {opt}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const MonthlySaleChartContent = () => {
  const searchParams = useSearchParams();
  const urlCity = searchParams?.get("city");
  const urlType = searchParams?.get("propertyType");

  const [filters, setFilters] = useState({
    region: "Vancouver West",
    data: "Sold Prices by Month",
    propertyType: "All Residential",
    neighborhood: "All Neighborhoods",
    year: "Select Year",
  });

  // Sync filters if URL search params are provided (e.g. from CityStatsPopup detailed charts)
  useEffect(() => {
    if (!urlCity && !urlType) return;

    setFilters((prev) => {
      let updatedRegion = prev.region;
      let updatedNeighborhood = prev.neighborhood;
      let updatedType = prev.propertyType;

      if (urlCity) {
        // Direct region match
        const matchedRegion = REGION_DATA.find(
          (r) => r.region.toLowerCase() === urlCity.toLowerCase()
        );
        if (matchedRegion) {
          updatedRegion = matchedRegion.region;
        } else {
          // Check if it's a neighborhood inside a region
          const parentRegion = REGION_DATA.find((r) =>
            r.neighborhoods.some(
              (n) => n.toLowerCase() === urlCity.toLowerCase()
            )
          );
          if (parentRegion) {
            updatedRegion = parentRegion.region;
            const matchedNeighborhood = parentRegion.neighborhoods.find(
              (n) => n.toLowerCase() === urlCity.toLowerCase()
            );
            if (matchedNeighborhood) {
              updatedNeighborhood = matchedNeighborhood;
            }
          }
        }
      }

      if (urlType) {
        const matchedType = PROPERTY_OPTIONS.find(
          (t) => t.toLowerCase() === urlType.toLowerCase()
        );
        if (matchedType) {
          updatedType = matchedType;
        }
      }

      return {
        ...prev,
        region: updatedRegion,
        neighborhood: updatedNeighborhood,
        propertyType: updatedType,
      };
    });
  }, [urlCity, urlType]);

  // Neighborhoods depend dynamically upon the selected region
  const neighborhoodOptions = useMemo(() => {
    const selectedRegion = REGION_DATA.find((r) => r.region === filters.region);
    return ["All Neighborhoods", ...(selectedRegion?.neighborhoods || [])];
  }, [filters.region]);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    if (key === "region") {
      setFilters((prev) => ({
        ...prev,
        region: value,
        neighborhood: "All Neighborhoods", // Reset neighborhood when region changes
      }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Construct query params for the live API endpoint
  const queryParams: MonthlySalesChartParams = useMemo(() => {
    const params: MonthlySalesChartParams = {
      region: filters.region,
      data: filters.data.toLowerCase(),
    };

    if (filters.neighborhood && filters.neighborhood !== "All Neighborhoods") {
      params.neighbourhood = filters.neighborhood;
    }

    if (filters.propertyType && filters.propertyType !== "All Residential") {
      params.property_sub_type = filters.propertyType.toLowerCase();
    }

    if (filters.year && filters.year !== "Select Year") {
      const parsedYear = parseInt(filters.year);
      if (!isNaN(parsedYear)) {
        params.year = parsedYear;
      }
    }

    return params;
  }, [filters]);

  // Fetch real-time monthly sales chart data
  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetMonthlySalesChart(queryParams);

  // Transform and format API response for Recharts
  const chartData = useMemo(() => {
    if (!apiResponse?.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    return apiResponse.data.map((item: MonthlySalesChartItem) => {
      const rawMonth = item.month;
      let displayMonth = rawMonth;

      if (dayjs(rawMonth, ["YYYY-MM", "YYYY-M"]).isValid()) {
        displayMonth = dayjs(rawMonth, ["YYYY-MM", "YYYY-M"]).format("MMM YY");
      }

      return {
        ...item,
        rawMonth,
        month: displayMonth,
        soldCount: Number(item.soldCount ?? 0),
        averageSoldPrice: Number(item.averageSoldPrice ?? 0),
        "12MonthAvgPrice": Number(item["12MonthAvgPrice"] ?? 0),
      };
    });
  }, [apiResponse]);

  const { isLoggedIn, setOpenLogin } = useAuthContext();

  return (
    <section>
      {/* FILTERS */}
      <div className="bg-white rounded-2xl shadow p-5 mt-10 flex flex-wrap gap-4">
        <div className="w-full md:w-[calc(33.333%-1rem)]">
          <CustomSelect
            label="Region"
            options={REGION_OPTIONS}
            value={filters.region}
            onChange={(v) => updateFilter("region", v)}
          />
        </div>

        <div className="w-full md:w-[calc(33.333%-1rem)]">
          <CustomSelect
            label="Data"
            options={DATA_OPTIONS}
            value={filters.data}
            onChange={(v) => updateFilter("data", v)}
          />
        </div>

        <div className="w-full md:w-[calc(33.333%-1rem)]">
          <CustomSelect
            label="Property Type"
            options={PROPERTY_OPTIONS}
            value={filters.propertyType}
            onChange={(v) => updateFilter("propertyType", v)}
          />
        </div>

        <div className="w-full md:w-[calc(50%-1rem)]">
          <CustomSelect
            label="Neighborhood"
            options={neighborhoodOptions}
            value={filters.neighborhood}
            onChange={(v) => updateFilter("neighborhood", v)}
          />
        </div>

        <div className="w-full md:w-[calc(50%-1rem)]">
          <CustomSelect
            label="Years"
            options={YEAR_OPTIONS}
            value={filters.year}
            onChange={(v) => updateFilter("year", v)}
          />
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl shadow p-6 mt-10 min-h-130">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-2">
          <h3 className="text-sm font-medium text-gray-700">
            {filters.region}{" "}
            {filters.data === "Sold Prices by Month"
              ? "Median Sold Price"
              : filters.data}{" "}
            in{" "}
            {filters.neighborhood === "All Neighborhoods"
              ? "all Neighborhoods"
              : filters.neighborhood}
            *
          </h3>
          {isFetching && !isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <Loader2 size={13} className="animate-spin" />
              <span>Updating chart...</span>
            </div>
          )}
        </div>

        {/* SCROLL WRAPPER */}
        <div className="overflow-x-auto scrollbar-hide h-full">
          <div className="min-w-175 md:min-w-full h-full relative">
            {!isLoggedIn ? (
              <ChartSignInOverlay onSignIn={() => setOpenLogin(true)} />
            ) : isLoading && chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[380px] gap-3 text-gray-500">
                <Loader2 size={32} className="animate-spin text-primary" />
                <span className="text-sm font-medium">
                  Loading monthly sales data...
                </span>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[380px] gap-2 text-gray-400">
                <p className="text-base font-semibold text-gray-600">
                  No monthly sales data available
                </p>
                <p className="text-xs">
                  Try selecting a different region, neighborhood, property
                  type, or year range.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={380}>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
                >
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />

                  {/* Left Axis: Price */}
                  <YAxis
                    yAxisId="price"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => {
                      if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
                      if (v >= 1000) return `$${Math.round(v / 1000)}K`;
                      return `$${v}`;
                    }}
                  />

                  {/* Right Axis: Sold Count */}
                  <YAxis
                    yAxisId="sold"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                    domain={[
                      0,
                      (dataMax: number) =>
                        Math.max(5, Math.ceil(dataMax * 1.3)),
                    ]}
                  />

                  <Tooltip
                    formatter={(value: any, name: any) => {
                      if (name === "Sold Count") {
                        return [value, name];
                      }
                      return [
                        `$${Number(value || 0).toLocaleString()}`,
                        name,
                      ];
                    }}
                    labelFormatter={(label, payload) => {
                      const rawMonth = payload?.[0]?.payload?.rawMonth;
                      if (rawMonth && dayjs(rawMonth).isValid()) {
                        return dayjs(rawMonth).format("MMMM YYYY");
                      }
                      return label;
                    }}
                  />

                  {/* Sold Count Bar */}
                  <Bar
                    yAxisId="sold"
                    dataKey="soldCount"
                    name="Sold Count"
                    barSize={26}
                    fill="#244A7C"
                    radius={[6, 6, 0, 0]}
                  >
                    <LabelList
                      dataKey="soldCount"
                      position="top"
                      style={{
                        fontSize: 11,
                        fill: "#333",
                        fontWeight: 500,
                      }}
                    />
                  </Bar>

                  <Legend verticalAlign="bottom" height={36} />

                  {/* Average Sold Price Line */}
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="averageSoldPrice"
                    name={
                      filters.propertyType === "All Residential"
                        ? "Avg Sold Price"
                        : `${filters.propertyType} Avg Price`
                    }
                    stroke="#F5A623"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />

                  {/* 12-Month Average Price Line */}
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="12MonthAvgPrice"
                    name="12 Month Avg Price"
                    stroke="#2E7D32"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const MonthlySaleChart = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl shadow p-6 mt-10 min-h-130 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span>Loading sales chart...</span>
          </div>
        </div>
      }
    >
      <MonthlySaleChartContent />
    </Suspense>
  );
};

export default MonthlySaleChart;
