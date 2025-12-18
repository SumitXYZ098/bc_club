"use client";
import CustomButton from "@/src/components/button/CustomButton";
import React, { useState } from "react";
import PropertiesMap from "../properties/PropertiesMap";
import NeighboringProperties from "./NeighboringProperties";
import SampleSoldProperties from "./SampleSoldProperties";

const MapTapSection = () => {
  const tabsLabel = [
    { id: 0, label: "Map" },
    { id: 1, label: "Neighboring properties" },
    { id: 2, label: "Sample sold properties" },
  ];
  const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <div className="flex flex-col bg-gray xl:p-6 md:p-4 p-3 rounded-xl w-full gap-y-4 xl:gap-y-6 ">
      <div className="flex md:flex-row md:flex-nowrap flex-col gap-2 md:items-center w-full p-2 bg-background rounded-xl">
        {tabsLabel.map((tab) => (
          <CustomButton
            key={tab.id}
            label={tab.label}
            buttonType={activeTab === tab.id ? "primary" : "disabled"}
            customClasses="w-full transition duration-500 ease-in-out disabled"
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {activeTab === 0 && (
        <div className="w-full h-150">
          <PropertiesMap />
        </div>
      )}
      {activeTab === 1 && <NeighboringProperties />}
      {activeTab === 2 && <SampleSoldProperties />}
    </div>
  );
};

export default MapTapSection;
