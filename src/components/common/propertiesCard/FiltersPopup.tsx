"use client";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { Icons, Images } from "@/src/app/exports";
import LineGradient from "../lineGradient/LineGradient";
import CustomButton from "../../button/CustomButton";
import { Dialog } from "@mui/material";
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
export default function FiltersPopup({ open, onClose, id }: FiltersDialogProps) {
  const { isLoggedIn, setOpenLogin } = useAuthContext();
  const { getInstanceFilters, updateInstanceFilter, clearInstanceFilters } = useListingStore();
  
  const filters = getInstanceFilters(id);

  const [price, setPrice] = useState<[number | null, number | null]>([
    filters.minPrice ?? 0,
    filters.maxPrice ?? 20000000,
  ]);

  const [sqft, setSqft] = useState<[number | null, number | null]>([
    filters.minSqft ?? 0,
    filters.maxSqft ?? 15000,
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
  const [location, setLocation] = useState<string>(filters.location ?? "");

  useEffect(() => {
    if (open) {
      const currentFilters = getInstanceFilters(id);
      setPrice([currentFilters.minPrice ?? 0, currentFilters.maxPrice ?? 20000000]);
      setSqft([currentFilters.minSqft ?? 0, currentFilters.maxSqft ?? 15000]);
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
      setLocation(currentFilters.location ?? "");
    }
  }, [open, id, getInstanceFilters]);

  const handleClearAll = () => {
    clearInstanceFilters(id);
    setPrice([0, 20000000]);
    setSqft([0, 15000]);
    setBedrooms(null);
    setBathrooms(null);
    setStatus("");
    setLocation("");
    onClose();
  };

  const handleApplyFilter = () => {
    updateInstanceFilter(id, "minPrice", price[0]);
    updateInstanceFilter(id, "maxPrice", price[1]);
    updateInstanceFilter(id, "minSqft", sqft[0]);
    updateInstanceFilter(id, "maxSqft", sqft[1]);
    updateInstanceFilter(id,
      "activeBedRoom",
      bedrooms ? (bedrooms >= 4 ? "4+" : bedrooms.toString()) : "any",
    );
    updateInstanceFilter(id,
      "activeBathRoom",
      bathrooms ? (bathrooms >= 4 ? "4+" : bathrooms.toString()) : "any",
    );
    updateInstanceFilter(id, "status", status);
    updateInstanceFilter(id, "location", location);
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
        onClick={(e) => e.stopPropagation()}
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
        <div className="mb-6 space-y-2 flex flex-col gap-y-1">
          <label className="font-medium">Location</label>
          <select
            value={location || ""}
            onChange={(e) => setLocation(e.target.value as string)}
            className="w-full border border-[#33333333] rounded-xl px-2 py-2 focus:outline-none cursor-pointer text-sm"
          >
            <option value="" disabled>
              Select Location
            </option>
            {[
              "New Westminster",
              "Vancouver",
              "Surrey",
              "White Rock",
              "North Vancouver",
              "Tsawwassen",
              "Coquitlam",
              "Burnaby",
              "Port Moody",
              "Maple Ridge",
              "Richmond",
              "Delta",
              "Langley",
              "Hope",
              "Chilliwack",
              "Abbotsford",
              "Whistler",
              "West Vancouver",
              "Sechelt",
              "Mission",
              "Port Coquitlam",
              "Agassiz",
            ].map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <LineGradient />

        {/* Price Range */}
        <div className="md:mb-6 mb-3">
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
        <div className="md:mb-6 mb-3">
          <h3 className="font-medium md:mb-3">Area Range</h3>
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
        {/* <div className="mb-6  border-[#33333333] pt-5">
            <h3 className="font-bold mb-5">Features</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                "Water front",
                "View",
                "Fireplace",
                "Pool",
                "Workshop",
                "Suite",
              ].map((f) => (
                <div
                  key={f}
                  className="text-center py-3 rounded-xl border border-[#0F0F0F1F] text-gray-400 text-sm"
                >
                  {f}
                </div>
              ))}
            </div>
          </div>
          <LineGradient /> */}

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
          </div> */}
        {/* <LineGradient /> */}

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
