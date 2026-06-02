"use client";

import "leaflet/dist/leaflet.css";
import "./openstreet-map.css";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import Supercluster from "supercluster";
import { useRouter } from "next/navigation";
import {
  useGetListings,
  useGetMapZoomListings,
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

type SchoolItem = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
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

function SchoolMarker({
  school,
  hoveredSchool,
  setHoveredSchool,
}: {
  school: SchoolItem;
  hoveredSchool: SchoolItem | null;
  setHoveredSchool: (school: SchoolItem | null) => void;
}) {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: "bc-osm-marker",
        html: `<div class="bc-osm-school"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="22" width="22" xmlns="http://www.w3.org/2000/svg"><path d="M256 32 20 160l236 128 192-104v104h44V160L256 32zM108 247.3V336c0 48.6 66.3 88 148 88s148-39.4 148-88v-88.7L256 328 108 247.3z"></path></svg></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
    [],
  );

  return (
    <Marker
      position={[school.lat, school.lng]}
      icon={icon}
      eventHandlers={{
        mouseover: () => setHoveredSchool(school),
        mouseout: () => setHoveredSchool(null),
      }}
    >
      {hoveredSchool?.id === school.id && (
        <Tooltip
          permanent
          direction="top"
          offset={[0, -24]}
          className="bc-osm-school-tooltip"
        >
          <div className="w-60 bg-white rounded-2xl shadow-2xl p-3 z-50">
            <h3 className="text-sm font-semibold">{school.name}</h3>
            {school.address && (
              <p className="text-xs text-gray-500 mt-1">{school.address}</p>
            )}
            <a
              href={`https://www.openstreetmap.org/?mlat=${school.lat}&mlon=${school.lng}#map=18/${school.lat}/${school.lng}`}
              target="_blank"
              className="text-blue-600 text-xs underline mt-2 inline-block"
            >
              Open in OpenStreetMap
            </a>
          </div>
        </Tooltip>
      )}
    </Marker>
  );
}

export default function OpenStreetMapSearch() {
  const router = useRouter();
  const { data: me } = useGetMe();
  const { isLoggedIn, setOpenLogin } = useAuthContext();
  const { getInstanceFilters, updateInstanceFilter, clearInstanceFilters } =
    useListingStore();

  const filters = getInstanceFilters("map");
  const {
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
  // const [schools, setSchools] = useState<SchoolItem[]>([]);
  // const [loadingSchools, setLoadingSchools] = useState(false);
  // const [hoveredSchool, setHoveredSchool] = useState<SchoolItem | null>(null);
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<LatLngPoint[]>([]);
  const [distance, setDistance] = useState<{
    segment: number;
    total: number;
  } | null>(null);
  const [movingPoint, setMovingPoint] = useState<LatLngPoint | null>(null);
  const [userLocation, setUserLocation] = useState<LatLngPoint | null>(null);
  const [locationChecked, setLocationChecked] = useState(false);

  const superclusterRef = useRef<Supercluster | null>(null);
  const lastFetchedBounds = useRef<string>("");
  const popupRef = useRef<HTMLDivElement | null>(null);
  const lastLocationRef = useRef<string | null>(null);

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

  const price = [minPrice ?? 1000, maxPrice ?? 20000000];
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
  const isLoading = isLoadingData || isFetching;

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

    if (zoom >= 16) fetchParcels(newBounds);
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

  // Start fetchSchools
  // const fetchSchools = useCallback(async () => {
  //   if (!map) return;

  //   const bounds = map.getBounds();

  //   const south = bounds.getSouth();
  //   const west = bounds.getWest();
  //   const north = bounds.getNorth();
  //   const east = bounds.getEast();

  //   setLoadingSchools(true);

  //   try {
  //     const params = new URLSearchParams({
  //       south: String(south),
  //       west: String(west),
  //       north: String(north),
  //       east: String(east),
  //     });

  //     const res = await fetch(`/api/overpass/schools?${params.toString()}`);

  //     const json = await res.json();

  //     if (!res.ok || !json.success) {
  //       throw new Error(json.message || "School API failed");
  //     }

  //     const nextSchools: SchoolItem[] = (json?.data || []).map((item: any) => ({
  //       id: String(item.id),
  //       name: item.name || "School",
  //       lat: Number(item.latitude),
  //       lng: Number(item.longitude),
  //       address: item.address || "",
  //     }));

  //     setSchools(nextSchools);
  //   } catch (error) {
  //     console.error("OSM school fetch failed:", error);
  //     setSchools([]);
  //   } finally {
  //     setLoadingSchools(false);
  //   }
  // }, [map]);

  // const handleSchool = () => {
  //   if (schools.length > 0) {
  //     setSchools([]);
  //     setHoveredSchool(null);
  //     return;
  //   }
  //   fetchSchools();
  // };

  // useEffect(() => {
  //   if (!map || schools.length === 0) return;

  //   const onIdle = () => fetchSchools();
  //   map.on("moveend", onIdle);
  //   map.on("zoomend", onIdle);

  //   return () => {
  //     map.off("moveend", onIdle);
  //     map.off("zoomend", onIdle);
  //   };
  // }, [map, schools.length, fetchSchools]);
  // End fetchSchools

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
          location={location}
          setLocation={setLocation}
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

          <div className="flex relative z-10 w-full h-full">
            <MapContainer
              center={osmDefaultCenter}
              zoom={13}
              minZoom={8}
              maxZoom={18}
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

              {parcelGeoJSON && mapZoomVal && mapZoomVal >= 16 && (
                <OSMGeoJsonLayer data={parcelGeoJSON} properties={properties} />
              )}

              {/* {mapZoomVal &&
                mapZoomVal >= 15 &&
                schools.map((school) => (
                  <SchoolMarker
                    key={school.id}
                    school={school}
                    hoveredSchool={hoveredSchool}
                    setHoveredSchool={setHoveredSchool}
                  />
                ))} */}

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
              toggleMapStyle={toggleMapStyle}
              handleGeolocation={handleGeolocation}
              // handleSchool={handleSchool}
              handleMeasure={handleMeasure}
            />
          </div>
        </div>
      </div>

      <GetInTouch />
    </>
  );
}
