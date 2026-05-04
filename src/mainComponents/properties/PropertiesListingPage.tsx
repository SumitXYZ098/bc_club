"use client";
import { useEffect, useState, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import FiltersPopup from "@/src/components/common/propertiesCard/FiltersPopup";
import { Box, Chip, Pagination } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FilterListIcon from "@mui/icons-material/FilterList";
import PropertiesCard, {
  PropertyCardProps,
} from "@/src/components/common/propertiesCard/PropertiesCard";
import PropertyCardSkeleton from "@/src/components/common/propertiesCard/PropertyCardSkeleton";
import FilterPillSelect from "@/src/components/filterPillSelect/FilterPillSelect";

import { useListingStore } from "@/src/store/useListingStore";
import {
  useGetListings,
  useGetActiveListings,
  useGetMe,
} from "@/src/hooks/listing/useListingQueries";
import { getOfficeName } from "@/src/utilities/utilities";

export default function PropertiesListingPage() {
  const { data: me } = useGetMe();
  const [openFilters, setOpenFilters] = useState(false);

  const { getInstanceFilters, updateInstanceFilter, clearInstanceFilters } =
    useListingStore();
  const filters = getInstanceFilters("list");

  const search = filters.search || "";
  const isChip = filters.isChip || false;
  const activePrice = filters.activePrice || "newest";
  const activeBathRoom = filters.activeBathRoom || "any";
  const activeBedRoom = filters.activeBedRoom || "any";
  const activeProperty = filters.activeProperty || "any";
  const page = filters.page || 1;
  const pageSize = 30;

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
  const setActivePrice = (val: string) => {
    console.log("Setting Active Price:", val);
    updateInstanceFilter("list", "activePrice", val);
  };
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

  const isForSale = !status || status === "forSale";

  const params: any = {
    page: page,
    pageSize: pageSize,
  };

  if (!isForSale) {
    params["filters[property_sub_type][$notNull]"] = true;
    if (status === "sold") {
      params["filters[property_status][$eq]"] = "Closed";
    } else if (status === "expired") {
      params["filters[property_status][$eq]"] = "Expired";
    }
  }

  // sorting
  if (activePrice && activePrice !== "any") {
    if (isForSale) {
      if (activePrice === "newest") params.sort = "ModificationTimestamp:desc";
      else if (activePrice === "oldest")
        params.sort = "ModificationTimestamp:asc";
      else if (activePrice === "asc") params.sort = "price:asc";
      else if (activePrice === "desc") params.sort = "price:desc";
    } else {
      if (activePrice === "newest") params.sort = "createdAt:desc";
      else if (activePrice === "oldest") params.sort = "createdAt:asc";
      else params.sort = `price:${activePrice}`;
    }
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
  } else if (isForSale) {
    params.propertyType = "forSale";
  }

  if (location && location !== "") {
    params.location = location;
  }

  const select = (res: any) => {
    const listings = res?.data || [];
    const pagination = res?.meta?.pagination || {
      pageCount: res?.count ? Math.ceil(res.count / pageSize) : 1,
    };

    let properties: PropertyCardProps[] = listings
      .map((listing: any) => ({
        id: listing?.documentId,
        image:
          typeof listing?.media?.[0] === "string"
            ? listing.media[0]
            : listing?.media?.[0]?.MediaURL,
        title: listing?.property_sub_type,
        price: listing?.price,
        daysAgo:
          listing?.ModificationTimestamp ??
          listing?.raw_data?.BridgeModificationTimestamp ??
          0,
        address: `${listing?.address}, ${listing?.city}, ${listing?.state}`,
        sqft: listing?.area ?? listing?.lot_size_area ?? 0,
        beds: listing?.bedrooms ?? 0,
        baths: listing?.bathrooms ?? 0,
        likesCount: listing?.likesCount ?? 0,
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
        mls:
          listing?.mls_number ??
          listing?.listing_id ??
          listing?.raw_data?.ListingID ??
          listing?.raw_data?.MLS ??
          listing?.MlsNumber ??
          listing?.raw_data?.MlsNumber ??
          "N/A",
        realtor: getOfficeName(listing),
        isFavourite: listing?.users_permissions_users?.some(
          (user: any) => user?.documentId === me?.documentId,
        ),
        isDdf: isForSale,
      }))
      .filter((p: any) => Number(p.price) > 0);

    // Explicit client-side sort to guarantee order regardless of API behavior
    if (activePrice === "asc") {
      properties.sort(
        (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0),
      );
    } else if (activePrice === "desc") {
      properties.sort(
        (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0),
      );
    } else if (activePrice === "newest") {
      properties.sort((a, b) => {
        const dateA = a.daysAgo ? new Date(a.daysAgo).getTime() : 0;
        const dateB = b.daysAgo ? new Date(b.daysAgo).getTime() : 0;
        return dateB - dateA;
      });
    } else if (activePrice === "oldest") {
      properties.sort((a, b) => {
        const dateA = a.daysAgo ? new Date(a.daysAgo).getTime() : 0;
        const dateB = b.daysAgo ? new Date(b.daysAgo).getTime() : 0;
        return dateA - dateB;
      });
    } else if (activePrice === "popular") {
      properties.sort(
        (a, b) => (Number(b.likesCount) || 0) - (Number(a.likesCount) || 0),
      );
    }

    return { properties, listings, pagination };
  };

  const { data: queryDataNormal, isLoading: isLoadingNormal } = useGetListings(
    params,
    {
      select,
      enabled: !isForSale,
    },
  );

  const { data: queryDataActive, isLoading: isLoadingActive } =
    useGetActiveListings(params, {
      select,
      enabled: isForSale,
    });

  const queryData = isForSale ? queryDataActive : queryDataNormal;
  const loading = isForSale ? isLoadingActive : isLoadingNormal;

  const data = queryData?.properties || [];

  const pageCount = queryData?.pagination?.pageCount || 1;

  const isLoading = loading;
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🚀 Scroll to top of the container on filter change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [
    search,
    activePrice,
    activeBathRoom,
    activeBedRoom,
    activeProperty,
    minPrice,
    maxPrice,
    minSqft,
    maxSqft,
    status,
    location,
    page,
  ]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <div className="xl:max-w-screen-2xl mx-auto xl:px-16 md:px-13 px-6 pt-5 w-full h-full">
      <div className="h-full mt-24">
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
                scrollRef.current?.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className={`px-4 py-3 text-sm rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.12)] lg:hidden flex flex-nowrap flex-row items-center gap-2 border border-[#30548733] cursor-pointer w-full justify-center text-nowrap ${
                activePrice !== "any" ||
                activeBedRoom !== "any" ||
                activeBathRoom !== "any" ||
                activeProperty !== "any" ||
                filters.status ||
                (filters.minPrice !== undefined && filters.minPrice > 1000) ||
                (filters.maxPrice !== undefined &&
                  filters.maxPrice < 20000000) ||
                (filters.minSqft !== undefined && filters.minSqft > 100) ||
                (filters.maxSqft !== undefined && filters.maxSqft < 15000) ||
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
              label="Sort By"
              value={activePrice}
              onChange={setActivePrice}
              pillBase={pillBase}
              pillActive={pillActive}
              pillInactive={pillInactive}
              options={[
                { label: "Newest First", value: "newest" },
                { label: "Oldest First", value: "oldest" },
                { label: "Low to High", value: "asc" },
                { label: "High to Low", value: "desc" },
                { label: "Popular First", value: "popular" },
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
                { label: "All", value: "any" },
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
                { label: "All", value: "any" },
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
              options={
                status === "sold" || status === "expired"
                  ? [
                      { label: "All", value: "any" },
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
                    ]
                  : [
                      { label: "All", value: "any" },
                      {
                        label: "Single-Family",
                        value: "Single-Family",
                      },
                      {
                        label: "Multi-Family",
                        value: "Multi-Family",
                      },
                      { label: "Office", value: "Office" },
                      { label: "Business", value: "Business" },
                      { label: "Agriculture", value: "Agriculture" },
                      { label: "Vacant Land", value: "Vacant Land" },
                    ]
              }
            />
          </div>
          <button
            onClick={() => {
              clearInstanceFilters("list");
              scrollRef.current?.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className={`px-4 py-3 text-sm rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.12)] hidden lg:flex flex-nowrap flex-row items-center gap-2 border border-[#30548733] cursor-pointer w-auto text-nowrap ${
              activePrice !== "any" ||
              activeBedRoom !== "any" ||
              activeBathRoom !== "any" ||
              activeProperty !== "any" ||
              filters.status ||
              (filters.minPrice !== undefined && filters.minPrice > 1000) ||
              (filters.maxPrice !== undefined && filters.maxPrice < 20000000) ||
              (filters.minSqft !== undefined && filters.minSqft > 100) ||
              (filters.maxSqft !== undefined && filters.maxSqft < 15000) ||
              filters.location
                ? "bg-primary text-white"
                : "bg-white"
            }`}
          >
            <FiX size={16} />
            <span className="font-medium">Reset Filters</span>
          </button>
        </div>

        {((filters.status && filters.status !== "forSale") ||
          (filters.minPrice !== undefined && filters.minPrice > 1000) ||
          (filters.maxPrice !== undefined && filters.maxPrice < 20000000) ||
          (filters.minSqft !== undefined && filters.minSqft > 100) ||
          (filters.maxSqft !== undefined && filters.maxSqft < 15000) ||
          filters.location) && (
          <div className="w-full flex flex-row justify-between items-center mb-4">
            <span className="font-medium text-sm">Selected Filters:</span>
            <div className="flex flex-row gap-2">
              {(filters.minPrice !== undefined && filters.minPrice > 1000) ||
              (filters.maxPrice !== undefined &&
                filters.maxPrice < 20000000) ? (
                <Chip
                  label={`$${Number(filters.minPrice).toLocaleString()} to ${filters.maxPrice === 20000000 ? "Max" : `$${Number(filters.maxPrice).toLocaleString()}`}`}
                  onDelete={() => {
                    updateInstanceFilter("list", "minPrice", 0);
                    updateInstanceFilter("list", "maxPrice", 20000000);
                  }}
                  className="bg-gray-100 text-sm"
                />
              ) : null}
              {(filters.minSqft !== undefined && filters.minSqft > 100) ||
              (filters.maxSqft !== undefined && filters.maxSqft < 15000) ? (
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
              {filters.location &&
                filters.location
                  .split(",")
                  .filter(Boolean)
                  .map((loc: string) => (
                    <Chip
                      key={loc}
                      label={loc}
                      onDelete={() => {
                        const remaining = (filters.location || "")
                          .split(",")
                          .filter((l: string) => l !== loc)
                          .join(",");
                        updateInstanceFilter("list", "location", remaining);
                      }}
                      className="bg-gray-100 text-sm"
                    />
                  ))}
            </div>
          </div>
        )}

        {/* Property Grid */}
        {isLoading ? (
          <div className="flex justify-between items-start mb-10 w-full">
            <div className="w-full flex flex-col h-full">
              <div
                ref={scrollRef}
                className="gap-7 grid grid-cols-1 md:grid-cols-3 justify-between overflow-y-scroll xl:h-[65svh] no-scrollbar w-full xl:p-3"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full xl:h-[65svh] h-full flex justify-center items-center">
            <h3 className="text-2xl font-medium">No Properties Found</h3>
          </div>
        ) : (
          <div className="flex justify-between items-start mb-10 w-full">
            <div className="w-full flex flex-col h-full">
              <div
                ref={scrollRef}
                className="gap-7 grid grid-cols-1 md:grid-cols-3 justify-between overflow-y-scroll xl:h-[80svh] no-scrollbar w-full xl:p-3"
              >
                {data.map((property: any) => (
                  <PropertiesCard
                    key={property.id}
                    {...property}
                    isLogin
                    isSold={status === "sold"}
                    isExpired={status === "expired"}
                    isDdf={property.isDdf}
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
      </div>

      <FiltersPopup
        id="list"
        open={openFilters}
        onClose={() => setOpenFilters(false)}
      />
    </div>
  );
}
