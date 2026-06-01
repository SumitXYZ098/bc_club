import L from "leaflet";

export type LatLngPoint = { lat: number; lng: number };

export const toLeafletLatLng = (point: LatLngPoint): [number, number] => [
  Number(point.lat),
  Number(point.lng),
];

export const getBoundsPayload = (map: L.Map) => {
  const bounds = map.getBounds();
  const zoom = map.getZoom();

  return {
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest(),
    zoom,
  };
};

export const boundsKey = (bounds: any) =>
  JSON.stringify({
    north: Number(bounds.north).toFixed(6),
    south: Number(bounds.south).toFixed(6),
    east: Number(bounds.east).toFixed(6),
    west: Number(bounds.west).toFixed(6),
    zoom: Math.round(Number(bounds.zoom)),
  });

export const getClusterRadius = (zoom: number) => {
  if (zoom >= 16) return 50;
  if (zoom >= 14) return 255;
  if (zoom >= 12) return 270;
  if (zoom >= 10) return 300;
  return 340;
};

export const formatMeter = (meter: number) => {
  const feet = meter * 3.28084;

  if (meter >= 1000) {
    return `${(meter / 1000).toFixed(1)} km • ${(feet / 5280).toFixed(1)} mi`;
  }

  return `${meter.toFixed(1)} m • ${feet.toFixed(1)} ft`;
};

export const getDistanceBetweenPoints = (
  start: LatLngPoint,
  end: LatLngPoint,
) => {
  return L.latLng(start.lat, start.lng).distanceTo(L.latLng(end.lat, end.lng));
};

export const getMiddlePoint = (start: LatLngPoint, end: LatLngPoint) => ({
  lat: (start.lat + end.lat) / 2,
  lng: (start.lng + end.lng) / 2,
});

export const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
