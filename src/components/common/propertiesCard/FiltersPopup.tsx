"use client";

import React from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { Icons } from "@/src/app/exports";
import LineGradient from "../lineGradient/LineGradient";
import CustomButton from "../../button/CustomButton";
import { Modal } from "@mui/material";

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
});

// ================= Types =================
interface FiltersDialogProps {
  open: boolean;
  onClose: () => void;
}

// ================= Component =================
export default function FiltersPopup({ open, onClose }: FiltersDialogProps) {
  const [price, setPrice] = React.useState<number[]>([5, 80]);
  const [bedrooms, setBedrooms] = React.useState<number | null>(null);
  const [bathrooms, setBathrooms] = React.useState<number | null>(null);
  const [status, setStatus] = React.useState("sale");

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleClearAll = () => {
    setPrice([0, 100]);
    setBedrooms(null);
    setBathrooms(null);
    setStatus("sale");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      disableAutoFocus
      aria-labelledby="filters-modal"
      aria-describedby="filters-modal-description"
      closeAfterTransition
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(1px)",
        },
      }}
    >
      {/* CENTER WRAPPER */}
      <div
        className="fixed inset-0 flex items-center justify-center  px-4 z-9999"
        onClick={onClose}
      >
        {/* CARD */}
        <div
          className="bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto p-6 w-full max-w-xl scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between cursor-pointer mb-6">
            <h2 className="text-xl font-semibold  ">Filters</h2>
            <button onClick={onClose}>
              <FiX size={22} />
            </button>
          </div>

          {/* Status */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { k: "sale", l: "For Sale", i: Icons.forsale },
              { k: "sold", l: "Sold", i: Icons.sold },
              { k: "expired", l: "Expired", i: Icons.expire },
            ].map((s) => (
              <button
                key={s.k}
                onClick={() => setStatus(s.k)}
                className={`border rounded-xl p-3 flex flex-col items-center gap-2 transition ${
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
          <div className="mb-6">
            <label className="font-medium">Location</label>
            <select className="mt-2 w-full border border-[#33333333] cursor-pointer rounded-xl px-4 py-3 focus:outline-none">
              <option>Any area</option>
              <option>Downtown</option>
              <option>Suburb</option>
            </select>
          </div>
          <LineGradient />

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="relative">
              <PriceSlider
                value={price}
                min={0}
                max={100}
                onChange={(_, v) => setPrice(v as number[])}
                disableSwap
              />
              <div className="absolute left-0 -bottom-6">
                <div className="bg-[#EEA500] text-white text-xs px-3 py-1 rounded-full shadow">
                  ${price[0]}
                </div>
              </div>
            </div>

            <div className="flex items-center mt-8 justify-between gap-2 sm:gap-4">
              {/* Min */}
              <div className="flex items-center gap-2 sm:gap-4 h-full">
                <p className="text-[10px] sm:text-xs text-gray-300 mb-1 whitespace-nowrap">
                  Min Price
                </p>
                <div className="flex items-center gap-1 border border-[#33333333] rounded-xl w-[96px] sm:w-[122px] px-3 sm:px-4 py-2 h-full">
                  <span className="text-[#EEA500] font-semibold">$</span>
                  <LineGradient customClasses="mx-0.5 sm:mx-1" vr />
                  <span className="text-xs sm:text-sm font-medium">
                    {price[0]}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <LineGradient customClasses="mx-1 h-10 sm:h-15" vr />

              {/* Max */}
              <div className="flex items-center gap-2 sm:gap-4 h-full">
                <p className="text-[10px] sm:text-xs text-gray-300 mb-1 whitespace-nowrap">
                  Max Price
                </p>
                <div className="flex items-center gap-1 border border-[#33333333] rounded-xl w-[96px] sm:w-[122px] px-3 sm:px-4 py-2 h-full">
                  <span className="text-[#EEA500] font-semibold">$</span>
                  <LineGradient customClasses="mx-0.5 sm:mx-1" vr />
                  <span className="text-xs sm:text-sm font-medium">
                    {price[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <LineGradient />

          {/* Property Info */}
          <div className="mb-6 border-[#33333333] pt-5">
            <h3 className="font-semibold mb-4">Property Info</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {["Bedrooms", "Bathroom"].map((label, idx) => {
                const value = idx === 0 ? bedrooms : bathrooms;

                return (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{label}</span>

                    <div className="flex items-center gap-3 border border-[rgba(15,15,15,0.12)] rounded-xl px-3 py-2">
                      <button className="w-7 h-7 rounded-lg bg-[#30548729]">
                        −
                      </button>

                      <span className="text-sm min-w-6 text-center">
                        {value ?? "any"}
                      </span>

                      <button className="w-7 h-7 rounded-lg bg-[#30548729]">
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
          <LineGradient />

          {/* Extra Features */}
          <div className="border-[#33333333] pt-2">
            <h3 className="font-semibold mb-4">Features</h3>
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
            </div>

            {/* Bottom single item */}
            <div className="mt-4 mb-5 ">
              <div className="flex items-center justify-center gap-2 px-3 py-3 border border-[rgba(15,15,15,0.12)] rounded-xl text-gray-400 text-xs">
                <Image src={Icons.star} alt="" width={16} height={16} />
                <span>Must Be on Favorites list</span>
              </div>
            </div>
          </div>
          <LineGradient />

          {/* Bottom Buttons */}
          <div className="pt-6 mt-2 border-[#0F0F0F1F] flex gap-4">
            <CustomButton
              buttonType="secondary"
              label="Apply Filter"
              customClasses="w-1/2"
              onClick={onClose}
            />
            <CustomButton
              buttonType="disabled"
              label="Clear All"
              customClasses="w-1/2"
              onClick={handleClearAll}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
