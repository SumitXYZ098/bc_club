"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import PropertiesCard from "@/src/components/common/propertiesCard/PropertiesCard";
import { useGetListings } from "@/src/hooks/listing/useListingQueries";
import { Images } from "@/src/app/exports";
import { useListingStore } from "@/src/store/useListingStore";
import {
  FiPlus,
  FiMinus,
  FiMap,
  FiNavigation,
  FiMaximize,
  FiChevronDown,
  FiLoader,
  FiCheck,
} from "react-icons/fi";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import FiltersPopup from "@/src/components/common/propertiesCard/FiltersPopup";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterPillSelect from "@/src/components/filterPillSelect/FilterPillSelect";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import GetInTouchForm from "../getInTouch/GetInTouchForm";
import GetInTouch from "../getInTouch/GetInTouch";

// ================= Slider Theme =================
const PriceSlider = styled(Slider)({
  color: "#E8A200",
  height: 6,
  padding: "14px 0",

  "& .MuiSlider-thumb": {
    height: 18,
    width: 18,
    backgroundColor: "#E8A200",
    border: "3px solid #fff",
    boxShadow: "0 2px 6px rgba(0,0,0,.25)",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-track": {
    height: 12,
  },

  "& .MuiSlider-rail": {
    height: 12,
    opacity: 1,
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: "0 10px",
    width: "fit-content",
    height: 32,
    borderRadius: 20,
    backgroundColor: "#E8A200",
    transform: "translate(0%, 10%) rotate(180deg) scale(0)",
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(0%, 10%) rotate(180deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(180deg)",
    },
  },
});

// Marker Creator
function createPriceMarker(property: any, onClick: () => void) {
  const el = document.createElement("div");
  el.className =
    "price-marker flex items-center justify-center bg-[#58a65c] text-white font-bold text-[11px] rounded-full border-2 border-white shadow-md cursor-pointer hover:bg-[#4a8f4e] px-2 whitespace-nowrap";

  el.style.height = "32px";
  el.style.minWidth = "32px";

  let fullPrice = property.price
    ? "$" + Number(property.price).toLocaleString()
    : "$0";
  el.innerText = fullPrice;

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick();
  });

  return el;
}

export default function MapSearch() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [visibleProperties, setVisibleProperties] = useState<any[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // States for Custom Sort Dropdown
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const { getInstanceFilters, updateInstanceFilter } = useListingStore();
  const filters = getInstanceFilters("map");
  const {
    search = "",
    location = "",
    status = "forSale",
    activeProperty = "any",
    minPrice,
    maxPrice,
    minSqft,
    maxSqft,
    activeBedRoom,
    activeBathRoom,
  } = filters;

  const setActiveProperty = (val: string) =>
    updateInstanceFilter("map", "activeProperty", val);
  const setStatus = (val: string) => updateInstanceFilter("map", "status", val);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // States for Price Range Toggle
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const priceRef = useRef<HTMLDivElement>(null);

  // Close price toggle when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        priceRef.current &&
        !priceRef.current.contains(event.target as Node)
      ) {
        setIsPriceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const price = [minPrice ?? 1000, maxPrice ?? 20000000];
  const setPrice = (val: [number, number]) => {
    updateInstanceFilter("map", "minPrice", val[0]);
    updateInstanceFilter("map", "maxPrice", val[1]);
  };

  // States for Beds & Baths Toggle
  const [isBedsOpen, setIsBedsOpen] = useState(false);
  const bedsRef = useRef<HTMLDivElement>(null);

  // Close beds toggle when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bedsRef.current && !bedsRef.current.contains(event.target as Node)) {
        setIsBedsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const setActiveBedRoom = (val: string) =>
    updateInstanceFilter("map", "activeBedRoom", val);
  const setActiveBathRoom = (val: string) =>
    updateInstanceFilter("map", "activeBathRoom", val);

  const pillBase =
    "pl-4 pr-2 py-3 bg-white rounded-full shadow-[0_0_20px_0_rgba(0,0,0,0.12)] appearance-none font-medium cursor-pointer border transition w-full";

  const pillActive = "border-primary text-primary ring-1 ring-blue-200";

  const pillInactive = "border-[#30548733] text-gray-800";

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "priceLow" },
    { label: "Price: High to Low", value: "priceHigh" },
  ];

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label;

  // API Params Logic
  const params: any = {
    "pagination[page]": 1,
    "pagination[pageSize]": 100,
    search: search,
    "filters[property_status][$notIn]": ["Expired", "Terminated", "Cancelled"],
    "filters[property_sub_type][$notNull]": true,
    "filters[raw_data][BCRES_SoldDate][$null]": true,
  };

  if (status && status !== "any") {
    params.propertyType = status;
    delete params["filters[property_status][$notIn]"];
    delete params["filters[raw_data][BCRES_SoldDate][$null]"];
    delete params["filters[property_sub_type][$notNull]"];
  }

  if (location && location !== "" && location !== "British Columbia")
    params.location = location;
  if (minPrice !== undefined) params.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice !== 20000000)
    params.maxPrice = maxPrice;
  if (minSqft !== undefined) params.minSqft = minSqft;
  if (maxSqft !== undefined && maxSqft !== 15000) params.maxSqft = maxSqft;
  if (activeBedRoom && activeBedRoom !== "any")
    params.bedrooms = activeBedRoom.replace("+", "");
  if (activeBathRoom && activeBathRoom !== "any")
    params.bathrooms = activeBathRoom.replace("+", "");
  if (activeProperty && activeProperty !== "any") params.type = activeProperty;

  const { data: queryData, isLoading } = useGetListings(params, {
    select: (res: any) => {
      const listings = res?.data || [];
      return listings
        .map((listing: any) => ({
          id: listing.documentId || Math.random().toString(),
          image: listing?.media?.[0]?.MediaURL || Images.apartment,
          title: listing?.property_sub_type || "Property",
          price: listing?.price || 0,
          daysAgo: listing?.raw_data?.OriginalEntryTimestamp ?? 0,
          address: listing?.address
            ? `${listing?.address}, ${listing?.city || ""}`
            : listing?.city || "",
          sqft: listing?.area ?? 0,
          beds: listing?.bedrooms ?? 0,
          baths: listing?.bathrooms ?? 0,
          longitude: Number(
            listing.longitude ||
            listing.Longitude ||
            listing.raw_data?.Longitude ||
            (listing.coordinates && listing.coordinates[0]),
          ),
          latitude: Number(
            listing.latitude ||
            listing.Latitude ||
            listing.raw_data?.Latitude ||
            (listing.coordinates && listing.coordinates[1]),
          ),
          isLogin: true,
        }))
        .filter(
          (l: any) =>
            !isNaN(l.longitude) && !isNaN(l.latitude) && l.longitude !== 0,
        );
    },
  });

  const properties = queryData || [];

  // Initialize Map
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-123.1207, 49.2827],
      zoom: 10,
      style: "mapbox://styles/mapbox/light-v11",
    });

    map.on("load", () => setMapLoaded(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync Map with Location Filter
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !location) return;

    const cityCoords: { [key: string]: [number, number] } = {
      Vancouver: [-123.1207, 49.2827],
      Burnaby: [-122.9805, 49.2488],
      Surrey: [-122.849, 49.1913],
      Richmond: [-123.1336, 49.1666],
      Coquitlam: [-122.7722, 49.2838],
      Victoria: [-123.3656, 48.4284],
      Kelowna: [-119.496, 49.888],
      Abbotsford: [-122.3275, 49.0504],
    };

    const coords = cityCoords[location];

    if (coords) {
      mapRef.current.flyTo({ center: coords, zoom: 11, essential: true });
    } else if (properties.length > 0 && location !== "British Columbia") {
      mapRef.current.flyTo({
        center: [properties[0].longitude, properties[0].latitude],
        zoom: 11,
        essential: true,
      });
    }
  }, [location, mapLoaded]);

  // Fit bounds to show all properties when status/properties change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || properties.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidPoints = false;

    properties.forEach((p: any) => {
      if (
        p.longitude &&
        p.latitude &&
        !isNaN(p.longitude) &&
        !isNaN(p.latitude)
      ) {
        bounds.extend([p.longitude, p.latitude]);
        hasValidPoints = true;
      }
    });

    if (hasValidPoints) {
      mapRef.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 50, left: 50, right: 50 },
        maxZoom: 13,
        duration: 1500,
      });
    }
  }, [properties, mapLoaded]);

  // Update Markers and visible list with sorting
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    properties.forEach((property: any) => {
      const markerEl = createPriceMarker(property, () => {
        map.flyTo({
          center: [property.longitude, property.latitude],
          zoom: 16,
          essential: true,
        });
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([property.longitude, property.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding:5px"><b>$${property.price.toLocaleString()}</b></div>`,
          ),
        )
        .addTo(map);
      markersRef.current.push(marker);
    });

    const updateVisibleProperties = () => {
      const bounds = map.getBounds();
      if (!bounds) return;
      let visible = properties.filter((p: any) =>
        bounds.contains([p.longitude, p.latitude]),
      );

      if (sortBy === "priceLow") {
        visible.sort((a: any, b: any) => a.price - b.price);
      } else if (sortBy === "priceHigh") {
        visible.sort((a: any, b: any) => b.price - a.price);
      } else if (sortBy === "newest") {
        visible.sort((a: any, b: any) => b.daysAgo - a.daysAgo);
      }

      setVisibleProperties(visible);
    };

    map.on("moveend", updateVisibleProperties);
    updateVisibleProperties();
    return () => {
      map.off("moveend", updateVisibleProperties);
    };
  }, [mapLoaded, properties, sortBy]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <div className="w-full h-screen flex flex-col bg-white overflow-hidden mt-20">
        {/* 1. TOP FILTER BAR */}
        <div className="relative z-[1000] bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          <FiltersPopup
            id="map"
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          <div
            onClick={() => setIsFilterOpen(true)}
            className="px-6 py-3 bg-background rounded-full shadow-[0_0_20px_0_rgba(0,0,0,0.12)] flex items-center justify-center gap-3 border-[#30548733] cursor-pointer  shrink-0"
          >
            <FilterListIcon sx={{ color: "#305487" }} /> Filters
          </div>

          <div
            onClick={() => setStatus("forSale")}
            className={`flex items-center gap-1 border rounded px-3 py-1.5 text-sm font-normal cursor-pointer shrink-0 transition-all ${status === "forSale"
                ? "bg-primary text-white border-primary"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            For Sale
          </div>

          <div
            onClick={() => setStatus("sold")}
            className={`flex items-center gap-1 border rounded px-3 py-1.5 text-sm font-normal cursor-pointer shrink-0 transition-all ${status === "sold"
                ? "bg-primary text-white border-primary"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            Sold
          </div>

          <div
            onClick={() => setStatus("expired")}
            className={`flex items-center gap-1 border rounded px-3 py-1.5 text-sm font-normal cursor-pointer shrink-0 transition-all ${status === "expired"
                ? "bg-primary text-white border-primary"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            Expired
          </div>

          <div className="relative" ref={priceRef}>
            <div
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className={`flex items-center gap-1 border rounded px-3 py-1.5 text-sm font-normal cursor-pointer shrink-0 transition-all ${isPriceOpen
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              $ Price{" "}
              <FiChevronDown
                className={`text-gray-400 ml-1 transition-transform ${isPriceOpen ? "rotate-180 text-white" : ""}`}
              />
            </div>

            {isPriceOpen && (
              <div className="absolute top-full left-0 md:left-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[9999] p-5 md:p-7 w-[92vw] md:w-auto md:min-w-[400px] animate-in fade-in slide-in-from-top-3 duration-300 backdrop-blur-sm bg-white/95">
                <div className="md:mb-6 mb-3">
                  <div className="flex items-center justify-between md:mb-3">
                    <h3 className="font-medium">Price Range</h3>
                    <button
                      onClick={() => setPrice([1000, 20000000])}
                      className="text-xs font-bold text-white bg-secondary transition-all p-3 px-7 rounded-sm cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="relative">
                    <PriceSlider
                      value={[price[0] ?? 1000, price[1] ?? 20000000]}
                      min={1000}
                      max={20000000}
                      step={2000}
                      onChange={(_, v) => setPrice(v as [number, number])}
                      disableSwap
                      valueLabelDisplay="auto"
                    />
                  </div>

                  <div className="flex flex-row flex-wrap items-center mt-5 justify-between gap-4 w-full">
                    <div className="flex flex-col flex-1 min-w-35">
                      <p className="text-[10px] sm:text-xs text-[#333]/30 mb-1 whitespace-nowrap">
                        Min Price
                      </p>
                      <div className="flex text-xs sm:text-sm font-medium items-center gap-1 border border-[#33333333] rounded-xl px-4 py-2.5 h-11 bg-white">
                        <span className="text-secondary">$</span>
                        <span>{price[0].toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 min-w-35">
                      <p className="text-[10px] sm:text-xs text-[#333]/30 mb-1 whitespace-nowrap">
                        Max Price
                      </p>
                      <div className="flex text-xs sm:text-sm font-medium items-center gap-1 border border-[#33333333] rounded-xl px-4 py-2.5 h-11 bg-white">
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
              </div>
            )}
          </div>

          <div className="relative" ref={bedsRef}>
            <div
              onClick={() => setIsBedsOpen(!isBedsOpen)}
              className={`flex items-center gap-1 border rounded-lg px-4 py-2 text-[15px] font-semibold cursor-pointer shrink-0 transition-all ${isBedsOpen
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
              <div className="absolute top-full left-0 md:left-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[9999] p-5 md:p-7 w-[92vw] md:w-auto md:min-w-[380px] animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="mb-7">
                  <h3 className="font-bold text-gray-800 text-lg mb-4">
                    Bedrooms
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {["any", "1", "2", "3", "4+"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setActiveBedRoom(val)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${activeBedRoom === val
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {val === "any" ? "Any" : val}
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
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${activeBathRoom === val
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {val === "any" ? "Any" : val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative min-w-50 shrink-0">
            <FilterPillSelect
              label="Property Type"
              value={activeProperty}
              onChange={setActiveProperty}
              pillBase={pillBase}
              pillActive={pillActive}
              pillInactive={pillInactive}
              options={[
                { label: "Any", value: "any" },
                { label: "Apartment/Condo", value: "Apartment/Condo" },
                { label: "Single Family Residence", value: "Single Family Residence" },
                { label: "Townhouse", value: "Townhouse" },
                { label: "Half Duplex", value: "Half Duplex" },
                { label: "Row House (Non-Strata)", value: "Row House (Non-Strata)" },
              ]}
            />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
          {/* 2. SIDEBAR - LEFT (Mobile: Full width, Desktop: 110 width) */}
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

              <div className="flex items-center gap-2" ref={sortRef}>
                <span className="text-gray-400 text-[15px] font-bold hidden sm:inline">
                  Sort by:
                </span>
                <div className="relative min-w-40">
                  <div
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className={`flex items-center justify-between px-3 py-2 bg-white border rounded-lg cursor-pointer transition-all duration-200 ${isSortOpen ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-300 shadow-sm"}`}
                  >
                    <span className="text-gray-800 text-sm font-bold">
                      {currentSortLabel}
                    </span>
                    <FiChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${isSortOpen ? "rotate-180 text-primary" : ""}`}
                      size={16}
                    />
                  </div>

                  {isSortOpen && (
                    <div className="absolute right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-999 overflow-hidden">
                      <div className="py-1">
                        {sortOptions.map((opt) => (
                          <div
                            key={opt.value}
                            onClick={() => {
                              setSortBy(opt.value);
                              setIsSortOpen(false);
                            }}
                            className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-colors ${sortBy === opt.value ? "bg-primary/5 text-primary font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                          >
                            {opt.label}
                            {sortBy === opt.value && (
                              <FiCheck className="text-primary" size={14} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar bg-[#f8f9fa]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-3">
                  <FiLoader className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-gray-500 text-sm font-medium">Fetching properties...</p>
                </div>
              ) : visibleProperties.length > 0 ? (
                visibleProperties.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <PropertiesCard
                      {...p}
                      isLogin
                      isSold={status === "sold"}
                      isExpired={status === "expired"}
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

          {/* 3. MAP AREA - RIGHT (Hidden on Mobile) */}
          <div className="hidden md:block flex-1 relative z-10">
            <div ref={mapContainerRef} className="w-full h-full" />

            {isLoading && (
              <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-20 pointer-events-none flex items-start justify-center pt-10">
                <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                  <FiLoader className="animate-spin text-primary" />
                  <span className="text-xs font-bold text-gray-600">Updating Map...</span>
                </div>
              </div>
            )}

            <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
              <div className="flex flex-col bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                <button className="p-2.5 border-b hover:bg-gray-50" onClick={() => mapRef.current?.zoomIn()}>
                  <FiPlus className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2.5 hover:bg-gray-50" onClick={() => mapRef.current?.zoomOut()}>
                  <FiMinus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50">
                <FiMap className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50">
                <FiNavigation className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50">
                <FiMaximize className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

      </div>
      <GetInTouch />
    </>
  );
}