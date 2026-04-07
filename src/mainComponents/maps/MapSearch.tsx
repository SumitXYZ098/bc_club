"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import PropertiesCard from "@/src/components/common/propertiesCard/PropertiesCard";
import { useGetListings } from "@/src/hooks/listing/useListingQueries";
import { Images } from "@/src/app/exports";
import { useListingStore } from "@/src/store/useListingStore";
import { FiSearch, FiX, FiClock, FiPlus, FiMinus, FiMap, FiNavigation, FiLayers, FiMaximize, FiChevronDown, FiFilter } from "react-icons/fi";

// Green Circle Marker matching the screenshot
function createPriceMarker(property: any) {
  const el = document.createElement("div");
  el.className =
    "price-marker flex items-center justify-center bg-[#58a65c] text-white font-bold text-[11px] rounded-full border-2 border-white shadow-md cursor-pointer hover:bg-[#4a8f4e] transition-all hover:scale-110";
  el.style.width = "32px";
  el.style.height = "32px";

  let shortLabel = "0";
  if (property.price) {
    if (property.price >= 1000000) {
      shortLabel = Math.round(property.price / 1000000) + "M";
    } else if (property.price >= 1000) {
      const kVal = Math.round(property.price / 1000);
      shortLabel = kVal > 999 ? "1M" : kVal.toString();
    } else {
      shortLabel = property.price.toString();
    }
  }

  el.innerText = shortLabel;
  return el;
}

export default function MapSearch() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [visibleProperties, setVisibleProperties] = useState<any[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const { filters, updateFilter } = useListingStore();
  const { search = "", location = "", status = "forSale", activePrice = "any", activeProperty = "any" } = filters;

  const setStatus = (val: string) => updateFilter("status", val);
  const setActiveProperty = (val: string) => updateFilter("activeProperty", val);

  const [commuteLocation, setCommuteLocation] = useState("");
  const [commuteTime, setCommuteTime] = useState("10");

  const params: any = {
    "pagination[page]": 1,
    "pagination[pageSize]": 100,
    search: search,
  };

  if (status && status !== "any") params.propertyType = status;
  if (location && location !== "") params.location = location;
  if (activePrice && activePrice !== "any") params.price = activePrice;

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
          longitude: Number(listing.longitude),
          latitude: Number(listing.latitude),
          isLogin: true
        })).filter((l: any) => !isNaN(l.longitude) && !isNaN(l.latitude));
    },
  });

  const properties = queryData || [];

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-79.38, 43.65],
      zoom: 8,
      style: "mapbox://styles/mapbox/light-v11",
    });

    map.on("load", () => setMapLoaded(true));
    mapRef.current = map;

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !properties.length) return;
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    properties.forEach((property: any) => {
      const markerEl = createPriceMarker(property);
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([property.longitude, property.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<div style="padding:5px"><b>$${property.price.toLocaleString()}</b></div>`))
        .addTo(map);
      markersRef.current.push(marker);
    });

    const updateVisibleProperties = () => {
      const bounds = map.getBounds();
      if (!bounds) return;
      setVisibleProperties(properties.filter((p: any) => bounds.contains([p.longitude, p.latitude])));
    };

    map.on("moveend", updateVisibleProperties);
    updateVisibleProperties();
    return () => { map.off("moveend", updateVisibleProperties); };
  }, [mapLoaded, properties]);

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden mt-20">
      
      {/* 1. TOP FILTER BAR (Exact Design) */}
      <div className="z-30 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1.5 text-sm font-normal text-gray-700 cursor-pointer hover:bg-gray-50">
          For Sale <FiChevronDown className="text-gray-400 ml-1" />
        </div>

        <div className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1.5 text-sm font-normal text-gray-700 cursor-pointer hover:bg-gray-50">
          $ Price <FiChevronDown className="text-gray-400 ml-1" />
        </div>

        <div className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1.5 text-sm font-normal text-gray-700 cursor-pointer hover:bg-gray-50">
          Beds & Baths <FiChevronDown className="text-gray-400 ml-1" />
        </div>

        <div className="flex bg-[#f3f4f6] rounded border p-1">
          <button onClick={() => setStatus("forSale")} className={`px-4 py-1 text-sm font-bold transition rounded ${status === "forSale" ? "bg-primary text-white" : "text-gray-500"}`}>Active</button>
          <button onClick={() => setStatus("any")} className={`flex items-center gap-1 px-4 py-1 text-sm font-bold transition rounded ${status === "any" ? "bg-primary text-white" : "text-gray-500"}`}>All <FiChevronDown className="text-[10px]" /></button>
          <button onClick={() => setStatus("sold")} className={`px-4 py-1 text-sm font-bold transition rounded ${status === "sold" ? "bg-gray-400 text-white" : "text-gray-500"}`}>Sold</button>
        </div>

        <button className="px-4 py-1.5 border border-gray-300 rounded text-sm font-normal text-gray-700 bg-white">De-Listed</button>
        <button className="px-4 py-1.5 border border-primary bg-primary text-white rounded text-sm font-bold">Price Changed</button>

        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-sm font-normal text-gray-700 cursor-pointer">
          <FiClock className="text-gray-500" /> Travel Time
        </div>

        <div className="relative min-w-[180px]">
          <select value={activeProperty} onChange={(e) => setActiveProperty(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 rounded px-4 py-1.5 text-sm font-normal outline-none cursor-pointer pr-8">
            <option value="any">All Property Types</option>
            <option value="Condo Townhouse">Condo Townhouse</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="ml-auto flex items-center gap-3">
           <FiMaximize className="text-gray-500 cursor-pointer w-5 h-5" />
           <FiFilter className="text-gray-500 cursor-pointer w-5 h-5" />
           <button className="px-4 py-1.5 border border-gray-300 rounded text-sm font-bold bg-white shadow-sm">List view</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 2. SIDEBAR - LEFT */}
        <div className="w-[440px] flex flex-col bg-white border-r border-gray-200">
          <div className="p-4 border-b flex justify-between items-center text-sm font-semibold">
            <div className="text-gray-500 uppercase tracking-tight">Results: <span className="text-black font-bold">{visibleProperties.length}/{properties.length}</span></div>
            <div className="flex items-center gap-1 text-gray-800 cursor-pointer">
              Sort by: <span className="text-black font-bold">New to Old</span> <FiChevronDown className="text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar bg-[#f8f9fa]">
            {visibleProperties.map((p) => (
              <div key={p.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <PropertiesCard {...p} isLogin />
              </div>
            ))}
          </div>
        </div>

        {/* 3. MAP AREA - RIGHT */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* COMMUTE SEARCH OVERLAY */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[850px]">
            <div className="bg-white p-1.5 rounded-full shadow-2xl border border-gray-200 flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1 px-4 border-r border-gray-100">
                <FiSearch className="text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Enter a location to find commute time and ..." className="w-full bg-transparent outline-none text-[13px] py-1.5" />
              </div>
              <div className="flex items-center gap-3 px-2 border-r border-gray-100 text-[12px] font-bold text-gray-500">
                <span className="uppercase ml-1">Mode:</span>
                <span className="text-gray-400 text-lg">🚗</span>
                <span className="text-[#58a65c] text-xl border-b-2 border-[#58a65c]">🚶</span>
                <span className="text-gray-400 text-lg">🚲</span>
                <span className="text-gray-400 text-lg">🚌</span>
              </div>
              <div className="flex items-center gap-2 px-2 border-r border-gray-100 text-[12px] font-bold text-gray-500">
                <span className="uppercase">Time</span>
                <span className="bg-gray-50 px-2.5 py-1 border rounded text-black font-bold">10</span>
                <span className="text-gray-400">:Mins</span>
              </div>
              <button className="bg-white text-gray-800 px-6 py-2 rounded-full text-xs font-bold border border-gray-300 hover:bg-gray-50 transition uppercase tracking-wider">Calculate</button>
              <button className="p-2 text-red-400 bg-red-50 rounded-full mr-1"><FiX /></button>
            </div>
          </div>

          {/* FLOATING MAP TOOLS */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
            <div className="flex flex-col bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
               <button className="p-2.5 border-b hover:bg-gray-50" onClick={() => mapRef.current?.zoomIn()}><FiPlus className="w-5 h-5 text-gray-600" /></button>
               <button className="p-2.5 hover:bg-gray-50" onClick={() => mapRef.current?.zoomOut()}><FiMinus className="w-5 h-5 text-gray-600" /></button>
            </div>
            <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50"><FiMap className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50"><FiNavigation className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50"><FiMaximize className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 text-[10px] font-bold text-gray-700">AUTO</button>
            <button className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 text-[14px] font-bold text-gray-700 underline">A</button>
          </div>
        </div>
      </div>
    </div>
  );
}