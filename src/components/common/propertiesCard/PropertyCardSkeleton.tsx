import { usePathname } from "next/navigation";

const PropertyCardSkeleton = () => {
  const pathname = usePathname();
  return (
    <div
      className={`${
        pathname === "/properties" || pathname === "/wishlist"
          ? "md:w-[49%] w-full"
          : "w-full"
      }`}
    >
      <div className="relative rounded-xl flex overflow-hidden border border-borderColor h-auto w-full animate-pulse">
        <div className="flex flex-col gap-y-3 xl:p-5 p-4 w-full h-full justify-between">
          {/* Image */}
          <div className="w-full h-56 bg-gray-200 rounded-lg" />

          <div className="space-y-3 mt-1">
            {/* Title */}
            <div className="h-6 w-2/3 bg-gray-200 rounded" />

            {/* Price + badge */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-7 w-32 bg-gray-200 rounded" />
              </div>
              <div className="h-6 w-36 bg-gray-200 rounded" />
            </div>

            {/* Address */}
            <div className="h-4 w-full bg-gray-200 rounded" />

            {/* Specs */}
            <div className="flex gap-3">
              <div className="h-10 w-full bg-gray-200 rounded-md" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>

            {/* Divider */}
            <div className="h-0.5 w-full bg-gray-200 rounded" />

            {/* Realtor + MLS */}
            <div className="flex justify-between">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
