import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import FiltersPopup from "@/src/components/common/propertiesCard/FiltersPopup";
import FilterListIcon from "@mui/icons-material/FilterList";

interface MapTopFilterBarProps {
  status: string;
  setStatus: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
}

export default function MapTopFilterBar({
  status,
  setStatus,
  location,
  setLocation,
}: MapTopFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap justify-start items-center gap-4 lg:gap-2 xl:gap-4 h-auto">
      <FiltersPopup
        id="map"
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <div
        onClick={() => setIsFilterOpen(true)}
        className="px-5 py-2.5 bg-background rounded-[10px] text-sm border flex items-center justify-center gap-1 border-[#30548733] cursor-pointer shrink-0"
      >
        <FilterListIcon sx={{ color: "#305487", width: 18, height: 18 }} />
        Filters
      </div>

      <div
        onClick={() => setStatus("forSale")}
        className={`hidden md:flex items-center gap-1 border rounded-[10px] px-5 py-2.5 text-sm font-normal cursor-pointer shrink-0 transition-all ${
          status === "forSale"
            ? "bg-primary text-white border-primary"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        For Sale
      </div>

      <div
        onClick={() => setStatus("closed")}
        className={`hidden md:flex items-center gap-1 border rounded-[10px] px-4 py-2.5 bg-background text-sm font-normal cursor-pointer shrink-0 transition-all ${
          status === "closed"
            ? "bg-primary text-white border-primary"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Sold
      </div>

      <div
        onClick={() => setStatus("expired")}
        className={`hidden md:flex items-center gap-1 border rounded-[10px] px-4 py-2.5 text-sm font-normal cursor-pointer shrink-0 transition-all ${
          status === "expired"
            ? "bg-primary text-white border-primary"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Expired
      </div>

      <div className="hidden md:flex relative" ref={locationRef}>
        <div
          onClick={() => setIsLocationOpen(!isLocationOpen)}
          className={`flex items-center gap-1 border rounded-[10px] px-5 py-2.5 text-sm font-normal cursor-pointer shrink-0 transition-all ${
            isLocationOpen
              ? "border-primary bg-primary text-white"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {location || "Location"}{" "}
          <FiChevronDown
            className={`text-gray-400 ml-1 transition-transform ${isLocationOpen ? "rotate-180 text-white" : ""}`}
          />
        </div>

        {isLocationOpen && (
          <div className="absolute top-full -left-20 mt-3 border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-9999 w-[92vw] p-4 md:w-60 animate-in fade-in slide-in-from-top-3 duration-300 backdrop-blur-sm bg-white/95">
            <div className="max-h-80 overflow-y-auto no-scrollbar">
              {[
                "British Columbia",
                "Vancouver",
                "Burnaby",
                "Surrey",
                "Prince George",
                "Richmond",
                "Victoria",
                "Kelowna",
                "Abbotsford",
                "White Rock",
                "Nanaimo",
                "Coquitlam",
                "New Westminster",
                "North Vancouver",
                "West Vancouver",
                "Langley",
                "Delta",
                "Maple Ridge",
                "Chilliwack",
              ].map((loc) => (
                <div
                  key={loc}
                  onClick={() => {
                    setLocation(loc === "British Columbia" ? "" : loc);
                    setIsLocationOpen(false);
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer rounded-lg transition-colors ${
                    location === loc ||
                    (loc === "British Columbia" && !location)
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {loc}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
