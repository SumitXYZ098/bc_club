/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { Icons } from "@/src/app/exports";
import CustomButton from "@/src/components/button/CustomButton";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { dummyListings } from "../dummyData";
import { useRouter } from "next/navigation";

const SearchPropertyTab = () => {
  const [search, setSearch] = useState<string>("");
  const tabList = ["Find Home", "Home Assessment", "Market Trends"];
  const [activeTab, setActiveTab] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<typeof dummyListings>(
    []
  );
  useEffect(() => {
    if (query.length > 1) {
      const filtered = dummyListings.filter((item) =>
        item.address.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [query]);

  const router = useRouter();

  return (
    <div className="xl:w-183.75 w-full xl:absolute p-3 flex flex-col gap-y-4 justify-between shadow-[0_0_16px_0_rgba(0,0,0,0.12)] rounded-xl bg-background z-99">
      <div className="flex flex-nowrap gap-2.5 w-full">
        {tabList.map((item, idx) => (
          <CustomButton
            key={idx}
            label={item}
            buttonType={activeTab === idx ? "primary" : "disabled"}
            customClasses="w-full"
            onClick={() => {
              if (idx !== 2) {
                setActiveTab(idx);
              } else {
                router.push(`/market-trends`);
              }
            }}
          />
        ))}
      </div>
      {activeTab === 0 && (
        <div
          className={`border border-borderColor md:p-1.5 py-5 flex flex-row items-center justify-between relative  ${
            showDropdown && filteredResults.length > 0
              ? "rounded-t-xl rounded-b-0"
              : "rounded-xl"
          }`}
        >
          <input
            className="outline-0 px-3 cursor-pointer w-full"
            placeholder={`Enter an address, neighborhood, city, or ZIP code for Find Home`}
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
          <button
            onClick={() => {
              console.log("Search", search);
              setSearch("");
            }}
            className="w-13 h-13 bg-secondary p-3.5 text-center flex items-center justify-center-safe rounded-xl cursor-pointer"
          >
            <Image
              src={Icons.searchLine}
              alt="Search"
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </button>
          {showDropdown && filteredResults.length > 0 && (
            <div className=" absolute top-full left-0 w-full bg-background rounded-b-xl shadow-lg z-10 border-t-0 border border-borderColor overflow-clip">
              <div className="p-2 text-foreground text-sm border-b">
                Properties ({filteredResults.length})
              </div>
              {filteredResults.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/property-assessment/${item.id}`)}
                  className={`cursor-pointer p-3 hover:bg-gray-100 border-gray ${
                    index + 1 === filteredResults.length ? "" : "border-b"
                  } `}
                >
                  <span className="text-black font-medium">{item.address}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 1 && (
        <div
          className={`border border-borderColor md:p-1.5 py-5 flex flex-row items-center justify-between relative  ${
            showDropdown && filteredResults.length > 0
              ? "rounded-t-xl rounded-b-0"
              : "rounded-xl"
          }`}
        >
          <input
            className="outline-0 px-3 cursor-pointer w-full"
            placeholder={`Enter an address, neighborhood, city, or ZIP code for Home Assessment`}
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
          <button
            onClick={() => {
              console.log("Search", search);
              setSearch("");
            }}
            className="w-13 h-13 bg-secondary p-3.5 text-center flex items-center justify-center-safe rounded-xl cursor-pointer"
          >
            <Image
              src={Icons.searchLine}
              alt="Search"
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </button>
          {showDropdown && filteredResults.length > 0 && (
            <div className=" absolute top-full left-0 w-full bg-background rounded-b-xl shadow-lg z-10 border-t-0 border border-borderColor overflow-clip">
              <div className="p-2 text-foreground text-sm border-b">
                Properties ({filteredResults.length})
              </div>
              {filteredResults.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/property-assessment/${item.id}`)}
                  className={`cursor-pointer p-3 hover:bg-gray-100 border-gray ${
                    index + 1 === filteredResults.length ? "" : "border-b"
                  } `}
                >
                  <span className="text-black font-medium">{item.address}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPropertyTab;
