"use client";
import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import FiltersPopup from "@/src/components/common/propertiesCard/FiltersPopup";
import { Box, Chip, Pagination } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FilterListIcon from "@mui/icons-material/FilterList";
import PropertiesMap from "./PropertiesMap";
import PropertiesCard, {
  PropertyCardProps,
} from "@/src/components/common/propertiesCard/PropertiesCard";
import PropertyCardSkeleton from "@/src/components/common/propertiesCard/PropertyCardSkeleton";
import FilterPillSelect from "@/src/components/filterPillSelect/FilterPillSelect";

import { useListingStore } from "@/src/store/useListingStore";
import {
  useGetListings,
  useGetWishlistProperties,
  useGetActiveListings,
} from "@/src/hooks/listing/useListingQueries";
import { usePathname } from "next/navigation";
import { useAuthContext } from "../auth/AuthContext";
import CustomButton from "../../components/button/CustomButton";
import Link from "next/link";

export default function PropertiesListingPage() {
  const pathName = usePathname();
  const isWishlistPage = pathName === "/wishlist";
  const { isLoggedIn, setOpenLogin } = useAuthContext();
  const [openFilters, setOpenFilters] = useState(false);

  const { getInstanceFilters, updateInstanceFilter, clearInstanceFilters } =
    useListingStore();
  const filters = getInstanceFilters("list");

  const search = filters.search || "";
  const isChip = filters.isChip || false;
  const activePrice = filters.activePrice || "any";
  const activeBathRoom = filters.activeBathRoom || "any";
  const activeBedRoom = filters.activeBedRoom || "any";
  const activeProperty = filters.activeProperty || "any";
  const page = filters.page || 1;
  const pageSize = 20;

  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const minSqft = filters.minSqft;
  const maxSqft = filters.maxSqft;
  const status = filters.status;
  const location = filters.location;

  const setSearch = (val: string) =>
    updateInstanceFilter("list", "search", val);
  const setIsChip = (val: boolean) =>
    updateInstanceFilter("list", "isChip", val);
  const setActivePrice = (val: string) =>
    updateInstanceFilter("list", "activePrice", val);
  const setActiveBathRoom = (val: string) =>
    updateInstanceFilter("list", "activeBathRoom", val);
  const setActiveBedRoom = (val: string) =>
    updateInstanceFilter("list", "activeBedRoom", val);
  const setActiveProperty = (val: string) =>
    updateInstanceFilter("list", "activeProperty", val);
  const setPage = (val: number | ((prev: number) => number)) => {
    if (typeof val === "function") {
      updateInstanceFilter("list", "page", val(page));
    } else {
      updateInstanceFilter("list", "page", val);
    }
  };

  const pillBase =
    "pl-4 pr-2 py-3 bg-white rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.12)] appearance-none font-medium cursor-pointer border transition w-full";

  const pillActive = "border-primary text-primary ring-1 ring-blue-200";

  const pillInactive = "border-[#30548733] text-gray-800";

  const params: any = {
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "filters[property_status][$notIn]": ["Expired", "Terminated", "Cancelled"],
    "filters[property_sub_type][$notNull]": true,
    "filters[raw_data][BCRES_SoldDate][$null]": true,
  };

  // price sorting
  if (activePrice && activePrice !== "any") {
    params.price = activePrice;
  }

  // bedroom filter
  if (activeBedRoom && activeBedRoom !== "any") {
    params.beds = activeBedRoom;
  }

  // bathroom filter
  if (activeBathRoom && activeBathRoom !== "any") {
    params.baths = activeBathRoom;
  }

  // property type filter
  if (activeProperty && activeProperty !== "any") {
    params.type = activeProperty;
  }

  // search
  if (search) {
    params.search = search;
  }

  // popup filters
  if (minPrice !== undefined && minPrice > 1000) params.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice < 20000000) params.maxPrice = maxPrice;
  if (minSqft !== undefined && minSqft > 100) params.minSqft = minSqft;
  if (maxSqft !== undefined && maxSqft < 15000) params.maxSqft = maxSqft;

  if (status && status !== "any") {
    params.propertyType = status;
    delete params["filters[property_status][$notIn]"];
    delete params["filters[raw_data][BCRES_SoldDate][$null]"];
    delete params["filters[property_sub_type][$notNull]"];
  }

  if (location && location !== "") {
    params.location = location;
  }

  const select = (res: any) => {
    const listings = res?.data || [];
    const pagination = res?.meta?.pagination || {
      pageCount: res?.count ? Math.ceil(res.count / pageSize) : 1,
    };

    const properties: PropertyCardProps[] = listings.map((listing: any) => ({
      id: listing.documentId,
      image: listing?.media?.[0] ?? listing?.media[0]?.MediaURL,
      title: listing?.property_sub_type,
      price: listing?.price,
      daysAgo: listing?.raw_data?.OriginalEntryTimestamp ?? 0,
      address: `${listing?.address}, ${listing?.city}, ${listing?.state}`,
      sqft: listing?.area ?? listing?.lot_size_area ?? 0,
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
      mls: listing?.mls_number ?? listing?.listing_id,
      realtor:
        listing?.office_data?.OfficeName ||
        listing?.raw_data?.ListAOR ||
        "Unknown",
      isFavourite: listing?.is_favorite || isWishlistPage,
    }));

    return { properties, listings, pagination };
  };

  const isForSale = status === "forSale" || !status;
  const { data: queryDataNormal, isLoading: loadingNormal } = useGetListings(
    params,
    {
      select,
      enabled: !isWishlistPage && !isForSale,
    },
  );

  const { data: queryDataActive, isLoading: loadingActive } =
    useGetActiveListings({
      select,
      enabled: !isWishlistPage && isForSale,
    });

  const queryData = isForSale ? queryDataActive : queryDataNormal;
  const loading = isForSale ? loadingActive : loadingNormal;

  const {
    data: wishlistData,
    isLoading: wishlistLoading,
    error: wishlistError,
    refetch: refetchWishlist,
  } = useGetWishlistProperties({
    select,
    enabled: isWishlistPage && isLoggedIn,
  });

  useEffect(() => {
    if (isWishlistPage && isLoggedIn) {
      refetchWishlist();
    }
  }, [isWishlistPage, isLoggedIn, refetchWishlist]);

  const data = isWishlistPage
    ? wishlistData?.properties || []
    : queryData?.properties || [];
  const listingData = isWishlistPage
    ? wishlistData?.listings || []
    : queryData?.listings || [];
  const pageCount = isWishlistPage
    ? wishlistData?.pagination?.pageCount || 1
    : queryData?.pagination?.pageCount || 1;
  const isLoading = isWishlistPage ? wishlistLoading : loading;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <div className="xl:max-w-screen-2xl mx-auto xl:px-16 md:px-13 px-6 pt-5 w-full h-full">
      <div className="h-full mt-24">
        {(isWishlistPage ||
          (status && (status === "sold" || status === "expired"))) &&
          !isLoggedIn && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <h2 className="text-3xl font-bold text-center capitalize">
                {isWishlistPage ? "Wishlist" : `${status} Properties`}
              </h2>
              <p className="text-gray-600">
                Please login to view your {isWishlistPage ? "wishlist" : status}{" "}
                properties
              </p>
              <CustomButton
                label="Login Now"
                buttonType="primary"
                onClick={() => setOpenLogin(true)}
                customClasses="px-10"
              />
            </div>
          )}

        {(isLoggedIn ||
          (!isWishlistPage && status !== "sold" && status !== "expired")) && (
          <>
            {isWishlistPage && !isLoading && data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 w-full">
                <h2 className="text-3xl font-bold">No Wishlist Yet</h2>
                <p className="text-gray-600 text-center max-w-md">
                  You haven't saved any properties yet. Explore our listings and
                  click the heart icon to save your wishlist!
                </p>
                <Link href="/properties">
                  <CustomButton
                    label="Explore Properties"
                    buttonType="primary"
                    customClasses="px-10"
                  />
                </Link>
              </div>
            ) : (
              <>
                {/* Top Filters Row */}
                <div className="flex items-center gap-4 flex-wrap mb-6 justify-between">
                  {/* 🔍 CHIP SEARCH BAR (DESIGN SAME) */}
                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-[0_0_20px_0_rgba(0,0,0,0.12)] border border-gray-200 w-full max-w-md">
                    {isChip ? (
                      <Chip
                        label={search}
                        onDelete={() => {
                          setSearch("");
                          setIsChip(false);
                        }}
                        className="bg-gray-100 text-sm"
                      />
                    ) : (
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search city..."
                        className="flex-1 text-sm outline-none bg-transparent"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && search.trim()) {
                            setIsChip(true);
                          }
                        }}
                      />
                    )}

                    <button
                      className="ml-auto bg-[#E6A500] p-2.5 rounded-lg flex items-center justify-center"
                      onClick={() => {
                        if (search.trim()) setIsChip(true);
                      }}
                    >
                      <FiSearch size={18} className="text-white" />
                    </button>
                  </div>

                  <button className="px-4 py-4 bg-gray rounded-xl shadow items-center gap-2 hidden">
                    <BookmarkIcon sx={{ color: "#33333333" }} />
                    Save Search
                  </button>
                </div>

                {/* Filters */}
                {pathName === "/properties" && (
                  <div className="flex flex-wrap justify-between items-center gap-4 lg:flex-nowrap mb-6 h-auto w-full">
                    <div className="flex flex-row justify-between items-center gap-4 w-full xl:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenFilters(true);
                        }}
                        className="px-6 py-3 bg-background rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.12)] flex items-center justify-center gap-3 border-[#30548733] cursor-pointer w-full xl:w-fit"
                      >
                        <FilterListIcon sx={{ color: "#305487" }} />
                        <span className="font-medium">Filters</span>
                      </button>
                      <button
                        onClick={() => {
                          clearInstanceFilters("list");
                        }}
                        className={`px-4 py-3 text-sm rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.12)] lg:hidden flex flex-nowrap flex-row items-center gap-2 border border-[#30548733] cursor-pointer w-full justify-center text-nowrap ${
                          activePrice !== "any" ||
                          activeBedRoom !== "any" ||
                          activeBathRoom !== "any" ||
                          activeProperty !== "any" ||
                          filters.status ||
                          (filters.minPrice !== undefined &&
                            filters.minPrice > 1000) ||
                          (filters.maxPrice !== undefined &&
                            filters.maxPrice < 20000000) ||
                          (filters.minSqft !== undefined &&
                            filters.minSqft > 100) ||
                          (filters.maxSqft !== undefined &&
                            filters.maxSqft < 15000) ||
                          filters.location
                            ? "bg-primary text-white"
                            : "bg-white"
                        }`}
                      >
                        <FiX size={16} />
                        <span className="font-medium">Reset Filters</span>
                      </button>
                    </div>

                    {/* Price */}
                    <div className="w-full flex flex-row xs:flex-nowrap flex-wrap justify-between items-center gap-4">
                      <FilterPillSelect
                        label="Price"
                        value={activePrice}
                        onChange={setActivePrice}
                        pillBase={pillBase}
                        pillActive={pillActive}
                        pillInactive={pillInactive}
                        options={[
                          { label: "Any", value: "any" },
                          { label: "Low to High", value: "asc" },
                          { label: "High to Low", value: "desc" },
                        ]}
                      />

                      {/* BedRoom */}
                      <FilterPillSelect
                        label="BedRoom"
                        value={activeBedRoom}
                        onChange={setActiveBedRoom}
                        pillBase={pillBase}
                        pillActive={pillActive}
                        pillInactive={pillInactive}
                        options={[
                          { label: "Any", value: "any" },
                          { label: "1", value: "1" },
                          { label: "2", value: "2" },
                          { label: "3", value: "3" },
                          { label: "4+", value: "4" },
                        ]}
                      />
                    </div>
                    <div className="w-full flex flex-row sm:flex-nowrap flex-wrap justify-between items-center gap-4">
                      {/* BathRoom */}
                      <FilterPillSelect
                        label="BathRoom"
                        value={activeBathRoom}
                        onChange={setActiveBathRoom}
                        pillBase={pillBase}
                        pillActive={pillActive}
                        pillInactive={pillInactive}
                        options={[
                          { label: "Any", value: "any" },
                          { label: "1", value: "1" },
                          { label: "2", value: "2" },
                          { label: "3", value: "3" },
                          { label: "4+", value: "4" },
                        ]}
                      />

                      {/* Property Type */}
                      <FilterPillSelect
                        label="Property Type"
                        value={activeProperty}
                        onChange={setActiveProperty}
                        pillBase={pillBase}
                        pillActive={pillActive}
                        pillInactive={pillInactive}
                        options={[
                          { label: "Any", value: "any" },
                          {
                            label: "Apartment/Condo",
                            value: "Apartment/Condo",
                          },
                          {
                            label: "Single Family Residence",
                            value: "Single Family Residence",
                          },
                          { label: "Townhouse", value: "Townhouse" },
                          { label: "Half Duplex", value: "Half Duplex" },
                          {
                            label: "Row House (Non-Strata)",
                            value: "Row House (Non-Strata)",
                          },
                        ]}
                      />
                    </div>
                    <button
                      onClick={() => {
                        clearInstanceFilters("list");
                      }}
                      className={`px-4 py-3 text-sm rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.12)] hidden lg:flex flex-nowrap flex-row items-center gap-2 border border-[#30548733] cursor-pointer w-auto text-nowrap ${
                        activePrice !== "any" ||
                        activeBedRoom !== "any" ||
                        activeBathRoom !== "any" ||
                        activeProperty !== "any" ||
                        filters.status ||
                        (filters.minPrice !== undefined &&
                          filters.minPrice > 1000) ||
                        (filters.maxPrice !== undefined &&
                          filters.maxPrice < 20000000) ||
                        (filters.minSqft !== undefined &&
                          filters.minSqft > 100) ||
                        (filters.maxSqft !== undefined &&
                          filters.maxSqft < 15000) ||
                        filters.location
                          ? "bg-primary text-white"
                          : "bg-white"
                      }`}
                    >
                      <FiX size={16} />
                      <span className="font-medium">Reset Filters</span>
                    </button>
                  </div>
                )}
                {((filters.status && filters.status !== "forSale") ||
                  (filters.minPrice !== undefined && filters.minPrice > 1000) ||
                  (filters.maxPrice !== undefined &&
                    filters.maxPrice < 20000000) ||
                  (filters.minSqft !== undefined && filters.minSqft > 100) ||
                  (filters.maxSqft !== undefined && filters.maxSqft < 15000) ||
                  filters.location) && (
                  <div className="w-full flex flex-row justify-between items-center mb-4">
                    <span className="font-medium text-sm">
                      Selected Filters:
                    </span>
                    <div className="flex flex-row gap-2">
                      {(filters.minPrice !== undefined &&
                        filters.minPrice > 1000) ||
                      (filters.maxPrice !== undefined &&
                        filters.maxPrice < 20000000) ? (
                        <Chip
                          label={`$${filters.minPrice} to ${filters.maxPrice === 20000000 ? "Max" : `$${filters.maxPrice}`}`}
                          onDelete={() => {
                            updateInstanceFilter("list", "minPrice", 0);
                            updateInstanceFilter("list", "maxPrice", 20000000);
                          }}
                          className="bg-gray-100 text-sm"
                        />
                      ) : null}
                      {(filters.minSqft !== undefined &&
                        filters.minSqft > 100) ||
                      (filters.maxSqft !== undefined &&
                        filters.maxSqft < 15000) ? (
                        <Chip
                          label={`${filters.minSqft}sqft to ${filters.maxSqft === 15000 ? "Max" : `${filters.maxSqft}sqft`}`}
                          onDelete={() => {
                            updateInstanceFilter("list", "minSqft", 0);
                            updateInstanceFilter("list", "maxSqft", 15000);
                          }}
                          className="bg-gray-100 text-sm"
                        />
                      ) : null}
                      {filters.status && filters.status !== "forSale" && (
                        <Chip
                          label={filters.status}
                          onDelete={() => {
                            updateInstanceFilter("list", "status", "forSale");
                          }}
                          className="bg-gray-100 text-sm capitalize"
                        />
                      )}
                      {filters.location && (
                        <Chip
                          label={filters.location}
                          onDelete={() => {
                            updateInstanceFilter("list", "location", "");
                          }}
                          className="bg-gray-100 text-sm"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Map + List */}
                {isLoading ? (
                  <div className="flex justify-between items-start mb-10 w-full">
                    <div className="xl:flex h-[65svh] w-full xl:w-[40%] hidden">
                      <div className="w-full h-full flex justify-center items-center animate-pulse bg-gray-200 rounded-xl" />
                    </div>
                    <div className="xl:w-[64%] w-full flex flex-col">
                      <div className="flex flex-wrap gap-y-7 justify-between overflow-y-scroll xl:h-[65svh] no-scrollbar w-full xl:p-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <PropertyCardSkeleton key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : data.length === 0 ? (
                  <div className="w-full xl:h-[65svh] h-full flex justify-center items-center">
                    <h3 className="text-2xl font-medium">
                      No Properties Found
                    </h3>
                  </div>
                ) : (
                  <div className="flex justify-between items-start mb-10 w-full ">
                    {/* <div className="xl:flex h-[65svh] w-full xl:w-[40%] hidden">
                      <PropertiesMap
                        locations={listingData}
                        zoom={8}
                        center={[-122.89, 49.28]}
                      />
                    </div> */}

                    <div className=" w-full flex flex-col h-full">
                      <div className=" gap-7 grid grid-cols-1 md:grid-cols-3 justifyjustify-between overflow-y-scroll xl:h-[65svh] no-scrollbar w-full xl:p-3">
                        {data.map((property: any) => (
                          <PropertiesCard
                            key={property.id}
                            {...property}
                            isLogin
                            isSold={status === "sold"}
                            isExpired={status === "expired"}
                          />
                        ))}
                      </div>
                      {data?.length !== 0 && pageCount !== 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 4,
                          }}
                        >
                          <Pagination
                            count={pageCount}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                          />
                        </Box>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <FiltersPopup
        id="list"
        open={openFilters}
        onClose={() => setOpenFilters(false)}
      />
    </div>
  );
}
