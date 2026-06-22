"use client";

import "leaflet/dist/leaflet.css";
import "./openstreet-map.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import Supercluster from "supercluster";
import {
  useGetListings,
  useGetMapZoomAssignmentList,
  useGetMapZoomListings,
  useGetMapZoomSchools,
  useGetMapZoomSoldList,
  useGetMe,
} from "@/src/hooks/listing/useListingQueries";
import { useListingStore } from "@/src/store/useListingStore";
import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";

import {
  cityCoords,
  osmDefaultCenter,
  osmRoadmapTile,
  osmSatelliteTile,
} from "./osmMapConfig";
import OpenStreetMapControls from "./OpenStreetMapControls";
import OpenStreetMapMarkerLayer from "./OpenStreetMapMarkerLayer";
import {
  OpenStreetClusterPopup,
  OpenStreetPropertyPopup,
} from "./OpenStreetMapInfoWindows";
import {
  boundsKey,
  formatMeter,
  getBoundsPayload,
  getClusterRadius,
  getDistanceBetweenPoints,
  getMiddlePoint,
  type LatLngPoint,
} from "./osmUtils";
import { MapBounds } from "../maps/google_map/mapTypes";
import {
  buildActiveFilterPills,
  buildListingParams,
  buildMapZoomParams,
} from "../maps/google_map/mapFilterUtils";
import {
  getGeoKey,
  hasValidCoordinates,
  normalizeAddress,
  transformActiveListing,
  transformNormalListing,
} from "../maps/google_map/mapPropertyUtils";
import MapLoading from "../maps/google_map/MapLoading";
import MapTopFilterBar from "../maps/MapTopFilterBar";
import MapActiveFilters from "../maps/MapActiveFilters";
import MapSidebar from "../maps/MapSidebar";
import MapLoadingBadge from "../maps/google_map/MapLoadingBadge";
import GetInTouch from "../getInTouch/GetInTouch";
import OSMGeoJsonLayer from "./OSMGeoJsonLayer";
import OpenStreetMapSoldMakerLayer from "./OpenStreetMapSoldMakerLayer";
import { Endpoints } from "@/src/api/endpoints";
import {
  MdApartment,
  MdEmojiEvents,
  MdLocationOn,
  MdMap,
  MdSchool,
  MdStar,
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import OpenStreetMapAssignmentGeoLayer from "./OpenStreetMapAssignmentGeoLayer";

type SchoolType = "Elementary" | "Secondary" | "All";

type SchoolItem = {
  id: string;
  school_name: string;
  school_type: SchoolType;
  city?: string;
  rating?: number | string;
  rank?: number;
  address?: string;
  latitude: number;
  longitude: number;
};

function MapReady({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
}

function MapEvents({
  measureMode,
  selectedProperty,
  selectedClusterProperties,
  triggerSearch,
  clearPopups,
  handleMeasureClick,
  handleMeasureMove,
}: {
  measureMode: boolean;
  selectedProperty: any;
  selectedClusterProperties: any[];
  triggerSearch: () => void;
  clearPopups: () => void;
  handleMeasureClick: (point: LatLngPoint) => void;
  handleMeasureMove: (point: LatLngPoint) => void;
}) {
  const timeoutRef = useRef<any>(null);

  useMapEvents({
    moveend() {
      if (selectedClusterProperties.length > 0 || selectedProperty) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(triggerSearch, 400);
    },
    zoomend() {
      if (selectedClusterProperties.length > 0 || selectedProperty) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(triggerSearch, 400);
    },
    dragstart() {
      clearPopups();
    },
    click(e) {
      if (measureMode) {
        handleMeasureClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
      clearPopups();
    },
    mousemove(e) {
      if (!measureMode) return;
      handleMeasureMove({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return null;
}

function SchoolMarker({ school }: { school: SchoolItem }) {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: "bc-osm-marker",
        html: `<div class="bc-osm-school"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="22" width="22" xmlns="http://www.w3.org/2000/svg"><path d="M256 32 20 160l236 128 192-104v104h44V160L256 32zM108 247.3V336c0 48.6 66.3 88 148 88s148-39.4 148-88v-88.7L256 328 108 247.3z"></path></svg></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    [],
  );
  // if (!school.city) return null;
  return (
    <Marker position={[school.latitude, school.longitude]} icon={icon}>
      <Popup className="school-popup w-[350px]">
        <div className="w-[350px] overflow-hidden rounded-2xl bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
              <MdSchool className="h-6 w-6 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold leading-snug text-[#15376b]">
                {school.school_name || "-"}
              </h3>

              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
                <MdApartment className="h-3.5 w-3.5" />
                {school.school_type || "-"}
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-dashed border-gray-200" />

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-50">
                <MdStar className="h-5 w-5 text-yellow-500" />
              </div>
              <span className="font-medium text-gray-600">Rating</span>
              <span className="ml-auto font-bold text-primary">
                {school.rating || "-"} / 10
              </span>
            </div>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50">
                <MdEmojiEvents className="h-5 w-5 text-purple-600" />
              </div>
              <span className="font-medium text-gray-600">Rank</span>
              <span className="ml-auto font-bold text-purple-600">
                {school.rank || "-"}
              </span>
            </div>

            <div className="flex items-start gap-3 border-b border-gray-100 pb-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <MdMap className="h-5 w-5 text-blue-500" />
              </div>
              <span className="font-medium text-gray-600">Address</span>
              <span className="ml-auto max-w-[150px] text-right font-semibold leading-snug text-gray-800">
                {school.address || "-"}
              </span>
            </div>
            <span className="text-right text-[10px] font-medium text-gray-400">
              Data Source: Fraser Institute
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function OpenStreetMapSearch() {
  const { data: me } = useGetMe();
  const { isLoggedIn, setOpenLogin } = useAuthContext();
  const { getInstanceFilters, updateInstanceFilter, clearInstanceFilters } =
    useListingStore();

  const filters = getInstanceFilters("map");
  const {
    search = "",
    location = "",
    status = "forSale",
    minPrice,
    maxPrice,
    minSqft,
    maxSqft,
    activeBedRoom,
    activeBathRoom,
  } = filters;

  const [map, setMap] = useState<L.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [visibleProperties, setVisibleProperties] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
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
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [mapZoomVal, setMapZoomVal] = useState<number | null>(null);
  const [fitBoundsDone, setFitBoundsDone] = useState(false);
  const [parcelGeoJSON, setParcelGeoJSON] = useState<any>(null);
  const [geocodedCache, setGeocodedCache] = useState<Record<string, any>>({});
  const [schoolMode, setSchoolMode] = useState(false);
  const [schoolType, setSchoolType] = useState<SchoolType>("All");
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<LatLngPoint[]>([]);
  const [distance, setDistance] = useState<{
    segment: number;
    total: number;
  } | null>(null);
  const [movingPoint, setMovingPoint] = useState<LatLngPoint | null>(null);
  const [userLocation, setUserLocation] = useState<LatLngPoint | null>(null);
  const [locationChecked, setLocationChecked] = useState(false);
  const floodLayerRef = useRef<L.GeoJSON | null>(null);
  const [showFloodProvince, setShowFloodProvince] = useState(false);
  const [loadingFloodProvince, setLoadingFloodProvince] = useState(false);
  const [selectedAssessmentProperty, setSelectedAssessmentProperty] =
    useState<any>(null);

  const [assessmentDrawerOpen, setAssessmentDrawerOpen] = useState(false);

  const superclusterRef = useRef<Supercluster | null>(null);
  const lastFetchedBounds = useRef<string>("");
  const popupRef = useRef<HTMLDivElement | null>(null);
  const lastLocationRef = useRef<string | null>(null);

  const setSearch = (val: string) => updateInstanceFilter("map", "search", val);
  const setActiveBedRoom = (val: string) =>
    updateInstanceFilter("map", "activeBedRoom", val);
  const setActiveBathRoom = (val: string) =>
    updateInstanceFilter("map", "activeBathRoom", val);
  const setLocation = (val: string) =>
    updateInstanceFilter("map", "location", val);

  const setStatus = (val: string) => {
    if ((val === "sold" || val === "expired") && !isLoggedIn) {
      setOpenLogin(true);
      return;
    }
    updateInstanceFilter("map", "status", val);
  };

  useEffect(() => {
    setFitBoundsDone(false);
  }, [filters]);

  const price = [minPrice ?? 1000, maxPrice ?? 100000000];
  const sqft = [minSqft ?? 100, maxSqft ?? 15000];

  const setPrice = (val: [number, number]) => {
    updateInstanceFilter("map", "minPrice", val[0]);
    updateInstanceFilter("map", "maxPrice", val[1]);
  };

  const setSqft = (val: [number, number]) => {
    updateInstanceFilter("map", "minSqft", val[0]);
    updateInstanceFilter("map", "maxSqft", val[1]);
  };

  const resetAllFilters = () => {
    clearInstanceFilters("map");
    setSortBy("newest");
  };

  const activeFilterPills = useMemo(
    () =>
      buildActiveFilterPills({
        filters,
        sortBy,
        setSortBy,
        updateInstanceFilter,
      }),
    [filters, sortBy, updateInstanceFilter],
  );

  const hasActiveFilters = activeFilterPills.length > 0;
  const isForSale = status === "forSale";

  const mapZoomParams = useMemo(
    () => buildMapZoomParams({ filters, mapBounds, mapZoomVal }),
    [filters, mapBounds, mapZoomVal],
  );

  const params = useMemo(() => buildListingParams(filters), [filters]);

  const {
    data: queryDataNormal,
    isLoading: isLoadingNormal,
    isFetching: isFetchingNormal,
  } = useGetListings(params, {
    select: (res: any) =>
      (res?.data || [])
        .map((listing: any) => transformNormalListing(listing, me))
        .filter(
          (l: any) =>
            Number(l.price) > 0 && (hasValidCoordinates(l) || l.address),
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
        .map((listing: any) => transformActiveListing(listing, me))
        .filter(
          (l: any) =>
            Number(l.price) > 0 && (hasValidCoordinates(l) || l.address),
        ),
    enabled: isForSale && !!mapBounds,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData: any) => previousData,
  });

  const {
    data: queryDataSold,
    isLoading: isLoadingSold,
    isFetching: isFetchingSold,
  } = useGetMapZoomSoldList(mapZoomParams, {
    select: (res: any) => res.data.filter((l: any) => Number(l.price) > 0),
    enabled: isForSale && !!mapBounds && mapZoomVal! > 15,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData: any) => previousData,
  });

  const {
    data: queryDataAssignment,
    isLoading: isLoadingAssignment,
    isFetching: isFetchingAssignment,
  } = useGetMapZoomAssignmentList(mapZoomParams, {
    select: (res: any) => res.data.filter((l: any) => Number(l.price) > 0),
    enabled: isForSale && !!mapBounds && mapZoomVal! > 15,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData: any) => previousData,
  });

  const rawProperties = useMemo(
    () => (isForSale ? queryDataActive || [] : queryDataNormal || []),
    [isForSale, queryDataActive, queryDataNormal],
  );

  useEffect(() => {
    const needsGeocode = rawProperties.filter((property: any) => {
      const key = getGeoKey(property);
      return (
        !hasValidCoordinates(property) &&
        property.address &&
        !geocodedCache[key]
      );
    });

    if (needsGeocode.length === 0) return;

    let cancelled = false;

    const runGeocode = async () => {
      const updates: Record<string, any> = {};

      for (const property of needsGeocode.slice(0, 8)) {
        const key = getGeoKey(property);

        try {
          const query = encodeURIComponent(normalizeAddress(property));
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`,
          );
          const json = await res.json();
          const first = json?.[0];

          if (first?.lat && first?.lon) {
            updates[key] = {
              latitude: Number(first.lat),
              longitude: Number(first.lon),
            };
          }
        } catch (error) {
          console.error("OSM geocode failed:", property.address, error);
        }

        await new Promise((resolve) => setTimeout(resolve, 1100));
      }

      if (!cancelled && Object.keys(updates).length > 0) {
        setGeocodedCache((prev) => ({ ...prev, ...updates }));
      }
    };

    runGeocode();

    return () => {
      cancelled = true;
    };
  }, [rawProperties, geocodedCache]);

  const properties = useMemo(() => {
    return rawProperties
      .map((property: any) => {
        const key = getGeoKey(property);
        const cached = geocodedCache[key];

        if (hasValidCoordinates(property)) return property;
        if (cached) {
          return {
            ...property,
            latitude: cached.latitude,
            longitude: cached.longitude,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [rawProperties, geocodedCache]);

  const isFetching = isForSale ? isFetchingActive : isFetchingNormal;
  const isLoadingData = isForSale ? isLoadingActive : isLoadingNormal;
  const isLoading =
    isLoadingData || isFetching || isLoadingSold || isFetchingSold;

  const fetchParcels = useCallback(async (bounds: MapBounds) => {
    try {
      const query = new URLSearchParams({
        north: bounds.north.toString(),
        south: bounds.south.toString(),
        east: bounds.east.toString(),
        west: bounds.west.toString(),
        zoom: bounds.zoom.toString(),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/parcels/findGeoJSON?${query}`,
      );
      if (!res.ok) throw new Error("Failed to fetch parcels");

      setParcelGeoJSON(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const toggleFloodLayer = async () => {
    if (!map) return;

    if (floodLayerRef.current) {
      map.removeLayer(floodLayerRef.current);
      floodLayerRef.current = null;
      setShowFloodProvince(false);
      return;
    }

    try {
      setLoadingFloodProvince(true);

      const res = await fetch(`${Endpoints.getFloodProvinceGeoJSON}`);

      if (!res.ok) throw new Error("Failed to fetch flood province layer");

      const geojson = await res.json();

      const layer = L.geoJSON(geojson, {
        pane: "overlayPane",
        style: {
          color: "#dc2626",
          weight: 1,
          opacity: 1,
          dashArray: "10",
          fillColor: "#dc2626",
          fillOpacity: 0.75,
        },
        // onEachFeature: (feature, layer) => {
        //   const p = feature.properties || {};

        //   layer.bindPopup(`
        //   <strong>${p.floodplain_name || "Flood Province"}</strong><br/>
        //   Feature: ${p.feature_name || "-"}<br/>
        //   Code: ${p.feature_code || "-"}<br/>
        //   Date: ${p.designation_date || "-"}
        // `);
        // },
      });

      layer.addTo(map);
      floodLayerRef.current = layer;
      setShowFloodProvince(true);
    } catch (err) {
      console.error("Flood layer error:", err);
    } finally {
      setLoadingFloodProvince(false);
    }
  };

  const triggerSearch = useCallback(() => {
    if (!map) return;
    const zoom = map.getZoom() || 8;
    if (zoom < 8) return;

    const newBounds = getBoundsPayload(map);
    const key = boundsKey(newBounds);
    if (lastFetchedBounds.current === key) return;

    setMapBounds(newBounds);
    setMapZoomVal(Math.round(zoom));
    lastFetchedBounds.current = key;

    if (zoom >= 19) fetchParcels(newBounds);
  }, [map, fetchParcels]);

  const onMapReady = useCallback((mapInstance: L.Map) => {
    setMap(mapInstance);
    setMapLoaded(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(center);
        setLocationChecked(true);
        mapInstance.setView([center.lat, center.lng], 13);

        setTimeout(() => {
          const nextBounds = getBoundsPayload(mapInstance);
          setMapBounds(nextBounds);
          setMapZoomVal(Math.round(nextBounds.zoom));
          lastFetchedBounds.current = boundsKey(nextBounds);
        }, 700);
      },
      () => {
        setLocationChecked(true);
        mapInstance.setView(osmDefaultCenter, 13);

        setTimeout(() => {
          const nextBounds = getBoundsPayload(mapInstance);
          setMapBounds(nextBounds);
          setMapZoomVal(Math.round(nextBounds.zoom));
          lastFetchedBounds.current = boundsKey(nextBounds);
        }, 700);
      },
    );
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map || !locationChecked) return;
    if (lastLocationRef.current === location) return;
    lastLocationRef.current = location;

    if (!location) {
      if (userLocation) map.setView([userLocation.lat, userLocation.lng], 13);
      else map.setView(osmDefaultCenter, 13);
      setTimeout(() => triggerSearch(), 300);
      return;
    }

    const firstCity = location.split(",")[0].trim();
    const coords = cityCoords[firstCity];

    if (coords) {
      map.setView(coords, 13);
      setTimeout(() => triggerSearch(), 300);
    }
  }, [location, mapLoaded, map, locationChecked, userLocation, triggerSearch]);

  useEffect(() => {
    if (!mapLoaded || !map || properties.length === 0 || fitBoundsDone) return;
    if (location) return;

    const bounds = L.latLngBounds([]);
    let hasValidPoints = false;

    properties.forEach((p: any) => {
      if (hasValidCoordinates(p)) {
        bounds.extend([p.latitude, p.longitude]);
        hasValidPoints = true;
      }
    });

    if (hasValidPoints && bounds.isValid()) {
      map.fitBounds(bounds, { maxZoom: 13 });
      setFitBoundsDone(true);
    }
  }, [properties, mapLoaded, map, fitBoundsDone, location]);

  useEffect(() => {
    if (selectedClusterProperties.length > 0) return;

    if (!properties || properties.length === 0) {
      setClusters((prev) => (prev.length === 0 ? prev : []));
      setVisibleProperties((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    if (!map) return;

    const zoom = map.getZoom() || 13;
    const bounds = map.getBounds();

    const points = properties.map((p: any) => ({
      type: "Feature",
      properties: { cluster: false, propertyId: p.id, propertyData: p },
      geometry: {
        type: "Point",
        coordinates: [Number(p.longitude), Number(p.latitude)],
      },
    }));

    superclusterRef.current = new Supercluster({
      radius: getClusterRadius(zoom),
      maxZoom: 18,
    });

    superclusterRef.current.load(points as any);

    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    const clustersData = superclusterRef.current.getClusters(
      bbox,
      Math.floor(zoom),
    );
    setClusters(clustersData);

    const visible = properties
      .filter((p: any) => bounds.contains([p.latitude, p.longitude]))
      .sort((a: any, b: any) => {
        if (sortBy === "priceLow") return a.price - b.price;
        if (sortBy === "priceHigh") return b.price - a.price;
        return b.daysAgo - a.daysAgo;
      });

    setVisibleProperties(visible);
  }, [properties, map, mapZoomVal, sortBy, selectedClusterProperties.length]);

  const stableClusterPosition = useMemo(
    () => clusterPosition,
    [clusterPosition?.lat, clusterPosition?.lng],
  );

  const toggleMapStyle = () => setIsSatellite((prev) => !prev);

  const handleGeolocation = () => {
    if (!map) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(center);
        map.setView([center.lat, center.lng], 13);
        setTimeout(() => triggerSearch(), 300);
      },
      () => alert("Please enable location services to use this feature."),
    );
  };

  const schoolParams = useMemo(
    () => ({
      north: mapBounds?.north,
      south: mapBounds?.south,
      east: mapBounds?.east,
      west: mapBounds?.west,
      zoom: mapBounds?.zoom,
      schoolType,
    }),
    [mapBounds, schoolType],
  );

  const { data: schoolsData, isLoading: isLoadingSchools } =
    useGetMapZoomSchools(schoolParams, {
      select: (res: any) =>
        (res?.data || [])
          .map((item: any) => ({
            id: item.documentId,
            school_name: item.school_name,
            school_type: item.school_type,
            city: item.city,
            rating: item.rating,
            rank: item.rank,
            address: item.address,
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
          }))
          .filter(
            (item: SchoolItem) =>
              !Number.isNaN(item.latitude) &&
              !Number.isNaN(item.longitude) &&
              item.latitude !== 0 &&
              item.longitude !== 0,
          ),
      enabled:
        schoolMode && !!mapBounds && mapZoomVal !== null && mapZoomVal >= 15,
      staleTime: 1000 * 60 * 5,
    });

  const schools =
    mapZoomVal !== null && mapZoomVal >= 15 ? schoolsData || [] : [];

  const handleSchool = () => {
    setSchoolMode((prev) => !prev);

    if (!schoolMode && map) {
      const nextBounds = getBoundsPayload(map);
      setMapBounds(nextBounds);
      setMapZoomVal(Math.round(nextBounds.zoom));
    }
  };

  const handleSchoolTypeChange = (type: SchoolType) => {
    setSchoolType(type);

    if (map) {
      const nextBounds = getBoundsPayload(map);
      setMapBounds(nextBounds);
      setMapZoomVal(Math.round(nextBounds.zoom));
    }
  };

  const clearMeasurement = () => {
    setMeasureMode(false);
    setMeasurePoints([]);
    setDistance(null);
    setMovingPoint(null);
  };

  const handleMeasureMove = (point: LatLngPoint) => {
    if (!measureMode || measurePoints.length === 0) return;
    setMovingPoint(point);
  };

  const handleMeasureClick = (point: LatLngPoint) => {
    if (!measureMode) return;
    setMovingPoint(null);

    setMeasurePoints((prev) => {
      const updated = [...prev, point];

      if (updated.length >= 2) {
        let total = 0;

        for (let i = 1; i < updated.length; i++) {
          total += getDistanceBetweenPoints(updated[i - 1], updated[i]);
        }

        const segment = getDistanceBetweenPoints(
          updated[updated.length - 2],
          updated[updated.length - 1],
        );

        setDistance({ segment, total });
      }

      return updated;
    });
  };

  const handleMeasure = () => {
    setMeasureMode((prev) => !prev);

    if (measureMode) {
      setMeasurePoints([]);
      setDistance(null);
      setMovingPoint(null);
    }

    setSelectedProperty(null);
    setSelectedClusterProperties([]);
    setClusterPosition(null);
  };
  if (!mapLoaded && typeof window === "undefined") return <MapLoading />;

  return (
    <>
      <div className="flex flex-col overflow-hidden mt-20 w-full h-[calc(100vh-5px)]">
        <div className="flex flex-row items-center gap-4 flex-wrap mb-6 justify-between w-full mx-auto xl:max-w-screen-2xl xl:px-16 md:px-13 px-6">
          {/* 🔍 CHIP SEARCH BAR (DESIGN SAME) */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city, neighborhood, or address..."
              className="flex-1 text-sm outline-none bg-transparent"
            />

            <button
              className="ml-auto bg-[#E6A500] p-2.5 rounded-lg flex items-center justify-center"
              onClick={() => {
                // Search is live, but we can keep the button for UX
              }}
            >
              <FiSearch size={18} className="text-white" />
            </button>
          </div>
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
            location={location}
            setLocation={setLocation}
          />

          <MapActiveFilters
            hasActiveFilters={hasActiveFilters}
            activeFilterPills={activeFilterPills}
            resetAllFilters={resetAllFilters}
          />
        </div>

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative xl:max-w-screen-2xl mx-auto w-full h-full">
          <MapSidebar
            isLoading={isLoading}
            visibleProperties={visibleProperties}
            properties={properties}
            isLoggedIn={isLoggedIn}
            status={status}
            setHoveredPropertyId={setHoveredPropertyId}
            assessmentDrawerOpen={assessmentDrawerOpen}
            selectedAssessmentProperty={selectedAssessmentProperty}
            setAssessmentDrawerOpen={setAssessmentDrawerOpen}
          />

          <div className="flex flex-1 relative z-10 w-full h-full">
            {isLoading && (
              <div className="absolute left-0 top-0 z-9999 h-1 w-full overflow-hidden bg-gray-200">
                <div className="h-full w-1/3 animate-[mapLoading_1.2s_ease-in-out_infinite] bg-[#305487]" />
              </div>
            )}

            <MapContainer
              center={osmDefaultCenter}
              zoom={13}
              minZoom={8}
              maxZoom={22}
              zoomControl={false}
              scrollWheelZoom
              className="w-full h-full bc-osm-map"
            >
              <MapReady onReady={onMapReady} />

              <TileLayer
                attribution={
                  isSatellite
                    ? osmSatelliteTile.attribution
                    : osmRoadmapTile.attribution
                }
                url={isSatellite ? osmSatelliteTile.url : osmRoadmapTile.url}
                maxZoom={22}
                maxNativeZoom={
                  isSatellite
                    ? osmSatelliteTile.maxNativeZoom
                    : osmRoadmapTile.maxNativeZoom
                }
              />

              <MapEvents
                measureMode={measureMode}
                selectedProperty={selectedProperty}
                selectedClusterProperties={selectedClusterProperties}
                triggerSearch={triggerSearch}
                clearPopups={() => {
                  setSelectedProperty(null);
                  setSelectedClusterProperties([]);
                  setClusterPosition(null);
                }}
                handleMeasureClick={handleMeasureClick}
                handleMeasureMove={handleMeasureMove}
              />

              <OpenStreetMapAssignmentGeoLayer
                map={map}
                data={queryDataAssignment || []}
                zoomVal={mapZoomVal}
                onSelectProperty={(property) => {
                  setSelectedAssessmentProperty(property);
                  setAssessmentDrawerOpen(true);
                }}
              />

              {parcelGeoJSON && mapZoomVal && mapZoomVal >= 19 && (
                <OSMGeoJsonLayer data={parcelGeoJSON} properties={properties} />
              )}

              {schoolMode &&
                mapZoomVal &&
                mapZoomVal >= 15 &&
                schools.map((school: SchoolItem) => (
                  <SchoolMarker key={school.id} school={school} />
                ))}

              {measureMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-999 w-[330px] bg-yellow-300 border border-black text-center text-xs shadow-md">
                  <div className="bg-yellow-400 border-b border-black font-bold text-[10px]">
                    MEASUREMENT TOOL
                  </div>

                  <div className="px-2 py-1 font-medium">
                    {measurePoints.length === 0
                      ? "Tap after moving to the starting point."
                      : "Tap after moving to the next point or Double-Tap to set the last point."}
                  </div>

                  <button
                    onClick={clearMeasurement}
                    className="mb-1 px-3 py-0.5 bg-white border border-black rounded text-xs"
                  >
                    Cancel
                  </button>

                  {distance && (
                    <div className="pb-1 leading-4">
                      <div>
                        Segment distance: {formatMeter(distance.segment)}
                      </div>
                      <div>Total distance: {formatMeter(distance.total)}</div>
                    </div>
                  )}
                </div>
              )}

              {measureMode && measurePoints.length > 0 && movingPoint && (
                <Polyline
                  positions={[
                    [
                      measurePoints[measurePoints.length - 1].lat,
                      measurePoints[measurePoints.length - 1].lng,
                    ],
                    [movingPoint.lat, movingPoint.lng],
                  ]}
                  pathOptions={{ color: "#22558b", opacity: 1, weight: 3 }}
                />
              )}

              {measurePoints.length >= 2 && (
                <Polyline
                  positions={measurePoints.map((point) => [
                    point.lat,
                    point.lng,
                  ])}
                  pathOptions={{ color: "#22558b", opacity: 1, weight: 3 }}
                />
              )}

              {measurePoints.length >= 2 &&
                measurePoints.slice(1).map((point, index) => {
                  const start = measurePoints[index];
                  const end = point;
                  const segmentDistance = getDistanceBetweenPoints(start, end);
                  const middle = getMiddlePoint(start, end);

                  return (
                    <Marker
                      key={`segment-distance-${index}`}
                      position={[middle.lat, middle.lng]}
                      icon={L.divIcon({
                        className: "bc-osm-marker",
                        html: `<div class="bc-osm-measure-label">${formatMeter(segmentDistance)}</div>`,
                      })}
                    />
                  );
                })}

              {measureMode &&
                measurePoints.length > 0 &&
                movingPoint &&
                (() => {
                  const start = measurePoints[measurePoints.length - 1];
                  const middle = getMiddlePoint(start, movingPoint);
                  return (
                    <Marker
                      position={[middle.lat, middle.lng]}
                      icon={L.divIcon({
                        className: "bc-osm-marker",
                        html: `<div class="bc-osm-measure-label">${formatMeter(
                          getDistanceBetweenPoints(start, movingPoint),
                        )}</div>`,
                      })}
                    />
                  );
                })()}

              {measurePoints.map((point, index) => (
                <CircleMarker
                  key={`measure-point-${index}`}
                  center={[point.lat, point.lng]}
                  radius={6}
                  pathOptions={{
                    color: "#305487",
                    fillColor: "white",
                    fillOpacity: 1,
                    weight: 2,
                  }}
                />
              ))}

              <OpenStreetMapMarkerLayer
                clusters={clusters}
                map={map}
                status={status}
                hoveredPropertyId={hoveredPropertyId}
                selectedClusterProperties={selectedClusterProperties}
                superclusterRef={superclusterRef}
                setHoveredPropertyId={setHoveredPropertyId}
                setSelectedProperty={setSelectedProperty}
                setSelectedClusterProperties={setSelectedClusterProperties}
                setClusterPosition={setClusterPosition}
              />

              <OpenStreetMapSoldMakerLayer
                map={map}
                soldListings={queryDataSold || []}
                zoomVal={mapZoomVal}
              />

              <OpenStreetPropertyPopup
                selectedProperty={selectedProperty}
                popupRef={popupRef}
                onClose={() => setSelectedProperty(null)}
              />

              <OpenStreetClusterPopup
                selectedClusterProperties={selectedClusterProperties}
                stableClusterPosition={stableClusterPosition}
                onClose={() => setSelectedClusterProperties([])}
              />
            </MapContainer>

            {isLoading && <MapLoadingBadge />}

            <OpenStreetMapControls
              map={map}
              isSatellite={isSatellite}
              measureMode={measureMode}
              floodProvinceMode={showFloodProvince}
              loadingFloodProvince={loadingFloodProvince}
              schoolMode={schoolMode}
              schoolType={schoolType}
              mapZoomVal={mapZoomVal}
              loadingSchools={isLoadingSchools}
              toggleMapStyle={toggleMapStyle}
              handleGeolocation={handleGeolocation}
              handleSchool={handleSchool}
              handleSchoolTypeChange={handleSchoolTypeChange}
              handleMeasure={handleMeasure}
              handleFloodProvince={toggleFloodLayer}
            />
          </div>
        </div>
      </div>

      <GetInTouch />
    </>
  );
}
