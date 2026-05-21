"use client";

import React, { useEffect, useRef, useState } from "react";
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

import {
  useGetActiveListings,
  useGetListings,
  useGetMe,
} from "@/src/hooks/listing/useListingQueries";
import { getOfficeName } from "@/src/utilities/utilities";
import { useRouter } from "next/navigation";
import RippleButton from "@/src/components/button/RippleButton";
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
  loop: false,
  pagination: {
    clickable: true,
    dynamicBullets: true,
  },
  breakpoints: {
    640: { slidesPerView: 1.5, spaceBetween: 20 },
    1024: { slidesPerView: 3.2, spaceBetween: 16 },
  },
  speed: 900,
};

const OurProperty = () => {
  const router = useRouter();
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

  const { data: me } = useGetMe();

  // 🔹 Mapping Function
  const mapProperty = (listing: any, isDdf?: boolean): PropertyCardProps => ({
    id: listing.documentId,
    image: listing?.media_url,
    title: listing?.property_sub_type,
    price: listing?.price,
    daysAgo: listing?.ModificationTimestamp ?? 0,
    address: listing?.address,
    sqft: listing?.area ?? listing?.Living_area ?? 0,
    beds: listing?.bedrooms ?? 0,
    baths: listing?.bathrooms ?? 0,
    likesCount: listing?.likesCount ?? 0,
    lotSize: listing?.lot_size_area ?? "",
    structureType: listing?.structure_type ?? "",
    priceDrop:
      listing.PreviousListPrice > listing.ListPrice
        ? Number(
          (
            (listing.PreviousListPrice - listing.ListPrice) /
            listing.ListPrice
          ).toFixed(1),
        )
        : undefined,
    assessedDiff: listing.price
      ? Number(
        ((listing.price - (listing.annual_tax ?? 0)) / listing.price).toFixed(
          1,
        ),
      )
      : 0,
    mls: listing?.listing_id,
    realtor: listing?.office_name ?? getOfficeName(listing),
    status: listing?.status || "",
    isFavourite: listing?.users?.some(
      (user: any) => user?.documentId === me?.documentId,
    ),
    isDdf: !!isDdf,
  });

  const { data: newList = [], isLoading: isLoadingNew } = useGetActiveListings(
    { location: city, page: 1, pageSize: 30 },
    {
      select: (res: any) => {
        const nonResidentialTypes = [
          "office",
          "business",
          "agriculture",
          "vacant land",
          "industrial",
          "retail",
        ];

        return (
          res?.data
            ?.filter((l: any) => l?.address && Number(l?.price) > 0)
            .filter((l: any) => {
              const type = (l?.property_sub_type || "").toLowerCase();
              return !nonResidentialTypes.some((nonRes) =>
                type.includes(nonRes),
              );
            })
            .map((l: any) => mapProperty(l, true)) || []
        );
      },
    },
  );

  const { data: soldList = [], isLoading: isLoadingSold } = useGetListings(
    {
      propertyType: "sold",
      location: city,
      page: 1, pageSize: 30
    },
    {
      select: (res: any) => {
        const nonResidentialTypes = [
          "office",
          "business",
          "agriculture",
          "vacant land",
          "industrial",
          "retail",
        ];
        return (
          res?.data
            ?.filter((l: any) => l?.address && Number(l?.price) > 0)
            .filter((l: any) => {
              const type = (l?.property_sub_type || "").toLowerCase();
              return !nonResidentialTypes.some((nonRes) =>
                type.includes(nonRes),
              );
            })
            .map((l: any) => mapProperty(l, false)) || []
        );
      },
    },
  );

  const { data: expiredList = [], isLoading: isLoadingExpired } =
    useGetListings(
      {
        propertyType: "expired",
        location: city,
        page: 1, pageSize: 30
      },
      {
        select: (res: any) => {
          const nonResidentialTypes = [
            "office",
            "business",
            "agriculture",
            "vacant land",
            "industrial",
            "retail",
          ];
          return (
            res?.data
              ?.filter((l: any) => l?.address && Number(l?.price) > 0)
              .filter((l: any) => {
                const type = (l?.property_sub_type || "").toLowerCase();
                return !nonResidentialTypes.some((nonRes) =>
                  type.includes(nonRes),
                );
              })
              .map((l: any) => mapProperty(l, false)) || []
          );
        },
      },
    );

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
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
          setCity("Vancouver");
        }
      },

      // ✅ If user clicks DENY or any error
      (error) => {
        setCity("Vancouver");
      },
    );
  };

  useEffect(() => {
    // ✅ Only run after API finishes loading
    if (isLoadingNew) return;

    // ✅ If no properties found for detected city → fallback
    if (newList.length === 0 && city !== "Vancouver") {
      setCity("Vancouver");
    }
  }, [isLoadingNew, newList, city]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setCity("Vancouver");
      return;
    }

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      // ❌ If already denied → DON'T call API again
      if (result.state === "denied") {
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
    navId?: string,
  ) => {
    if (isLoading) {
      return (
        <div className="flex gap-6 justify-center-safe">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (!list.length) {
      return <p className="text-center py-10">No properties found</p>;
    }

    return (
      <div className="relative group/slider">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 flex justify-between pointer-events-none px-1 md:-mx-5">
          {/* Prev */}
          <button
            className={[
              `${navId}-prev`,
              "pointer-events-auto",
              "relative overflow-hidden",
              "w-16 h-16 rounded-full",
              "flex items-center justify-center",
              "bg-white",
              // clean shadow edge — no CSS border
              "shadow-[0_2px_12px_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(0,0,0,0.06)]",
              "text-primary",
              // hover: blue glow, no border
              "hover:shadow-[0_0_0_4px_rgba(34,85,139,0.12),0_4px_20px_rgba(34,85,139,0.22)]",
              "group/btn",
              "-translate-x-3 opacity-0",
              "group-hover/slider:translate-x-0 group-hover/slider:opacity-100",
              "transition-all duration-300 ease-out",
              "disabled:opacity-0 disabled:pointer-events-none",
            ].join(" ")}
          >
            <span className="absolute inset-0 rounded-full bg-primary scale-0 group-hover/btn:scale-100 transition-transform duration-300 ease-out origin-center" />
            <ChevronLeft
              size={22}
              strokeWidth={2.5}
              className="relative z-10 text-primary group-hover/btn:text-white transition-all duration-300 group-hover/btn:-translate-x-0.5"
            />
          </button>

          {/* Next */}
          <button
            className={[
              `${navId}-next`,
              "pointer-events-auto",
              "relative overflow-hidden",
              "w-16 h-16 rounded-full",
              "flex items-center justify-center",
              "bg-white",
              // clean shadow edge — no CSS border
              "shadow-[0_2px_12px_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(0,0,0,0.06)]",
              "text-primary",
              // hover: blue glow, no border
              "hover:shadow-[0_0_0_4px_rgba(34,85,139,0.12),0_4px_20px_rgba(34,85,139,0.22)]",
              "group/btn",
              "translate-x-3 opacity-0",
              "group-hover/slider:translate-x-0 group-hover/slider:opacity-100",
              "transition-all duration-300 ease-out",
              "disabled:opacity-0 disabled:pointer-events-none",
            ].join(" ")}
          >
            <span className="absolute inset-0 rounded-full bg-primary scale-0 group-hover/btn:scale-100 transition-transform duration-300 ease-out origin-center" />
            <ChevronRight
              size={22}
              strokeWidth={2.5}
              className="relative z-10 text-primary group-hover/btn:text-white transition-all duration-300 group-hover/btn:translate-x-0.5"
            />
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
                isSold={item.status === "Closed" ? true : false}
                isExpired={item.status === "Expired" ? true : false}
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
        <RippleButton
          title="View All"
          buttonType="tertiary"
          onClick={() => router.push("/properties")}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M8.7842 17.7042C8.87716 17.7979 8.98777 17.8723 9.10962 17.9231C9.23148 17.9739 9.36219 18 9.4942 18C9.62621 18 9.75692 17.9739 9.87878 17.9231C10.0006 17.8723 10.1112 17.7979 10.2042 17.7042L15.2042 12.7042C15.2979 12.6112 15.3723 12.5006 15.4231 12.3788C15.4739 12.2569 15.5 12.1262 15.5 11.9942C15.5 11.8622 15.4739 11.7315 15.4231 11.6096C15.3723 11.4878 15.2979 11.3772 15.2042 11.2842L10.2042 6.2842C10.1112 6.19047 10.0006 6.11608 9.87878 6.06531C9.75692 6.01454 9.62621 5.9884 9.4942 5.9884C9.36219 5.9884 9.23148 6.01454 9.10962 6.06531C8.98777 6.11608 8.87716 6.19047 8.7842 6.2842C8.69047 6.37717 8.61608 6.48777 8.56531 6.60962C8.51454 6.73148 8.4884 6.86219 8.4884 6.9942C8.4884 7.12621 8.51454 7.25692 8.56531 7.37878C8.61608 7.50064 8.69047 7.61124 8.7842 7.7042L13.0842 11.9942L8.7842 16.2842C8.69047 16.3772 8.61608 16.4878 8.56531 16.6096C8.51454 16.7315 8.4884 16.8622 8.4884 16.9942C8.4884 17.1262 8.51454 17.2569 8.56531 17.3788C8.61608 17.5006 8.69047 17.6112 8.7842 17.7042Z"
                fill="currentColor"
              />
            </svg>
          }
          customClassName="font-black md:py-3 xl:px-5 py-2.5 px-7 rounded-lg"
          textClassName="!font-black !text-xs md:!text-sm"
        />
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
          {renderSlider(newList, isLoadingNew, true, "newly-listed")}
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
          {renderSlider(expiredList, isLoadingExpired, isLoggedIn, "expired")}
        </div>

        <div ref={refs["Sold properties"]} className="flex flex-col gap-4">
          <Heading
            tagType="h3"
            type={IHeadingTypes.heading20}
            content="Sold Properties"
          />
          {renderSlider(soldList, isLoadingSold, isLoggedIn, "sold")}
        </div>
      </div>
    </section>
  );
};

export default OurProperty;
