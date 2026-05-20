"use client";
import PropertyTopAddressSection from "./PropertyTopAddressSection";
import PropertyGallery from "./PropertyGallery";
import PropertyInformation from "./propertyInformation/PropertyInformation";
import GetInTouch from "../getInTouch/GetInTouch";
import { useGetUnifiedListingById } from "@/src/hooks/listing/useListingQueries";
import PropertyInfoSkeleton from "./PropertyInfoSkeleton";
import Image from "next/image";
import { Images } from "@/src/app/exports";
import PropertySimilarAndSoldListing from "./PropertySimilarAndSoldListing";

const PropertyInfo = ({ paramsId }: { paramsId: string }) => {
  const {
    data: listing,
    isLoading: loading,
    error,
  } = useGetUnifiedListingById(paramsId, {
    select: (res: any) => res?.data || res,
  });

  if (loading) return <PropertyInfoSkeleton />;
  if (error)
    return (
      <div className="p-10 text-red-500 xl:max-w-screen-2xl mx-auto w-full h-[50svh] flex justify-center items-center">
        {error.message || "An error occurred"}
      </div>
    );
  if (!listing)
    return (
      <div className="p-10 text-gray-500 xl:max-w-screen-2xl mx-auto w-full h-[50svh] flex justify-center items-center">
        Property not found
      </div>
    );

  return (
    <>
      <section className="xl:max-w-screen-2xl mx-auto w-full bg-background flex flex-col xl:px-16 md:px-13 px-6 xl:pt-35.5 xl:pb-28.25 md:pt-28 md:pb-25 pt-21 pb-13 items-center-safe">
        <PropertyTopAddressSection property={listing} />
        {listing?.media_url.length > 0 ? (
          <PropertyGallery images={listing?.media ?? listing?.media_url} />
        ) : (
          <div className="w-1/2 xl:h-134 md:h-76.5 h-56.5 relative cursor-pointer md:rounded-2xl rounded-xl">
            <Image
              className="w-full h-full object-cover rounded-xl"
              src={Images.apartment}
              alt="property image not found*"
              width={1400}
              height={1400}
            />
          </div>
        )}
        <PropertyInformation property={listing} />
      </section>

      {/* Sections */}
      <PropertySimilarAndSoldListing
        propertyId={listing.documentId}
        city={listing?.city}
        bedsVariance={listing.bedrooms}
        lotSizeAreaVariance={listing?.lot_size_area}
      />

      <GetInTouch />
    </>
  );
};

export default PropertyInfo;
