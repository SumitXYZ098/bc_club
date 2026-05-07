"use client";

import { useEffect } from "react";

export default function GeoJsonLayer({
  data,
  map,
}: {
  data: any;
  map: google.maps.Map | null;
}) {
  useEffect(() => {
    if (!map || !data) return;

    // clear old parcels
    map.data.forEach((feature) => {
      map.data.remove(feature);
    });

    // add new parcels
    map.data.addGeoJson(data);

    // style parcels
    map.data.setStyle({
      fillColor: "#22558b",
      fillOpacity: 0.08,
      strokeColor: "#22558b",
      strokeWeight: 1,
      clickable: false,
    });

    return () => {
      map.data.forEach((feature) => {
        map.data.remove(feature);
      });
    };
  }, [map, data]);

  return null;
}
