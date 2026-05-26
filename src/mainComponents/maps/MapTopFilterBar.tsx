import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import FiltersPopup from "@/src/components/common/propertiesCard/FiltersPopup";
import FilterListIcon from "@mui/icons-material/FilterList";
// import FilterPillSelect from "@/src/components/filterPillSelect/FilterPillSelect";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import { PriceSlider } from "./mapUtils";

interface MapTopFilterBarProps {
  status: string;
  setStatus: (val: string) => void;
  price: [number, number];
  setPrice: (val: [number, number]) => void;
  sqft: [number, number];
  setSqft: (val: [number, number]) => void;
  activeBedRoom: string | undefined;
  setActiveBedRoom: (val: string) => void;
  activeBathRoom: string | undefined;
  setActiveBathRoom: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
}

export default function MapTopFilterBar({
  status,
  setStatus,
  price,
  setPrice,
  sqft,
  setSqft,
  activeBedRoom,
  setActiveBedRoom,
  activeBathRoom,
  setActiveBathRoom,
  location,
  setLocation,
}: MapTopFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPriceAreaOpen, setIsPriceAreaOpen] = useState(false);
  const [isBedsOpen, setIsBedsOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const priceAreaRef = useRef<HTMLDivElement>(null);
  const bedsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        priceAreaRef.current &&
        !priceAreaRef.current.contains(event.target as Node)
      ) {
        setIsPriceAreaOpen(false);
      }
      if (bedsRef.current && !bedsRef.current.contains(event.target as Node)) {
        setIsBedsOpen(false);
      }
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
    <div className="flex flex-wrap md:justify-start justify-center items-center gap-4 lg:flex-nowrap mb-6 h-auto w-full pl-5 mt-4">
      <FiltersPopup
        id="map"
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <div
        onClick={() => setIsFilterOpen(true)}
        className="px-6 py-3 bg-background rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.12)] flex items-center justify-center gap-3 border-[#30548733] cursor-pointer shrink-0"
      >
        <FilterListIcon sx={{ color: "#305487" }} /> Filters
      </div>

      <div
        onClick={() => setStatus("forSale")}
        className={`flex items-center gap-1 border rounded-[10px] px-5 py-2.5 text-sm font-normal cursor-pointer shrink-0 transition-all ${
          status === "forSale"
            ? "bg-primary text-white border-primary"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        For Sale
      </div>

      <div
        onClick={() => setStatus("sold")}
        className={`flex items-center gap-1 border rounded-[10px] px-4 py-2.5 bg-background text-sm font-normal cursor-pointer shrink-0 transition-all ${
          status === "sold"
            ? "bg-primary text-white border-primary"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Sold
      </div>

      <div
        onClick={() => setStatus("expired")}
        className={`flex items-center gap-1 border rounded-[10px] px-4 py-2.5 text-sm font-normal cursor-pointer shrink-0 transition-all ${
          status === "expired"
            ? "bg-primary text-white border-primary"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Expired
      </div>

      <div className="relative" ref={priceAreaRef}>
        <div
          onClick={() => setIsPriceAreaOpen(!isPriceAreaOpen)}
          className={`flex items-center gap-1 border rounded-[10px] px-5 py-2.5 text-sm font-normal cursor-pointer shrink-0 transition-all ${
            isPriceAreaOpen
              ? "border-primary bg-primary text-white"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Price & Area{" "}
          <FiChevronDown
            className={`text-gray-400 ml-1 transition-transform ${isPriceAreaOpen ? "rotate-180 text-white" : ""}`}
          />
        </div>

        {isPriceAreaOpen && (
          <div className="absolute top-full left-0 md:left-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-9999 p-5 md:p-7 w-[92vw] md:w-auto md:min-w-[450px] animate-in fade-in slide-in-from-top-3 duration-300 backdrop-blur-sm max-h-[80vh] overflow-y-auto no-scrollbar">
            <div className="md:mb-8 mb-5">
              <div className="flex items-center justify-between md:mb-3">
                <h3 className="font-bold text-gray-800 text-lg">Price Range</h3>
                <button
                  onClick={() => setPrice([1000, 20000000])}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Reset Price
                </button>
              </div>
              <div className="relative px-2">
                <PriceSlider
                  value={[price[0] ?? 1000, price[1] ?? 20000000]}
                  min={1000}
                  max={20000000}
                  step={20000}
                  onChange={(_, v) => setPrice(v as [number, number])}
                  disableSwap
                  valueLabelDisplay="auto"
                />
              </div>

              <div className="flex flex-row items-center mt-5 justify-between gap-4 w-full">
                <div className="flex flex-col flex-1">
                  <p className="text-[10px] text-[#333]/40 mb-1 uppercase font-bold tracking-wider">
                    Min Price
                  </p>
                  <div className="flex text-sm font-bold items-center gap-1 border border-[#33333333] rounded-xl px-4 py-2.5 bg-white">
                    <span className="text-secondary">$</span>
                    <span>{price[0].toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <p className="text-[10px] text-[#333]/40 mb-1 uppercase font-bold tracking-wider">
                    Max Price
                  </p>
                  <div className="flex text-sm font-bold items-center gap-1 border border-[#33333333] rounded-xl px-4 py-2.5 bg-white">
                    {price[1] === 20000000 ? (
                      <span>Max</span>
                    ) : (
                      <>
                        <span className="text-secondary">$</span>
                        <span>{price[1].toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <LineGradient />

            <div className="md:mb-2 mb-2 mt-2">
              <div className="flex items-center justify-between md:mb-3">
                <h3 className="font-bold text-gray-800 text-lg">Area Range</h3>
                <button
                  onClick={() => setSqft([100, 15000])}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Reset Area
                </button>
              </div>
              <div className="relative px-2">
                <PriceSlider
                  value={[sqft[0] ?? 100, sqft[1] ?? 15000]}
                  min={100}
                  max={15000}
                  step={100}
                  onChange={(_, v) => setSqft(v as [number, number])}
                  disableSwap
                  valueLabelDisplay="auto"
                />
              </div>

              <div className="flex flex-row items-center mt-5 justify-between gap-4 w-full">
                <div className="flex flex-col flex-1">
                  <p className="text-[10px] text-[#333]/40 mb-1 uppercase font-bold tracking-wider">
                    Min Sqft
                  </p>
                  <div className="flex text-sm font-bold items-center gap-1 border border-[#33333333] rounded-xl px-4 py-2.5 bg-white">
                    <span>{sqft[0]}</span>
                    <span className="text-secondary text-[10px]">sqft</span>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <p className="text-[10px] text-[#333]/40 mb-1 uppercase font-bold tracking-wider">
                    Max Sqft
                  </p>
                  <div className="flex text-sm font-bold items-center gap-1 border border-[#33333333] rounded-xl px-4 py-2.5 bg-white">
                    {sqft[1] === 15000 ? (
                      <span>Max</span>
                    ) : (
                      <>
                        <span>{sqft[1]}</span>
                        <span className="text-secondary text-[10px]">sqft</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative" ref={bedsRef}>
        <div
          onClick={() => setIsBedsOpen(!isBedsOpen)}
          className={`flex items-center gap-1 border rounded-[10px] px-7 py-2.5 text-[15px] font-semibold cursor-pointer shrink-0 transition-all ${
            isBedsOpen
              ? "border-primary bg-primary text-white shadow-md"
              : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
          }`}
        >
          Beds & Baths{" "}
          <FiChevronDown
            className={`ml-1.5 transition-transform duration-300 ${isBedsOpen ? "rotate-180" : "text-gray-400"}`}
          />
        </div>

        {isBedsOpen && (
          <div className="absolute top-full left-0 md:left-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-9999 p-5 md:p-7 w-[92vw] md:w-auto md:min-w-[380px] animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="mb-7">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Bedrooms</h3>
              <div className="flex flex-wrap gap-2.5">
                {["any", "1", "2", "3", "4+"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setActiveBedRoom(val)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                      activeBedRoom === val
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {val === "any" ? "All" : val}
                  </button>
                ))}
              </div>
            </div>

            <LineGradient />

            <div className="mb-2 mt-4">
              <h3 className="font-bold text-gray-800 text-lg mb-4">
                Bathrooms
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {["any", "1", "2", "3", "4+"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setActiveBathRoom(val)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                      activeBathRoom === val
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {val === "any" ? "All" : val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <div className="relative min-w-50 shrink-0">
        <FilterPillSelect
          label="Property Type"
          value={activeProperty}
          onChange={setActiveProperty}
          pillBase={pillBase}
          pillActive={pillActive}
          pillInactive={pillInactive}
          options={
            status === "sold" || status === "expired"
              ? [
                  { label: "All", value: "any" },
                  { label: "Apartment/Condo", value: "Apartment/Condo" },
                  {
                    label: "Single Family Residence",
                    value: "Single Family Residence",
                  },
                  { label: "Townhouse", value: "Townhouse" },
                  { label: "Half Duplex", value: "Half Duplex" },
                  {
                    label: "Row House (Non-Strata)",
                    value: "Row House (Non-Strata)",
                  },
                ]
              : [
                  { label: "All", value: "any" },
                  { label: "Single-Family", value: "Single-Family" },
                  { label: "Multi-Family", value: "Multi-Family" },
                  { label: "Office", value: "Office" },
                  { label: "Business", value: "Business" },
                  { label: "Agriculture", value: "Agriculture" },
                  { label: "Vacant Land", value: "Vacant Land" },
                ]
          }
        />
      </div> */}

      <div className="relative" ref={locationRef}>
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
          <div className="absolute top-full left-0 md:left-0 mt-3 border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-9999 p-5 w-[92vw] md:w-60 animate-in fade-in slide-in-from-top-3 duration-300 backdrop-blur-sm bg-white/95">
            <div className="max-h-80 overflow-y-auto no-scrollbar p-2">
              {[
                "British Columbia",
                "Vancouver",
                "Burnaby",
                "Surrey",
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
