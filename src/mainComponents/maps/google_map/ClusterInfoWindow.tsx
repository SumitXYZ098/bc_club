import { InfoWindow } from "@react-google-maps/api";
import { Images } from "@/src/app/exports";

export default function ClusterInfoWindow({
  selectedClusterProperties,
  stableClusterPosition,
  onClose,
  onViewAll,
}: {
  selectedClusterProperties: any[];
  stableClusterPosition: { lat: number; lng: number } | null;
  onClose: () => void;
  onViewAll: () => void;
}) {
  if (selectedClusterProperties.length === 0 || !stableClusterPosition)
    return null;

  return (
    <InfoWindow position={stableClusterPosition} onCloseClick={onClose}>
      <div
        style={{
          width: 300,
          maxHeight: 320,
          overflowY: "auto",
          padding: 10,
          fontFamily: "Plus Jakarta Display",
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
          Properties ({selectedClusterProperties.length})
        </h3>

        {selectedClusterProperties.map((p) => (
          <div
            key={p.id}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/property-info/${p.id}`;
            }}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 12,
              cursor: "pointer",
              borderBottom: "1px solid #eee",
              paddingBottom: 10,
            }}
          >
            <img
              src={p.image || Images.apartment}
              alt=""
              style={{
                width: 70,
                height: 55,
                objectFit: "cover",
                borderRadius: 6,
                background: "#f1f5f9",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#305487" }}>
                ${Number(p.price).toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#444",
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                {p.title === "Single Family" ? p.structureType : p.title}
              </div>
              <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>
                {p.address}
              </div>
            </div>
          </div>
        ))}

        {/* <button
          onClick={onViewAll}
          style={{
            width: "100%",
            marginTop: 8,
            padding: "8px",
            background: "#305487",
            color: "white",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 12,
          }}
        >
          View All
        </button> */}
      </div>
    </InfoWindow>
  );
}
