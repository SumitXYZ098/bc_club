import L from "leaflet";
import { Marker } from "react-leaflet";
import Supercluster from "supercluster";
import { escapeHtml } from "./osmUtils";
import { formatPriceAbbreviated } from "../maps/mapUtils";

const getStatusColor = (status: string) =>
  status === "sold" ? "#ef4444" : status === "expired" ? "#3b82f6" : "#22c55e";

const structureIconSvg = (type?: string) => {
  const value = String(type || "").toLowerCase();

  if (value.includes("apartment") || value.includes("condo")) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 21h18"/><path d="M5 21V7l7-4v18"/><path d="M19 21V11l-7-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/><path d="M14 13h1"/><path d="M14 17h1"/></svg>`;
  }

  if (value.includes("townhouse") || value.includes("townhome")) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>`;
  }

  if (value.includes("duplex")) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M2 10L7 5l5 5"/><path d="M12 10l5-5 5 5"/><path d="M4 10v10h6V10"/><path d="M14 10v10h6V10"/></svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 11L12 3l9 8"/><path d="M5 10v11h14V10"/><path d="M10 21v-6h4v6"/></svg>`;
};

const clusterIcon = (count: number) => {
  const size = count < 10 ? 30 : count < 100 ? 40 : 50;

  return L.divIcon({
    className: "bc-osm-marker",
    html: `<div class="bc-osm-cluster" style="width:${size}px;height:${size}px">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const priceIcon = (property: any, status: string, isHovered: boolean) => {
  const statusColor = getStatusColor(status);

  return L.divIcon({
    className: "bc-osm-marker",
    html: `
      <div class="bc-osm-price-marker" style="border-color:${
        isHovered ? statusColor : "transparent"
      }">
        <div class="bc-osm-price-bg" style="background:white"></div>
        <div class="bc-osm-price-content" style="color:${statusColor}">
          ${structureIconSvg(property.structureType)}
          <span>${escapeHtml(formatPriceAbbreviated(property.price))}</span>
        </div>
        <div class="bc-osm-price-tip" style="background:${
          isHovered ? statusColor : "white"
        };border-color:transparent;z-index:-10;"></div>
      </div>
    `,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  });
};

export default function OpenStreetMapMarkerLayer({
  clusters,
  map,
  status,
  hoveredPropertyId,
  selectedClusterProperties,
  superclusterRef,
  setHoveredPropertyId,
  setSelectedProperty,
  setSelectedClusterProperties,
  setClusterPosition,
}: {
  clusters: any[];
  map: L.Map | null;
  status: string;
  hoveredPropertyId: string | null;
  selectedClusterProperties: any[];
  superclusterRef: React.MutableRefObject<Supercluster | null>;
  setHoveredPropertyId: (value: string | null) => void;
  setSelectedProperty: (value: any) => void;
  setSelectedClusterProperties: (value: any[]) => void;
  setClusterPosition: (value: { lat: number; lng: number } | null) => void;
}) {
  return clusters.map((cluster, index) => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    const { cluster: isCluster, point_count: pointCount } = cluster.properties;

    if (isCluster) {
      return (
        <Marker
          key={`cluster-${cluster.id || index}`}
          position={[latitude, longitude]}
          icon={clusterIcon(pointCount)}
          eventHandlers={{
            click: () => {
              if (selectedClusterProperties.length > 0) return;
              if (!map) return;

              const currentZoom = map.getZoom() || 0;
              setSelectedProperty(null);

              if (currentZoom >= 17) {
                const leaves =
                  superclusterRef.current?.getLeaves(cluster.id, 50) || [];
                setSelectedClusterProperties(
                  leaves.map((leaf: any) => leaf.properties.propertyData),
                );
                setClusterPosition({ lat: latitude, lng: longitude });
                return;
              }
              map.flyTo([latitude, longitude], 18);
            },
          }}
        />
      );
    }

    if (!isCluster) {
      const property = cluster.properties.propertyData;
      const isHovered = hoveredPropertyId === property.id;
      return (
        <Marker
          key={`property-${property.id}`}
          position={[property.latitude, property.longitude]}
          icon={priceIcon(property, status, isHovered)}
          eventHandlers={{
            click: () => {
              setSelectedClusterProperties([]);
              setClusterPosition(null);
              setSelectedProperty(property);
            },
            mouseover: () => setHoveredPropertyId(property.id),
            mouseout: () => setHoveredPropertyId(null),
          }}
        />
      );
    }

    const property = cluster.properties.propertyData;
    const zoom = map?.getZoom() || 8;
    const isHovered = hoveredPropertyId === property.id;

    if (zoom < 15) return null;

    return (
      <Marker
        key={`property-${property.id}`}
        position={[property.latitude, property.longitude]}
        icon={priceIcon(property, status, isHovered)}
        eventHandlers={{
          click: () => {
            setSelectedClusterProperties([]);
            setClusterPosition(null);
            setSelectedProperty(property);
          },
          mouseover: () => setHoveredPropertyId(property.id),
          mouseout: () => setHoveredPropertyId(null),
        }}
      />
    );
  });
}
