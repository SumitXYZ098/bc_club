/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import { StarFilled } from "@fluentui/react-icons";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BookingDialog from "./BookingDialog";

const PropertyContactUs = ({ property }: { property: any }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full flex flex-col gap-y-4 p-6 border border-borderColor rounded-2xl ">
      <div className="flex items-center gap-x-1.5">
        <StarFilled className="text-primary w-6 h-6" />
        <span className="text-xl font-bold capitalize">
          {property?.property_sub_type === "Single Family"
            ? property?.structure_type
            : property?.property_sub_type}
        </span>
      </div>
      <div className="flex items-center gap-x-1.5 text-[#636366]">
        <MapPin className="w-6 h-6" />
        <span className="text-base">
          {`${property?.city}, ${property?.state},` ||
            "Southwestern Ontario, Ontario,"}
          Canada
        </span>
      </div>
      <div className="flex items-end gap-x-1.5">
        <span className="text-4xl text-primary font-bold">
          ${Number(property?.price || 0).toLocaleString()}
        </span>
        <span className="text-base text-black70">
          {property?.Living_area ?? property?.lot_size_area}{" "}
          {property?.living_area_units ?? property?.lot_size_units}
        </span>
      </div>
      <LineGradient />
      <span className="text-2xl font-bold">Contact with us now !</span>
      <div className="p-4 flex flex-col gap-y-4 bg-gray rounded-[10px]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2.5 border border-primary rounded-md text-primary text-base font-bold cursor-pointer"
        >
          Request a showing
        </button>
        <Link
          href={"tel:+1 778-896-2478"}
          className="px-4 py-2.5 text-center text-base font-bold bg-primary text-background rounded-md"
        >
          Call Now
        </Link>
      </div>
      <BookingDialog
        property={property}
        onClose={() => setOpen(false)}
        open={open}
      />
    </div>
  );
};

export default PropertyContactUs;
