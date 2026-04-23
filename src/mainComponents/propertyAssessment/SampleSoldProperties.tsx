"use client";
import React, { useLayoutEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PropertiesCard, {
  PropertyCardProps,
} from "@/src/components/common/propertiesCard/PropertiesCard";
import { useAuthContext } from "../auth/AuthContext";
import axios from "axios";
import { getListings } from "@/src/api/listing/listingApi";
import PropertyCardSkeleton from "@/src/components/common/propertiesCard/PropertyCardSkeleton";

const SampleSoldProperties = () => {
  const [soldList, setSoldList] = useState<PropertyCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuthContext();

  const soldParams: any = {
    "filters[property_status][$notIn]": ["Rented", "Expired"],
    "filters[raw_data][BCRES_SoldDate][$notNull]": true,
    "filters[property_sub_type][$notNull]": true,
  };

  useLayoutEffect(() => {
    const fetchSoldListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getListings(soldParams);

        const soldProperties: PropertyCardProps[] = res.data
          .filter((listing: any) => listing?.address)
          .map((listing: any) => {
            return {
              id: listing.documentId,
              image: typeof listing?.media?.[0] === "string" ? listing.media[0] : listing?.media?.[0]?.MediaURL,
              title: listing?.property_sub_type,
              price: listing?.price,
              daysAgo: listing.DaysOnMarket ?? 0,
              address:
                `${listing?.address}, ${listing?.city}, ${listing?.state}` ||
                "",
              sqft: listing?.area ?? 0,
              beds: listing?.bedrooms ?? 0,
              baths: listing?.bathrooms ?? 0,
              priceDrop:
                listing.PreviousListPrice &&
                listing.PreviousListPrice > listing.ListPrice
                  ? Number(
                      (
                        (listing.PreviousListPrice - listing.ListPrice) /
                        listing.ListPrice
                      ).toFixed(1),
                    )
                  : undefined,
              assessedDiff: listing.ListPrice
                ? Number(
                    (
                      (listing.ListPrice - (listing.TaxAssessedValue ?? 0)) /
                      listing.ListPrice
                    ).toFixed(1),
                  )
                : 0,
              mls: listing?.mls_number,
              realtor: listing?.raw_data?.ListAOR || "Unknown",
            };
          });

        setSoldList(soldProperties);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error?.message || "API error");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSoldListings();
  }, []);

  return loading ? (
    <div className="flex flex-nowrap gap-4 pt-5 pb-9">
      {Array.from({ length: 6 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  ) : soldList?.length === 0 ? (
    <div className="text-center md:py-15 py-9 space-y-3 ">
      <h3 className="md:text-lg text-base font-semibold">No properties yet</h3>
      <p className="md:text-base text-sm text-lightWhite">
        {error || "Looks like you haven’t added any properties."}
      </p>
    </div>
  ) : (
    <div className="flex flex-row gap-x-5 w-full">
      <Swiper
        speed={2500}
        spaceBetween={12}
        slidesPerView={1.1}
        autoplay={{
          delay: 100,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Autoplay, Pagination]}
        loop
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          640: { slidesPerView: 1.8, spaceBetween: 20, speed: 2500 },
          1024: { slidesPerView: 3, spaceBetween: 32, speed: 2500 },
        }}
        className="mySwiper w-full xl:pt-5! pb-9!"
      >
        {soldList.map((item, index) => (
          <SwiperSlide key={index}>
            <PropertiesCard {...item} isLogin={isLoggedIn} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SampleSoldProperties;
