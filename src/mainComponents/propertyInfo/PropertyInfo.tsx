"use client";
import PropertyTopAddressSection from "./PropertyTopAddressSection";
import PropertyGallery from "./PropertyGallery";
import PropertyInformation from "./propertyInformation/PropertyInformation";
import GetInTouch from "../getInTouch/GetInTouch";
import { propertyImages } from "@/src/mainComponents/dummyData";
import { useGetUnifiedListingById } from "@/src/hooks/listing/useListingQueries";
import PropertyInfoSkeleton from "./PropertyInfoSkeleton";

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
      <section className="xl:max-w-screen-2xl mx-auto w-full bg-background flex flex-col xl:px-16 md:px-13 px-6 xl:pt-35.5 xl:pb-28.25 md:pt-28 md:pb-25 pt-21 pb-13">
        <PropertyTopAddressSection property={listing} />
        <PropertyGallery images={listing?.media || propertyImages} />
        <PropertyInformation property={listing} />
      </section>

      <GetInTouch />
    </>
  );
};

export default PropertyInfo;
