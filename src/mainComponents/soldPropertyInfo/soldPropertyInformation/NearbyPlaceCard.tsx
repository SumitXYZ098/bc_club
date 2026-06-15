type NearbyPlace = {
  school_name: string;
  school_type: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  googleMapLink: string;
};

const NavigationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
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
  return (
    <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
      <div>
        {/* Top Row: Badge & Distance */}
        <div className="flex items-center justify-between">
          <span className="rounded-lg bg-[#E0E7FF] px-3 py-1.5 text-sm font-bold text-[#1E1B4B]">
            {place?.school_type}
          </span>
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
            <NavigationIcon />
            <span>{place.distanceKm} km</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-lg md:text-xl font-bold text-gray-900 leading-tight">
          {place.school_name}
        </h3>

        {/* Address */}
        <p className="mt-2.5 text-base font-semibold text-gray-500 leading-relaxed">
          {place.address}
        </p>
      </div>

      {/* Bottom Row: Nearby Link */}
      <div className="mt-6 flex items-center">
        <a
          href={place.googleMapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-primary font-bold transition hover:opacity-85"
        >
          <span className="transition-transform group-hover:scale-110">
            <MapPinIcon />
          </span>
          <span>{type === "school" ? "Nearby School" : "Nearby Hospital"}</span>
        </a>
      </div>
    </div>
  );
};

export default NearbyPlaceCard;

export const NearbyPlaceSkeleton = () => {
  return (
    <div className="animate-pulse rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Top Row Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-24 rounded-lg bg-gray-200" />
          <div className="h-5 w-16 rounded bg-gray-200" />
        </div>

        {/* Title Skeleton */}
        <div className="mt-5 h-7 w-3/4 rounded bg-gray-200" />

        {/* Address Skeleton */}
        <div className="mt-3 space-y-2">
          <div className="h-5 w-full rounded bg-gray-200" />
          <div className="h-5 w-2/3 rounded bg-gray-200" />
        </div>
      </div>

      {/* Bottom Row Skeleton */}
      <div className="mt-6 h-6 w-36 rounded bg-gray-200" />
    </div>
  );
};
