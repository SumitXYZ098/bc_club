"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import PropertiesCard, {
  PropertyCardProps,
} from "@/src/components/common/propertiesCard/PropertiesCard";
import { useGetListings } from "@/src/hooks/listing/useListingQueries";
import { Images } from "@/src/app/exports";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";

// Function definition remains the same
function createPriceMarker(property: any) {
  const el = document.createElement("div");
  el.className =
    "price-marker bg-white px-2 py-1 rounded-full shadow-md border border-primary text-primary font-bold text-xs cursor-pointer hover:bg-primary hover:text-white transition-all";
  el.innerText = `$${property.price ? Number(property.price).toLocaleString() : "..."}`;
  return el;
}

export default function Maps() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [visibleProperties, setVisibleProperties] = useState<any[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // useGetListings hook remains unchanged
  const { data: queryData, isLoading } = useGetListings(
    {
      "pagination[page]": 1,
      "pagination[pageSize]": 100,
    },
    {
      select: (res: any) => {
        const listings = res?.data || [];
        return listings
          .map((listing: any) => ({
            id: listing.documentId || Math.random().toString(),
            image: typeof listing?.media?.[0] === "string" ? listing.media[0] : listing?.media?.[0]?.MediaURL,
            title: listing?.property_sub_type || "Property",
            price: listing?.price || 0,
            daysAgo: listing?.raw_data?.OriginalEntryTimestamp ?? 0,
            address: listing?.address
              ? `${listing?.address}, ${listing?.city || ""}, ${listing?.state || ""}`
              : `${listing?.city || ""}, ${listing?.state || ""}` || "",
            sqft: listing?.area ?? 0,
            beds: listing?.bedrooms ?? 0,
            baths: listing?.bathrooms ?? 0,
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
            mls: listing?.mls_number || "N/A",
            realtor:
              listing?.office_data?.OfficeName ||
              listing?.raw_data?.ListAOR ||
              "Unknown",
            isLogin: true,
            isFavourite: listing?.is_favorite || false,
            longitude: Number(listing.longitude),
            latitude: Number(listing.latitude),
          }))
          .filter((l: any) => !isNaN(l.longitude) && !isNaN(l.latitude) && Number(l.price) > 0);
      },
    },
  );

  const properties = queryData || [];

  // Map initialization remains unchanged
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-122.89, 49.28],
      zoom: 8,
      style: "mapbox://styles/bcrealestate/cmj8gyj7g000k01sagq9ad6bv",
    });

    map.on("load", () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update effect to adjust popup content
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !properties.length) return;
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    let hasCentered = false;

    properties.forEach((property: any) => {
      const lng = property.longitude;
      const lat = property.latitude;

      const markerEl = createPriceMarker(property);
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: true,
          }).setHTML(
            `<a href="/property-info/${property.id}" style="text-decoration: none; color: inherit; display: block; width: 220px; font-family: 'Inter', sans-serif;">
              <div style="overflow: hidden;">
                <div style="width: 100%; height: 130px; overflow: hidden; border-radius: 8px;">
                  <img src="${property.image}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div style="padding: 12px 2px 4px 2px; display: flex; flex-direction: column; gap: 4px;">
                  <h3 style="margin: 0; color: #305487; font-size: 18px; font-weight: 700;">$${Number(property.price).toLocaleString()}</h3>
                  <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${property.title}</p>
                  <p style="margin: 0; font-size: 12px; color: #6e6e6e; line-height: 1.4; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${property.address}</p>
                </div>
              </div>
            </a>`,
          ),
        )
        .addTo(map);

      markersRef.current.push(marker);

      if (!hasCentered) {
        map.setCenter([lng, lat]);
        hasCentered = true;
      }
    });

    // Visibility filtering logic remains unchanged
    const updateVisibleProperties = () => {
      const bounds = map.getBounds();
      if (!bounds) return;
      const visible = properties.filter((p: any) => {
        return bounds.contains([p.longitude, p.latitude]);
      });
      setVisibleProperties(visible);
    };

    map.on("move", updateVisibleProperties);
    map.on("zoom", updateVisibleProperties);
    updateVisibleProperties();

    return () => {
      map.off("move", updateVisibleProperties);
      map.off("zoom", updateVisibleProperties);
    };
  }, [mapLoaded, properties]);

  // Minor layout fixes applied to the sidebar width and grid gap
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 xl:px-10 mx-auto xl:max-w-480">
      <h1 className="text-4xl font-bold text-primary mb-2">Interactive Map</h1>
      <p className="text-gray-500 mb-8">
        Pan and zoom the map to instantly filter properties in view.
      </p>

      <div className="flex flex-col xl:flex-row justify-between items-start w-full gap-6">
        {/* Left Side: Map Container (Layout Fixed to 70%) */}
        <div className="h-[75svh] w-full xl:w-[70%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative shrink-0">
          <div ref={mapContainerRef} className="w-full h-full bg-slate-100" />
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-primary font-bold text-xl animate-pulse">
                Loading Map Data...
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Sidebar (Layout Fixed to 30%) */}
        <div className="xl:w-[30%] w-full flex flex-col h-[75svh]">
          {/* Right Side Title and Blue Line */}
          <div className="mb-4 flex flex-col gap-2 shrink-0 px-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xl text-primary">
                {visibleProperties.length} Properties
              </span>
            </div>
            <LineGradient customClasses="bg-gradient-to-r from-blue-400 to-blue-700 h-[2px] w-full" />
          </div>

          {/* List with fixed single-column grid, adjusted gap */}
          <div className="gap-5 grid grid-cols-1 overflow-y-auto no-scrollbar w-full p-1 scroll-smooth">
            {visibleProperties.map((property: any) => (
              <div key={property.id} className="w-full h-full">
                <PropertiesCard {...property} />
              </div>
            ))}

            {visibleProperties.length === 0 && !isLoading && (
              <div className="col-span-full h-40 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl mt-4 text-center px-4">
                <span className="text-lg font-semibold text-gray-400">
                  No properties found.
                </span>
                <span className="text-sm">
                  Try zooming out or moving the map.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}