import { InfoWindow } from "@react-google-maps/api";
import { Images } from "@/src/app/exports";

export default function PropertyInfoWindow({
  selectedProperty,
  popupRef,
  onClose,
}: {
  selectedProperty: any;
  popupRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  if (!selectedProperty) return null;

  return (
    <InfoWindow
      position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
      onCloseClick={onClose}
    >
      <div
        ref={popupRef}
        style={{
          width: 260,
          background: "white",
          borderRadius: 6,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          fontFamily: "Plus Jakarta Display",
          cursor: "pointer",
          padding: 10,
        }}
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/property-info/${selectedProperty.id}`;
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              width: "100%",
              height: 130,
              overflow: "hidden",
              borderRadius: 3,
              backgroundColor: "#f1f5f9",
            }}
          >
            <img
              src={selectedProperty.image || Images.apartment}
              alt={selectedProperty.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div style={{ padding: "12px 2px 4px 2px", display: "flex", flexDirection: "column", gap: 4 }}>
            <h3 style={{ margin: 0, color: "#305487", fontSize: 18, fontWeight: 700 }}>
              ${Number(selectedProperty.price).toLocaleString()}
            </h3>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {selectedProperty.title}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#6e6e6e", lineHeight: 1.4, fontWeight: 500 }}>
              {selectedProperty.address}
            </p>
          </div>
        </div>
      </div>
    </InfoWindow>
  );
}
