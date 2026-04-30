"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import Supercluster from "supercluster";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 49.2827,
  lng: -123.1207,
};

// 🔥 Convert lat/lng → tile
function latLngToTile(lat: number, lng: number, zoom: number) {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom),
  );

  return { x, y };
}

export default function GoogleSearchMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const tileCache = useRef<Map<string, any[]>>(new Map());
  const superclusterRef = useRef<any>(null);
  const [clusters, setClusters] = useState<any[]>([]);

  const fetchTile = async (z: number, x: number, y: number) => {
    const key = `${z}-${x}-${y}`;

    if (tileCache.current.has(key)) {
      return tileCache.current.get(key);
    }

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/map/tiles/${z}/${x}/${y}`,
    );

    tileCache.current.set(key, res.data);

    return res.data;
  };

  const loadTiles = useCallback(async () => {
    if (!map) return;

    const zoom = Math.floor(map.getZoom() || 10);
    const bounds = map.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const tileNE = latLngToTile(ne.lat(), ne.lng(), zoom);
    const tileSW = latLngToTile(sw.lat(), sw.lng(), zoom);

    let results: any[] = [];

    for (let x = tileSW.x; x <= tileNE.x; x++) {
      for (let y = tileNE.y; y <= tileSW.y; y++) {
        const tileData = await fetchTile(zoom, x, y);
        if (tileData && tileData.data) {
          results = [...results, ...tileData.data];
        }
      }
    }

    setProperties(results);
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const listener = map.addListener("idle", () => {
      loadTiles();
    });

    return () => listener.remove();
  }, [map, loadTiles]);

  // clustering
  useEffect(() => {
    if (!properties.length) return;

    const points = properties.map((p) => ({
      type: "Feature" as const,
      properties: { cluster: false, data: p },
      geometry: {
        type: "Point" as const,
        coordinates: [Number(p.longitude), Number(p.latitude)],
      },
    }));

    const sc = new Supercluster({ radius: 60, maxZoom: 20 });
    sc.load(points);

    superclusterRef.current = sc;

    if (map) {
      const zoom = Math.floor(map.getZoom() || 10);
      const bounds = map.getBounds();
      if (!bounds) return;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const clusters = sc.getClusters(
        [sw.lng(), sw.lat(), ne.lng(), ne.lat()],
        zoom,
      );

      setClusters(clusters);
    }
  }, [properties, map]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="mt-40 w-full h-screen">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={11}
        onLoad={(map) => setMap(map)}
      >
        {clusters.map((c: any) => {
          const [lng, lat] = c.geometry.coordinates;

          if (c.properties.cluster) {
            return (
              <OverlayView
                key={c.id}
                position={{ lat, lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div className="bg-blue-500 text-white rounded-full p-2">
                  {c.properties.point_count}
                </div>
              </OverlayView>
            );
          }

          return (
            <OverlayView
              key={c.properties.data.id}
              position={{ lat, lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="bg-white px-2 py-1 rounded shadow">
                ${c.properties.data.price}
              </div>
            </OverlayView>
          );
        })}
      </GoogleMap>
    </div>
  );
}
