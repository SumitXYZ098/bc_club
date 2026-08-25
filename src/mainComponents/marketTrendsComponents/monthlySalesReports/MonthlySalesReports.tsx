"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { getMonthlySalesReports } from "@/src/api/listing/listingApi";

/* ================= SELECT ================= */
interface CustomSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative flex-1">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center border border-[#E6EAEE] rounded-full px-4 py-2 text-sm bg-white cursor-pointer"
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
        <div className="absolute z-30 mt-2 w-full bg-white rounded-xl shadow max-h-60 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                value === opt ? "font-medium text-black" : "text-gray-600"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ================= TYPES & HELPER ================= */
type SortDirection = "asc" | "desc";

interface SortState {
  key: string;
  direction: SortDirection;
}

interface HeaderCol {
  label: string;
  key: string;
}

const PROPERTY_TYPE_OPTIONS = [
  "All Residential",
  "Apartment",
  "Detached",
  "Townhouse",
];

const NEIGHBORHOOD_OPTIONS = [
  "Vancouver",
  "Surrey",
  "Richmond",
  "Burnaby",
  "Coquitlam",
  "Langley",
  "North Vancouver",
  "West Vancouver",
  "Abbotsford",
  "Chilliwack",
  "Maple Ridge",
  "New Westminster",
  "Delta",
  "Whistler",
];

const PRICE_COLUMNS: HeaderCol[] = [
  { label: "Price Range $", key: "priceRange" },
  { label: "Solds", key: "sold" },
  { label: "Inventory", key: "inventory" },
  { label: "Ratio", key: "ratio" },
  { label: "New", key: "new" },
];

const BEDS_COLUMNS: HeaderCol[] = [
  { label: "Bedrooms", key: "bedroomRange" },
  { label: "Solds", key: "sold" },
  { label: "Inventory", key: "inventory" },
  { label: "Ratio", key: "ratio" },
  { label: "New", key: "new" },
];

const NEIGHBOR_COLUMNS: HeaderCol[] = [
  { label: "Neighbourhood", key: "neighborhood" },
  { label: "Solds", key: "sold" },
  { label: "Inventory", key: "inventory" },
  { label: "Ratio", key: "ratio" },
  { label: "New", key: "new" },
];

const getMonthOptions = () => {
  const options: { label: string; year: number; month: number }[] = [];
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() - 1; // 0-based index for previous month

  if (month < 0) {
    month = 11;
    year -= 1;
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i < 12; i++) {
    options.push({
      label: `${monthNames[month]} ${year}`,
      year: year,
      month: month + 1, // 1-based month
    });

    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }

  return options;
};

const parseRangeValue = (val: string): number => {
  if (!val) return 0;
  const match = val.match(/\d[\d,]*/);
  if (match) {
    return parseInt(match[0].replace(/,/g, ""), 10);
  }
  return 0;
};

const sortReportData = (
  data: any[],
  sortKey: string,
  sortDirection: SortDirection,
  labelKey: string
) => {
  if (!data || data.length === 0) return [];

  const regularRows = data.filter((row) => row[labelKey] !== "Total");
  const totalRow = data.find((row) => row[labelKey] === "Total");

  const sorted = [...regularRows].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (valA === undefined || valA === null) valA = "";
    if (valB === undefined || valB === null) valB = "";

    let comparison = 0;

    if (sortKey === "priceRange" || sortKey === "bedroomRange") {
      const numA = parseRangeValue(String(valA));
      const numB = parseRangeValue(String(valB));
      comparison = numA - numB;
    } else if (typeof valA === "number" && typeof valB === "number") {
      comparison = valA - valB;
    } else if (
      !isNaN(Number(valA)) &&
      !isNaN(Number(valB)) &&
      valA !== "" &&
      valB !== ""
    ) {
      comparison = Number(valA) - Number(valB);
    } else {
      comparison = String(valA).localeCompare(String(valB));
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  if (totalRow) {
    sorted.push(totalRow);
  }

  return sorted;
};

/* ================= MAIN COMPONENT ================= */
const MonthlySalesReports = () => {
  const monthOptions = useMemo(() => getMonthOptions(), []);

  const [property, setProperty] = useState("All Residential");
  const [neighborhood, setNeighborhood] = useState("Vancouver");
  const [selectedMonthLabel, setSelectedMonthLabel] = useState(
    monthOptions[0]?.label || ""
  );

  const [priceData, setPriceData] = useState<any[]>([]);
  const [neighborData, setNeighborData] = useState<any[]>([]);
  const [bedsData, setBedsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sorting state for each table
  const [priceSort, setPriceSort] = useState<SortState>({
    key: "priceRange",
    direction: "asc",
  });
  const [bedsSort, setBedsSort] = useState<SortState>({
    key: "bedroomRange",
    direction: "asc",
  });
  const [neighborSort, setNeighborSort] = useState<SortState>({
    key: "neighborhood",
    direction: "asc",
  });

  const handleSort = (
    setSort: React.Dispatch<React.SetStateAction<SortState>>,
    key: string
  ) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    const currentOption =
      monthOptions.find((opt) => opt.label === selectedMonthLabel) ||
      monthOptions[0];
    if (!currentOption) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const commonParams = {
          year: currentOption.year,
          month: currentOption.month,
          propertyType: property.toLowerCase(),
          region: neighborhood.toLowerCase(),
        };

        const [resPrice, resNeighbor, resBeds] = await Promise.all([
          getMonthlySalesReports({ ...commonParams, type: "price" }),
          getMonthlySalesReports({ ...commonParams, type: "neighbor" }),
          getMonthlySalesReports({ ...commonParams, type: "beds" }),
        ]);

        setPriceData(resPrice?.priceRanges || []);
        setNeighborData(resNeighbor?.neighborhoods || []);
        setBedsData(resBeds?.bedrooms || []);
      } catch (err: any) {
        console.error("Failed to fetch monthly sales report data:", err);
        setError(err?.message || "Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [property, neighborhood, selectedMonthLabel, monthOptions]);

  const monthLabelsList = useMemo(
    () => monthOptions.map((opt) => opt.label),
    [monthOptions]
  );

  const sortedPriceData = useMemo(
    () => sortReportData(priceData, priceSort.key, priceSort.direction, "priceRange"),
    [priceData, priceSort]
  );

  const sortedBedsData = useMemo(
    () => sortReportData(bedsData, bedsSort.key, bedsSort.direction, "bedroomRange"),
    [bedsData, bedsSort]
  );

  const sortedNeighborData = useMemo(
    () => sortReportData(neighborData, neighborSort.key, neighborSort.direction, "neighborhood"),
    [neighborData, neighborSort]
  );

  const handleRetry = () => {
    const opt =
      monthOptions.find((o) => o.label === selectedMonthLabel) ||
      monthOptions[0];
    if (!opt) return;
    setLoading(true);
    setError(null);
    const commonParams = {
      year: opt.year,
      month: opt.month,
      propertyType: property.toLowerCase(),
      region: neighborhood.toLowerCase(),
    };
    Promise.all([
      getMonthlySalesReports({ ...commonParams, type: "price" }),
      getMonthlySalesReports({ ...commonParams, type: "neighbor" }),
      getMonthlySalesReports({ ...commonParams, type: "beds" }),
    ])
      .then(([resPrice, resNeighbor, resBeds]) => {
        setPriceData(resPrice?.priceRanges || []);
        setNeighborData(resNeighbor?.neighborhoods || []);
        setBedsData(resBeds?.bedrooms || []);
      })
      .catch((err) => setError(err?.message || "Error fetching data"))
      .finally(() => setLoading(false));
  };

  const renderTableHeader = (
    columns: HeaderCol[],
    currentSort: SortState,
    onSort: (key: string) => void
  ) => (
    <thead className="bg-[#F9FAFB]">
      <tr className="text-left text-gray-500">
        {columns.map((col) => {
          const isActive = currentSort.key === col.key;
          return (
            <th
              key={col.key}
              onClick={() => onSort(col.key)}
              className="px-4 py-3 cursor-pointer select-none hover:text-black hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-1">
                <span>{col.label}</span>
                <span className="text-xs text-[#EEA500]">
                  {isActive ? (currentSort.direction === "asc" ? "▲" : "▼") : "▲"}
                </span>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );

  return (
    <section className="space-y-6 mt-10">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row gap-4">
        <CustomSelect
          label="Property Type"
          options={PROPERTY_TYPE_OPTIONS}
          value={property}
          onChange={setProperty}
        />
        <CustomSelect
          label="Neighborhood"
          options={NEIGHBORHOOD_OPTIONS}
          value={neighborhood}
          onChange={setNeighborhood}
        />
        <CustomSelect
          label="Month"
          options={monthLabelsList}
          value={selectedMonthLabel}
          onChange={setSelectedMonthLabel}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={handleRetry}
            className="underline font-medium cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table Cards */}
      <div className="w-full flex flex-wrap gap-5">
        <div className="w-full md:w-[calc(50%-10px)] flex flex-col gap-5">
          {/* Table 1: Price Range */}
          <div className="bg-white rounded-2xl shadow overflow-hidden w-full h-fit">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-140 md:min-w-full w-full text-sm">
                {renderTableHeader(PRICE_COLUMNS, priceSort, (key) =>
                  handleSort(setPriceSort, key)
                )}

                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-10"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-10"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-10"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-10"></div>
                        </td>
                      </tr>
                    ))
                  ) : sortedPriceData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-400"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    sortedPriceData.map((row, i) => {
                      const isTotal = row.priceRange === "Total";
                      return (
                        <tr
                          key={i}
                          className={
                            isTotal
                              ? "font-bold bg-[#EAEAEA] text-black"
                              : i % 2
                              ? "bg-[#F3F3F3]"
                              : "bg-white"
                          }
                        >
                          <td className="px-4 py-3 font-medium">
                            {row.priceRange}
                          </td>
                          <td className="px-4 py-3">{row.sold}</td>
                          <td className="px-4 py-3">{row.inventory}</td>
                          <td className="px-4 py-3">
                            {row.ratio !== undefined && row.ratio !== null
                              ? `${row.ratio}%`
                              : "-"}
                          </td>
                          <td className="px-4 py-3">{row.new}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Bedrooms */}
          <div className="bg-white rounded-2xl shadow overflow-hidden w-full h-fit">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-140 md:min-w-full w-full text-sm">
                {renderTableHeader(BEDS_COLUMNS, bedsSort, (key) =>
                  handleSort(setBedsSort, key)
                )}

                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-10"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-10"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-10"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-10"></div>
                        </td>
                      </tr>
                    ))
                  ) : sortedBedsData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-400"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    sortedBedsData.map((row, i) => {
                      const isTotal = row.bedroomRange === "Total";
                      return (
                        <tr
                          key={i}
                          className={
                            isTotal
                              ? "font-bold bg-[#EAEAEA] text-black"
                              : i % 2
                              ? "bg-[#F3F3F3]"
                              : "bg-white"
                          }
                        >
                          <td className="px-4 py-3 font-medium">
                            {row.bedroomRange}
                          </td>
                          <td className="px-4 py-3">{row.sold}</td>
                          <td className="px-4 py-3">{row.inventory}</td>
                          <td className="px-4 py-3">
                            {row.ratio !== undefined && row.ratio !== null
                              ? `${row.ratio}%`
                              : "-"}
                          </td>
                          <td className="px-4 py-3">{row.new}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table 3: Neighbourhood */}
        <div className="bg-white rounded-2xl shadow overflow-hidden w-full h-fit md:w-[calc(50%-10px)]">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-140 md:min-w-full w-full text-sm">
              {renderTableHeader(NEIGHBOR_COLUMNS, neighborSort, (key) =>
                handleSort(setNeighborSort, key)
              )}

              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-10"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-10"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-10"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-10"></div>
                      </td>
                    </tr>
                  ))
                ) : sortedNeighborData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  sortedNeighborData.map((row, i) => {
                    const isTotal = row.neighborhood === "Total";
                    return (
                      <tr
                        key={i}
                        className={
                          isTotal
                            ? "font-bold bg-[#EAEAEA] text-black"
                            : i % 2
                            ? "bg-[#F3F3F3]"
                            : "bg-white"
                        }
                      >
                        <td className="px-4 py-3 font-medium">
                          {row.neighborhood}
                        </td>
                        <td className="px-4 py-3">{row.sold}</td>
                        <td className="px-4 py-3">{row.inventory}</td>
                        <td className="px-4 py-3">
                          {row.ratio !== undefined && row.ratio !== null
                            ? `${row.ratio}%`
                            : "-"}
                        </td>
                        <td className="px-4 py-3">{row.new}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlySalesReports;
