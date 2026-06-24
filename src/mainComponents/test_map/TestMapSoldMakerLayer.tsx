"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

type SoldListing = {
  documentId: string;
  listing_id?: string;
  mls_number?: string;
  property_sub_type?: string;
  property_type?: string;
  property_status?: string;
  latitude: number | string;
  longitude: number | string;
  price: number | string;
  bedrooms?: number;
  bathrooms?: number;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  Living_area?: number;
  area?: number;
  media_url?: string;
  sold_date?: string;
};

export default function TestMapSoldMakerLayer({
  map,
  soldListings = [],
  zoomVal,
}: {
  map: L.Map | null;
  soldListings: SoldListing[];
  zoomVal: number | null;
}) {
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!map || !soldListings.length || !zoomVal || zoomVal <= 15) return;

    soldListings.forEach((item) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);

      if (!lat || !lng || Number.isNaN(lat) || Number.isNaN(lng)) return;

      const soldYear = item.sold_date
        ? new Date(item.sold_date).getFullYear()
        : "";

      const price = Number(item.price || 0).toLocaleString();
      const image =
        item.media_url || "https://placehold.co/400x300?text=Property";
      const sqft = item.Living_area || item.area || 0;

      const icon = L.divIcon({
        className: "",
        html: `
          <div class="sold-marker flex items-center justify-center rounded-sm text-[#dc2626] bg-background hover:border border-[#dc2626] text-xs font-semibold text-nowrap shadow-md cursor-pointer w-fit px-1 py-0.5">
           Sold ${soldYear}
          </div>
        `,
        iconSize: [15, 15],
        iconAnchor: [7.5, 7.5],
      });

      const popupHtml = `
        <div
          style="
            width:260px;
            background:white;
            border-radius:6px;
            font-family:Plus Jakarta Display, sans-serif;
            cursor:pointer;
            padding:4px;
            position:relative;
          " onclick="window.open('/sold-property-info/${item.documentId}', '_blank')"
        >
          <div
            style="
              position:absolute;
              top:10px;
              left:10px;
              z-index:2;
              background:#dc2626;
              color:white;
              font-size:11px;
              font-weight:700;
              padding:4px 8px;
              border-radius:999px;
            "
          >
            SOLD ${soldYear}
          </div>

          <div
            style="
              width:100%;
              height:130px;
              overflow:hidden;
              border-radius:3px;
              background-color:#f1f5f9;
            "
          >
            <img
              src="${image}"
              alt="${item.address || "Sold Property"}"
              style="
                width:100%;
                height:100%;
                object-fit:cover;
              "
            />
          </div>

          <div
            style="
              padding:12px 2px 4px 2px;
              display:flex;
              flex-direction:column;
              gap:4px;
            "
          >
            <h3
              style="
                margin:0;
                color:#305487;
                font-size:18px;
                font-weight:700;
              "
            >
              $${price}
            </h3>

            <p
              style="
                margin:0;
                font-size:14px;
                font-weight:700;
                color:#333;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
              "
            >
              ${item.bedrooms || 0} Bed • ${item.bathrooms || 0} Bath • ${sqft} Sqft
            </p>

            <p
              style="
                margin:0;
                font-size:12px;
                color:#6e6e6e;
                line-height:1.4;
                font-weight:500;
              "
            >
              ${item.address || ""}
            </p>
          </div>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      marker.bindPopup(popupHtml, {
        closeButton: true,
        autoPan: true,
        maxWidth: 280,
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [map, soldListings, zoomVal]);

  return null;
}
