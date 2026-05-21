"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import Supercluster from "supercluster";
import { useRouter } from "next/navigation";
import {
  useGetListings,
  useGetMapZoomListings,
  useGetMe,
} from "@/src/hooks/listing/useListingQueries";
import { useListingStore } from "@/src/store/useListingStore";
import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";
import "./map.css";
import ClusterInfoWindow from "./ClusterInfoWindow";
import MapControls from "./MapControls";
import MapLoading from "./MapLoading";
import MapLoadingBadge from "./MapLoadingBadge";
import MapMarkerLayer from "./MapMarkerLayer";
import PropertyInfoWindow from "./PropertyInfoWindow";
import {
  GOOGLE_MAP_LIBRARIES,
  cityCoords,
  defaultCenter,
  mapContainerStyle,
  mapOptions,
  pillActive,
  pillBase,
  pillInactive,
} from "./googleMapConfig";
import {
  buildActiveFilterPills,
  buildListingParams,
  buildMapZoomParams,
} from "./mapFilterUtils";
import type { MapBounds } from "./mapTypes";
import {
  fitBoundsWithZoom,
  getGeoKey,
  hasValidCoordinates,
  normalizeAddress,
  transformActiveListing,
  transformNormalListing,
} from "./mapPropertyUtils";
import GeoJsonLayer from "./GeoJsonLayer";
import GetInTouch from "../../getInTouch/GetInTouch";
import MapSidebar from "../MapSidebar";
import MapActiveFilters from "../MapActiveFilters";
import MapTopFilterBar from "../MapTopFilterBar";
import { IoSchool } from "react-icons/io5";

export default function GoogleMapSearch() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAP_LIBRARIES,
    version: "weekly",
    language: "en",
    region: "US",
    authReferrerPolicy: "origin",
  });

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

  const [map, setMap] = useState<google.maps.Map | null>(null);
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
  const [schools, setSchools] = useState<any[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [hoveredSchool, setHoveredSchool] = useState<any>(null);

  const superclusterRef = useRef<Supercluster | null>(null);
  const idleTimeout = useRef<any>(null);
  const lastFetchedBounds = useRef<string>("");
  const popupRef = useRef<HTMLDivElement | null>(null);

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
    if (!isLoaded || !window.google || rawProperties.length === 0) return;

    const needsGeocode = rawProperties.filter((property: any) => {
      const key = getGeoKey(property);
      return (
        !hasValidCoordinates(property) &&
        property.address &&
        !geocodedCache[key]
      );
    });

    if (needsGeocode.length === 0) return;

    const geocoder = new google.maps.Geocoder();
    let cancelled = false;

    const runGeocode = async () => {
      const updates: Record<string, any> = {};

      for (const property of needsGeocode) {
        const key = getGeoKey(property);

        try {
          const response = await geocoder.geocode({
            address: normalizeAddress(property),
          });
          const foundLocation = response.results?.[0]?.geometry?.location;

          if (foundLocation) {
            updates[key] = {
              latitude: foundLocation.lat(),
              longitude: foundLocation.lng(),
            };
          }
        } catch (error) {
          console.error("Geocode failed:", property.address, error);
        }

        await new Promise((resolve) => setTimeout(resolve, 120));
      }

      if (!cancelled && Object.keys(updates).length > 0) {
        setGeocodedCache((prev) => ({ ...prev, ...updates }));
      }
    };

    runGeocode();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, rawProperties, geocodedCache]);

  const properties = useMemo(() => {
    return rawProperties
      .map((property: any) => {
        const key = getGeoKey(property);
        const cached = geocodedCache[key];

        if (hasValidCoordinates(property)) return property;
        if (cached)
          return {
            ...property,
            latitude: cached.latitude,
            longitude: cached.longitude,
          };
        return null;
      })
      .filter(Boolean);
  }, [rawProperties, geocodedCache]);

  const isFetching = isForSale ? isFetchingActive : isFetchingNormal;
  const isLoadingData = isForSale ? isLoadingActive : isLoadingNormal;
  const isLoading = isLoadingData || isFetching;

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    setMapLoaded(true);

    setTimeout(() => {
      const bounds = mapInstance.getBounds();
      if (!bounds) return;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const zoom = mapInstance.getZoom() || 14;

      const newBounds = {
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng(),
        zoom,
      };

      setMapBounds(newBounds);
      setMapZoomVal(Math.round(zoom));
      lastFetchedBounds.current = JSON.stringify(newBounds);
    }, 300);
  }, []);

  const fetchParcels = async (bounds: MapBounds) => {
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
  };

  const triggerSearch = useCallback(() => {
    if (selectedClusterProperties.length > 0 || selectedProperty) return;
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
    fetchParcels(newBounds);
    setMapZoomVal(Math.round(zoom));
    lastFetchedBounds.current = boundsKey;
  }, [map, selectedClusterProperties, selectedProperty]);

  const onMapIdle = useCallback(() => {
    if (selectedClusterProperties.length > 0 || selectedProperty) return;
    if (!map) return;

    const zoom = map.getZoom() || 14;
    if (zoom < 8) return;

    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    idleTimeout.current = setTimeout(triggerSearch, 400);
  }, [map, triggerSearch, selectedClusterProperties, selectedProperty]);

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

  useEffect(() => {
    if (!mapLoaded || !map) return;

    if (!location) {
      map.panTo(defaultCenter);
      map.setZoom(14);
      return;
    }

    const firstCity = location.split(",")[0].trim();
    const coords = cityCoords[firstCity];

    if (coords) {
      map.panTo(coords);
      setTimeout(() => {
        map.setZoom(14);
        triggerSearch();
      }, 300);
      return;
    }

    if (properties.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      properties.slice(0, 5).forEach((p: any) => {
        if (hasValidCoordinates(p))
          bounds.extend({ lat: p.latitude, lng: p.longitude });
      });
      fitBoundsWithZoom(map, bounds, 14);
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
      () => alert("Please enable location services to use this feature."),
    );
  };

  const handleSchool = () => {
    // REMOVE SCHOOLS IF ALREADY OPEN
    if (schools.length > 0) {
      setSchools([]);
      setHoveredSchool(null);
      return;
    }

    if (!map || !window.google) return;

    const bounds = map.getBounds();

    if (!bounds) return;

    const center = map.getCenter();

    if (!center) return;

    setLoadingSchools(true);

    const north = bounds.getNorthEast().lat();
    const east = bounds.getNorthEast().lng();
    const south = bounds.getSouthWest().lat();
    const west = bounds.getSouthWest().lng();

    const service = new google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: center,
        radius: 5000,
        type: "school",
      },
      (results, status) => {
        setLoadingSchools(false);

        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !results
        ) {
          setSchools([]);
          return;
        }

        const filteredSchools = results.filter((school: any) => {
          const lat = school.geometry.location.lat();
          const lng = school.geometry.location.lng();

          return (
            lat <= north &&
            lat >= south &&
            lng <= east &&
            lng >= west
          );
        });

        setSchools(filteredSchools);
      }
    );
  };

  useEffect(() => {
  if (!map || schools.length === 0) return;

  const listener = map.addListener("idle", () => {
    const bounds = map.getBounds();

    if (!bounds) return;

    const north = bounds.getNorthEast().lat();
    const east = bounds.getNorthEast().lng();
    const south = bounds.getSouthWest().lat();
    const west = bounds.getSouthWest().lng();

    const center = map.getCenter();

    if (!center) return;

    const service = new google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: center,
        radius: 5000,
        type: "school",
      },
      (results, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !results
        ) {
          setSchools([]);
          return;
        }

        // UPDATE SCHOOL LIST BASED ON CURRENT MAP BOUNDS
        const filteredSchools = results.filter((school: any) => {
          const lat = school.geometry.location.lat();
          const lng = school.geometry.location.lng();

          return (
            lat <= north &&
            lat >= south &&
            lng <= east &&
            lng >= west
          );
        });

        setSchools(filteredSchools);
      }
    );
  });

  return () => {
    google.maps.event.removeListener(listener);
  };
}, [map, schools.length]);

  useEffect(() => {
    if (!mapLoaded || !map || properties.length === 0 || fitBoundsDone) return;
    if (location) return;

    const bounds = new google.maps.LatLngBounds();
    let hasValidPoints = false;

    properties.forEach((p: any) => {
      if (hasValidCoordinates(p)) {
        bounds.extend({ lat: p.latitude, lng: p.longitude });
        hasValidPoints = true;
      }
    });

    if (hasValidPoints) {
      fitBoundsWithZoom(map, bounds, 14);
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

    const points = properties.map((p: any) => ({
      type: "Feature",
      properties: { cluster: false, propertyId: p.id, propertyData: p },
      geometry: {
        type: "Point",
        coordinates: [Number(p.longitude), Number(p.latitude)],
      },
    }));

    const currentZoom = map?.getZoom() || 8;

    const getClusterRadius = (zoom: number) => {
      if (zoom >= 16) return 100;
      if (zoom >= 14) return 255;
      if (zoom >= 12) return 270;
      if (zoom >= 10) return 300;

      return 340;
    };

    superclusterRef.current = new Supercluster({
      radius: getClusterRadius(currentZoom),
      maxZoom: 20,
    });

    superclusterRef.current.load(points as any);

    if (!map) return;

    const zoom = map.getZoom() || 14;
    const bounds = map.getBounds();
    if (!bounds) return;

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
    setClusters(clustersData);

    const visible = properties
      .filter((p: any) =>
        bounds.contains({ lat: p.latitude, lng: p.longitude }),
      )
      .sort((a: any, b: any) => {
        if (sortBy === "priceLow") return a.price - b.price;
        if (sortBy === "priceHigh") return b.price - a.price;
        return b.daysAgo - a.daysAgo;
      });

    setVisibleProperties(visible);
  }, [properties, map, mapZoomVal, sortBy, selectedClusterProperties]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSelectedProperty(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded) return <MapLoading />;

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
              center={defaultCenter}
              onLoad={onMapLoad}
              onIdle={onMapIdle}
              onDragStart={() => setSelectedProperty(null)}
              onZoomChanged={() => setSelectedProperty(null)}
              options={mapOptions}
              onClick={() => {
                setSelectedClusterProperties([]);
                setClusterPosition(null);
              }}
            >
              {parcelGeoJSON && mapZoomVal && mapZoomVal >= 17 && (
                <GeoJsonLayer
                  data={parcelGeoJSON}
                  map={map}
                  properties={properties}
                />
              )}

              {mapZoomVal && mapZoomVal >= 15 &&schools.map((school: any) => (
                <OverlayView
                  key={school.place_id}
                  position={{
                    lat: school.geometry.location.lat(),
                    lng: school.geometry.location.lng(),
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div
                    onMouseEnter={() => setHoveredSchool(school)}
                    onMouseLeave={() => setHoveredSchool(null)}
                    className="relative"
                  >
                    {/* SCHOOL ICON */}
                    <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-all">
                      <IoSchool className="text-white text-xl" />
                    </div>

                    {/* HOVER CARD */}
                    {hoveredSchool?.place_id === school.place_id && (
                      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-60 bg-white rounded-2xl shadow-2xl p-3 z-50">
                        <h3 className="text-sm font-semibold">
                          {school.name}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {school.vicinity}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs">
                            ⭐ {school.rating || "N/A"}
                          </span>

                          <span className="text-xs text-gray-500">
                            ({school.user_ratings_total || 0})
                          </span>
                        </div>

                        <a
                          href={`https://www.google.com/maps/place/?q=place_id:${school.place_id}`}
                          target="_blank"
                          className="text-blue-600 text-xs underline mt-2 inline-block"
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </OverlayView>
              ))}

              <MapMarkerLayer
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

              <PropertyInfoWindow
                selectedProperty={selectedProperty}
                popupRef={popupRef}
                onClose={() => setSelectedProperty(null)}
              />

              <ClusterInfoWindow
                selectedClusterProperties={selectedClusterProperties}
                stableClusterPosition={stableClusterPosition}
                onClose={() => setSelectedClusterProperties([])}
                onViewAll={() => {
                  setVisibleProperties(selectedClusterProperties);
                  setSelectedClusterProperties([]);
                  router.push("/properties");
                }}
              />
            </GoogleMap>

            {isLoading && <MapLoadingBadge />}

            <MapControls
              map={map}
              isSatellite={isSatellite}
              toggleMapStyle={toggleMapStyle}
              handleGeolocation={handleGeolocation}
              handleSchool={handleSchool}
            />
          </div>
        </div>
      </div>

      <GetInTouch />
    </>
  );
}
