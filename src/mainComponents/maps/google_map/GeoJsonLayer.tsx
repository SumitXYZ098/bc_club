"use client";

import { useEffect } from "react";

type PropertyType = {
  latitude: number;
  longitude: number;
};

export default function GeoJsonLayer({
  data,
  map,
  properties = [],
}: {
  data: any;
  map: google.maps.Map | null;
  properties?: PropertyType[];
}) {
  useEffect(() => {
    if (!map || !data) return;

    // Clear old parcels
    map.data.forEach((feature) => {
      map.data.remove(feature);
    });

    // Add GeoJSON
    map.data.addGeoJson(data);

    // Check if point inside bounds
    const hasPropertyInside = (feature: google.maps.Data.Feature): boolean => {
      const geometry = feature.getGeometry();

      if (!geometry) return false;

      let bounds = new google.maps.LatLngBounds();

      geometry.forEachLatLng((latLng) => {
        bounds.extend(latLng);
      });

      return properties.some((property) => {
        const lat = Number(property.latitude);
        const lng = Number(property.longitude);

        if (!lat || !lng) return false;

        return bounds.contains(new google.maps.LatLng(lat, lng));
      });
    };

    // Style
    map.data.setStyle((feature) => {
      const active = hasPropertyInside(feature);

      return {
        fillColor: active ? "#22558b" : "#eea500",
        fillOpacity: active ? 0.18 : 0.08,
        strokeColor: active ? "#22558b" : "#eea500",
        strokeWeight: active ? 1 : 2,
        clickable: false,
      };
    });

    return () => {
      map.data.forEach((feature) => {
        map.data.remove(feature);
      });
    };
  }, [map, data, properties]);

  return null;
}
