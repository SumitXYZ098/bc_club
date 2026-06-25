"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

type AssignmentGeoItem = {
  documentId: string;
  roll?: string;
  address?: string;
  price?: number | string;
  latitude?: number | string;
  longitude?: number | string;
  coordinates?: number[][][];
};

export default function OpenStreetMapAssignmentGeoLayer
({
  map,
  data = [],
  zoomVal,
  onSelectProperty,
}: {
  map: L.Map | null;
  data: AssignmentGeoItem[];
  zoomVal: number | null;
  onSelectProperty?: (property: AssignmentGeoItem) => void;
}) {
  const geoLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    if (geoLayerRef.current) {
      geoLayerRef.current.remove();
      geoLayerRef.current = null;
    }

    if (!data.length || !zoomVal || zoomVal <= 14) return;

    const layerGroup = L.layerGroup().addTo(map);

    data.forEach((item) => {
      if (!item.coordinates?.length) return;

      item.coordinates.forEach((ring) => {
        const latLngs = ring
          .map(([lng, lat]) => [Number(lat), Number(lng)] as [number, number])
          .filter(([lat, lng]) => !Number.isNaN(lat) && !Number.isNaN(lng));

        if (latLngs.length < 3) return;

        const polygon = L.polygon(latLngs, {
          color: "#30548700",
          weight: 1.5,
          fillColor: "#30548700",
          fillOpacity: 0.12,
        });

        polygon.on("mouseover", () => {
          polygon.setStyle({
            weight: 3,
            color: "#808080",
            fillColor: "#808080",
            fillOpacity: 0.55,
          });
        });

        polygon.on("mouseout", () => {
          polygon.setStyle({
            weight: 1.5,
            color: "#30548700",
            fillColor: "#30548700",
            fillOpacity: 0.12,
          });
        });

        polygon.on("click", () => {
          onSelectProperty?.(item);
        });

        polygon.addTo(layerGroup);
      });
    });

    geoLayerRef.current = layerGroup;

    return () => {
      layerGroup.remove();
      geoLayerRef.current = null;
    };
  }, [map, data, zoomVal, onSelectProperty]);

  return null;
}
