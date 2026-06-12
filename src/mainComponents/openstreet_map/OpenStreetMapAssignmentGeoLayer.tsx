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

export default function OpenStreetMapAssignmentGeoLayer({
  map,
  data = [],
  zoomVal,
}: {
  map: L.Map | null;
  data: AssignmentGeoItem[];
  zoomVal: number | null;
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

      const price = Number(item.price || 0).toLocaleString();

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

          polygon.bindTooltip(item.address || "Assessment Property", {
            direction: "top",
            sticky: true,
          });

          polygon.openTooltip();
        });

        polygon.on("mouseout", () => {
          polygon.setStyle({
            weight: 1.5,
            color: "#30548700",
            fillColor: "#30548700",
            fillOpacity: 0.12,
          });

          polygon.closeTooltip();
        });

        polygon.on("click", () => {
          polygon.openPopup();
        });

        polygon.bindPopup(
          `
    <div
      style="
        width:240px;
        cursor:pointer;
        font-family:Plus Jakarta Display, sans-serif;
      "
      onclick="window.location.href='/property-assessment/${item.documentId}'"
    >
      <h3 style="
        margin:0;
        color:#305487;
        font-size:18px;
        font-weight:700;
      ">
        $${Number(item.price || 0).toLocaleString()}
      </h3>

      <p style="
        margin:6px 0 0;
        font-size:12px;
        color:#6e6e6e;
      ">
        ${item.address || ""}
      </p>

      <p style="
        margin:6px 0 0;
        font-size:11px;
        color:#999;
      ">
        ${item.roll || ""}
      </p>
    </div>
  `,
          {
            maxWidth: 260,
            autoPan: true,
          },
        );

        polygon.addTo(layerGroup);
      });
    });

    geoLayerRef.current = layerGroup;

    return () => {
      layerGroup.remove();
      geoLayerRef.current = null;
    };
  }, [map, data, zoomVal]);

  return null;
}
