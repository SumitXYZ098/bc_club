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
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 49.2827,
  lng: -123.1207,
};

const options = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
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

  const mapZoomParams = useMemo(() => {
    const p: any = {};
    if (search) p.search = search;
    if (location && location !== "" && location !== "British Columbia")
      p.location = location;
    if (minPrice !== undefined && minPrice > 1000) p.minPrice = minPrice;
    if (maxPrice !== undefined && maxPrice < 20000000) p.maxPrice = maxPrice;
    if (minSqft !== undefined && minSqft > 100) p.minSqft = minSqft;
    if (maxSqft !== undefined && maxSqft < 15000) p.maxSqft = maxSqft;
    if (activeBedRoom && activeBedRoom !== "any")
      p.beds = activeBedRoom.replace("+", "");
    if (activeBathRoom && activeBathRoom !== "any")
      p.baths = activeBathRoom.replace("+", "");
    if (activeProperty && activeProperty !== "any") p.type = activeProperty;
    if (status && status !== "forSale" && status !== "any")
      p.propertyType = status;
    if (mapBounds) {
      p.north = mapBounds.north;
      p.south = mapBounds.south;
      p.east = mapBounds.east;
      p.west = mapBounds.west;
      // if (mapZoomVal !== null) p.zoom = mapZoomVal;
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

  const params: any = { "pagination[page]": 1, "pagination[pageSize]": 500 };
  if (status && status !== "any") params.propertyType = status;
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
          daysAgo: listing?.raw_data?.OriginalEntryTimestamp ?? 0,
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
          isFavourite: listing?.is_favorite || isWishlistPage,
          isDdf: false,
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
        ),
    enabled: isForSale && !!mapBounds,
    staleTime: 1000 * 60 * 5,
  });

  const queryData = isForSale ? queryDataActive : queryDataNormal;
  const isFetching = isForSale ? isFetchingActive : isFetchingNormal;
  const isLoadingData = isForSale ? isLoadingActive : isLoadingNormal;

  const isLoading = isLoadingData || isFetching || isMoving;

  const properties = useMemo(() => queryData || [], [queryData]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMapLoaded(true);
  }, []);

  const onMapIdle = useCallback(() => {
    setIsMoving(false);
    if (!map) return;
    const bounds = map.getBounds();
    if (bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const newBounds = {
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng(),
        zoom: map.getZoom() || 6,
      };

      setMapBounds((prev) => {
        if (
          prev &&
          prev.north === newBounds.north &&
          prev.south === newBounds.south &&
          prev.east === newBounds.east &&
          prev.west === newBounds.west &&
          prev.zoom === newBounds.zoom
        ) {
          return prev;
        }
        return newBounds;
      });
      const newZoom = Math.round(map.getZoom() || 6);
      setMapZoomVal((prev) => (prev === newZoom ? prev : newZoom));
    }
  }, [map]);

  useEffect(() => {
    if (!map || !mapLoaded) return;
    const zoom = map.getZoom() || 6;
    if (zoom >= 17 && !isSatellite) {
      map.setMapTypeId("satellite");
      setIsSatellite(true);
    } else if (zoom < 17 && isSatellite) {
      map.setMapTypeId("roadmap");
      setIsSatellite(false);
    }
  }, [map, mapLoaded, isSatellite]);

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

  useEffect(() => {
    if (!mapLoaded || !map || !location) return;
    const cityCoords: { [key: string]: { lat: number; lng: number } } = {
      Vancouver: { lat: 49.2827, lng: -123.1207 },
      Burnaby: { lat: 49.2488, lng: -122.9805 },
      Surrey: { lat: 49.1913, lng: -122.849 },
      Richmond: { lat: 49.1666, lng: -123.1336 },
      Coquitlam: { lat: 49.2838, lng: -122.7722 },
      Victoria: { lat: 48.4284, lng: -123.3656 },
      Kelowna: { lat: 49.888, lng: -119.496 },
      Abbotsford: { lat: 49.0504, lng: -122.3275 },
    };
    const coords = cityCoords[location];
    if (coords) {
      map.panTo(coords);
      map.setZoom(11);
    } else if (properties?.length > 0 && location !== "British Columbia") {
      map.panTo({ lat: properties[0].latitude, lng: properties[0].longitude });
      map.setZoom(11);
    }
  }, [location, mapLoaded, map]);

  const handleGeolocation = () => {
    if (!map) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.panTo({ lat: latitude, lng: longitude });
        map.setZoom(15);
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

  // // Supercluster logic for Google Maps
  // useEffect(() => {
  //   if (!properties || properties.length === 0) {
  //     setClusters((prev) => (prev.length === 0 ? prev : []));
  //     setVisibleProperties((prev) => (prev.length === 0 ? prev : []));
  //     return;
  //   }

  //   const points = properties.map((p: any) => ({
  //     type: "Feature",
  //     properties: { cluster: false, propertyId: p.id, propertyData: p },
  //     geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
  //   }));

  //   superclusterRef.current = new Supercluster({ radius: 60, maxZoom: 15 });
  //   superclusterRef.current.load(points as any);

  //   if (map) {
  //     const zoom = map.getZoom() || 6;
  //     const bounds = map.getBounds();
  //     if (bounds) {
  //       const sw = bounds.getSouthWest();
  //       const ne = bounds.getNorthEast();
  //       const bbox: [number, number, number, number] = [
  //         sw.lng(),
  //         sw.lat(),
  //         ne.lng(),
  //         ne.lat(),
  //       ];
  //       const clustersData = superclusterRef.current.getClusters(
  //         bbox,
  //         Math.floor(zoom),
  //       );

  //       setClusters((prev) => {
  //         if (JSON.stringify(prev) === JSON.stringify(clustersData))
  //           return prev;
  //         return clustersData;
  //       });

  //       let visible = properties.filter((p: any) =>
  //         bounds.contains({ lat: p.latitude, lng: p.longitude }),
  //       );
  //       if (sortBy === "priceLow")
  //         visible.sort((a: any, b: any) => a.price - b.price);
  //       else if (sortBy === "priceHigh")
  //         visible.sort((a: any, b: any) => b.price - a.price);
  //       else if (sortBy === "newest")
  //         visible.sort((a: any, b: any) => b.daysAgo - a.daysAgo);

  //       setVisibleProperties((prev) => {
  //         if (JSON.stringify(prev) === JSON.stringify(visible)) return prev;
  //         return visible;
  //       });
  //     }
  //   }
  // }, [properties, map, mapZoomVal, sortBy]);

  useEffect(() => {
    if (!properties.length) return;

    const points = properties.map((p: any) => ({
      type: "Feature",
      properties: {
        cluster: false,
        propertyData: p,
      },
      geometry: {
        type: "Point",
        coordinates: [p.longitude, p.latitude],
      },
    }));

    const cluster = new Supercluster({
      radius: 60,
      maxZoom: 15,
    });

    cluster.load(points as any);
    superclusterRef.current = cluster;
  }, [properties]);

  useEffect(() => {
    if (!map || !superclusterRef.current) return;

    const clusterInstance = superclusterRef.current;

    const updateClusters = () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom() || 6;

      if (!bounds) return;

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const bbox: [number, number, number, number] = [
        sw.lng(),
        sw.lat(),
        ne.lng(),
        ne.lat(),
      ];

      const clustersData = clusterInstance.getClusters(bbox, Math.floor(zoom));

      setClusters(clustersData);

      let visible = properties.filter((p: any) =>
        bounds.contains({ lat: p.latitude, lng: p.longitude }),
      );

      if (sortBy === "priceLow") {
        visible.sort((a: any, b: any) => a.price - b.price);
      } else if (sortBy === "priceHigh") {
        visible.sort((a: any, b: any) => b.price - a.price);
      } else {
        visible.sort((a: any, b: any) => b.daysAgo - a.daysAgo);
      }

      setVisibleProperties(visible);
    };

    updateClusters();

    const listener = map.addListener("idle", updateClusters);

    return () => {
      if (listener) listener.remove();
    };
  }, [map, properties, sortBy]);

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
      <div className="w-full h-screen flex flex-col bg-white overflow-hidden mt-20">
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
          />

          <div className="hidden md:block flex-1 relative z-10">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={6}
              onLoad={onMapLoad}
              onIdle={onMapIdle}
              onDragStart={() => setIsMoving(true)}
              onZoomChanged={() => setIsMoving(true)}
              options={options}
            >
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
                        onClick={() => {
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
                const zoom = map?.getZoom() || 6;

                if (zoom >= 10) {
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
                        onClick={() => setSelectedProperty(property)}
                        className="w-fit bg-white px-2 py-1 rounded-full shadow-md text-primary font-bold text-xs cursor-pointer hover:bg-primary hover:text-white transition-all"
                      >
                        {formatPriceAbbreviated(property.price)}
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
                      onClick={() => {
                        map?.setZoom(12);
                        map?.panTo({
                          lat: property.latitude,
                          lng: property.longitude,
                        });
                      }}
                      className="cursor-pointer"
                      style={{
                        width: 30,
                        height: 30,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="flex items-center justify-center bg-primary text-white font-bold text-sm rounded-full shadow-lg border-2 border-white w-full h-full transition-transform hover:scale-110">
                        1
                      </div>
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
                    onClick={() =>
                      (window.location.href = `/property-info/${selectedProperty.id}`)
                    }
                    style={{
                      cursor: "pointer",
                      width: 220,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          width: "100%",
                          height: 130,
                          overflow: "hidden",
                          borderRadius: 8,
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
            </GoogleMap>

            {isLoading && (
              <div className="absolute top-4 left-4  z-20 pointer-events-none flex items-center justify-center">
                <div className="bg-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-gray-100 animate-in fade-in zoom-in duration-300">
                  <FiLoader className="animate-spin text-primary w-5 h-5" />
                  <span className="text-sm font-bold text-gray-700 tracking-tight">
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
