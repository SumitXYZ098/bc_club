"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import PropertiesCard from "@/src/components/common/propertiesCard/PropertiesCard";
import { useGetListings } from "@/src/hooks/listing/useListingQueries";
import { Images } from "@/src/app/exports";
import { useListingStore } from "@/src/store/useListingStore";
import { FiPlus, FiMinus, FiMap, FiNavigation, FiMaximize, FiChevronDown, FiFilter, FiLoader, FiCheck } from "react-icons/fi";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import FiltersPopup from "@/src/components/common/propertiesCard/FiltersPopup";
import FilterListIcon from "@mui/icons-material/FilterList";

// Marker Creator
function createPriceMarker(property: any, onClick: () => void) {
  const el = document.createElement("div");
  el.className =
    "price-marker flex items-center justify-center bg-[#58a65c] text-white font-bold text-[11px] rounded-full border-2 border-white shadow-md cursor-pointer hover:bg-[#4a8f4e] px-2 whitespace-nowrap";
  
  el.style.height = "32px";
  el.style.minWidth = "32px"; 

  let fullPrice = property.price ? "$" + Number(property.price).toLocaleString() : "$0";
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
    search = "", location = "", status = "forSale", activeProperty = "any",
    minPrice, maxPrice, minSqft, maxSqft, activeBedRoom, activeBathRoom
  } = filters;

  const setActiveProperty = (val: string) => updateInstanceFilter("map", "activeProperty", val);

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

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "priceLow" },
    { label: "Price: High to Low", value: "priceHigh" },
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label;

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

  if (location && location !== "" && location !== "British Columbia") params.location = location;
  if (minPrice !== undefined) params.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice !== 20000000) params.maxPrice = maxPrice;
  if (minSqft !== undefined) params.minSqft = minSqft;
  if (maxSqft !== undefined && maxSqft !== 15000) params.maxSqft = maxSqft;
  if (activeBedRoom && activeBedRoom !== "any") params.bedrooms = activeBedRoom.replace("+", "");
  if (activeBathRoom && activeBathRoom !== "any") params.bathrooms = activeBathRoom.replace("+", "");
  if (activeProperty && activeProperty !== "any") params.type = activeProperty;

  const { data: queryData, isLoading } = useGetListings(params, {
    select: (res: any) => {
      const listings = res?.data || [];
      return listings.map((listing: any) => ({
          id: listing.documentId || Math.random().toString(),
          image: listing?.media?.[0]?.MediaURL || Images.apartment,
          title: listing?.property_sub_type || "Property",
          price: listing?.price || 0,
          daysAgo: listing?.raw_data?.OriginalEntryTimestamp ?? 0,
          address: listing?.address ? `${listing?.address}, ${listing?.city || ""}` : listing?.city || "",
          sqft: listing?.area ?? 0,
          beds: listing?.bedrooms ?? 0,
          baths: listing?.bathrooms ?? 0,
          longitude: Number(listing.longitude || listing.Longitude || listing.raw_data?.Longitude || (listing.coordinates && listing.coordinates[0])),
          latitude: Number(listing.latitude || listing.Latitude || listing.raw_data?.Latitude || (listing.coordinates && listing.coordinates[1])),
          isLogin: true
        })).filter((l: any) => !isNaN(l.longitude) && !isNaN(l.latitude) && l.longitude !== 0);
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

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Sync Map with Location Filter
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !location) return;

    const cityCoords: { [key: string]: [number, number] } = {
      "Vancouver": [-123.1207, 49.2827],
      "Burnaby": [-122.9805, 49.2488],
      "Surrey": [-122.8490, 49.1913],
      "Richmond": [-123.1336, 49.1666],
      "Coquitlam": [-122.7722, 49.2838],
      "Victoria": [-123.3656, 48.4284],
      "Kelowna": [-119.4960, 49.8880],
      "Abbotsford": [-122.3275, 49.0504],
    };

    const coords = cityCoords[location];

    if (coords) {
      mapRef.current.flyTo({ center: coords, zoom: 11, essential: true });
    } else if (properties.length > 0 && location !== "British Columbia") {
      mapRef.current.flyTo({
        center: [properties[0].longitude, properties[0].latitude],
        zoom: 11,
        essential: true
      });
    }
  }, [location, mapLoaded]);

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
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<div style="padding:5px"><b>$${property.price.toLocaleString()}</b></div>`))
        .addTo(map);
      markersRef.current.push(marker);
    });

    const updateVisibleProperties = () => {
      const bounds = map.getBounds();
      if (!bounds) return;
      let visible = properties.filter((p: any) => bounds.contains([p.longitude, p.latitude]));

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
    return () => { map.off("moveend", updateVisibleProperties); };
  }, [mapLoaded, properties, sortBy]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden mt-20">
      
      {/* 1. TOP FILTER BAR */}
      <div className="z-30 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <FiltersPopup id="map" open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
        
        <div onClick={() => setIsFilterOpen(true)} className="px-6 py-3 bg-background rounded-full shadow-[0_0_20px_0_rgba(0,0,0,0.12)] flex items-center justify-center gap-3 border-[#30548733] cursor-pointer w-full xl:w-fit">
          <FilterListIcon sx={{ color: "#305487" }} /> Filters
        </div>

        <div className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1.5 text-sm font-normal text-gray-700 cursor-pointer hover:bg-gray-50 shrink-0">
          For Sale <FiChevronDown className="text-gray-400 ml-1" />
        </div>

        <div className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1.5 text-sm font-normal text-gray-700 cursor-pointer hover:bg-gray-50 shrink-0">
          $ Price <FiChevronDown className="text-gray-400 ml-1" />
        </div>

        <button className="px-4 py-1.5 border border-primary bg-primary text-white rounded text-sm font-bold shrink-0">Price Changed</button>

        <div className="relative min-w-[180px]">
          <select value={activeProperty} onChange={(e) => setActiveProperty(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 rounded px-4 py-1.5 text-sm font-normal outline-none cursor-pointer pr-8">
            <option value="any">All Property Types</option>
            <option value="Condo Townhouse">Condo Townhouse</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 2. SIDEBAR - LEFT */}
        <div className="w-110 flex flex-col bg-white border-r border-gray-200 z-10">
          <div className="p-4 flex justify-between items-center text-sm font-semibold">
            <div className="text-gray-500 ">
              Results: <span className="text-black ">
                {isLoading ? "..." : `${visibleProperties.length}/${properties.length}`}
              </span>
            </div>

            {/* --- PREMIUM CUSTOM SORT DROPDOWN --- */}
            <div className="flex items-center gap-2" ref={sortRef}>
              <span className="text-gray-400 text-[15px] font-bold ">Sort by:</span>
              <div className="relative min-w-[160px]">
                <div 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`flex items-center justify-between px-3 py-2 bg-white border rounded-lg cursor-pointer transition-all duration-200 ${isSortOpen ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-300 shadow-sm"}`}
                >
                  <span className="text-gray-800 text-sm font-bold">{currentSortLabel}</span>
                  <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${isSortOpen ? "rotate-180 text-primary" : ""}`} size={16} />
                </div>

                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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
                          {sortBy === opt.value && <FiCheck className="text-primary" size={14} />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <LineGradient />

          <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar bg-[#f8f9fa]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-3">
                <FiLoader className="w-8 h-8 text-primary animate-spin" />
                <p className="text-gray-500 text-sm font-medium">Fetching properties...</p>
              </div>
            ) : visibleProperties.length > 0 ? (
              visibleProperties.map((p) => (
                <div key={p.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <PropertiesCard {...p} isLogin isSold={status === "sold"} isExpired={status === "expired"} />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No properties found in this area.
              </div>
            )}
          </div>
        </div>

        {/* 3. MAP AREA - RIGHT */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="w-full h-full" />
          
           {isLoading && (
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-20 pointer-events-none flex items-start justify-center pt-10">
               <div className="bg-white px-4 py-2 rounded-full shadow-md border flex items-center gap-2">
                  <FiLoader className="animate-spin text-primary" />
                  <span className="text-xs font-bold text-gray-600">Updating Map...</span>
               </div>
            </div>
          )}

          {/* FLOATING MAP TOOLS */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
            <div className="flex flex-col bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                <button className="p-2.5 border-b hover:bg-gray-50" onClick={() => mapRef.current?.zoomIn()}><FiPlus className="w-5 h-5 text-gray-600" /></button>
                <button className="p-2.5 hover:bg-gray-50" onClick={() => mapRef.current?.zoomOut()}><FiMinus className="w-5 h-5 text-gray-600" /></button>
            </div>
            <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50"><FiMap className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50"><FiNavigation className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50"><FiMaximize className="w-5 h-5 text-gray-600" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}