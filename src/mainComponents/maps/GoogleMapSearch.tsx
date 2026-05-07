"use client";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import Supercluster from "supercluster";
import {
  useGetListings,
  useGetMapZoomListings,
  useGetMe,
} from "@/src/hooks/listing/useListingQueries";
import { Images } from "@/src/app/exports";
import { useListingStore } from "@/src/store/useListingStore";
import { FiPlus, FiMinus, FiMap, FiNavigation, FiLoader } from "react-icons/fi";
import { getOfficeName } from "@/src/utilities/utilities";
import GetInTouch from "../getInTouch/GetInTouch";
import MapTopFilterBar from "./MapTopFilterBar";
import MapActiveFilters from "./MapActiveFilters";
import MapSidebar from "./MapSidebar";
import { formatPriceAbbreviated } from "./mapUtils";
import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";
import "./map.css";
import { MapOptions } from "mapbox-gl";
import { useRouter } from "next/navigation";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 49.2827,
  lng: -123.1207, // Vancouver
};
const options = {
  hash: false,
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  minZoom: 6,
  maxZoom: 20,
  gestureHandling: "greedy",
};

export default function GoogleMapSearch() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [visibleProperties, setVisibleProperties] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const superclusterRef = useRef<Supercluster | null>(null);
  const { data: me } = useGetMe();
  const idleTimeout = useRef<any>(null);
  const hasInitialized = useRef(false);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(
    null,
  );
  const [selectedClusterProperties, setSelectedClusterProperties] = useState<
    any[]
  >([]);
  const [clusterPosition, setClusterPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const lastFetchedBounds = useRef<string>("");

  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
    zoom: number;
  } | null>(null);
  const [mapZoomVal, setMapZoomVal] = useState<number | null>(null);
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
    minLotSizeArea,
    maxLotSizeArea,
    minTax,
    maxTax,
    structureType,
    features,
    whenListed,
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
    minLotSizeArea,
    maxLotSizeArea,
    minTax,
    maxTax,
    whenListed,
    structureType,
    features,
    activeBedRoom,
    activeBathRoom,
  ]);

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

  const resetAllFilters = () => {
    clearInstanceFilters("map");
    setSortBy("newest");
  };

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
  if (minLotSizeArea !== undefined && minLotSizeArea > 100) {
    activeFilterPills.push({
      label: `Min Lot Area: ${minLotSizeArea} sqft`,
      onRemove: () => updateInstanceFilter("map", "minLotSizeArea", 0),
    });
  }
  if (maxLotSizeArea !== undefined && maxLotSizeArea < 100000) {
    activeFilterPills.push({
      label: `Max Lot Area: ${maxLotSizeArea} sqft`,
      onRemove: () => updateInstanceFilter("map", "maxLotSizeArea", 100000),
    });
  }
  if (minTax !== undefined && minTax > 0) {
    activeFilterPills.push({
      label: `Min Tax: $${minTax}`,
      onRemove: () => updateInstanceFilter("map", "minTax", 0),
    });
  }
  if (maxTax !== undefined && maxTax < 50000) {
    activeFilterPills.push({
      label: `Max Tax: $${maxTax}`,
      onRemove: () => updateInstanceFilter("map", "maxTax", 50000),
    });
  }
  if (whenListed && whenListed !== "any") {
    activeFilterPills.push({
      label: `Listed: ${whenListed}`,
      onRemove: () => updateInstanceFilter("map", "whenListed", "any"),
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
      label: `Property: ${activeProperty
        .split(",")
        .map((t: string) => t.replace(/([A-Z])/g, " $1").trim())
        .join(", ")}`,
      onRemove: () => {
        updateInstanceFilter("map", "activeProperty", "any");
      },
    });
  }
  if (features && features !== "") {
    activeFilterPills.push({
      label: `Feature: ${features
        .split(",")
        .map((feat: string) => feat.replace(/([A-Z])/g, " $1").trim())
        .join(", ")}`,
      onRemove: () => {
        updateInstanceFilter("map", "features", "");
      },
    });
  }
  if (structureType && structureType !== "") {
    activeFilterPills.push({
      label: `Type: ${structureType.split(",").join(", ")}`,
      onRemove: () => {
        updateInstanceFilter("map", "structureType", "");
      },
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

  const mapZoomParams = useMemo(() => {
    const p: any = {};
    if (search) p.search = search;
    if (location && location !== "" && location !== "British Columbia")
      p.location = location;
    if (minPrice !== undefined && minPrice > 1000) p.minPrice = minPrice;
    if (maxPrice !== undefined && maxPrice < 20000000) p.maxPrice = maxPrice;
    if (minSqft !== undefined && minSqft > 100) p.minSqft = minSqft;
    if (maxSqft !== undefined && maxSqft < 15000) p.maxSqft = maxSqft;
    if (minLotSizeArea !== undefined && minLotSizeArea > 100)
      p["filters[lot_size_area][$gte]"] = minLotSizeArea;
    if (maxLotSizeArea !== undefined && maxLotSizeArea < 100000)
      p["filters[lot_size_area][$lte]"] = maxLotSizeArea;
    if (minTax !== undefined && minTax > 0) p["filters[tax][$gte]"] = minTax;
    if (maxTax !== undefined && maxTax < 50000)
      p["filters[tax][$lte]"] = maxTax;
    if (whenListed && whenListed !== "any") p.whenListed = whenListed;
    if (activeBedRoom && activeBedRoom !== "any")
      p.beds = activeBedRoom.replace("+", "");
    if (activeBathRoom && activeBathRoom !== "any")
      p.baths = activeBathRoom.replace("+", "");
    if (activeProperty && activeProperty !== "any") {
      if (activeProperty.includes(",")) {
        activeProperty.split(",").forEach((type: string, index: number) => {
          p[`filters[type][$in][${index}]`] = type;
        });
      } else {
        p.type = activeProperty;
      }
    }
    if (features && features !== "") p.features = features;
    if (structureType && structureType !== "") p.structureType = structureType;
    if (status && status !== "forSale" && status !== "any")
      p.propertyType = status;
    if (mapBounds) {
      p.north = mapBounds.north;
      p.south = mapBounds.south;
      p.east = mapBounds.east;
      p.west = mapBounds.west;
      if (mapZoomVal !== null) p.zoom = mapZoomVal;
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
    minLotSizeArea,
    maxLotSizeArea,
    minTax,
    maxTax,
    whenListed,
    features,
    structureType,
    activeBedRoom,
    activeBathRoom,
    activeProperty,
    status,
  ]);

  const params: any = { "pagination[page]": 1, "pagination[pageSize]": 500 };
  if (status && status !== "any") params.propertyType = status;
  if (location && location !== "" && location !== "British Columbia")
    params.location = location;
  if (minPrice !== undefined && minPrice > 1000) params.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice < 20000000) params.maxPrice = maxPrice;
  if (minSqft !== undefined && minSqft > 100) params.minSqft = minSqft;
  if (maxSqft !== undefined && maxSqft < 15000) params.maxSqft = maxSqft;
  if (minLotSizeArea !== undefined && minLotSizeArea > 100)
    params["filters[lot_size_area][$gte]"] = minLotSizeArea;
  if (maxLotSizeArea !== undefined && maxLotSizeArea < 100000)
    params["filters[lot_size_area][$lte]"] = maxLotSizeArea;
  if (minTax !== undefined && minTax > 0) params["filters[tax][$gte]"] = minTax;
  if (maxTax !== undefined && maxTax < 50000)
    params["filters[tax][$lte]"] = maxTax;
  if (whenListed && whenListed !== "any") params.whenListed = whenListed;
  if (activeProperty && activeProperty !== "any") {
    if (activeProperty.includes(",")) {
      activeProperty.split(",").forEach((type: string, index: number) => {
        params[`filters[type][$in][${index}]`] = type;
      });
    } else {
      params.type = activeProperty;
    }
  }
  if (features && features !== "") params.features = features;
  if (structureType && structureType !== "") params.structureType = structureType;
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
    select: (res: any) =>
      (res?.data || [])
        .map((listing: any) => ({
          id: listing.documentId || Math.random().toString(),
          image:
            typeof listing?.media?.[0] === "string"
              ? listing.media[0]
              : listing?.media?.[0]?.MediaURL,
          title: listing?.property_sub_type || "Property",
          price: listing?.price || 0,
          daysAgo:
            listing?.ModificationTimestamp ??
            listing?.raw_data?.BridgeModificationTimestamp ??
            0,
          address: listing?.address
            ? `${listing?.address}, ${listing?.city || ""}`
            : listing?.city || "",
          sqft: listing?.area ?? listing?.lot_size_area ?? 0,
          beds: listing?.bedrooms ?? 0,
          baths: listing?.bathrooms ?? 0,
          longitude: listing?.longitude,
          latitude: listing?.latitude,
          mls: listing?.mls_number,
          realtor: getOfficeName(listing),
          isLogin: false,
          likesCount: listing?.likesCount,
          isFavourite: listing?.users?.some(
            (user: any) => user.documentId === me?.documentId,
          ),
          isDdf: false,
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
        }))
        .filter(
          (l: any) =>
            !isNaN(l.longitude) &&
            !isNaN(l.latitude) &&
            l.longitude !== 0 &&
            Number(l.price) > 0,
        ),
    enabled: !isForSale && !!mapBounds,
  });

  const {
    data: queryDataActive,
    isLoading: isLoadingActive,
    isFetching: isFetchingActive,
  } = useGetMapZoomListings(mapZoomParams, {
    select: (res: any) =>
      (res?.data || [])
        .map((listing: any) => ({
          id: listing.documentId,
          image:
            typeof listing?.media_url === "string"
              ? listing.media_url
              : Array.isArray(listing?.media_url)
                ? listing.media_url[0]
                : listing?.media?.[0]?.MediaURL,
          title: listing?.property_sub_type || "Property",
          price: Number(listing?.price) || 0,
          daysAgo:
            listing?.ModificationTimestamp ??
            listing?.raw_data?.BridgeModificationTimestamp ??
            0,
          address: listing?.address || `${listing?.city || ""}`,
          sqft: listing?.area ?? listing?.Living_area ?? 0,
          beds: listing?.bedrooms ?? 0,
          baths: listing?.bathrooms ?? 0,
          longitude: Number(listing?.longitude),
          latitude: Number(listing?.latitude),
          mls: listing?.mls_number ?? listing?.listing_id,
          realtor: listing?.office_name ?? getOfficeName(listing),
          isFavourite: listing?.users?.some(
            (user: any) => user.documentId === me?.documentId,
          ),
          likesCount: listing?.likesCount,
          isDdf: true,
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
        }))
        .filter(
          (l: any) =>
            !isNaN(l.longitude) &&
            !isNaN(l.latitude) &&
            l.longitude !== 0 &&
            Number(l.price) > 0,
        ),
    enabled: isForSale && !!mapBounds, // 🔥 KEY FIX
    staleTime: 1000 * 60 * 5,
  });

  const queryData = isForSale ? queryDataActive : queryDataNormal;
  const isFetching = isForSale ? isFetchingActive : isFetchingNormal;
  const isLoadingData = isForSale ? isLoadingActive : isLoadingNormal;

  const isLoading = isLoadingData || isFetching;

  const properties = useMemo(() => queryData || [], [queryData]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMapLoaded(true);
  }, []);

  const triggerSearch = useCallback(() => {
    if (selectedClusterProperties.length > 0 || selectedProperty) return; // 🚫 block if any popup open
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) return;

    const zoom = map.getZoom() || 8;
    if (zoom < 8) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const newBounds = {
      north: ne.lat(),
      south: sw.lat(),
      east: ne.lng(),
      west: sw.lng(),
      zoom,
    };

    const boundsKey = JSON.stringify(newBounds);
    if (lastFetchedBounds.current === boundsKey) return;

    setMapBounds(newBounds);
    setMapZoomVal(Math.round(zoom));
    lastFetchedBounds.current = boundsKey;
    setShowSearchButton(false);
  }, [map, selectedClusterProperties]);

  const onMapIdle = useCallback(() => {
    // 🚫 Do nothing if popup open
    if (selectedClusterProperties.length > 0 || selectedProperty) return;

    setIsMoving(false);
    if (!map) return;
    const zoom = map.getZoom() || 14;

    // 🚫 STOP API CALL if zoom is too low
    if (zoom < 8) {
      return;
    }

    // ⛔ Skip first unwanted trigger (important)
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const bounds = map.getBounds();
      if (bounds) {
        triggerSearch();
      }
      return;
    }

    if (idleTimeout.current) {
      clearTimeout(idleTimeout.current);
    }

    idleTimeout.current = setTimeout(() => {
      // Instead of auto-fetching, we can check if we want auto-fetch or manual
      // For now, let's keep auto-fetch but with a longer debounce and show button if it's a significant move
      triggerSearch();
    }, 400); // ⏱ debounce increased to 400ms
  }, [map, triggerSearch, selectedClusterProperties]);

  const toggleMapStyle = () => {
    if (!map) return;
    if (isSatellite) {
      map.setMapTypeId("roadmap");
      setIsSatellite(false);
    } else {
      map.setMapTypeId("satellite");
      setIsSatellite(true);
    }
  };

  const stableClusterPosition = useMemo(
    () => clusterPosition,
    [clusterPosition?.lat, clusterPosition?.lng],
  );

  const router = useRouter();

  useEffect(() => {
    if (!mapLoaded || !map) return;

    if (!location || location === "British Columbia") {
      // 🗺️ Smoothly fly out to a broad overview of the region
      const bcBounds = new google.maps.LatLngBounds();
      bcBounds.extend({ lat: 48.0, lng: -125.5 });
      bcBounds.extend({ lat: 50.5, lng: -121.0 });
      map.fitBounds(bcBounds);
      return;
    }

    const cityCoords: { [key: string]: { lat: number; lng: number } } = {
      Vancouver: { lat: 49.2827, lng: -123.1207 },
      Burnaby: { lat: 49.2488, lng: -122.9805 },
      Surrey: { lat: 49.1913, lng: -122.849 },
      Richmond: { lat: 49.1666, lng: -123.1336 },
      Coquitlam: { lat: 49.2838, lng: -122.7722 },
      Victoria: { lat: 48.4284, lng: -123.3656 },
      Kelowna: { lat: 49.888, lng: -119.496 },
      Abbotsford: { lat: 49.0504, lng: -122.3275 },
      "White Rock": { lat: 49.025, lng: -122.8028 },
      Nanaimo: { lat: 49.1659, lng: -123.9401 },
      "New Westminster": { lat: 49.2057, lng: -122.911 },
      "North Vancouver": { lat: 49.32, lng: -123.0724 },
      "West Vancouver": { lat: 49.3667, lng: -123.1667 },
      Langley: { lat: 49.1042, lng: -122.6578 },
      Delta: { lat: 49.0847, lng: -123.0583 },
      "Maple Ridge": { lat: 49.2194, lng: -122.6011 },
      Chilliwack: { lat: 49.1573, lng: -121.9515 },
    };

    // Support multi-select by taking the first city
    const firstCity = location.split(",")[0].trim();
    const coords = cityCoords[firstCity];

    if (coords) {
      // 🚀 Using fitBounds provides a smooth, coordinated pan + zoom animation (the 'Fly To' effect)
      const bounds = new google.maps.LatLngBounds();
      const offset = 0.05; // Balanced city-level view
      bounds.extend({ lat: coords.lat - offset, lng: coords.lng - offset });
      bounds.extend({ lat: coords.lat + offset, lng: coords.lng + offset });
      map.fitBounds(bounds);
    } else if (properties?.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      properties.slice(0, 5).forEach((p: any) => {
        if (p.latitude && p.longitude) {
          bounds.extend({ lat: p.latitude, lng: p.longitude });
        }
      });
      map.fitBounds(bounds);
    }
  }, [location, mapLoaded, map]);

  const handleGeolocation = () => {
    if (!map) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.panTo({ lat: latitude, lng: longitude });
        map.setZoom(17);
      },
      (err) => alert("Please enable location services to use this feature."),
    );
  };

  useEffect(() => {
    if (!mapLoaded || !map || properties?.length === 0 || fitBoundsDone) return;
    const bounds = new google.maps.LatLngBounds();
    let hasValidPoints = false;
    properties.forEach((p: any) => {
      if (p.longitude && p.latitude) {
        bounds.extend({ lat: p.latitude, lng: p.longitude });
        hasValidPoints = true;
      }
    });
    if (hasValidPoints) {
      map.fitBounds(bounds);
      setFitBoundsDone(true);
    }
  }, [properties, mapLoaded, map, fitBoundsDone]);

  // Supercluster logic for Google Maps
  useEffect(() => {
    // 🚫 STOP recalculation if cluster popup is open
    if (selectedClusterProperties.length > 0) return;

    if (!properties || properties.length === 0) {
      setClusters((prev) => (prev.length === 0 ? prev : []));
      setVisibleProperties((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    const points = properties.map((p: any) => ({
      type: "Feature",
      properties: { cluster: false, propertyId: p.id, propertyData: p },
      geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
    }));

    superclusterRef.current = new Supercluster({ radius: 60, maxZoom: 20 });
    superclusterRef.current.load(points as any);

    if (map) {
      const zoom = map.getZoom() || 14;
      const bounds = map.getBounds();
      if (bounds) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const bbox: [number, number, number, number] = [
          sw.lng(),
          sw.lat(),
          ne.lng(),
          ne.lat(),
        ];
        const clustersData = superclusterRef.current.getClusters(
          bbox,
          Math.floor(zoom),
        );

        setClusters((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(clustersData))
            return prev;
          return clustersData;
        });

        let visible = properties.filter((p: any) =>
          bounds.contains({ lat: p.latitude, lng: p.longitude }),
        );
        if (sortBy === "priceLow")
          visible.sort((a: any, b: any) => a.price - b.price);
        else if (sortBy === "priceHigh")
          visible.sort((a: any, b: any) => b.price - a.price);
        else if (sortBy === "newest")
          visible.sort((a: any, b: any) => b.daysAgo - a.daysAgo);

        setVisibleProperties((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(visible)) return prev;
          return visible;
        });
      }
    }
  }, [properties, map, mapZoomVal, sortBy, selectedClusterProperties]);

  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSelectedProperty(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isLoaded)
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-3">
        <FiLoader className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-sm font-medium">
          Fetching properties...
        </p>
      </div>
    );

  return (
    <>
      <div className="w-full h-[90svh] flex flex-col overflow-hidden mt-20">
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

        <MapActiveFilters
          hasActiveFilters={hasActiveFilters}
          activeFilterPills={activeFilterPills}
          resetAllFilters={resetAllFilters}
        />

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
          <MapSidebar
            isLoading={isLoading}
            visibleProperties={visibleProperties}
            properties={properties}
            isLoggedIn={isLoggedIn}
            status={status}
            setHoveredPropertyId={setHoveredPropertyId}
          />

          <div className="hidden md:block flex-1 relative z-10">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={14}
              center={center}
              onLoad={onMapLoad}
              onIdle={onMapIdle}
              onDragStart={() => {
                setIsMoving(true);
                setShowSearchButton(true);
              }}
              onZoomChanged={() => {
                setIsMoving(true);
                setShowSearchButton(true);
              }}
              options={options}
              onClick={() => {
                setSelectedClusterProperties([]);
                setClusterPosition(null);
              }}
            >
              {/* Search This Area Button */}
              {showSearchButton && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerSearch();
                    }}
                    className="flex items-center gap-2 bg-white text-primary px-6 py-2.5 rounded-full shadow-2xl border border-primary/20 font-bold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FiLoader className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiNavigation className="w-4 h-4" />
                    )}
                    {isLoading ? "Searching..." : "Search This Area"}
                  </button>
                </div>
              )}
              {clusters.map((cluster, index) => {
                const [longitude, latitude] = cluster.geometry.coordinates;
                const { cluster: isCluster, point_count: pointCount } =
                  cluster.properties;

                if (isCluster) {
                  const size =
                    pointCount < 10 ? 30 : pointCount < 100 ? 40 : 50;
                  return (
                    <OverlayView
                      key={`cluster-${cluster.id || index}`}
                      position={{ lat: latitude, lng: longitude }}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedClusterProperties.length > 0) return;

                          const currentZoom = map?.getZoom() || 0;

                          // ❗ Close single property popup
                          setSelectedProperty(null);

                          // 🔥 If max zoom → show cluster properties in InfoWindow
                          if (currentZoom >= 20) {
                            const leaves =
                              superclusterRef.current?.getLeaves(
                                cluster.id,
                                50, // limit for performance
                              ) || [];

                            const properties = leaves.map(
                              (leaf: any) => leaf.properties.propertyData,
                            );

                            setSelectedClusterProperties(properties);
                            setClusterPosition({
                              lat: latitude,
                              lng: longitude,
                            });

                            return;
                          }

                          // 👉 Normal zoom behavior
                          const expansionZoom =
                            superclusterRef.current?.getClusterExpansionZoom(
                              cluster.id as number,
                            ) || 10;

                          map?.setZoom(expansionZoom);
                          map?.panTo({ lat: latitude, lng: longitude });
                        }}
                        className="cursor-pointer"
                        style={{
                          width: size,
                          height: size,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div className="flex items-center justify-center bg-primary text-white font-bold text-sm rounded-full shadow-lg border-2 border-white w-full h-full transition-transform hover:scale-110">
                          {pointCount}
                        </div>
                      </div>
                    </OverlayView>
                  );
                }

                const property = cluster.properties.propertyData;
                const zoom = map?.getZoom() || 8;

                const isHovered = hoveredPropertyId === property.id;
                const statusColor =
                  status === "sold"
                    ? "#ef4444"
                    : status === "expired"
                      ? "#3b82f6"
                      : "#22c55e"; // Green for Active

                if (zoom >= 14) {
                  return (
                    <OverlayView
                      key={`property-${property.id}`}
                      position={{
                        lat: property.latitude,
                        lng: property.longitude,
                      }}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClusterProperties([]);
                          setClusterPosition(null);
                          setSelectedProperty(property);
                        }}
                        onMouseEnter={() => setHoveredPropertyId(property.id)}
                        onMouseLeave={() => setHoveredPropertyId(null)}
                        className={`group w-fit relative -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${isHovered ? "scale-110 z-30" : "z-20"}`}
                      >
                        <div
                          style={{
                            borderColor: isHovered
                              ? statusColor
                              : "transparent",
                          }}
                          className={`bg-white px-3 py-1.5 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.15)] font-bold text-sm whitespace-nowrap border-2 transition-all duration-200 text-gray-800 `}
                        >
                          <div
                            style={{
                              backgroundColor: isHovered
                                ? statusColor
                                : "white",
                            }}
                            className="absolute inset-0 rounded-lg -z-10"
                          ></div>
                          <span style={{ color: statusColor }}>
                            {formatPriceAbbreviated(property.price)}
                          </span>
                        </div>
                        <div
                          style={{
                            backgroundColor: isHovered ? statusColor : "white",
                            borderColor: isHovered
                              ? statusColor
                              : "transparent",
                          }}
                          className="-z-10 absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 border-r border-b transition-all duration-200 shadow-[2px_2px_2px_rgba(0,0,0,0.05)]"
                        ></div>
                      </div>
                    </OverlayView>
                  );
                }

                return (
                  <OverlayView
                    key={`marker-${property.id}`}
                    position={{
                      lat: property.latitude,
                      lng: property.longitude,
                    }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        map?.setZoom(15);
                        map?.panTo({
                          lat: property.latitude,
                          lng: property.longitude,
                        });
                      }}
                      onMouseEnter={() => setHoveredPropertyId(property.id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                      className={`group -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${isHovered ? "scale-150 z-30" : "z-20"}`}
                    >
                      <div
                        style={{
                          backgroundColor: statusColor,
                          boxShadow: isHovered
                            ? `0 0 10px ${statusColor}`
                            : "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                        className="flex items-center justify-center w-3.5 h-3.5 rounded-full border-2 border-white transition-all"
                      ></div>
                    </div>
                  </OverlayView>
                );
              })}

              {selectedProperty && (
                <InfoWindow
                  position={{
                    lat: selectedProperty.latitude,
                    lng: selectedProperty.longitude,
                  }}
                  onCloseClick={() => setSelectedProperty(null)}
                >
                  <div
                    ref={popupRef}
                    style={{
                      width: 260,
                      background: "white",
                      borderRadius: 6,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                      fontFamily: "Plus Jakarta Display",
                      cursor: "pointer",
                      padding: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/property-info/${selectedProperty.id}`;
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          width: "100%",
                          height: 130,
                          overflow: "hidden",
                          borderRadius: 3,
                          backgroundColor: "#f1f5f9",
                        }}
                      >
                        <img
                          src={selectedProperty.image || Images.apartment}
                          alt={selectedProperty.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          padding: "12px 2px 4px 2px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            color: "#305487",
                            fontSize: 18,
                            fontWeight: 700,
                          }}
                        >
                          ${Number(selectedProperty.price).toLocaleString()}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#333",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {selectedProperty.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#333",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {selectedProperty.title}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12,
                            color: "#6e6e6e",
                            lineHeight: 1.4,
                            fontWeight: 500,
                          }}
                        >
                          {selectedProperty.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )}

              {selectedClusterProperties.length > 0 &&
                stableClusterPosition && (
                  <InfoWindow
                    position={stableClusterPosition}
                    onCloseClick={() => {
                      setSelectedClusterProperties([]);
                    }}
                  >
                    <div
                      style={{
                        width: 300,
                        maxHeight: 320,
                        overflowY: "auto",
                        padding: 10,
                        fontFamily: "Plus Jakarta Display",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          marginBottom: 10,
                        }}
                      >
                        Properties ({selectedClusterProperties.length})
                      </h3>

                      {selectedClusterProperties.map((p) => (
                        <div
                          key={p.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/property-info/${p.id}`;
                          }}
                          style={{
                            display: "flex",
                            gap: 10,
                            marginBottom: 12,
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                            paddingBottom: 10,
                          }}
                        >
                          <img
                            src={p.image || Images.apartment}
                            alt=""
                            style={{
                              width: 70,
                              height: 55,
                              objectFit: "cover",
                              borderRadius: 6,
                              background: "#f1f5f9",
                            }}
                          />

                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: 13,
                                color: "#305487",
                              }}
                            >
                              ${Number(p.price).toLocaleString()}
                            </div>

                            <div
                              style={{
                                fontSize: 12,
                                color: "#444",
                                fontWeight: 600,
                                marginTop: 2,
                              }}
                            >
                              {p.title}
                            </div>

                            <div
                              style={{
                                fontSize: 11,
                                color: "#777",
                                marginTop: 2,
                              }}
                            >
                              {p.address}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* 👉 Optional CTA */}
                      <button
                        onClick={() => {
                          setVisibleProperties(selectedClusterProperties);
                          setSelectedClusterProperties([]);
                          router.push("/properties");
                        }}
                        style={{
                          width: "100%",
                          marginTop: 8,
                          padding: "8px",
                          background: "#305487",
                          color: "white",
                          borderRadius: 6,
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        View All
                      </button>
                    </div>
                  </InfoWindow>
                )}
            </GoogleMap>

            {isLoading && (
              <div className="absolute top-4 left-4  z-20 pointer-events-none flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 border border-gray-100 animate-in fade-in zoom-in duration-300">
                  <FiLoader className="animate-spin text-primary w-4 h-4" />
                  <span className="text-xs font-bold text-gray-700 tracking-tight">
                    Loading...
                  </span>
                </div>
              </div>
            )}

            <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
              <div className="flex flex-col bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                <button
                  className="p-2.5 border-b hover:bg-gray-50"
                  onClick={() => map?.setZoom((map.getZoom() || 5) + 1)}
                >
                  <FiPlus className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2.5 hover:bg-gray-50"
                  onClick={() => map?.setZoom((map.getZoom() || 5) - 1)}
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
            </div>
          </div>
        </div>
      </div>
      <GetInTouch />
    </>
  );
}
