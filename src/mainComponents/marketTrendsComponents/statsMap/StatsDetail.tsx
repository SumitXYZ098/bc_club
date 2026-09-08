"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import CityStatsPopup from "@/src/mainComponents/home/CityStatsPopup";
import { REGION_COORDINATES, RegionCoordinate } from "..";

interface ActiveRegion {
  name: string;
  coordinates: [number, number];
}

const StatsDetail: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [activeRegion, setActiveRegion] = useState<ActiveRegion | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
  }>({});

  const activeRegionRef = useRef<ActiveRegion | null>(null);
  activeRegionRef.current = activeRegion;

  // Calculate popup position near the active marker, clamped safely within container
  const updatePopupPos = useCallback((coords: [number, number]) => {
    if (!mapRef.current || !mapContainerRef.current) return;
    const point = mapRef.current.project(coords);
    const container = mapContainerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const popupWidth = Math.min(445, containerWidth - 24);
    const popupHeight = 490; // estimated popup height

    // Horizontal placement: prefer right, fallback to left or center
    let left: number;
    if (point.x + popupWidth + 24 <= containerWidth) {
      left = point.x + 16;
    } else if (point.x - popupWidth - 24 >= 0) {
      left = point.x - popupWidth - 16;
    } else {
      left = Math.max(12, (containerWidth - popupWidth) / 2);
    }

    // Vertical placement: align slightly above marker, clamped safely inside container
    let top = point.y - 120;
    top = Math.max(12, Math.min(containerHeight - popupHeight - 12, top));

    setPopupPosition({
      top: `${top}px`,
      left: `${left}px`,
    });
  }, []);

  const handleMarkerClick = useCallback(
    (region: string, coords: [number, number]) => {
      // Toggle if clicking the active region, or switch to selected region
      setActiveRegion((prev) => {
        if (prev?.name === region) {
          return null; // Close if clicked again
        }
        return { name: region, coordinates: coords };
      });
      updatePopupPos(coords);
    },
    [updatePopupPos]
  );

  const handleClosePopup = useCallback(() => {
    setActiveRegion(null);
  }, []);

  // Stable handlers ref for Mapbox event listeners
  const handlersRef = useRef({
    handleMarkerClick,
  });
  handlersRef.current = {
    handleMarkerClick,
  };

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error("Mapbox token missing");
      return;
    }

    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-122.6, 49.35],
      zoom: 11,
      minZoom: 7,
      maxZoom: 13,
    });

    // Add navigation controls (zoom, compass)
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: true }),
      "bottom-right"
    );

    map.on("load", () => {
      map.resize();

      // Fit map bounds to cover all 41 regions
      const bounds = new mapboxgl.LngLatBounds();
      REGION_COORDINATES.forEach((c) => {
        bounds.extend([c.longitude, c.latitude]);
      });
      map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        minZoom: 8,
        maxZoom: 11,
        duration: 800,
      });

      // Clear any prior markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add markers displaying the region/location name on click
      REGION_COORDINATES.forEach((item: RegionCoordinate) => {
        const markerEl = document.createElement("div");
        markerEl.className =
          "region-map-marker group flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-gray-800 border border-[#E6EAEE] shadow-md hover:shadow-lg hover:border-primary cursor-pointer transition-all duration-200 select-none whitespace-nowrap";
        markerEl.setAttribute("data-region", item.region);

        markerEl.innerHTML = `
          <span class="marker-dot w-2 h-2 rounded-full bg-[#EEA500] shrink-0 transition-colors"></span>
          <span class="marker-text text-xs font-semibold tracking-tight text-gray-800 transition-colors">${item.region}</span>
        `;

        const coords: [number, number] = [item.longitude, item.latitude];

        markerEl.addEventListener("click", (e) => {
          e.stopPropagation();
          handlersRef.current.handleMarkerClick(item.region, coords);
        });

        const marker = new mapboxgl.Marker({ element: markerEl })
          .setLngLat(coords)
          .addTo(map);

        markersRef.current.push(marker);
      });
    });

    // Update popup position when panning/zooming map
    map.on("move", () => {
      if (activeRegionRef.current) {
        updatePopupPos(activeRegionRef.current.coordinates);
      }
    });

    // Close popup on map click (outside markers and outside popup)
    map.on("click", (e) => {
      const target = e.originalEvent.target as HTMLElement | null;
      if (
        !target?.closest(".region-map-marker") &&
        !target?.closest(".city-stats-popup-container")
      ) {
        handleClosePopup();
      }
    });

    // ResizeObserver to ensure map canvas fits container
    const ro = new ResizeObserver(() => {
      map.resize();
    });
    if (mapContainerRef.current) {
      ro.observe(mapContainerRef.current);
    }

    mapRef.current = map;

    return () => {
      ro.disconnect();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [updatePopupPos, handleClosePopup]);

  // Highlight active marker visually when selected
  useEffect(() => {
    const markerEls =
      document.querySelectorAll<HTMLElement>(".region-map-marker");
    markerEls.forEach((el) => {
      const region = el.getAttribute("data-region");
      const dot = el.querySelector<HTMLElement>(".marker-dot");
      const text = el.querySelector<HTMLElement>(".marker-text");

      if (region === activeRegion?.name) {
        el.classList.add(
          "bg-[#22558b]",
          "text-white",
          "border-[#22558b]",
          "ring-2",
          "ring-primary/40",
          "shadow-xl",
          "scale-105"
        );
        el.classList.remove("bg-white", "text-gray-800", "border-[#E6EAEE]");
        if (dot) dot.classList.replace("bg-[#EEA500]", "bg-white");
        if (text) text.classList.replace("text-gray-800", "text-white");
        el.style.zIndex = "50";
      } else {
        el.classList.remove(
          "bg-[#22558b]",
          "text-white",
          "border-[#22558b]",
          "ring-2",
          "ring-primary/40",
          "shadow-xl",
          "scale-105"
        );
        el.classList.add("bg-white", "text-gray-800", "border-[#E6EAEE]");
        if (dot) dot.classList.replace("bg-white", "bg-[#EEA500]");
        if (text) text.classList.replace("text-white", "text-gray-800");
        el.style.zIndex = "1";
      }
    });
  }, [activeRegion]);

  return (
    <div className="relative w-full h-[620px] lg:h-[550px] rounded-xl overflow-hidden bg-gray-100">
      {/* Mapbox Canvas */}
      <div ref={mapContainerRef} className="w-full h-full rounded-xl" />

      {/* City Stats Popup */}
      <div className="city-stats-popup-container">
        <CityStatsPopup
          city={activeRegion?.name || ""}
          isVisible={!!activeRegion}
          position={popupPosition}
          customClasses="flex"
          onClose={handleClosePopup}
        />
      </div>
    </div>
  );
};

export default StatsDetail;
