import { OverlayView } from "@react-google-maps/api";
import Supercluster from "supercluster";
import { formatPriceAbbreviated } from "./mapUtils";

const StructureIcon = ({ type }: { type?: string }) => {
  const value = String(type || "").toLowerCase();

  // Apartment / Condo
  if (value.includes("apartment") || value.includes("condo")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-[#22c55e]"
      >
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4v18" />
        <path d="M19 21V11l-7-4" />
        <path d="M9 9h1" />
        <path d="M9 13h1" />
        <path d="M9 17h1" />
        <path d="M14 13h1" />
        <path d="M14 17h1" />
      </svg>
    );
  }

  // Townhouse
  if (value.includes("townhouse") || value.includes("townhome")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-[#22c55e]"
      >
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    );
  }

  // Detached Home
  if (value.includes("detached")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-[#22c55e]"
      >
        <path d="M3 11L12 3l9 8" />
        <path d="M5 10v11h14V10" />
        <path d="M10 21v-6h4v6" />
      </svg>
    );
  }

  // Duplex
  if (value.includes("duplex")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-[#22c55e]"
      >
        <path d="M2 10L7 5l5 5" />
        <path d="M12 10l5-5 5 5" />
        <path d="M4 10v10h6V10" />
        <path d="M14 10v10h6V10" />
      </svg>
    );
  }

  // Default
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className="text-[#22c55e]"
    >
      <path d="M3 11L12 3l9 8" />
      <path d="M5 10v11h14V10" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
};

export default function MapMarkerLayer({
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
  map: google.maps.Map | null;
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
      const size = pointCount < 10 ? 30 : pointCount < 100 ? 40 : 50;

      return (
        <OverlayView
          key={`cluster-${cluster.id || index}`}
          position={{ lat: latitude, lng: longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (selectedClusterProperties.length > 0) return;

              const currentZoom = map?.getZoom() || 0;
              setSelectedProperty(null);

              if (currentZoom >= 20) {
                const leaves =
                  superclusterRef.current?.getLeaves(cluster.id, 50) || [];
                const props = leaves.map(
                  (leaf: any) => leaf.properties.propertyData,
                );

                setSelectedClusterProperties(props);
                setClusterPosition({ lat: latitude, lng: longitude });
                return;
              }

              const expansionZoom =
                superclusterRef.current?.getClusterExpansionZoom(
                  cluster.id as number,
                ) || 10;

              map?.setZoom(expansionZoom);
              map?.panTo({ lat: latitude, lng: longitude });
            }}
            className="cursor-pointer"
            style={{
              width: size,
              height: size,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex items-center justify-center bg-primary text-white font-bold text-sm rounded-full shadow-lg border-2 border-white w-full h-full transition-transform hover:scale-110">
              {pointCount}
            </div>
          </div>
        </OverlayView>
      );
    }

    const property = cluster.properties.propertyData;
    const zoom = map?.getZoom() || 8;
    const isHovered = hoveredPropertyId === property.id;

    const statusColor =
      status === "sold"
        ? "#ef4444"
        : status === "expired"
          ? "#3b82f6"
          : "#22c55e";

    if (zoom >= 17) {
      return (
        <OverlayView
          key={`property-${property.id}`}
          position={{ lat: property.latitude, lng: property.longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              setSelectedClusterProperties([]);
              setClusterPosition(null);
              setSelectedProperty(property);
            }}
            onMouseEnter={() => setHoveredPropertyId(property.id)}
            onMouseLeave={() => setHoveredPropertyId(null)}
            className={`group w-fit relative -translate-x-1/2 -translate-y-full cursor-pointer transition-transform duration-200 ${
              isHovered ? "scale-110 z-30" : "z-20"
            }`}
          >
            <div
              style={{
                borderColor: isHovered ? statusColor : "transparent",
              }}
              className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.15)] font-bold text-xs whitespace-nowrap border-2 transition-all duration-200 text-gray-800"
            >
              <div
                style={{
                  backgroundColor: isHovered ? statusColor : "white",
                }}
                className="absolute inset-0 rounded-lg -z-10"
              />
              <div className="flex items-center gap-1">
                <StructureIcon type={property.structureType} />

                <span style={{ color: statusColor }}>
                  {formatPriceAbbreviated(property.price)}
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: isHovered ? statusColor : "white",
                borderColor: isHovered ? statusColor : "transparent",
              }}
              className="-z-10 absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 border-r border-b transition-all duration-200 shadow-[2px_2px_2px_rgba(0,0,0,0.05)]"
            />
          </div>
        </OverlayView>
      );
    }

    return null;
  });
}
