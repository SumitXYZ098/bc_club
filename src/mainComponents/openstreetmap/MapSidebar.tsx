import React from "react";
import { FiLoader } from "react-icons/fi";
import PropertiesCard from "@/src/components/common/propertiesCard/PropertiesCard";

interface MapSidebarProps {
  isLoading: boolean;
  visibleProperties: any[];
  properties: any[];
  isLoggedIn: boolean;
  status: string;
}

export default function MapSidebar({
  isLoading,
  visibleProperties,
  properties,
  isLoggedIn,
  status,
}: MapSidebarProps) {
  return (
    <div className="w-full md:w-110 flex flex-col bg-white md:border-r border-gray-200 z-10 h-full">
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

      <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar bg-[#f8f9fa]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <FiLoader className="w-8 h-8 text-primary animate-spin" />
            <p className="text-gray-500 text-sm font-medium">
              Fetching properties...
            </p>
          </div>
        ) : visibleProperties.length > 0 ? (
          visibleProperties.map((p) => (
            <div key={p.id} className="">
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
