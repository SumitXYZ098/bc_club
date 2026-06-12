import React from "react";
import { FiLoader } from "react-icons/fi";
import PropertiesCard from "@/src/components/common/propertiesCard/PropertiesCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface MapSidebarProps {
  isLoading: boolean;
  visibleProperties: any[];
  properties: any[];
  isLoggedIn: boolean;
  status: string;
  setHoveredPropertyId?: (id: string | null) => void;
  assessmentDrawerOpen?: boolean;
  selectedAssessmentProperty?: any;
  setAssessmentDrawerOpen?: (value: boolean) => void;
}

export default function MapSidebar({
  isLoading,
  visibleProperties,
  properties,
  isLoggedIn,
  status,
  setHoveredPropertyId,
  assessmentDrawerOpen,
  selectedAssessmentProperty,
  setAssessmentDrawerOpen,
}: MapSidebarProps) {
  // const displayChartData =
  //   selectedAssessmentProperty?.chartComparison?.map((item: any) => ({
  //     year: item.year,
  //     value: Number(item.assessedValue || 0),
  //     change: item.propertyChangePercent ?? 0,
  //     displayValue:
  //       item.assessedValueFormatted ||
  //       `$${Number(item.assessedValue || 0).toLocaleString()}`,
  //   })) || [];

  // const barMax =
  //   Math.max(...displayChartData.map((item: any) => item.value), 0) * 1.15;

  if (assessmentDrawerOpen && selectedAssessmentProperty) {
    return (
      <div className="hidden md:w-110 xl:flex flex-col bg-white md:border-r border-gray-200 z-10 h-full">
        <div className="h-full w-full bg-white overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-5">
            <button
              onClick={() => setAssessmentDrawerOpen?.(false)}
              className="mb-3 text-sm font-semibold text-gray-500 hover:text-[#305487]"
            >
              ← Back to Properties
            </button>

            <h2 className="text-2xl font-bold text-[#305487]">
              ${Number(selectedAssessmentProperty.price || 0).toLocaleString()}
            </h2>

            <p className="mt-2 text-sm font-semibold text-gray-800 leading-5">
              {selectedAssessmentProperty.address}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {selectedAssessmentProperty.roll}
            </p>
          </div>

          <div className="p-5 space-y-5">
            {/* Value Cards */}
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Total Assessed Value</p>
                <p className="mt-1 text-xl font-bold text-[#305487]">
                  $
                  {Number(
                    selectedAssessmentProperty.price || 0,
                  ).toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Land Value</p>
                  <p className="mt-1 text-base font-bold text-gray-900">
                    $
                    {Number(
                      selectedAssessmentProperty.landValue || 0,
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Building Value</p>
                  <p className="mt-1 text-base font-bold text-gray-900">
                    $
                    {Number(
                      selectedAssessmentProperty.buildingValue || 0,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Info */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Legal Information
              </h3>

              {selectedAssessmentProperty.legal?.length > 0 ? (
                <div className="space-y-2">
                  {selectedAssessmentProperty.legal?.map(
                    (item: any, index: number) => (
                      <div
                        key={`${item.pid}-${index}`}
                        className="rounded-lg bg-gray-50 p-3 text-sm"
                      >
                        <p className="text-gray-700">
                          <span className="font-semibold">PID:</span>{" "}
                          {item.pid || "-"}
                        </p>
                        <p className="text-gray-700 mt-1">
                          <span className="font-semibold">Plan:</span>{" "}
                          {item.plan || "-"}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No legal information available.
                </p>
              )}
            </div>

            {/* Assessment History */}
            {/* {displayChartData.length > 0 && (
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-4">
                  Assessment History
                </h3>

                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={displayChartData}
                      layout="vertical"
                      margin={{ top: 0, right: 0, left: 10, bottom: 0 }}
                      barCategoryGap={15}
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
                            <g transform={`translate(${x - 75},${y - 19.5})`}>
                              <rect
                                width="69"
                                height="39"
                                rx="8"
                                fill="#f3f4f6"
                              />
                              <text
                                x="34.5"
                                y="24"
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
                        barSize={39}
                        background={{ fill: "#f3f4f6", radius: 8 }}
                      >
                        {displayChartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill="#E1A22A" />
                        ))}

                        <LabelList
                          dataKey="value"
                          content={(props: any) => {
                            const { x, y, width, index } = props;
                            const entry = displayChartData[index];

                            if (!entry) return null;

                            return (
                              <g>
                                <rect
                                  x={x + 12}
                                  y={y + 8}
                                  width="55"
                                  height="25"
                                  rx="6"
                                  fill="rgba(255,255,255,0.25)"
                                />

                                <text
                                  x={x + 39.5}
                                  y={y + 25}
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

                                <text
                                  x={x + width - 15}
                                  y={y + 26}
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
            )} */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Assessment History
              </h3>

              {selectedAssessmentProperty.chartComparison?.length > 0 ? (
                <div className="space-y-2">
                  {selectedAssessmentProperty.chartComparison.map(
                    (item: any) => (
                      <div
                        key={item.year}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {item.year}
                          </p>
                          <p className="text-xs text-gray-500">
                            Change:{" "}
                            {item.propertyChangePercent !== null &&
                            item.propertyChangePercent !== undefined
                              ? `${item.propertyChangePercent}%`
                              : "-"}
                          </p>
                        </div>

                        <p className="text-sm font-bold text-[#305487]">
                          {item.assessedValueFormatted ||
                            `$${Number(item.assessedValue || 0).toLocaleString()}`}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No assessment history available.
                </p>
              )}
            </div>

            {/* Location */}
            {/* <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Location</h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Latitude</p>
                  <p className="font-semibold text-gray-800">
                    {selectedAssessmentProperty.latitude || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Longitude</p>
                  <p className="font-semibold text-gray-800">
                    {selectedAssessmentProperty.longitude || "-"}
                  </p>
                </div>
              </div>
            </div> */}

            {/* Action */}
            <button
              onClick={() =>
                window.open(
                  `/property-assessment/${selectedAssessmentProperty.documentId}`,
                  `_blank`,
                )
              }
              className="w-full rounded-lg bg-[#305487] px-4 py-3 text-sm font-bold text-white hover:bg-[#24446f]"
            >
              View Full Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="hidden md:w-110 xl:flex flex-col bg-white md:border-r border-gray-200 z-10 h-full">
      <div className="p-4 flex justify-between items-center text-sm font-semibold border-b border-gray-50">
        <div className="text-gray-500 ">
          Results:{" "}
          <span className="text-black ">
            {isLoading
              ? "..."
              : `${visibleProperties.length}/${properties.length}`}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-8 no-scrollbar bg-[#f8f9fa]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <FiLoader className="w-8 h-8 text-primary animate-spin" />
            <p className="text-gray-500 text-sm font-medium">
              Fetching properties...
            </p>
          </div>
        ) : visibleProperties.length > 0 ? (
          visibleProperties.map((p, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredPropertyId?.(p.id)}
              onMouseLeave={() => setHoveredPropertyId?.(null)}
            >
              <PropertiesCard
                {...p}
                isLogin={isLoggedIn || status === "forSale"}
                isSold={status === "sold"}
                isExpired={status === "expired"}
                isDdf={p.isDdf}
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No properties found in this area.
          </div>
        )}
      </div>
    </div>
  );
}
