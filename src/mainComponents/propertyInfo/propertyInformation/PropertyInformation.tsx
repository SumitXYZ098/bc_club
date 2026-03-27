/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import PropertyContactUs from "./PropertyContactUs";
import PropertyTabs from "./PropertyTabs";
import Description, {
  IDescriptionTypes,
} from "@/src/components/description/Description";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import Image from "next/image";
import { Icons } from "@/src/app/exports";
import Link from "next/link";
import DynamicTable from "@/src/components/common/dynamicTable/DynamicTable";
import {
  buildingComplexHeaders,
  buildingComplexRows,
  getPropertyDetailsRows,
  getRoomRows,
  marketStatsHeaders,
  marketStatsRows,
  nearbySchoolsHeaders,
  nearbySchoolsRows,
  propertyDetailsHeaders,
  roomHeaders,
  taxHistoryHeaders,
  taxHistoryRows,
} from "../../dummyData";
import AssessmentHistory from "./AssessmentHistory";
import PropertyMap from "./PropertyMap";

const PropertyInformation = ({ property }: { property: any }) => {
  const featureslist = [
    {
      icon: Icons.bedroom,
      label: "Bedrooms",
      value: property?.bedrooms || "Na",
    },
    {
      icon: Icons.bathtub,
      label: "Bathrooms",
      value: property?.bathrooms || "Na",
    },
    {
      icon: Icons.garage,
      label: "Garage",
      value: "0",
    },
    {
      icon: Icons.calendar,
      label: "Year Built",
      value: property?.raw_data?.YearBuilt || "Na",
    },
    {
      icon: Icons.scale,
      label: "Area Size",
      value: property?.area || "Na",
    },
  ];

  const formatCurrency = (num?: number) => {
    if (!num) return "-";
    return `$${Number(num).toLocaleString()}`;
  };

  const price = property?.price;
  const assessed = property?.raw_data?.TaxAssessedValue;
  const rentEstimate = property?.raw_data?.RentEstimate; // if exists

  const offerValue = price || assessed || 0;
  const offerRent = rentEstimate || (price ? Math.round(price * 0.004) : 0); // rough 0.4% rule
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`;

  return (
    <div className="flex flex-row items-start flex-nowrap gap-5 w-full mt-6 md:mt-8 xl:mt-13">
      <div className="flex flex-col xl:w-[70%] w-full h-full  relative">
        {/* Property Tabs */}
        <PropertyTabs />
        <div className="xl:space-y-13 md:space-y-8 space-y-6">
          {/* Description */}
          <div
            id="overview"
            className="scroll-mt-40 p-6 rounded-2xl bg-gray flex flex-col gap-y-3"
          >
            <h2 className="xl:text-2xl text-lg xl:font-bold font-semibold">
              Description
            </h2>
            <Description
              type={IDescriptionTypes.dec1614}
              customClasses="text-black70/50"
              content={property?.raw_data?.PublicRemarks || "No Description"}
            />
          </div>

          {/* Features */}
          <div
            id="features"
            className="scroll-mt-30 p-6 rounded-2xl border border-borderColor flex flex-col gap-y-3"
          >
            <h2 className="xl:text-2xl text-lg xl:font-bold font-semibold">
              Features
            </h2>
            <LineGradient />
            <div className="flex flex-row flex-wrap justify-between gap-y-3">
              {featureslist.map((features, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-y-2 md:w-26.75 xl:w-36.25 h-auto px-2"
                >
                  <div className="flex flex-row items-center gap-x-2">
                    <Image
                      src={features.icon}
                      alt={features.label}
                      width={40}
                      height={40}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-lg font-medium">
                      {features.value}
                    </span>
                  </div>
                  <Description
                    type={IDescriptionTypes.dec1614}
                    content={features.label}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* map */}
          <div className="flex flex-col gap-y-6 w-full">
            <div className="w-full flex flex-row items-center justify-between">
              <h2 className="xl:text-2xl text-lg xl:font-bold font-semibold">
                Map location
              </h2>
              <Link
                href={googleMapsUrl}
                target="_blank"
                className="px-5 py-3 bg-primary text-background text-base font-bold rounded-2xl"
              >
                Open Map
              </Link>
            </div>
            <PropertyMap
              location={[property.longitude, property.latitude]}
              address={property.address}
              city={property.city}
              state={property.state}
            />
          </div>
          {/* Property Details */}
          <DynamicTable
            title="Property Details"
            headers={propertyDetailsHeaders}
            rows={getPropertyDetailsRows(property)}
          />
          {/* Room Information */}
          <DynamicTable
            title="Room Information"
            headers={roomHeaders}
            rows={getRoomRows(property)}
          />

          {/*  */}
          <div
            id="assessment"
            className="scroll-mt-40 flex flex-col md:gap-y-6 gap-y-5"
          >
            <AssessmentHistory />
            <DynamicTable headers={taxHistoryHeaders} rows={taxHistoryRows} />
          </div>

          {/* Pricing Estimate */}
          <div
            id="estimate"
            className="scroll-mt-40 p-5 rounded-xl bg-gray flex flex-col gap-y-4"
          >
            <h2 className="xl:text-2xl text-lg xl:font-bold font-semibold">
              Pricing Estimate
            </h2>
            <LineGradient customClasses="" />
            {/* Pricing content can be added here */}
            <div className="flex flex-row md:flex-nowrap flex-wrap justify-between w-full xl:gap-x-6 gap-x-5 gap-y-4">
              {/* Offer Value */}
              <div className="bg-background px-4 py-5 flex items-center justify-between rounded-xl w-full">
                <span className="text-sm">Offer Value Estimate</span>
                <span className="text-primary font-bold text-xl xl:text-2xl">
                  {formatCurrency(offerValue)}
                </span>
              </div>

              {/* Rent Estimate */}
              <div className="bg-background px-4 py-5 flex items-center justify-between rounded-xl w-full">
                <span className="text-sm">Offer Rent Estimate</span>
                <span className="text-primary font-bold text-xl xl:text-2xl">
                  {formatCurrency(offerRent)}
                </span>
              </div>
            </div>
          </div>

          {/* Nearby Schools */}
          <div id="neighbourhood" className="scroll-mt-40">
            <DynamicTable
              title={"Nearby Schools (Dummy Data)"}
              headers={nearbySchoolsHeaders}
              rows={nearbySchoolsRows}
            />
          </div>

          {/* Building Complex Information */}
          <DynamicTable
            title={"Building Complex Information (Dummy Data)"}
            headers={buildingComplexHeaders}
            rows={buildingComplexRows}
          />
          {/* Market Statistics */}
          <div id="stats" className="scroll-mt-40">
            <DynamicTable
              title="Market Statistics  (Dummy Data)"
              headers={marketStatsHeaders}
              rows={marketStatsRows}
            />
            {/* Sentinel (DO NOT REMOVE) */}
            <div id="stats-end" className="h-px" />
          </div>
        </div>
      </div>
      {/* ================= RIGHT SIDEBAR ================= */}
      <aside className="h-fit sticky top-14 self-start md:w-[30%] xl:block hidden  ">
        <PropertyContactUs property={property} />
      </aside>
    </div>
  );
};

export default PropertyInformation;
