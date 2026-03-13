"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Images } from "@/src/app/exports";

interface SimpleMapProps {
  center?: [number, number];
  zoom?: number;
  locations?: any[];
}

function createPriceMarker(property: any) {
  const el = document.createElement("div");
  el.className = "price-marker";
  el.innerText = `$${property.price.toLocaleString()}`;
  return el;
}

const PropertiesMap: React.FC<SimpleMapProps> = ({
  center = [-123.13, 49.28],
  zoom = 7,
  locations = [],
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center,
      zoom,
      style: "mapbox://styles/bcrealestate/cmj8gyj7g000k01sagq9ad6bv",
    });

    map.on("load", () => {
      locations.forEach((property) => {
        const lng = Number(property.longitude);
        const lat = Number(property.latitude);

        if (isNaN(lng) || isNaN(lat)) return;

        const markerEl = createPriceMarker(property);

        new mapboxgl.Marker(markerEl)
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({
              offset: 25,
              closeButton: false,
              closeOnClick: true,
            })
              .setHTML(`<a href="/property-info/${property?.documentId}"><div class="property-card">
        <img src="${property?.media?.[0]?.MediaURL || Images.apartment}" class="property-image"/>

        <div class="property-content">
         <h3 class="price">$${property?.price.toLocaleString()}</h3>
         <span class="type">${property?.property_sub_type}</span>
          <p>${
            property?.address
              ? `${property?.address}`
              : `${property?.city}, ${property?.state}`
          }</p>
          <div class="combine"><span class="mls"><strong>MLS® ${property?.mls_number}</strong></span>
          <span class="aor"><strong>${property?.raw_data?.ListAOR || "Unknown"}</strong></span>
          </div>
        </div>
      </div></a>`),
          )
          .addTo(map);
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom, locations]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-3xl" />;
};

export default PropertiesMap;
