import { usePathname } from "next/navigation";

const PropertyCardSkeleton = () => {
  const pathname = usePathname();

  return (
    <div className={`${pathname === "/" ? "w-[400px]" : "w-full"}`}>
      <div className="relative rounded-2xl flex overflow-hidden shadow-[0_0_5px_0_rgba(21,21,21,0.19)] h-auto w-full animate-pulse">
        <div className="flex flex-col gap-y-2 w-full h-full justify-between">
          {/* Image */}
          <div className="w-full h-56 bg-gray-200 rounded-t-2xl" />

          <div className="space-y-3 mt-2 px-4 pb-5">
            {/* Price + badge */}
            <div className="flex justify-between items-center">
              <div className="h-8 w-38 bg-gray-200 rounded" />

              <div className="h-6 w-36 bg-gray-200 rounded" />
            </div>
            {/* Title */}
            <div className="h-4 w-2/3 bg-gray-200 rounded" />

            {/* Address */}
            <div className="h-6 w-full bg-gray-200 rounded" />

            {/* Specs */}
            <div className="flex gap-3 justify-between">
              <div className="h-6 w-16 bg-gray-200 rounded-md" />
              <div className="h-6 w-16 bg-gray-200 rounded-md" />
              <div className="h-6 w-16 bg-gray-200 rounded-md" />
              <div className="h-6 w-16 bg-gray-200 rounded-md" />
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
