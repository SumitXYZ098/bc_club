export const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export const defaultCenter = {
  lat: 49.2827,
  lng: -123.1207,
};

export const GOOGLE_MAP_LIBRARIES: (
  | "places"
  | "maps"
  | "geocoding"
  | "geometry"
)[] = ["places", "maps", "geocoding", "geometry"];

export const mapOptions = {
  hash: false,
  disableDefaultUI: false,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  minZoom: 6,
  maxZoom: 20,
  gestureHandling: "greedy",
  mapId:
    process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
  mapTypeId: "roadmap",
  tilt: 0,
};

export const cityCoords: Record<string, { lat: number; lng: number }> = {
  Vancouver: { lat: 49.2827, lng: -123.1207 },
  Burnaby: { lat: 49.2488, lng: -122.9805 },
  Surrey: { lat: 49.1913, lng: -122.849 },
  Richmond: { lat: 49.1666, lng: -123.1336 },
  Coquitlam: { lat: 49.2838, lng: -122.7722 },
  Victoria: { lat: 48.4284, lng: -123.3656 },
  Kelowna: { lat: 49.888, lng: -119.496 },
  Abbotsford: { lat: 49.0504, lng: -122.3275 },
  "White Rock": { lat: 49.025, lng: -122.8028 },
  Nanaimo: { lat: 49.1659, lng: -123.9401 },
  "New Westminster": { lat: 49.2057, lng: -122.911 },
  "North Vancouver": { lat: 49.32, lng: -123.0724 },
  "West Vancouver": { lat: 49.3667, lng: -123.1667 },
  Langley: { lat: 49.1042, lng: -122.6578 },
  Delta: { lat: 49.0847, lng: -123.0583 },
  "Maple Ridge": { lat: 49.2194, lng: -122.6011 },
  Chilliwack: { lat: 49.1573, lng: -121.9515 },
};
