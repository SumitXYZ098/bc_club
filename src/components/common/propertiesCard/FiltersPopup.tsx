"use client";
import React, { useEffect, useState } from "react";
import { FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Image from "next/image";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { Images } from "@/src/app/exports";
import LineGradient from "../lineGradient/LineGradient";
import CustomButton from "../../button/CustomButton";
import { Dialog } from "@mui/material";

// ================= Constants =================
const ALL_CITIES = [
  // Core Metro Vancouver
  "Vancouver",
  "Burnaby",
  "Richmond",
  "Surrey",
  "Coquitlam",
  "Port Coquitlam",
  "Port Moody",
  "New Westminster",
  "North Vancouver",
  "West Vancouver",

  // Fraser Valley
  "Abbotsford",
  "Chilliwack",
  "Mission",
  "Agassiz",
  "Hope",
  "Langley",
  "Maple Ridge",
  "Pitt Meadows",
  "Delta",
  "White Rock",
  "Tsawwassen",
  "Ladner",
  "Yarrow",
  "Rosedale",
  "Greendale",

  // Vancouver Island (important missing earlier)
  "Victoria",
  "Langford",
  "Saanich",
  "Nanaimo",
  "Courtenay",
  "Comox",
  "Campbell River",
  "Parksville",
  "Duncan",
  "Sidney",

  // Interior BC
  "Kelowna",
  "Kamloops",
  "Prince George",
  "Vernon",
  "Penticton",
  "Salmon Arm",
  "Nelson",
  "Castlegar",
  "Trail",

  // Sea-to-Sky
  "Squamish",
  "Whistler",
  "Pemberton",
  "Britannia Beach",
  "Lions Bay",

  // Sunshine Coast
  "Sechelt",
  "Gibsons",
  "Madeira Park",
  "Roberts Creek",
  "Egmont",

  // Islands
  "Salt Spring Island",
  "Pender Island",
  "Mayne Island",
  "Galiano Island",
  "Saturna Island",
  "Gabriola Island",
  "Bowen Island",
  "Gambier Island",
  "Keats Island",

  // Small / Rural / Edge cases
  "Anmore",
  "Belcarra",
  "D'Arcy",
  "Birken",
  "Brackendale",
  "Furry Creek",
  "Halfmoon Bay",
  "Garden Bay",
  "Harrison Hot Springs",
  "Harrison Mills",
  "Cultus Lake",
  "Lindell Beach",
  "Sunshine Valley",
  "Boston Bar",
  "Lytton",
  "Yale",
  "Vanderhoof",

  // DDF-specific / MLS weird values (optional keep)
  "Sardis",
  "Sardis - Chwk River Valley",
  "Sardis - Greendale",
  "University Endowment Lands",
  "Columbia Valley",
];

const POPULAR_CITIES = [
  "Vancouver",
  "Surrey",
  "Burnaby",
  "Coquitlam",
  "Richmond",
  "Langley",
  "Abbotsford",
  "Delta",
];
import { useListingStore } from "@/src/store/useListingStore";
import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";

// ================= Slider Theme =================
const PriceSlider = styled(Slider)({
  color: "#E8A200",
  height: 6,
  padding: "14px 0",
  "& .MuiSlider-thumb": {
    height: 18,
    width: 18,
    backgroundColor: "#E8A200",
    border: "3px solid #fff",
    boxShadow: "0 2px 6px rgba(0,0,0,.25)",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-track": {
    height: 12,
  },

  "& .MuiSlider-rail": {
    height: 12,
    opacity: 1,
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: "0 10px",
    width: "fit-content",
    height: 32,
    borderRadius: 20,
    backgroundColor: "#E8A200",
    transform: "translate(0%, 10%) rotate(180deg) scale(0)",
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(0%, 10%) rotate(180deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(180deg)",
    },
  },
});

// ================= Types =================
interface FiltersDialogProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

// ================= Component =================
export default function FiltersPopup({
  open,
  onClose,
  id,
}: FiltersDialogProps) {
  const { isLoggedIn, setOpenLogin } = useAuthContext();
  const { getInstanceFilters, updateInstanceFilter, clearInstanceFilters } =
    useListingStore();

  const filters = getInstanceFilters(id);

  const [price, setPrice] = useState<[number | null, number | null]>([
    filters.minPrice ?? 0,
    filters.maxPrice ?? 20000000,
  ]);

  const [sqft, setSqft] = useState<[number | null, number | null]>([
    filters.minSqft ?? 0,
    filters.maxSqft ?? 15000,
  ]);
  const [lotSqft, setLotSqft] = useState<[number | null, number | null]>([
    filters.minLotSizeArea ?? 0,
    filters.maxLotSizeArea ?? 100000,
  ]);
  const [tax, setTax] = useState<[number | null, number | null]>([
    filters.minTax ?? 0,
    filters.maxTax ?? 50000,
  ]);
  const [bedrooms, setBedrooms] = useState<number | null>(
    filters.activeBedRoom && filters.activeBedRoom !== "any"
      ? Number(filters.activeBedRoom.replace("+", ""))
      : null,
  );
  const [bathrooms, setBathrooms] = useState<number | null>(
    filters.activeBathRoom && filters.activeBathRoom !== "any"
      ? Number(filters.activeBathRoom.replace("+", ""))
      : null,
  );
  const [status, setStatus] = useState<string>(filters.status ?? "");
  const [whenListed, setWhenListed] = useState<string>(
    filters.whenListed ?? "any",
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    filters.location ? filters.location.split(",").filter(Boolean) : [],
  );
  const [selectedProperties, setSelectedProperties] = useState<string[]>(
    filters.activeProperty && filters.activeProperty !== "any"
      ? filters.activeProperty.split(",").filter(Boolean)
      : [],
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    filters.features ? filters.features.split(",").filter(Boolean) : [],
  );

  const [selectedStructureTypes, setSelectedStructureTypes] = useState<
    string[]
  >(
    filters.structureType
      ? filters.structureType.split(",").filter(Boolean)
      : [],
  );

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [whenListedDropdownOpen, setWhenListedDropdownOpen] = useState(false);
  const [expandedCityGroup, setExpandedCityGroup] = useState<
    "all" | "popular" | null
  >("popular");

  const handleToggleLocation = (city: string) => {
    if (selectedLocations.includes(city)) {
      setSelectedLocations(selectedLocations.filter((c) => c !== city));
    } else {
      setSelectedLocations([...selectedLocations, city]);
    }
  };

  const handleToggleProperty = (prop: string, isSingleFamilyGroup: boolean) => {
    const singleFamilyOptions = [
      "Single-Family",
      "Townhouse",
      "Detached House",
      "Detached Home",
      "Duplex",
      "Apartment/Condo",
      "Apartment",
      "Single Family Residence",
      "Half Duplex",
      "Row House (Non-Strata)",
    ];

    if (isSingleFamilyGroup) {
      // If it's a Single Family group option, clear any "Other" types
      const currentSF = selectedProperties.filter((p) =>
        singleFamilyOptions.includes(p),
      );
      if (currentSF.includes(prop)) {
        setSelectedProperties(currentSF.filter((p) => p !== prop));
      } else {
        setSelectedProperties([...currentSF, prop]);
      }
    } else {
      // If it's an "Other" type, it's single-select and clears everything elsew
      setSelectedProperties([prop]);
      setSelectedStructureTypes([]);
    }
  };

  const handleToggleStructureType = (type: string) => {
    const singleFamilyOptions = [
      "Single-Family",
      "Townhouse",
      "Detached House",
      "Detached Home",
      "Duplex",
      "Apartment/Condo",
      "Apartment",
      "Single Family Residence",
      "Half Duplex",
      "Row House (Non-Strata)",
    ];
    const currentSF = selectedProperties.filter((p) =>
      singleFamilyOptions.includes(p),
    );
    if (currentSF.length !== selectedProperties.length) {
      setSelectedProperties(currentSF);
    }

    if (selectedStructureTypes.includes(type)) {
      setSelectedStructureTypes(
        selectedStructureTypes.filter((t) => t !== type),
      );
    } else {
      setSelectedStructureTypes([...selectedStructureTypes, type]);
    }
  };

  const handleToggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  useEffect(() => {
    if (open) {
      const currentFilters = getInstanceFilters(id);
      setPrice([
        currentFilters.minPrice ?? 0,
        currentFilters.maxPrice ?? 20000000,
      ]);
      setSqft([currentFilters.minSqft ?? 0, currentFilters.maxSqft ?? 15000]);
      setLotSqft([
        currentFilters.minLotSizeArea ?? 0,
        currentFilters.maxLotSizeArea ?? 100000,
      ]);
      setTax([currentFilters.minTax ?? 0, currentFilters.maxTax ?? 50000]);
      setBedrooms(
        currentFilters.activeBedRoom && currentFilters.activeBedRoom !== "any"
          ? Number(currentFilters.activeBedRoom.replace("+", ""))
          : null,
      );
      setBathrooms(
        currentFilters.activeBathRoom && currentFilters.activeBathRoom !== "any"
          ? Number(currentFilters.activeBathRoom.replace("+", ""))
          : null,
      );
      setStatus(currentFilters.status ?? "");
      setWhenListed(currentFilters.whenListed ?? "any");
      setSelectedLocations(
        currentFilters.location
          ? currentFilters.location.split(",").filter(Boolean)
          : [],
      );
      setSelectedProperties(
        currentFilters.activeProperty && currentFilters.activeProperty !== "any"
          ? currentFilters.activeProperty.split(",").filter(Boolean)
          : [],
      );
      setSelectedFeatures(
        currentFilters.features
          ? currentFilters.features.split(",").filter(Boolean)
          : [],
      );
      setSelectedStructureTypes(
        currentFilters.structureType
          ? currentFilters.structureType.split(",").filter(Boolean)
          : [],
      );
    }
  }, [open, id, getInstanceFilters]);

  const handleClearAll = () => {
    clearInstanceFilters(id);
    setPrice([0, 20000000]);
    setSqft([0, 15000]);
    setLotSqft([0, 100000]);
    setTax([0, 50000]);
    setBedrooms(null);
    setBathrooms(null);
    setStatus("");
    setWhenListed("any");
    setSelectedLocations([]);
    setSelectedProperties([]);
    setSelectedFeatures([]);
    setSelectedStructureTypes([]);
    onClose();
  };

  const handleApplyFilter = () => {
    updateInstanceFilter(id, "minPrice", price[0]);
    updateInstanceFilter(id, "maxPrice", price[1]);
    updateInstanceFilter(id, "minSqft", sqft[0]);
    updateInstanceFilter(id, "maxSqft", sqft[1]);
    updateInstanceFilter(id, "minLotSizeArea", lotSqft[0]);
    updateInstanceFilter(id, "maxLotSizeArea", lotSqft[1]);
    updateInstanceFilter(id, "minTax", tax[0]);
    updateInstanceFilter(id, "maxTax", tax[1]);
    updateInstanceFilter(
      id,
      "activeBedRoom",
      bedrooms ? (bedrooms >= 4 ? "4+" : bedrooms.toString()) : "any",
    );
    updateInstanceFilter(
      id,
      "activeBathRoom",
      bathrooms ? (bathrooms >= 4 ? "4+" : bathrooms.toString()) : "any",
    );
    updateInstanceFilter(id, "status", status);
    updateInstanceFilter(id, "whenListed", whenListed);
    updateInstanceFilter(id, "location", selectedLocations.join(","));
    updateInstanceFilter(
      id,
      "activeProperty",
      selectedProperties.length > 0 ? selectedProperties.join(",") : "any",
    );
    updateInstanceFilter(id, "features", selectedFeatures.join(","));
    updateInstanceFilter(id, "structureType", selectedStructureTypes.join(","));
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 650,
          borderRadius: 5,
          margin: "24px",
        },
      }}
    >
      {/* Popup Content */}
      <div
        className="bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto md:px-6 md:pt-6 p-4 pb-0 w-full scrollbar-hide"
        onClick={(e) => {
          e.stopPropagation();
          if (locationDropdownOpen) {
            setLocationDropdownOpen(!locationDropdownOpen);
          }
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between cursor-pointer mb-6">
          <h2 className="text-xl font-medium">Filters</h2>
          <button onClick={onClose} aria-label="Close filters" autoFocus>
            <FiX size={22} />
          </button>
        </div>

        {/* Property Type Status */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { k: "forSale", l: "For Sale", i: Images.forSale },
            { k: "sold", l: "Sold", i: Images.sold },
            { k: "expired", l: "Expired", i: Images.expired },
          ].map((s) => (
            <button
              key={s.k}
              onClick={() => {
                if ((s.k === "sold" || s.k === "expired") && !isLoggedIn) {
                  setOpenLogin(true);
                  return;
                }
                setStatus(s.k);
              }}
              className={`border rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer transition ${
                status === s.k
                  ? "bg-[#7c7c7c33] border-[#0F0F0F33]"
                  : "border-[#0F0F0F33]"
              }`}
            >
              <Image src={s.i} width={36} height={36} alt={s.l} />
              <span className="text-sm font-medium">{s.l}</span>
            </button>
          ))}
        </div>
        <LineGradient />

        {/* Location */}
        <div className="mb-6 space-y-2 flex flex-col gap-y-1 pt-5">
          <label className="font-medium">Location</label>
          <div className="relative w-full">
            <div
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="w-full border border-[#33333333] rounded-xl px-3 py-3 cursor-pointer text-sm flex justify-between items-center bg-white"
            >
              <span
                className={
                  selectedLocations.length > 0 ? "text-black" : "text-gray-500"
                }
              >
                {selectedLocations.length > 0
                  ? selectedLocations.join(", ")
                  : "All Locations"}
              </span>
              <span className="text-gray-400">
                {locationDropdownOpen ? (
                  <FiChevronUp size={18} />
                ) : (
                  <FiChevronDown size={18} />
                )}
              </span>
            </div>

            {locationDropdownOpen && (
              <div className="absolute top-full mt-1 w-full bg-white border border-[#33333333] shadow-lg rounded-xl z-50 max-h-64 overflow-y-auto overflow-x-hidden scrollbar-hide py-2">
                {/* Popular Group */}
                <div>
                  <div
                    onClick={() =>
                      setExpandedCityGroup(
                        expandedCityGroup === "popular" ? null : "popular",
                      )
                    }
                    className="px-4 py-2 bg-gray-50/80 font-medium text-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                  >
                    <span>Popular Cities</span>
                    <span className="text-gray-500">
                      {expandedCityGroup === "popular" ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </span>
                  </div>
                  {expandedCityGroup === "popular" && (
                    <div className="py-1 flex flex-col">
                      {POPULAR_CITIES.map((city) => (
                        <div
                          key={`pop-${city}`}
                          className={`px-6 py-1.5 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${
                            selectedLocations.includes(city)
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                          onClick={() => handleToggleLocation(city)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(city)}
                            onChange={() => {}}
                            className="cursor-pointer rounded border-gray-300 text-primary focus:ring-primary checkbox checkbox-sm checkbox-"
                          />
                          <span>{city}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* All Cities Group */}
                <div className="mb-1">
                  <div
                    onClick={() =>
                      setExpandedCityGroup(
                        expandedCityGroup === "all" ? null : "all",
                      )
                    }
                    className="px-4 py-2 bg-gray-50/80 font-medium text-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                  >
                    <span>All Cities</span>
                    <span className="text-gray-500">
                      {expandedCityGroup === "all" ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </span>
                  </div>
                  {expandedCityGroup === "all" && (
                    <div className="py-1 flex flex-col">
                      {ALL_CITIES.map((city) => (
                        <div
                          key={`all-${city}`}
                          className={`px-6 py-1.5 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${
                            selectedLocations.includes(city)
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                          onClick={() => handleToggleLocation(city)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(city)}
                            onChange={() => {}}
                            className="cursor-pointer rounded border-gray-300 text-primary focus:ring-primary checkbox-sm checkbox"
                          />
                          <span>{city}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <LineGradient />

        {/* When Listed */}
        <div className="mb-6 space-y-2 flex flex-col gap-y-1 pt-5">
          <label className="font-medium">When Listed</label>
          <div className="relative w-full">
            <div
              onClick={() => setWhenListedDropdownOpen(!whenListedDropdownOpen)}
              className="w-full border border-[#33333333] rounded-xl px-3 py-3 cursor-pointer text-sm flex justify-between items-center bg-white"
            >
              <span
                className={
                  whenListed !== "any"
                    ? "text-black capitalize"
                    : "text-gray-500"
                }
              >
                {whenListed === "any" ? "Any time" : whenListed}
              </span>
              <span className="text-gray-400">
                {whenListedDropdownOpen ? (
                  <FiChevronUp size={18} />
                ) : (
                  <FiChevronDown size={18} />
                )}
              </span>
            </div>

            {whenListedDropdownOpen && (
              <div className="absolute top-full mt-1 w-full bg-white border border-[#33333333] shadow-lg rounded-xl z-50 max-h-64 overflow-y-auto overflow-x-hidden scrollbar-hide py-2">
                {[
                  { label: "Any time", value: "any" },
                  { label: "Today", value: "today" },
                  { label: "Yesterday", value: "yesterday" },
                  {
                    label: "Today and yesterday",
                    value: "today and yesterday",
                  },
                  { label: "Last 7 days", value: "last 7 days" },
                  { label: "Last 14 days", value: "last 14 days" },
                  { label: "This month", value: "this month" },
                  { label: "Last month", value: "last month" },
                  { label: "This year", value: "this year" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`px-6 py-2.5 text-sm cursor-pointer hover:bg-gray-50 flex items-center transition ${
                      whenListed === option.value
                        ? "bg-gray-100 font-medium text-primary"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      setWhenListed(option.value);
                      setWhenListedDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <LineGradient />

        {/* Property Type */}
        <div className="mb-6 space-y-3 pt-5">
          <label className="font-medium">Property Type</label>
          <div className="grid grid-cols-1 gap-8">
            {status === "sold" || status === "expired" ? (
              /* Sold/Expired Options */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1 ">
                {[
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
                ].map((prop) => (
                  <div
                    key={prop.value}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => handleToggleProperty(prop.value, false)}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        selectedProperties.includes(prop.value)
                          ? "bg-primary border-primary"
                          : "border-gray-300 group-hover:border-primary"
                      }`}
                    >
                      {selectedProperties.includes(prop.value) && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {prop.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* For Sale Options */
              <>
                {/* Single Family Section */}
                <div className="bg-gray-50/50 rounded-xl p-4 border border-[#33333311]">
                  <div className="flex items-center gap-3 cursor-pointer group mb-3">
                    <span className="font-medium text-sm text-gray-700">
                      Single Family
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                    {[
                      { label: "Townhouse", value: "Townhouse" },
                      { label: "Detached Home", value: "Detached Home" },
                      { label: "Duplex", value: "Duplex" },
                      { label: "Apartment", value: "Apartment" },
                    ].map((prop) => (
                      <div
                        key={prop.value}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => handleToggleStructureType(prop.value)}
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                            selectedStructureTypes.includes(prop.value)
                              ? "bg-primary border-primary"
                              : "border-gray-300 group-hover:border-primary"
                          }`}
                        >
                          {selectedStructureTypes.includes(prop.value) && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">
                          {prop.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Types Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
                  {[
                    { label: "Multi-Family", value: "Multi-Family" },
                    { label: "Office", value: "Office" },
                    { label: "Business", value: "Business" },
                    { label: "Agriculture", value: "Agriculture" },
                    { label: "Vacant Land", value: "Vacant Land" },
                  ].map((prop) => (
                    <div
                      key={prop.value}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => handleToggleProperty(prop.value, false)}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          selectedProperties.includes(prop.value)
                            ? "bg-primary border-primary"
                            : "border-gray-300 group-hover:border-primary"
                        }`}
                      >
                        {selectedProperties.includes(prop.value) && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {prop.label}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <LineGradient />

        {/* Price Range */}
        <div className="md:mb-6 mb-3 pt-5">
          <h3 className="font-medium md:mb-3">Price Range</h3>
          <div className="relative">
            <PriceSlider
              value={[price[0] ?? 1000, price[1] ?? 20000000]}
              min={1000}
              max={20000000}
              step={2000}
              onChange={(_, v) => setPrice(v as [number, number])}
              disableSwap
              valueLabelDisplay="auto"
            />
          </div>

          <div className="flex flex-row flex-wrap items-center mt-5 justify-between gap-x-0.5 sm:gap-4">
            {/* Min */}
            <div className="flex items-center gap-1 sm:gap-4 h-full">
              <p className="text-[10px] sm:text-xs text-[#333]/30 mb-1 whitespace-nowrap">
                Min Price
              </p>
              <div className="flex text-xs sm:text-sm font-medium items-center gap-1 border border-[#33333333] rounded-xl w-24 sm:w-30.5 px-2 sm:px-4 py-2 h-full">
                <span className="text-secondary">$</span>
                <span className="">{price[0]}</span>
              </div>
            </div>

            {/* Divider */}
            <LineGradient
              customClasses="mx-1 h-10 sm:h-15 hidden sm:block"
              vr
            />

            {/* Max */}
            <div className="flex items-center gap-1 sm:gap-4 h-full">
              <p className="text-[10px] sm:text-xs text-[#333]/30 mb-1 whitespace-nowrap">
                Max Price
              </p>
              <div className="flex text-xs sm:text-sm font-medium items-center gap-1 border border-[#33333333] rounded-xl w-24 sm:w-30.5 px-2 sm:px-4 py-2 h-full">
                {price[1] === 20000000 ? (
                  <span className="">Max</span>
                ) : (
                  <>
                    <span className="text-secondary">$</span>
                    <span className="">{price[1]}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <LineGradient />
        {/* Area Range */}
        <div className="md:mb-6 mb-3 pt-5">
          <h3 className="font-medium md:mb-3">Built Area</h3>
          <div className="relative">
            <PriceSlider
              value={[sqft[0] ?? 100, sqft[1] ?? 15000]}
              min={100}
              max={15000}
              step={100}
              onChange={(_, v) => setSqft(v as [number, number])}
              disableSwap
              valueLabelDisplay="auto"
            />
          </div>

          <div className="flex items-center mt-5 justify-between gap-2 sm:gap-4">
            {/* Min */}
            <div className="flex items-center gap-1 sm:gap-4 h-full">
              <p className="text-[10px] sm:text-xs text-[#333]/30 mb-1 whitespace-nowrap">
                Min Sqft
              </p>
              <div className="flex text-xs sm:text-sm font-medium items-center gap-1 border border-[#33333333] rounded-xl w-24 sm:w-30.5 px-2 sm:px-4 py-2 h-full">
                <span className="">{sqft[0]}</span>
                <span className="text-secondary">sqft</span>
              </div>
            </div>

            {/* Divider */}
            <LineGradient
              customClasses="mx-1 h-10 sm:h-15 hidden sm:block"
              vr
            />

            {/* Max */}
            <div className="flex items-center gap-1 sm:gap-4 h-full">
              <p className="text-[10px] sm:text-xs text-[#333]/30 mb-1 whitespace-nowrap">
                Max Sqft
              </p>
              <div className="flex text-xs sm:text-sm font-medium items-center gap-1 border border-[#33333333] rounded-xl w-24 sm:w-30.5 px-2 sm:px-4 py-2 h-full">
                {sqft[1] === 15000 ? (
                  <span className="">Max</span>
                ) : (
                  <>
                    <span className="">{sqft[1]}</span>
                    <span className="text-secondary">sqft</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <LineGradient />
        {/* Lot Size */}
        <div className="md:mb-6 mb-3 pt-5">
          <h3 className="font-medium md:mb-3">Lot Size</h3>
          <div className="relative">
            <PriceSlider
              value={[lotSqft[0] ?? 100, lotSqft[1] ?? 100000]}
              min={100}
              max={100000}
              step={100}
              onChange={(_, v) => setLotSqft(v as [number, number])}
              disableSwap
              valueLabelDisplay="auto"
            />
          </div>

          <div className="flex items-center mt-5 justify-between gap-2 sm:gap-4">
            {/* Min */}
            <div className="flex items-center gap-1 sm:gap-4 h-full">
              <p className="text-[10px] sm:text-xs text-[#333]/30 mb-1 whitespace-nowrap">
                Min Sqft
              </p>
              <div className="flex text-xs sm:text-sm font-medium items-center gap-1 border border-[#33333333] rounded-xl w-24 sm:w-30.5 px-2 sm:px-4 py-2 h-full">
                <span className="">{lotSqft[0]}</span>
                <span className="text-secondary">sqft</span>
              </div>
            </div>

            {/* Divider */}
            <LineGradient
              customClasses="mx-1 h-10 sm:h-15 hidden sm:block"
              vr
            />

            {/* Max */}
            <div className="flex items-center gap-1 sm:gap-4 h-full">
              <p className="text-[10px] sm:text-xs text-[#333]/30 mb-1 whitespace-nowrap">
                Max Sqft
              </p>
              <div className="flex text-xs sm:text-sm font-medium items-center gap-1 border border-[#33333333] rounded-xl w-24 sm:w-30.5 px-2 sm:px-4 py-2 h-full">
                {lotSqft[1] === 100000 ? (
                  <span className="">Max</span>
                ) : (
                  <>
                    <span className="">{lotSqft[1]}</span>
                    <span className="text-secondary">sqft</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <LineGradient />

        {/* Tax Range */}
        <div className="md:mb-6 mb-3 pt-5">
          <h3 className="font-medium md:mb-3">Tax Range</h3>
          <div className="relative">
            <PriceSlider
              value={[tax[0] ?? 0, tax[1] ?? 50000]}
              min={0}
              max={50000}
              step={100}
              onChange={(_, v) => setTax(v as [number, number])}
              disableSwap
              valueLabelDisplay="auto"
            />
          </div>

          <div className="flex items-center mt-5 justify-between gap-2 sm:gap-4">
            {/* Min */}
            <div className="flex items-center gap-1 sm:gap-4 h-full">
              <p className="text-[10px] sm:text-xs text-[#333]/30 mb-1 whitespace-nowrap">
                Min Tax
              </p>
              <div className="flex text-xs sm:text-sm font-medium items-center gap-1 border border-[#33333333] rounded-xl w-24 sm:w-30.5 px-2 sm:px-4 py-2 h-full">
                <span className="text-secondary">$</span>
                <span className="">{tax[0]}</span>
              </div>
            </div>

            {/* Divider */}
            <LineGradient
              customClasses="mx-1 h-10 sm:h-15 hidden sm:block"
              vr
            />

            {/* Max */}
            <div className="flex items-center gap-1 sm:gap-4 h-full">
              <p className="text-[10px] sm:text-xs text-[#333]/30 mb-1 whitespace-nowrap">
                Max Tax
              </p>
              <div className="flex text-xs sm:text-sm font-medium items-center gap-1 border border-[#33333333] rounded-xl w-24 sm:w-30.5 px-2 sm:px-4 py-2 h-full">
                {tax[1] === 50000 ? (
                  <span className="">Max</span>
                ) : (
                  <>
                    <span className="text-secondary">$</span>
                    <span className="">{tax[1]}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <LineGradient />

        {/* Property Info */}
        <div className="mb-6 border-[#33333333] pt-5">
          <h3 className="font-medium mb-4">Property Info</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["Bedrooms", "Bathroom"].map((label, idx) => {
              const value = idx === 0 ? bedrooms : bathrooms;

              return (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>

                  <div className="flex items-center gap-3 border border-[rgba(15,15,15,0.12)] rounded-xl px-3 py-2">
                    <button
                      className="w-7 h-7 rounded-lg bg-[#30548729]"
                      onClick={() => {
                        const setter = idx === 0 ? setBedrooms : setBathrooms;
                        const current = value ?? 0;
                        if (current === 1) setter(null);
                        else if (current > 1) setter(current - 1);
                      }}
                    >
                      −
                    </button>

                    <span className="text-sm min-w-6 text-center">
                      {value ?? "any"}
                    </span>

                    <button
                      className="w-7 h-7 rounded-lg bg-[#30548729]"
                      onClick={() => {
                        const setter = idx === 0 ? setBedrooms : setBathrooms;
                        const current = value ?? 0;
                        setter(current + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <LineGradient />

        {/* Features */}
        <div className="mb-6  border-[#33333333] pt-5">
          <h3 className="font-bold mb-5">Features</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              // { label: "Parking", value: "parking" },
              { label: "View", value: "view" },
              { label: "Fireplace", value: "firePlace" },
              { label: "Suite", value: "suite" },
              // { label: "Security", value: "security" },
              { label: "Waterfront", value: "waterfront" },
              { label: "Pool", value: "pool" },
              { label: "Workshop", value: "workshop" },
            ].map((f) => (
              <div
                key={f.value}
                onClick={() => handleToggleFeature(f.value)}
                className={`text-center py-3 rounded-xl border cursor-pointer text-sm transition-all ${
                  selectedFeatures.includes(f.value)
                    ? "bg-primary border-primary text-white"
                    : "border-[#0F0F0F1F] text-gray-400 hover:border-primary hover:text-primary"
                }`}
              >
                {f.label}
              </div>
            ))}
          </div>
        </div>
        <LineGradient />

        {/* Extra Features */}
        {/* <div className="border-[#33333333] pt-2">
            <h3 className="font-medium mb-4">Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                { label: " Court-ordered sale", icon: Icons.courtorder },
                { label: "Open House is set for", icon: Icons.openhouse },
                { label: "Previously sold", icon: Icons.soldicon },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-3 py-3.5 border border-[rgba(15,15,15,0.12)] rounded-xl text-gray-400 text-xs"
                >
                  <Image src={item.icon} alt="" width={16} height={16} />
                  <span className="whitespace-normal leading-snug">
                    {item.label}
                  </span>
                </div>
              ))}
            </div> */}

        {/* Bottom single item */}
        {/* <div className="mt-4 mb-5 ">
              <div className="flex items-center justify-center gap-2 px-3 py-3 border border-[rgba(15,15,15,0.12)] rounded-xl text-gray-400 text-xs">
                <Image src={Icons.star} alt="" width={16} height={16} />
                <span>Must Be on Favorites list</span>
              </div>
            </div>
          </div> 
        {/* <LineGradient /> 

        {/* Bottom Buttons */}
        <div className="md:py-6 py-4 mt-2 border-[#0F0F0F1F] flex gap-4 sticky bottom-0 bg-background w-full">
          <CustomButton
            buttonType="secondary"
            label="Apply Filter"
            customClasses="w-1/2"
            onClick={handleApplyFilter}
          />
          <CustomButton
            buttonType="disabled"
            label="Clear All"
            customClasses="w-1/2"
            onClick={handleClearAll}
          />
        </div>
      </div>
    </Dialog>
  );
}
