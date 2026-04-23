"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import PropertiesCard from "@/src/components/common/propertiesCard/PropertiesCard";
import {
  useGetListings,
  useGetActiveListings,
} from "@/src/hooks/listing/useListingQueries";
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
  FiX,
} from "react-icons/fi";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import FiltersPopup from "@/src/components/common/propertiesCard/FiltersPopup";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterPillSelect from "@/src/components/filterPillSelect/FilterPillSelect";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import GetInTouch from "../getInTouch/GetInTouch";
import CustomButton from "@/src/components/button/CustomButton";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";

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
    "price-marker flex items-center justify-center bg-primary text-white font-bold text-[12px] rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-secondary transition-all px-3 py-1 whitespace-nowrap gap-1.5";

  el.style.height = "36px";
  el.style.minWidth = "60px";

  let fullPrice = property.price
    ? "$" + Number(property.price).toLocaleString()
    : "$0";

  el.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
    <span>${fullPrice}</span>
  `;

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
  const [isSatellite, setIsSatellite] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [visibleProperties, setVisibleProperties] = useState<any[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const pathName = usePathname();
  const isWishlistPage = pathName === "/wishlist";

  // States for Custom Sort Dropdown
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const { getInstanceFilters, updateInstanceFilter, clearInstanceFilters } =
    useListingStore();
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

  const { isLoggedIn, setOpenLogin } = useAuthContext();

  const setActiveProperty = (val: string) =>
    updateInstanceFilter("map", "activeProperty", val);

  const setStatus = (val: string) => {
    if ((val === "sold" || val === "expired") && !isLoggedIn) {
      setOpenLogin(true);
      return;
    }
    updateInstanceFilter("map", "status", val);
  };

  // Enforce restriction if status is set externally (e.g. via GetInTouch or store initial state)
  useEffect(() => {
    if ((status === "sold" || status === "expired") && !isLoggedIn) {
      updateInstanceFilter("map", "status", "forSale");
      setOpenLogin(true);
    }
  }, [status, isLoggedIn, updateInstanceFilter, setOpenLogin]);

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

  // States for Price & Area Toggle
  const [isPriceAreaOpen, setIsPriceAreaOpen] = useState(false);
  const priceAreaRef = useRef<HTMLDivElement>(null);

  // Close price & area dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        priceAreaRef.current &&
        !priceAreaRef.current.contains(event.target as Node)
      ) {
        setIsPriceAreaOpen(false);
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

  // States for Location Toggle
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close location toggle when clicking outside
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

  const setActiveBedRoom = (val: string) =>
    updateInstanceFilter("map", "activeBedRoom", val);
  const setActiveBathRoom = (val: string) =>
    updateInstanceFilter("map", "activeBathRoom", val);

  const setLocation = (val: string) =>
    updateInstanceFilter("map", "location", val);

  const sqft = [minSqft ?? 100, maxSqft ?? 15000];
  const setSqft = (val: [number, number]) => {
    updateInstanceFilter("map", "minSqft", val[0]);
    updateInstanceFilter("map", "maxSqft", val[1]);
  };

  // ── Reset All Filters ────────────────────────────────────────────────────
  const resetAllFilters = () => {
    clearInstanceFilters("map");
    setSortBy("newest");
  };

  // ── Active Filter Pills ──────────────────────────────────────────────────
  const activeFilterPills: { label: string; onRemove: () => void }[] = [];

  if (status && status !== "forSale") {
    const statusLabel =
      status === "sold" ? "Sold" : status === "expired" ? "Expired" : status;
    activeFilterPills.push({
      label: `Status: ${statusLabel}`,
      onRemove: () => updateInstanceFilter("map", "status", "forSale"),
    });
  }

  if (location && location !== "") {
    activeFilterPills.push({
      label: `Location: ${location}`,
      onRemove: () => updateInstanceFilter("map", "location", ""),
    });
  }

  if (minPrice !== undefined && minPrice > 1000) {
    activeFilterPills.push({
      label: `Min Price: $${minPrice.toLocaleString()}`,
      onRemove: () => updateInstanceFilter("map", "minPrice", 1000),
    });
  }

  if (maxPrice !== undefined && maxPrice < 20000000) {
    activeFilterPills.push({
      label: `Max Price: $${maxPrice.toLocaleString()}`,
      onRemove: () => updateInstanceFilter("map", "maxPrice", 20000000),
    });
  }

  if (minSqft !== undefined && minSqft > 100) {
    activeFilterPills.push({
      label: `Min Area: ${minSqft} sqft`,
      onRemove: () => updateInstanceFilter("map", "minSqft", 100),
    });
  }

  if (maxSqft !== undefined && maxSqft < 15000) {
    activeFilterPills.push({
      label: `Max Area: ${maxSqft} sqft`,
      onRemove: () => updateInstanceFilter("map", "maxSqft", 15000),
    });
  }

  if (activeBedRoom && activeBedRoom !== "any") {
    activeFilterPills.push({
      label: `Beds: ${activeBedRoom}`,
      onRemove: () => updateInstanceFilter("map", "activeBedRoom", "any"),
    });
  }

  if (activeBathRoom && activeBathRoom !== "any") {
    activeFilterPills.push({
      label: `Baths: ${activeBathRoom}`,
      onRemove: () => updateInstanceFilter("map", "activeBathRoom", "any"),
    });
  }

  if (activeProperty && activeProperty !== "any") {
    activeFilterPills.push({
      label: `Type: ${activeProperty}`,
      onRemove: () => updateInstanceFilter("map", "activeProperty", "any"),
    });
  }

  if (sortBy !== "newest") {
    const sortLabel =
      sortBy === "priceLow" ? "Price: Low→High" : "Price: High→Low";
    activeFilterPills.push({
      label: `Sort: ${sortLabel}`,
      onRemove: () => setSortBy("newest"),
    });
  }

  const hasActiveFilters = activeFilterPills.length > 0;

  const pillBase =
    "pl-4 pr-2 py-3 bg-white rounded-[10px] appearance-none font-medium cursor-pointer border transition w-full";

  const pillActive = "border-primary text-primary ring-1 ring-blue-200";

  const pillInactive = "border-[#30548733] text-gray-800";

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "priceLow" },
    { label: "Price: High to Low", value: "priceHigh" },
  ];

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label;

  // API Params Logic
  const commonParams: any = {};
  if (search) commonParams.search = search;
  if (location && location !== "" && location !== "British Columbia") commonParams.location = location;
  if (minPrice !== undefined) commonParams.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice !== 20000000) commonParams.maxPrice = maxPrice;
  if (minSqft !== undefined) commonParams.minSqft = minSqft;
  if (maxSqft !== undefined && maxSqft !== 15000) commonParams.maxSqft = maxSqft;
  if (activeBedRoom && activeBedRoom !== "any") commonParams.bedrooms = activeBedRoom.replace("+", "");
  if (activeBathRoom && activeBathRoom !== "any") commonParams.bathrooms = activeBathRoom.replace("+", "");
  if (activeProperty && activeProperty !== "any") commonParams.type = activeProperty;

  const params: any = {
    ...commonParams,
    "filters[property_status][$notIn]": ["Expired", "Terminated", "Cancelled"],
    "filters[property_sub_type][$notNull]": true,
    "filters[raw_data][BCRES_SoldDate][$null]": true,
  };

  if (status && status !== "any") {
    delete params["filters[property_status]"];
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
    params.beds= activeBedRoom.replace("+", "");
  if (activeBathRoom && activeBathRoom !== "any")
    params.baths = activeBathRoom.replace("+", "");
  if (activeProperty && activeProperty !== "any") params.type = activeProperty;

  const isForSale = status === "forSale" || !status;
  const { data: queryDataNormal, isLoading: isLoadingNormal } = useGetListings(
    params,
    {
      select: (res: any) => {
        const listings = res?.data || [];
        return listings
          .map(
            (listing: any) => (
              console.log(
                "longitude:",
                listing?.longitude,
                " latitude:",
                listing?.latitude,
              ),
              {
                id: listing.documentId || Math.random().toString(),
                image: typeof listing?.media?.[0] === "string" ? listing.media[0] : listing?.media?.[0]?.MediaURL,
                title: listing?.property_sub_type || "Property",
                price: listing?.price || 0,
                daysAgo: listing?.raw_data?.OriginalEntryTimestamp ?? 0,
                address: listing?.address
                  ? `${listing?.address}, ${listing?.city || ""}`
                  : listing?.city || "",
                sqft: listing?.area ?? listing?.lot_size_area ?? 0,
                beds: listing?.bedrooms ?? 0,
                baths: listing?.bathrooms ?? 0,
                longitude: listing?.longitude,
                latitude: listing?.latitude,
                priceDrop:
                  listing.PreviousListPrice &&
                  listing.PreviousListPrice > listing.ListPrice
                    ? Number(
                        (
                          (listing.PreviousListPrice - listing.ListPrice) /
                          listing.ListPrice
                        ).toFixed(1),
                      )
                    : undefined,
                assessedDiff: listing.ListPrice
                  ? Number(
                      (
                        (listing.ListPrice - (listing.TaxAssessedValue ?? 0)) /
                        listing.ListPrice
                      ).toFixed(1),
                    )
                  : 0,
                mls: listing?.mls_number,
                realtor:
                  listing?.office_data?.OfficeName ||
                  listing?.raw_data?.ListAOR ||
                  "Unknown",
                isLogin: false,
                isFavourite: listing?.is_favorite || isWishlistPage,
              }
            ),
          )
          .filter(
            (l: any) =>
              !isNaN(l.longitude) && !isNaN(l.latitude) && l.longitude !== 0,
          );
      },
      enabled: !isForSale,
    },
  );

  const { data: queryDataActive, isLoading: isLoadingActive } =
    useGetActiveListings(params, {
      select: (res: any) => {
        const listings = res?.data || [];
        return listings
          .map(
            (listing: any) => (
              console.log(
                "longitude:",
                listing?.longitude,
                " latitude:",
                listing?.latitude,
              ),
              {
                id: listing.documentId,
                image: listing?.media_url?.[0] ?? listing?.media[0]?.MediaURL,
                title: listing?.property_sub_type,
                price: listing?.price || 0,
                daysAgo: listing?.raw_data?.OriginalEntryTimestamp ?? 0,
                address: `${listing?.address}, ${listing?.city}, ${listing?.state}`,
                sqft: listing?.area ?? listing?.Living_area ?? 0,
                beds: listing?.bedrooms ?? 0,
                baths: listing?.bathrooms ?? 0,
                priceDrop:
                  listing.PreviousListPrice > listing.ListPrice
                    ? Number(
                        (
                          (listing.PreviousListPrice - listing.ListPrice) /
                          listing.ListPrice
                        ).toFixed(1),
                      )
                    : undefined,
                assessedDiff: listing.ListPrice
                  ? Number(
                      (
                        (listing.PreviousListPrice - listing.ListPrice) /
                        listing.ListPrice
                      ).toFixed(1),
                    )
                  : 0,
                longitude: listing?.longitude,
                latitude: listing?.latitude,
                mls: listing?.mls_number ?? listing?.listing_id,
                realtor:
                  listing?.office_data?.OfficeName ||
                  listing?.raw_data?.OriginatingSystemName ||
                  "Unknown",
                isFavourite: listing?.is_favorite || isWishlistPage,
              }
            ),
          )
          .filter(
            (l: any) =>
              !isNaN(l.longitude) && !isNaN(l.latitude) && l.longitude !== 0,
          );
      },
      enabled: isForSale,
    });

  const queryData = isForSale ? queryDataActive : queryDataNormal;
  const isLoading = isForSale ? isLoadingActive : isLoadingNormal;

  const properties = queryData || [];

  // Initialize Map
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-123.1207, 49.2827],
      zoom: 10,
      style: "mapbox://styles/mapbox/streets-v12",
    });

    map.on("load", () => setMapLoaded(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Auto Satellite View on Zoom ──────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    const handleZoom = () => {
      const zoom = map.getZoom();
      if (zoom >= 17 && !isSatellite) {
        map.setStyle("mapbox://styles/mapbox/satellite-streets-v12");
        setIsSatellite(true);
      } else if (zoom < 17 && isSatellite) {
        map.setStyle("mapbox://styles/mapbox/streets-v12");
        setIsSatellite(false);
      }
    };

    map.on("zoom", handleZoom);
    return () => {
      map.off("zoom", handleZoom);
    };
  }, [mapLoaded, isSatellite]);

  const toggleMapStyle = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (isSatellite) {
      map.setStyle("mapbox://styles/mapbox/streets-v12");
      setIsSatellite(false);
    } else {
      map.setStyle("mapbox://styles/mapbox/satellite-streets-v12");
      setIsSatellite(true);
    }
  };

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

  const handleGeolocation = () => {
    if (!mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          essential: true,
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Please enable location services to use this feature.");
      },
    );
  };

  const handleFitBounds = () => {
    if (!mapRef.current || properties.length === 0) return;
    const bounds = new mapboxgl.LngLatBounds();
    properties.forEach((p: any) => {
      if (p.longitude && p.latitude) {
        bounds.extend([p.longitude, p.latitude]);
      }
    });
    mapRef.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
      duration: 1000,
    });
  };

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

      setVisibleProperties((prev: any) => {
        if (JSON.stringify(prev) === JSON.stringify(visible)) {
          return prev;
        }
        return visible;
      });
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
        <div className="flex flex-wrap md:justify-start  justify-center items-center gap-4 lg:flex-nowrap mb-6 h-auto w-full pl-5 mt-4">
          <FiltersPopup
            id="map"
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          <div
            onClick={() => setIsFilterOpen(true)}
            className="px-6 py-3 bg-background rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.12)] flex items-center justify-center gap-3 border-[#30548733] cursor-pointer  shrink-0"
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
            className={`flex items-center gap-1 border rounded-[10px] px-4 py-2.5 bg-background  text-sm font-normal cursor-pointer shrink-0 transition-all ${
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
              className={`flex items-center gap-1 border rounded-[10px] px-5 py-2.5 text-sm font-normal cursor-pointer shrink-0 transition-all  ${
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
              <div className="absolute top-full left-0 md:left-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[9999] p-5 md:p-7 w-[92vw] md:w-auto md:min-w-[450px] animate-in fade-in slide-in-from-top-3 duration-300 backdrop-blur-sm bg-white/95 max-h-[80vh] overflow-y-auto no-scrollbar">
                {/* Price Section */}
                <div className="md:mb-8 mb-5">
                  <div className="flex items-center justify-between md:mb-3">
                    <h3 className="font-bold text-gray-800 text-lg">
                      Price Range
                    </h3>

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

                {/* Area Section */}
                <div className="md:mb-2 mb-2 mt-2">
                  <div className="flex items-center justify-between md:mb-3">
                    <h3 className="font-bold text-gray-800 text-lg">
                      Area Range
                    </h3>
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
                            <span className="text-secondary text-[10px]">
                              sqft
                            </span>
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
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                          activeBedRoom === val
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
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                          activeBathRoom === val
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
              ]}
            />
          </div>

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
              <div className="absolute top-full left-0 md:left-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[9999] p-5 w-[92vw] md:w-60 animate-in fade-in slide-in-from-top-3 duration-300 backdrop-blur-sm bg-white/95">
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
                      className={`px-4 py-2.5 text-sm cursor-pointer rounded-lg transition-colors ${location === loc || (loc === "British Columbia" && !location) ? "bg-primary/10 text-primary font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ACTIVE FILTER PILLS ROW */}
        {hasActiveFilters && (
          <div className="relative z-[999] bg-[#f8faff] border-b border-gray-100 px-4 py-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0 mr-1">
              Active:
            </span>

            {activeFilterPills.map((pill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 bg-primary/10 border border-primary/25 text-primary text-xs font-semibold px-3 py-1.5 rounded-full animate-in fade-in duration-200"
              >
                <span>{pill.label}</span>
                <button
                  onClick={pill.onRemove}
                  className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
                  aria-label="Remove filter"
                >
                  <FiX size={11} />
                </button>
              </div>
            ))}

            <button
              onClick={resetAllFilters}
              className="ml-auto flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-[10px] transition-all duration-200 shrink-0 cursor-pointer"
            >
              <FiX size={12} />
              Reset All
            </button>
          </div>
        )}

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
                  <span className="text-xs font-bold text-gray-600">
                    Updating Map...
                  </span>
                </div>
              </div>
            )}

            <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
              <div className="flex flex-col bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                <button
                  className="p-2.5 border-b hover:bg-gray-50"
                  onClick={() => mapRef.current?.zoomIn()}
                >
                  <FiPlus className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2.5 hover:bg-gray-50"
                  onClick={() => mapRef.current?.zoomOut()}
                >
                  <FiMinus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={toggleMapStyle}
                className={`p-2.5 rounded-md shadow-lg border transition-colors ${isSatellite ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
              >
                <FiMap className="w-5 h-5" />
              </button>
              <button
                onClick={handleGeolocation}
                className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                title="Current Location"
              >
                <FiNavigation className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleFitBounds}
                className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                title="Fit all properties"
              >
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
