"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css/navigation";

import CustomButton from "@/src/components/button/CustomButton";
import PropertiesCard, {
  PropertyCardProps,
} from "@/src/components/common/propertiesCard/PropertiesCard";
import PropertyCardSkeleton from "@/src/components/common/propertiesCard/PropertyCardSkeleton";
import Heading, { IHeadingTypes } from "@/src/components/heading/Heading";

import { useGetActiveListings, useGetListings } from "@/src/hooks/listing/useListingQueries";
import { useAuthContext } from "../auth/AuthContext";

const tabList = [
  "Newly Listed properties",
  "Previously Listed Properties",
  "Sold properties",
];

const OFFSET = 120;

const swiperConfig = {
  spaceBetween: 12,
  slidesPerView: 1,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  modules: [Pagination, Navigation, Autoplay],
  loop: true,
  pagination: {
    clickable: true,
    dynamicBullets: true,
  },
  breakpoints: {
    640: { slidesPerView: 1.5, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 32 },
  },
  speed: 800,
};

const OurProperty = () => {

  const { isLoggedIn } = useAuthContext();

  const [tab, setTab] = useState(tabList[0]);

  const [city, setCity] = useState("Vancouver"); // default fallback

  const refs = {
    "Newly Listed properties": useRef<HTMLDivElement>(null),
    "Previously Listed Properties": useRef<HTMLDivElement>(null),
    "Sold properties": useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (tabName: string) => {
    setTab(tabName);
    const target = refs[tabName as keyof typeof refs]?.current;

    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;

      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // 🔹 Mapping Function
  const mapProperty = (listing: any, isDdf?: boolean): PropertyCardProps => ({
    id: listing.documentId,
    image: listing?.media_url?.[0] ?? listing?.media[0]?.MediaURL,
    title: listing?.property_sub_type,
    price: listing?.price,
    daysAgo: listing?.raw_data?.OriginalEntryTimestamp ?? 0,
    address: `${listing?.address}, ${listing?.city}, ${listing?.state}`,
    sqft: listing?.area ?? listing?.Living_area ?? 0,
    beds: listing?.bedrooms ?? 0,
    baths: listing?.bathrooms ?? 0,
    priceDrop:
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
    mls: listing?.mls_number ?? listing?.listing_id
,
    realtor:
      listing?.office_data?.OfficeName ||
      listing?.raw_data?.ListAOR ||
      "Unknown",
    isFavourite: listing?.is_favorite || false,
    isDdf: !!isDdf,
  });

  const { data: newList = [], isLoading: isLoadingNew } = useGetActiveListings(
    {},
    {
      select: (res: any) => {
        console.log("📦 API Response:", res);
        // console.log("🏙️ Current City Filter:", city);

        return (
          res?.data
            ?.filter((l: any) => l?.address && Number(l?.price) > 0)
            .map((l: any) => mapProperty(l, true)) || []
        );
      },
    },
  );

  const { data: soldList = [], isLoading: isLoadingSold } = useGetListings(
    {
      "filters[raw_data][BCRES_SoldDate][$notNull]": true,
    },
    {
      select: (res: any) =>
        res?.data
          ?.filter((l: any) => l?.address && Number(l?.price) > 0)
          .map((l: any) => mapProperty(l, false)) || [],
    },
  );

  const { data: expiredList = [], isLoading: isLoadingExpired } =
    useGetListings(
      {
        "filters[property_status][$eq]": ["Expired"],
      },
      {
        select: (res: any) =>
          res?.data
            ?.filter((l: any) => l?.address && Number(l?.price) > 0)
            .map((l: any) => mapProperty(l, false)) || [],
      },
    );

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );

          const data = await res.json();

          const detectedCity =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.county ||
            null;

          // ✅ If API returns nothing → fallback
          setCity(detectedCity || "Vancouver");

        } catch (err) {
          // ✅ If API fails
          console.log("❌ Reverse geocode failed");
          setCity("Vancouver");
        }
      },

      // ✅ If user clicks DENY or any error
      (error) => {
        console.log("❌ Location denied:", error.message);
        setCity("Vancouver");
      }
    );
  };

  useEffect(() => {
    // ✅ Only run after API finishes loading
    if (isLoadingNew) return;

    // ✅ If no properties found for detected city → fallback
    if (newList.length === 0 && city !== "Vancouver") {
      console.log("❌ No properties found for:", city);
      console.log("➡️ Falling back to Vancouver");

      setCity("Vancouver");
    }
  }, [isLoadingNew, newList, city]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setCity("Vancouver");
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        // ❌ If already denied → DON'T call API again
        if (result.state === "denied") {
          console.log("🚫 Permission already denied → using Vancouver");
          setCity("Vancouver");
          return;
        }
        getUserLocation();
      });
  }, []);

  const renderSlider = (
    list: PropertyCardProps[],
    isLoading: boolean,
    isLoginOverride?: boolean,
    isSold?: boolean,
    isExpired?: boolean,
    navId?: string,
  ) => {
    if (isLoading) {
      return (
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (!list.length) {
      return <p className="text-center py-10">No properties found</p>;
    }
    // if (list.length <= 3) {
    //   return (
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //       {list.map((item) => (
    //         <PropertiesCard
    //           {...item}
    //           isLogin={isLoginOverride ?? isLoggedIn}
    //           isSold={isSold}
    //           isExpired={isExpired}
    //         />
    //       ))}
    //     </div>
    //   );
    // }

    return (
      <div className="relative group/slider">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 flex justify-between pointer-events-none px-2 md:-mx-4">
          <button
            className={`${navId}-prev pointer-events-auto bg-background/80 backdrop-blur-sm border border-borderColor p-3 rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className={`${navId}-next pointer-events-auto bg-background/80 backdrop-blur-sm border border-borderColor p-3 rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <Swiper
          {...swiperConfig}
          navigation={{
            prevEl: `.${navId}-prev`,
            nextEl: `.${navId}-next`,
          }}
          className="pt-3! pb-9! mySwiper w-full h-full grid!"
        >
          {list.map((item) => (
            <SwiperSlide key={item.id}>
              <PropertiesCard
                {...item}
                isLogin={isLoginOverride ?? isLoggedIn}
                isSold={isSold}
                isExpired={isExpired}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  return (

    <section className="xl:max-w-screen-2xl mx-auto xl:px-16 md:px-13 px-6 py-16 overflow-clip">
      <Heading
        tagType="h2"
        type={IHeadingTypes.heading32}
        content="Explore Our Property"
        customClasses="text-center"
      />

      {/* Tab  */}
      <div className="xl:mt-13 md:mt-6 mt-4 w-full flex items-center-safe justify-between flex-col gap-y-2 md:flex-row">
        <div className="w-full md:w-[70%] xl:w-[60%] flex flex-nowrap flex-row h-auto shadow-[0_0_20px_0_rgba(0,0,0,0.12)] gap-x-2 rounded-xl p-2">
          {tabList.map((item, idx) => (
            <CustomButton
              buttonType={tab === item ? "primary" : "disabled"}
              key={idx}
              label={item}
              onClick={() => scrollToSection(item)}
              customClasses="w-full"
            />
          ))}
        </div>
        <Link
          href={"/properties"}
          className="flex flex-row items-center bg-secondary text-background font-black md:text-base text-sm md:py-4.5 xl:px-13.5 py-2.5 px-7 rounded-lg"
        >
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M8.7842 17.7042C8.87716 17.7979 8.98777 17.8723 9.10962 17.9231C9.23148 17.9739 9.36219 18 9.4942 18C9.62621 18 9.75692 17.9739 9.87878 17.9231C10.0006 17.8723 10.1112 17.7979 10.2042 17.7042L15.2042 12.7042C15.2979 12.6112 15.3723 12.5006 15.4231 12.3788C15.4739 12.2569 15.5 12.1262 15.5 11.9942C15.5 11.8622 15.4739 11.7315 15.4231 11.6096C15.3723 11.4878 15.2979 11.3772 15.2042 11.2842L10.2042 6.2842C10.1112 6.19047 10.0006 6.11608 9.87878 6.06531C9.75692 6.01454 9.62621 5.9884 9.4942 5.9884C9.36219 5.9884 9.23148 6.01454 9.10962 6.06531C8.98777 6.11608 8.87716 6.19047 8.7842 6.2842C8.69047 6.37717 8.61608 6.48777 8.56531 6.60962C8.51454 6.73148 8.4884 6.86219 8.4884 6.9942C8.4884 7.12621 8.51454 7.25692 8.56531 7.37878C8.61608 7.50064 8.69047 7.61124 8.7842 7.7042L13.0842 11.9942L8.7842 16.2842C8.69047 16.3772 8.61608 16.4878 8.56531 16.6096C8.51454 16.7315 8.4884 16.8622 8.4884 16.9942C8.4884 17.1262 8.51454 17.2569 8.56531 17.3788C8.61608 17.5006 8.69047 17.6112 8.7842 17.7042Z"
              fill="white"
            />
          </svg>
        </Link>
      </div>

      {/* Sections */}
      <div className="space-y-10 mt-10 h-auto">
        <div
          ref={refs["Newly Listed properties"]}
          className="flex flex-col gap-4 h-full"
        >
          <Heading
            tagType="h3"
            type={IHeadingTypes.heading20}
            content="Newly Listed Properties"
          />
          {renderSlider(newList, isLoadingNew, true, false, false, "newly-listed")}
        </div>

        <div
          ref={refs["Previously Listed Properties"]}
          className="flex flex-col gap-4 "
        >
          <Heading
            tagType="h3"
            type={IHeadingTypes.heading20}
            content="Previously Listed Properties"
          />
          {renderSlider(expiredList, isLoadingExpired, isLoggedIn, false, true, "expired")}
        </div>

        <div ref={refs["Sold properties"]} className="flex flex-col gap-4">
          <Heading
            tagType="h3"
            type={IHeadingTypes.heading20}
            content="Sold Properties"
          />
          {renderSlider(soldList, isLoadingSold, isLoggedIn, true, false, "sold")}
        </div>
      </div>
    </section>

  );
};

export default OurProperty;
