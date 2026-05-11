import { OverlayView } from "@react-google-maps/api";
import Supercluster from "supercluster";
import { formatPriceAbbreviated } from "./mapUtils";

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
  return (
    <>
      {clusters.map((cluster, index) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

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
                  className="bg-white px-2 py-1 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.15)] font-bold text-xs whitespace-nowrap border-2 transition-all duration-200 text-gray-800"
                >
                  <div
                    style={{
                      backgroundColor: isHovered ? statusColor : "white",
                    }}
                    className="absolute inset-0 rounded-lg -z-10"
                  />
                  <span style={{ color: statusColor }}>
                    {formatPriceAbbreviated(property.price)}
                  </span>
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
        // (
        //   <OverlayView
        //     key={`marker-${property.id}`}
        //     position={{ lat: property.latitude, lng: property.longitude }}
        //     mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        //   >
        //     <div
        //       onClick={(e) => {
        //         e.stopPropagation();
        //         map?.setZoom(15);
        //         map?.panTo({ lat: property.latitude, lng: property.longitude });
        //       }}
        //       onMouseEnter={() => setHoveredPropertyId(property.id)}
        //       onMouseLeave={() => setHoveredPropertyId(null)}
        //       className={`group -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${
        //         isHovered ? "scale-150 z-30" : "z-20"
        //       }`}
        //     >
        //       <div
        //         style={{
        //           backgroundColor: statusColor,
        //           boxShadow: isHovered
        //             ? `0 0 10px ${statusColor}`
        //             : "0 2px 5px rgba(0,0,0,0.2)",
        //         }}
        //         className="flex items-center justify-center w-3.5 h-3.5 rounded-full border-2 border-white transition-all"
        //       />
        //     </div>
        //   </OverlayView>
        // );
      })}
    </>
  );
}
