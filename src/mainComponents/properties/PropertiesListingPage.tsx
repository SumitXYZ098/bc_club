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
import { useGetListings } from "@/src/hooks/listing/useListingQueries";

export default function PropertiesListingPage() {
  const [openFilters, setOpenFilters] = useState(false);

  const { filters, updateFilter, clearFilters } = useListingStore();

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

  const setSearch = (val: string) => updateFilter("search", val);
  const setIsChip = (val: boolean) => updateFilter("isChip", val);
  const setActivePrice = (val: string) => updateFilter("activePrice", val);
  const setActiveBathRoom = (val: string) =>
    updateFilter("activeBathRoom", val);
  const setActiveBedRoom = (val: string) => updateFilter("activeBedRoom", val);
  const setActiveProperty = (val: string) =>
    updateFilter("activeProperty", val);
  const setPage = (val: number | ((prev: number) => number)) => {
    if (typeof val === "function") {
      updateFilter("page", val(page));
    } else {
      updateFilter("page", val);
    }
  };

  const pillBase =
    "pl-4 pr-2 py-3 bg-white rounded-full shadow-[0_0_20px_0_rgba(0,0,0,0.12)] appearance-none font-medium cursor-pointer border transition w-full";

  const pillActive = "border-primary text-primary ring-1 ring-blue-200";

  const pillInactive = "border-[#30548733] text-gray-800";

  const params: any = {
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "filters[property_status][$notIn]": ["Rented", "Expired"],
    "filters[property_sub_type][$notNull]": true,
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
  if (maxSqft !== undefined && maxSqft < 5000) params.maxSqft = maxSqft;

  if (status && status !== "any") {
    params.propertyType = status;
    delete params["filters[property_status][$notIn]"];
  }

  if (location && location !== "") {
    params.location = location;
  }

  const {
    data: queryData,
    isLoading: loading,
    error,
  } = useGetListings(params, {
    select: (res: any) => {
      const listings = res?.data || [];
      const pagination = res?.meta?.pagination || { pageCount: 1 };

      const properties: PropertyCardProps[] = listings.map((listing: any) => ({
        id: listing.documentId,
        image: listing?.media?.[0]?.MediaURL,
        title: listing?.property_sub_type,
        price: listing?.price,
        daysAgo: listing.DaysOnMarket ?? 0,
        address: listing?.address
          ? `${listing?.address}, ${listing?.city}, ${listing?.state}`
          : `${listing?.city}, ${listing?.state}` || "",
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
        isLogin: false,
      }));

      return { properties, listings, pagination };
    },
  });

  const data = queryData?.properties || [];
  const listingData = queryData?.listings || [];
  const pageCount = queryData?.pagination?.pageCount || 1;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <section className="xl:max-w-screen-2xl mx-auto xl:px-16 md:px-13 px-6 pt-5 w-full h-full">
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
                placeholder="Search country..."
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
        <div className="flex justify-between items-center gap-4 flex-nowrap mb-6">
          <button
            onClick={() => setOpenFilters(true)}
            className="px-6 py-3 bg-background rounded-full shadow-[0_0_20px_0_rgba(0,0,0,0.12)] flex items-center justify-center gap-3 border-[#30548733] cursor-pointer xl:w-3/5 w-full"
          >
            {/* <FiFilter size={18} className="text-blue-600" /> */}
            <FilterListIcon sx={{ color: "#305487" }} />
            <span className="font-medium">Filters</span>
          </button>

          {/* Price */}
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
              { label: "Apartment/Condo", value: "Apartment/Condo" },
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

          <button
            onClick={() => {
              clearFilters();
            }}
            className={`px-4 py-3 text-sm rounded-full shadow-[0_0_20px_0_rgba(0,0,0,0.12)] flex flex-nowrap flex-row items-center gap-2 border border-[#30548733] cursor-pointer w-auto text-nowrap ${activePrice !== "any" || activeBedRoom !== "any" || activeBathRoom !== "any" || activeProperty !== "any" || minPrice !== undefined || minSqft !== undefined || location ? "bg-primary text-white" : "bg-white"}`}
          >
            <FiX size={16} />
            <span className="font-medium">Reset Filters</span>
          </button>
        </div>

        {/* Map + List */}
        <div className="flex justify-between items-start mb-10 w-full ">
          <div className="xl:flex h-[65svh] w-full xl:w-[40%] hidden">
            <PropertiesMap locations={listingData} />
          </div>

          <div className="xl:w-[64%] w-full flex flex-col">
            <div className="flex flex-wrap gap-y-7 justify-between overflow-y-scroll xl:h-[65svh] no-scrollbar w-full xl:p-3">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))
              ) : data.length === 0 ? (
                <div className="w-full h-full flex justify-center items-center">
                  <h3 className="text-2xl font-medium">No Properties Found</h3>
                </div>
              ) : (
                data.map((property) => (
                  <PropertiesCard key={property.id} {...property} isLogin />
                ))
              )}
            </div>
            {data?.length !== 0 && pageCount !== 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
      </div>

      <FiltersPopup open={openFilters} onClose={() => setOpenFilters(false)} />
    </section>
  );
}
