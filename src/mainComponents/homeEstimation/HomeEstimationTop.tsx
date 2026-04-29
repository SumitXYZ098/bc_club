/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { Icons } from "@/src/app/exports";
import CustomButton from "@/src/components/button/CustomButton";
import Description, {
  IDescriptionTypes,
} from "@/src/components/description/Description";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import { dummyListings } from "../dummyData";
import { useRouter } from "next/navigation";
import { Endpoints } from "@/src/api/endpoints";

const HomeEstimationTop = () => {
  const [search, setSearch] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  const fetchProperties = async () => {
    if (!query || query.length < 2) return;

    try {
      const res = await fetch(
        `${Endpoints.importPropertyList}?address=${encodeURIComponent(query)}`
      );

      const json = await res.json();

      const results = json?.data || [];

      setFilteredResults(results);
      setShowDropdown(true);
    } catch (err) {
      console.error("❌ API ERROR:", err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 1) {
        fetchProperties();
      } else {
        setShowDropdown(false);
        setFilteredResults([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  const router = useRouter();

  return (
    <section className="xl:max-w-screen-2xl mx-auto w-full relative xl:pt-53.5 xl:pb-31 md:pt-38.75 md:pb-29 pt-26.5 pb-17 px-6 flex flex-col items-center-safe">
      <h1 className="xl:text-6xl xl:leading-17 md:text-5xl md:leading-14 text-[40px] leading-12 font-bold text-center">
        Get Your Free <span className="text-primary">Home Evaluation</span>
      </h1>
      <Description
        type={IDescriptionTypes.dec16}
        content="Fill out form below to below to receive your personalized property valuation report."
        customClasses="xl:mt-5 mt-4 text-center mx-6"
      />
      <div className="xl:mt-8 mt-5 md:w-[80%] w-full md:p-6 p-4 shadow-[0_0_15px_0_rgba(0,0,0,0.12)] rounded-2xl flex flex-col gap-y-6 bg-background z-10">
        <p className="xl:text-xl font-bold">What’s my home worth?</p>
        <div
          className={`border border-borderColor md:p-1.5 py-2 flex items-center relative  ${showDropdown && filteredResults.length > 0
            ? "rounded-t-xl rounded-b-0"
            : "rounded-xl"
            }`}
        >
          <input
           className="outline-0 px-4 w-full h-12 md:h-14 md:text-sm md:text-base"
            placeholder="Search Property Address"
            required
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
            }}
            onFocus={() => {
              if (filteredResults.length > 0) setShowDropdown(true);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
          {showDropdown && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-background rounded-b-xl shadow-lg z-10 border-t-0 border border-borderColor max-h-80 overflow-y-auto scrollbar-hide">
              <div className="p-2 text-foreground text-sm border-b">
                Properties ({filteredResults.length})
              </div>
              {filteredResults.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/property-assessment/${item.documentId}`)}
                  className={`cursor-pointer p-3 hover:bg-gray-100 border-gray ${index + 1 === filteredResults.length ? "" : "border-b"
                    } `}
                >
                  <span className="text-black font-medium">{item.address}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Image
        src={Icons.bgWaveLine}
        alt="Wave line"
        className="w-full md:h-65.5 h-29.5 absolute object-contain bottom-0 z-0 left-0"
        width={100}
        height={100}
      />
    </section>
  );
};

export default HomeEstimationTop;
