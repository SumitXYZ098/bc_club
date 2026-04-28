// "use client";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import Map from "@arcgis/core/Map";
// import MapView from "@arcgis/core/views/MapView";
// import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
// import Graphic from "@arcgis/core/Graphic";
// import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
// import Point from "@arcgis/core/geometry/Point";
// import * as projection from "@arcgis/core/geometry/projection";
// import "@arcgis/core/assets/esri/themes/light/main.css";

// import {
//   useGetListings,
//   useGetMapZoomListings,
// } from "@/src/hooks/listing/useListingQueries";
// import { Images } from "@/src/app/exports";
// import { useListingStore } from "@/src/store/useListingStore";
// import {
//   FiPlus,
//   FiMinus,
//   FiMap,
//   FiNavigation,
//   FiMaximize,
//   FiLoader,
// } from "react-icons/fi";
// import { getOfficeName } from "@/src/utilities/utilities";
// import GetInTouch from "../getInTouch/GetInTouch";
// import MapTopFilterBar from "./MapTopFilterBar";
// import MapActiveFilters from "./MapActiveFilters";
// import MapSidebar from "./MapSidebar";
// import { usePathname } from "next/navigation";
// import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";

// export default function OpenStreetMapSearch() {
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const viewRef = useRef<MapView | null>(null);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [isSatellite, setIsSatellite] = useState(false);
//   const [sortBy, setSortBy] = useState("newest");
//   const [visibleProperties, setVisibleProperties] = useState<any[]>([]);
//   const pathName = usePathname();
//   const isWishlistPage = pathName === "/wishlist";

//   const [mapBounds, setMapBounds] = useState<{
//     north: number;
//     south: number;
//     east: number;
//     west: number;
//     zoom: number;
//   } | null>(null);
//   const [mapZoomVal, setMapZoomVal] = useState<number | null>(null);
//   const [fitBoundsDone, setFitBoundsDone] = useState(false);

//   const { getInstanceFilters, updateInstanceFilter, clearInstanceFilters } =
//     useListingStore();
//   const filters = getInstanceFilters("map");
//   const {
//     search = "",
//     location = "",
//     status = "forSale",
//     activeProperty = "any",
//     minPrice,
//     maxPrice,
//     minSqft,
//     maxSqft,
//     activeBedRoom,
//     activeBathRoom,
//   } = filters;

//   const { isLoggedIn, setOpenLogin } = useAuthContext();

//   const setActiveProperty = (val: string) =>
//     updateInstanceFilter("map", "activeProperty", val);

//   const setStatus = (val: string) => {
//     if ((val === "sold" || val === "expired") && !isLoggedIn) {
//       setOpenLogin(true);
//       return;
//     }
//     updateInstanceFilter("map", "status", val);
//   };

//   useEffect(() => {
//     setFitBoundsDone(false);
//   }, [
//     search,
//     location,
//     status,
//     activeProperty,
//     minPrice,
//     maxPrice,
//     minSqft,
//     maxSqft,
//     activeBedRoom,
//     activeBathRoom,
//   ]);

//   // Enforce restriction if status is set externally
//   useEffect(() => {
//     if ((status === "sold" || status === "expired") && !isLoggedIn) {
//       updateInstanceFilter("map", "status", "forSale");
//       setOpenLogin(true);
//     }
//   }, [status, isLoggedIn, updateInstanceFilter, setOpenLogin]);

//   const price: [number, number] = [minPrice ?? 1000, maxPrice ?? 20000000];
//   const setPrice = (val: [number, number]) => {
//     updateInstanceFilter("map", "minPrice", val[0]);
//     updateInstanceFilter("map", "maxPrice", val[1]);
//   };

//   const setActiveBedRoom = (val: string) =>
//     updateInstanceFilter("map", "activeBedRoom", val);
//   const setActiveBathRoom = (val: string) =>
//     updateInstanceFilter("map", "activeBathRoom", val);

//   const setLocation = (val: string) =>
//     updateInstanceFilter("map", "location", val);

//   const sqft: [number, number] = [minSqft ?? 100, maxSqft ?? 15000];
//   const setSqft = (val: [number, number]) => {
//     updateInstanceFilter("map", "minSqft", val[0]);
//     updateInstanceFilter("map", "maxSqft", val[1]);
//   };

//   const resetAllFilters = () => {
//     clearInstanceFilters("map");
//     setSortBy("newest");
//   };

//   const activeFilterPills: { label: string; onRemove: () => void }[] = [];
//   if (status && status !== "forSale") {
//     const statusLabel = status === "sold" ? "Sold" : status === "expired" ? "Expired" : status;
//     activeFilterPills.push({ label: `Status: ${statusLabel}`, onRemove: () => updateInstanceFilter("map", "status", "forSale") });
//   }
//   if (location) activeFilterPills.push({ label: `Location: ${location}`, onRemove: () => updateInstanceFilter("map", "location", "") });
//   if (minPrice && minPrice > 1000) activeFilterPills.push({ label: `Min Price: $${Number(minPrice).toLocaleString()}`, onRemove: () => updateInstanceFilter("map", "minPrice", 1000) });
//   if (maxPrice && maxPrice < 20000000) activeFilterPills.push({ label: `Max Price: $${Number(maxPrice).toLocaleString()}`, onRemove: () => updateInstanceFilter("map", "maxPrice", 20000000) });

//   const hasActiveFilters = activeFilterPills.length > 0;

//   const mapZoomParams = useMemo(() => {
//     const p: any = {};
//     if (mapBounds) {
//       p.north = mapBounds.north;
//       p.south = mapBounds.south;
//       p.east = mapBounds.east;
//       p.west = mapBounds.west;
//       if (mapZoomVal !== null) p.zoom = mapZoomVal;
//     }
//     return p;
//   }, [mapBounds, mapZoomVal]);

//   const { data: queryData, isLoading, isFetching } = useGetMapZoomListings(mapZoomParams, {
//     enabled: !!mapBounds,
//     select: (res: any) => {
//       const listings = res?.data || [];
//       return listings.map((listing: any) => ({
//         id: listing.documentId || listing.id?.toString(),
//         image: typeof listing?.media_url === "string" ? listing.media_url : (Array.isArray(listing?.media_url) ? listing.media_url[0] : listing?.media?.[0]?.MediaURL),
//         title: listing?.property_sub_type || "Property",
//         price: Number(listing?.price) || 0,
//         address: listing?.address || listing?.city || "",
//         sqft: listing?.area || 0,
//         beds: listing?.bedrooms || 0,
//         baths: listing?.bathrooms || 0,
//         longitude: Number(listing?.longitude),
//         latitude: Number(listing?.latitude),
//         isDdf: true,
//       })).filter((l: any) => !isNaN(l.longitude) && !isNaN(l.latitude) && l.longitude !== 0);
//     }
//   });

//   const properties = queryData || [];

//   // Initialize ArcGIS Map
//   useEffect(() => {
//     if (!mapContainerRef.current) return;

//     const map = new Map({
//       basemap: "osm", // OpenStreetMap basemap
//     });

//     const view = new MapView({
//       container: mapContainerRef.current,
//       map: map,
//       center: [-123.1207, 49.2827],
//       zoom: 10,
//     });

//     // Add the specific layer provided by the user
//     const bcLayer = new FeatureLayer({
//       portalItem: {
//         id: "ce7fd87476b54100a3b158c9dae7e9b7",
//       },
//     });
//     map.add(bcLayer);

//     const graphicsLayer = new GraphicsLayer();
//     map.add(graphicsLayer);

//     view.when(() => {
//       setMapLoaded(true);
//       viewRef.current = view;

//       view.on("stationary", () => {
//         const extent = view.extent;
//         if (extent) {
//           // ArcGIS extent is usually in Web Mercator, we might need to project to geographic for the API
//           // But useGetMapZoomListings expects geographic north/south/east/west
//           const north = extent.ymax;
//           const south = extent.ymin;
//           const east = extent.xmax;
//           const west = extent.xmin;

//           // Simple approximation if not already projected
//           setMapBounds({ north, south, east, west, zoom: Math.round(view.zoom) });
//           setMapZoomVal(Math.round(view.zoom));
//         }
//       });
//     });

//     return () => {
//       if (view) view.destroy();
//     };
//   }, []);

//   // Update Markers
//   useEffect(() => {
//     if (!viewRef.current || !properties.length) return;
//     const view = viewRef.current;
//     const graphicsLayer = view.map.layers.find((l) => l.type === "graphics") as GraphicsLayer;
//     if (!graphicsLayer) return;

//     graphicsLayer.removeAll();

//     properties.forEach((p) => {
//       const point = new Point({
//         longitude: p.longitude,
//         latitude: p.latitude,
//       });

//       const graphic = new Graphic({
//         geometry: point,
//         symbol: {
//           type: "simple-marker",
//           color: "#305487",
//           outline: { color: "white", width: 2 },
//           size: 10,
//         } as any,
//         attributes: p,
//         popupTemplate: {
//           title: "{title}",
//           content: `
//             <div style="font-family: sans-serif;">
//               <img src="{image}" style="width: 100%; border-radius: 8px;" />
//               <p><b>Price:</b> $${p.price.toLocaleString()}</p>
//               <p><b>Address:</b> ${p.address}</p>
//               <a href="/property-info/${p.id}" style="color: #305487; font-weight: bold;">View Details</a>
//             </div>
//           `,
//         },
//       });
//       graphicsLayer.add(graphic);
//     });

//     // Update visible properties
//     const visible = properties.filter(p => {
//         const extent = view.extent;
//         return p.longitude >= extent.xmin && p.longitude <= extent.xmax &&
//                p.latitude >= extent.ymin && p.latitude <= extent.ymax;
//     });
//     setVisibleProperties(visible);

//   }, [properties, mapLoaded]);

//   const toggleMapStyle = () => {
//     if (!viewRef.current) return;
//     const view = viewRef.current;
//     if (isSatellite) {
//       view.map.basemap = "osm" as any;
//       setIsSatellite(false);
//     } else {
//       view.map.basemap = "satellite" as any;
//       setIsSatellite(true);
//     }
//   };

//   const handleGeolocation = () => {
//     navigator.geolocation.getCurrentPosition((pos) => {
//       viewRef.current?.goTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 15 });
//     });
//   };

//   const handleFitBounds = () => {
//     if (!viewRef.current || !properties.length) return;
//     const geometries = properties.map(p => new Point({ longitude: p.longitude, latitude: p.latitude }));
//     viewRef.current.goTo(geometries);
//   };

//   return (
//     <div className="w-full h-screen flex flex-col bg-white overflow-hidden mt-20">
//       <MapTopFilterBar
//         status={status} setStatus={setStatus}
//         price={price} setPrice={setPrice}
//         sqft={sqft} setSqft={setSqft}
//         activeBedRoom={activeBedRoom} setActiveBedRoom={setActiveBedRoom}
//         activeBathRoom={activeBathRoom} setActiveBathRoom={setActiveBathRoom}
//         activeProperty={activeProperty} setActiveProperty={setActiveProperty}
//         location={location} setLocation={setLocation}
//         pillBase="pl-4 pr-2 py-3 bg-white rounded-[10px] appearance-none font-medium cursor-pointer border transition w-full"
//         pillActive="border-primary text-primary ring-1 ring-blue-200"
//         pillInactive="border-[#30548733] text-gray-800"
//       />

//       <MapActiveFilters
//         hasActiveFilters={hasActiveFilters}
//         activeFilterPills={activeFilterPills}
//         resetAllFilters={resetAllFilters}
//       />

//       <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
//         <MapSidebar
//           isLoading={isLoading || isFetching}
//           visibleProperties={visibleProperties.length ? visibleProperties : properties}
//           properties={properties}
//           isLoggedIn={isLoggedIn}
//           status={status}
//         />

//         <div className="hidden md:block flex-1 relative z-10">
//           <div ref={mapContainerRef} className="w-full h-full" />

//           {(isLoading || isFetching) && (
//             <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-20 pointer-events-none flex items-start justify-center pt-10">
//               <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-2">
//                 <FiLoader className="animate-spin text-primary" />
//                 <span className="text-xs font-bold text-gray-600">Updating Map...</span>
//               </div>
//             </div>
//           )}

//           <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
//             <div className="flex flex-col bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
//               <button className="p-2.5 border-b hover:bg-gray-50" onClick={() => viewRef.current && (viewRef.current.zoom += 1)}><FiPlus className="w-5 h-5 text-gray-600" /></button>
//               <button className="p-2.5 hover:bg-gray-50" onClick={() => viewRef.current && (viewRef.current.zoom -= 1)}><FiMinus className="w-5 h-5 text-gray-600" /></button>
//             </div>
//             <button onClick={toggleMapStyle} className={`p-2.5 rounded-md shadow-lg border transition-colors ${isSatellite ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}><FiMap className="w-5 h-5" /></button>
//             <button onClick={handleGeolocation} className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"><FiNavigation className="w-5 h-5 text-gray-600" /></button>
//             <button onClick={handleFitBounds} className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"><FiMaximize className="w-5 h-5 text-gray-600" /></button>
//           </div>
//         </div>
//       </div>
//       <GetInTouch />
//     </div>
//   );
// }
