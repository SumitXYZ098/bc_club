type NearbyPlace = {
  place_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  googleMapLink: string;
};

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const NearbyPlaceCard = ({
  place,
  type,
}: {
  place: NearbyPlace;
  type: "school" | "hospital";
}) => {
  const schoolType = place.name.toLowerCase().includes("secondary")
    ? "Secondary"
    : place.name.toLowerCase().includes("elementary")
      ? "Elementary"
      : "School";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold">{place.name}</h3>

      <div className="mt-3 flex flex-wrap gap-2">
        {type === "school" ? (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">
            {schoolType}
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">
            Hospital
          </span>
        )}
      </div>

      <p className="mt-8 md:text-xl text-base font-semibold ">
        {place.address}
      </p>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:text-base text-sm font-bold">
          <span>{place.distanceKm} km</span>
          <span className="h-7 w-px bg-gray-300" />
          <span>{type === "school" ? "Nearby School" : "Nearby Hospital"}</span>
        </div>

        <a
          href={place.googleMapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary transition hover:scale-110"
        >
          <MapPinIcon />
        </a>
      </div>
    </div>
  );
};

export default NearbyPlaceCard;

export const NearbyPlaceSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Title */}
      <div className="h-7 w-3/4 rounded bg-gray-200" />

      {/* Badge */}
      <div className="mt-4 h-8 w-28 rounded-full bg-gray-200" />

      {/* Address */}
      <div className="mt-8 space-y-3">
        <div className="h-6 w-full rounded bg-gray-200" />
        <div className="h-6 w-2/3 rounded bg-gray-200" />
      </div>

      {/* Bottom */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-5 w-16 rounded bg-gray-200" />
          <div className="h-6 w-px bg-gray-200" />
          <div className="h-5 w-32 rounded bg-gray-200" />
        </div>

        <div className="h-10 w-10 rounded-full bg-gray-200" />
      </div>
    </div>
  );
};
