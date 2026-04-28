"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Supercluster from "supercluster";
import PropertiesCard from "@/src/components/common/propertiesCard/PropertiesCard";
import {
  useGetListings,
  useGetActiveListings,
  useGetMapZoomListings,
} from "@/src/hooks/listing/useListingQueries";
import { Images } from "@/src/app/exports";
import { useListingStore } from "@/src/store/useListingStore";
import {
  FiPlus,
  FiMinus,
  FiMap,
  FiNavigation,
  FiMaximize,
  FiLoader,
} from "react-icons/fi";
import { getOfficeName } from "@/src/utilities/utilities";
import GetInTouch from "../getInTouch/GetInTouch";
import MapTopFilterBar from "./MapTopFilterBar";
import MapActiveFilters from "./MapActiveFilters";
import MapSidebar from "./MapSidebar";
import { createPriceMarker } from "./mapUtils";
import CustomButton from "@/src/components/button/CustomButton";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";

export default function MapSearch() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [visibleProperties, setVisibleProperties] = useState<any[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const superclusterRef = useRef<Supercluster | null>(null);
  const pathName = usePathname();
  const isWishlistPage = pathName === "/wishlist";

  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
    zoom: number;
  } | null>(null);
  const [mapZoomVal, setMapZoomVal] = useState<number | null>(null);
  const mapBoundsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [fitBoundsDone, setFitBoundsDone] = useState(false);

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

  useEffect(() => {
    setFitBoundsDone(false);
  }, [
    search,
    location,
    status,
    activeProperty,
    minPrice,
    maxPrice,
    minSqft,
    maxSqft,
    activeBedRoom,
    activeBathRoom,
  ]);

  // Enforce restriction if status is set externally (e.g. via GetInTouch or store initial state)
  useEffect(() => {
    if ((status === "sold" || status === "expired") && !isLoggedIn) {
      updateInstanceFilter("map", "status", "forSale");
      setOpenLogin(true);
    }
  }, [status, isLoggedIn, updateInstanceFilter, setOpenLogin]);

  const price = [minPrice ?? 1000, maxPrice ?? 20000000];
  const setPrice = (val: [number, number]) => {
    updateInstanceFilter("map", "minPrice", val[0]);
    updateInstanceFilter("map", "maxPrice", val[1]);
  };

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
      label: `Min Price: $${Number(minPrice).toLocaleString()}`,
      onRemove: () => updateInstanceFilter("map", "minPrice", 1000),
    });
  }

  if (maxPrice !== undefined && maxPrice < 20000000) {
    activeFilterPills.push({
      label: `Max Price: $${Number(maxPrice).toLocaleString()}`,
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
  if (location && location !== "" && location !== "British Columbia")
    commonParams.location = location;
  if (minPrice !== undefined) commonParams.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice !== 20000000)
    commonParams.maxPrice = maxPrice;
  if (minSqft !== undefined) commonParams.minSqft = minSqft;
  if (maxSqft !== undefined && maxSqft !== 15000)
    commonParams.maxSqft = maxSqft;
  if (activeBedRoom && activeBedRoom !== "any")
    commonParams.bedrooms = activeBedRoom.replace("+", "");
  if (activeBathRoom && activeBathRoom !== "any")
    commonParams.bathrooms = activeBathRoom.replace("+", "");
  if (activeProperty && activeProperty !== "any")
    commonParams.type = activeProperty;
  if (status && status !== "any") commonParams.propertyType = status;

  const mapZoomParams = useMemo(() => {
    const p: any = {};

    if (search) p.search = search;
    if (location && location !== "" && location !== "British Columbia")
      p.location = location;
    if (minPrice !== undefined && minPrice > 1000) p.minPrice = minPrice;
    if (maxPrice !== undefined && maxPrice < 20000000) p.maxPrice = maxPrice;
    if (minSqft !== undefined && minSqft > 100) p.minSqft = minSqft;
    if (maxSqft !== undefined && maxSqft < 15000) p.maxSqft = maxSqft;

    if (activeBedRoom && activeBedRoom !== "any") {
      p.beds = activeBedRoom.replace("+", "");
    }
    if (activeBathRoom && activeBathRoom !== "any") {
      p.baths = activeBathRoom.replace("+", "");
    }
    if (activeProperty && activeProperty !== "any") p.type = activeProperty;
    if (status && status !== "forSale" && status !== "any") {
      p.propertyType = status;
    }

    if (mapBounds) {
      p.north = mapBounds.north;
      p.south = mapBounds.south;
      p.east = mapBounds.east;
      p.west = mapBounds.west;
      if (mapZoomVal !== null) {
        p.zoom = mapZoomVal;
      }
    }
    return p;
  }, [
    mapBounds,
    mapZoomVal,
    search,
    location,
    minPrice,
    maxPrice,
    minSqft,
    maxSqft,
    activeBedRoom,
    activeBathRoom,
    activeProperty,
    status,
  ]);

  if (mapBounds) {
    commonParams.north = mapBounds.north;
    commonParams.south = mapBounds.south;
    commonParams.east = mapBounds.east;
    commonParams.west = mapBounds.west;
    if (mapZoomVal !== null) {
      commonParams.zoom = mapZoomVal;
    }
  }

  const params: any = {
    "pagination[page]": 1,
    "pagination[pageSize]": 500,
  };

  if (status && status !== "any") {
    params.propertyType = status;
    delete params["filters[property_status][$eq]"];
    delete params["filters[property_sub_type][$notNull]"];

    // if (status === "sold") {
    //   params["filters[property_status][$eq]"] = "Closed";
    //   params["filters[property_sub_type][$notNull]"] = true;
    // } else if (status === "expired") {
    //   params["filters[property_status][$eq]"] = "Expired";
    //   params["filters[property_sub_type][$notNull]"] = true;
    // } else if (status === "forSale") {
    //   params["filters[property_status][$eq]"] = "Active";
    //   params["filters[property_sub_type][$notNull]"] = true;
    // }
  }

  if (location && location !== "" && location !== "British Columbia")
    params.location = location;
  if (minPrice !== undefined && minPrice > 1000) params.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice < 20000000) params.maxPrice = maxPrice;
  if (minSqft !== undefined && minSqft > 100) params.minSqft = minSqft;
  if (maxSqft !== undefined && maxSqft < 15000) params.maxSqft = maxSqft;
  if (activeBedRoom && activeBedRoom !== "any")
    params.beds = activeBedRoom.replace("+", "");
  if (activeBathRoom && activeBathRoom !== "any")
    params.baths = activeBathRoom.replace("+", "");
  if (activeProperty && activeProperty !== "any") params.type = activeProperty;

  const isForSale = status === "forSale";

  const {
    data: queryDataNormal,
    isLoading: isLoadingNormal,
    isFetching: isFetchingNormal,
  } = useGetListings(params, {
    select: (res: any) => {
      const listings = res?.data || [];
      return listings
        .map((listing: any) => ({
          id: listing.documentId || Math.random().toString(),
          image:
            typeof listing?.media?.[0] === "string"
              ? listing.media[0]
              : listing?.media?.[0]?.MediaURL,
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
          realtor: getOfficeName(listing),
          isLogin: false,
          isFavourite: listing?.is_favorite || isWishlistPage,
          isDdf: false,
        }))
        .filter(
          (l: any) =>
            !isNaN(l.longitude) &&
            !isNaN(l.latitude) &&
            l.longitude !== 0 &&
            Number(l.price) > 0,
        );
    },
    enabled: !isForSale && !!mapBounds,
  });

  const {
    data: queryDataActive,
    isLoading: isLoadingActive,
    isFetching: isFetchingActive,
  } = useGetMapZoomListings(mapZoomParams, {
    select: (res: any) => {
      const listings = res?.data || [];
      return listings
        .map((listing: any) => ({
          id: listing.doucumentId,
          image:
            typeof listing?.media_url === "string"
              ? listing.media_url
              : Array.isArray(listing?.media_url)
                ? listing.media_url[0]
                : listing?.media?.[0]?.MediaURL,
          title: listing?.property_sub_type || "Property",
          price: Number(listing?.price) || 0,
          daysAgo: listing?.raw_data?.OriginalEntryTimestamp ?? 0,
          address: listing?.address || `${listing?.city || ""}`,
          sqft: listing?.area ?? listing?.Living_area ?? 0,
          beds: listing?.bedrooms ?? 0,
          baths: listing?.bathrooms ?? 0,
          priceDrop: undefined,
          assessedDiff: 0,
          longitude: Number(listing?.longitude),
          latitude: Number(listing?.latitude),
          mls: listing?.mls_number ?? listing?.listing_id,
          realtor: listing?.office_name ?? getOfficeName(listing),
          isFavourite: listing?.is_favorite || isWishlistPage,
          isDdf: true,
        }))
        .filter(
          (l: any) =>
            !isNaN(l.longitude) &&
            !isNaN(l.latitude) &&
            l.longitude !== 0 &&
            Number(l.price) > 0,
        );
    },
    enabled: isForSale && !!mapBounds,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const queryData = isForSale ? queryDataActive : queryDataNormal;
  const isLoading = isForSale
    ? isLoadingActive || isFetchingActive
    : isLoadingNormal || isFetchingNormal;

  const properties = queryData || [];

  // Initialize Map
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-123.1207, 49.2827],
      zoom: 5,
      style: "mapbox://styles/mapbox/streets-v11",
    });

    map.on("load", () => setMapLoaded(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update mapBounds state when user pans or zooms (Debounced)
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    const handleBounds = () => {
      const bounds = map.getBounds();
      if (bounds) {
        if (mapBoundsTimeoutRef.current) {
          clearTimeout(mapBoundsTimeoutRef.current);
        }
        mapBoundsTimeoutRef.current = setTimeout(() => {
          setMapBounds({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
            zoom: map.getZoom(),
          });
          setMapZoomVal(Math.round(map.getZoom()));
        }, 300);
      }
    };

    map.on("moveend", handleBounds);
    map.on("zoomend", handleBounds);

    // Set initial bounds
    handleBounds();

    return () => {
      map.off("moveend", handleBounds);
      map.off("zoomend", handleBounds);
      if (mapBoundsTimeoutRef.current) {
        clearTimeout(mapBoundsTimeoutRef.current);
      }
    };
  }, [mapLoaded]);

  // Auto Satellite View on Zoom
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
    } else if (properties?.length > 0 && location !== "British Columbia") {
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
    if (!mapRef.current || properties?.length === 0) return;
    const bounds = new mapboxgl.LngLatBounds();
    properties?.forEach((p: any) => {
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
    if (
      !mapLoaded ||
      !mapRef.current ||
      properties?.length === 0 ||
      fitBoundsDone
    )
      return;

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidPoints = false;

    properties?.forEach((p: any) => {
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
      setFitBoundsDone(true);
    }
  }, [properties, mapLoaded, fitBoundsDone]);

  // Update Markers and visible list with sorting

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current;

    // 1. Initialize supercluster
    const points = properties
      ?.filter(
        (p: any) =>
          !isNaN(Number(p.longitude)) &&
          !isNaN(Number(p.latitude)) &&
          Number(p.price) > 0,
      )
      .map((p: any) => ({
        type: "Feature",
        properties: { cluster: false, propertyId: p.id, propertyData: p },
        geometry: {
          type: "Point",
          coordinates: [Number(p.longitude), Number(p.latitude)],
        },
      }));

    if (!superclusterRef.current) {
      superclusterRef.current = new Supercluster({
        radius: 60,
        maxZoom: 9, // at zoom >= 10, it will stop clustering and show individual prices
      });
    }

    superclusterRef.current.load(points as any);

    const updateMapMarkersAndVisible = () => {
      const bounds = map.getBounds();
      if (!bounds) return;

      const zoom = Math.floor(map.getZoom());
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ] as [number, number, number, number];

      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const clusters = superclusterRef.current!.getClusters(bbox, zoom);

      clusters.forEach((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const isCluster = cluster.properties?.cluster;

        if (isCluster) {
          const count = cluster.properties.point_count;
          const size = count < 10 ? 30 : count < 100 ? 40 : 50;

          const el = document.createElement("div");
          el.className = "cursor-pointer";
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;

          el.innerHTML = `
            <div class="flex items-center justify-center bg-primary text-white font-bold text-sm rounded-full shadow-lg border-2 border-white w-full h-full transition-transform hover:scale-110">
              ${count}
            </div>
          `;

          el.addEventListener("click", (e) => {
            e.stopPropagation();
            const expansionZoom =
              superclusterRef.current!.getClusterExpansionZoom(
                cluster.id as number,
              );
            map.flyTo({
              center: [longitude, latitude],
              zoom: expansionZoom,
              essential: true,
            });
          });

          const m = new mapboxgl.Marker({ element: el })
            .setLngLat([longitude, latitude] as [number, number])
            .addTo(map);
          markersRef.current.push(m);
        } else {
          // Individual property
          const property = cluster.properties.propertyData;
          let markerEl: HTMLElement;
          let anchorPos: mapboxgl.Anchor = "center";

          if (zoom >= 10) {
            markerEl = createPriceMarker(property, () => {});
          } else {
            markerEl = document.createElement("div");
            markerEl.className = "cursor-pointer";
            markerEl.style.width = "30px";
            markerEl.style.height = "30px";

            markerEl.innerHTML = `
              <div class="flex items-center justify-center bg-primary text-white font-bold text-sm rounded-full shadow-lg border-2 border-white w-full h-full transition-transform hover:scale-110">
                1
              </div>
            `;

            markerEl.addEventListener("click", (e) => {
              e.stopPropagation();
              map.flyTo({
                center: [property.longitude, property.latitude],
                zoom: 12,
                essential: true,
              });
            });
          }

          const marker = new mapboxgl.Marker(markerEl).setLngLat([
            property.longitude,
            property.latitude,
          ]);

          if (zoom >= 10) {
            const imageSrc = property?.image || Images.apartment;
            const price = property?.price
              ? `$${Number(property.price).toLocaleString()}`
              : "Price upon request";
            const title = property?.title || "Property";
            const address = property?.address || "Address not available";

            const popup = new mapboxgl.Popup({
              offset: 25,
              closeButton: false,
              closeOnClick: true,
            }).setHTML(
              `<div style="cursor: pointer; text-decoration: none; color: inherit; display: block; width: 220px; font-family: 'Inter', sans-serif;">
                <div style="overflow: hidden;">
                  <div style="width: 100%; height: 130px; overflow: hidden; border-radius: 8px; background-color: #f1f5f9; position: relative;">
                    <div style="position: absolute; inset: 0; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
                    <img src="${imageSrc}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 10;" onload="this.previousElementSibling.style.display='none'" />
                  </div>
                  <div style="padding: 12px 2px 4px 2px; display: flex; flex-direction: column; gap: 4px;">
                    <h3 style="margin: 0; color: #305487; font-size: 18px; font-weight: 700;">${price}</h3>
                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${title}</p>
                    <p style="margin: 0; font-size: 12px; color: #6e6e6e; line-height: 1.4; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${address}</p>
                  </div>
                </div>
              </div>`,
            );

            popup.on("open", () => {
              const el = popup.getElement();
              if (el) {
                el.style.cursor = "pointer";
                el.addEventListener("click", () => {
                  window.location.href = `/property-info/${property?.id || ""}`;
                });
              }
            });

            marker.setPopup(popup);
          }

          marker.addTo(map);
          markersRef.current.push(marker);
        }
      });

      // Update Sidebar visibility state
      let visible = properties.filter(
        (p: any) =>
          bounds.contains([p.longitude, p.latitude]) && Number(p.price) > 0,
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

    map.on("moveend", updateMapMarkersAndVisible);
    map.on("zoomend", updateMapMarkersAndVisible);
    updateMapMarkersAndVisible();

    return () => {
      map.off("moveend", updateMapMarkersAndVisible);
      map.off("zoomend", updateMapMarkersAndVisible);
    };
  }, [mapLoaded, properties, sortBy]);

  return (
    <>
      <div className="w-full h-screen flex flex-col bg-white overflow-hidden mt-20">
        {/* 1. TOP FILTER BAR */}
        <MapTopFilterBar
          status={status}
          setStatus={setStatus}
          price={price as [number, number]}
          setPrice={setPrice}
          sqft={sqft as [number, number]}
          setSqft={setSqft}
          activeBedRoom={activeBedRoom}
          setActiveBedRoom={setActiveBedRoom}
          activeBathRoom={activeBathRoom}
          setActiveBathRoom={setActiveBathRoom}
          activeProperty={activeProperty}
          setActiveProperty={setActiveProperty}
          location={location}
          setLocation={setLocation}
          pillBase={pillBase}
          pillActive={pillActive}
          pillInactive={pillInactive}
        />

        {/* ACTIVE FILTER PILLS ROW */}
        <MapActiveFilters
          hasActiveFilters={hasActiveFilters}
          activeFilterPills={activeFilterPills}
          resetAllFilters={resetAllFilters}
        />

        {/* MAIN CONTENT */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
          {/* 2. SIDEBAR - LEFT (Mobile: Full width, Desktop: 110 width) */}
          <MapSidebar
            isLoading={isLoading}
            visibleProperties={visibleProperties}
            properties={properties}
            isLoggedIn={isLoggedIn}
            status={status}
          />

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
