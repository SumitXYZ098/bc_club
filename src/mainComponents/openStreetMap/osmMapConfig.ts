export const OpenStreetMapDefaultCenter: [number, number] = [
  49.2827, -123.1207,
];

export const cityCoords: Record<string, [number, number]> = {
  Vancouver: [49.2827, -123.1207],
  Burnaby: [49.2488, -122.9805],
  Surrey: [49.1913, -122.849],
  Richmond: [49.1666, -123.1336],
  Coquitlam: [49.2838, -122.7722],
  Victoria: [48.4284, -123.3656],
  Kelowna: [49.888, -119.496],
  Abbotsford: [49.0504, -122.3275],
  "White Rock": [49.025, -122.8028],
  Nanaimo: [49.1659, -123.9401],
  "New Westminster": [49.2057, -122.911],
  "North Vancouver": [49.32, -123.0724],
  "West Vancouver": [49.3667, -123.1667],
  Langley: [49.1042, -122.6578],
  Delta: [49.0847, -123.0583],
  "Maple Ridge": [49.2194, -122.6011],
  Chilliwack: [49.1573, -121.9515],
  "Prince George": [53.917065, -122.749672],
};

export const OpenStreetMapRoadmapTile = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    "<a href='https://www.maptiler.com/copyright/' target='_blank'>&copy; MapTiler</a> <a href='https://www.openstreetmap.org/copyright' target='_blank'>&copy; OpenStreetMap contributors</a>",
  maxNativeZoom: 19,
};

export const OpenStreetMapSatelliteTile = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  attribution: "Tiles &copy; Esri",
  maxNativeZoom: 18,
};
