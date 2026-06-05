"use client";
import { Icons } from "@/src/app/exports";
import Description, {
  IDescriptionTypes,
} from "@/src/components/description/Description";
import Image from "next/image";
import React from "react";
import SearchPropertyTab from "./SearchPropertyTab";
import PoweredBy from "@/src/components/common/poweredby/PoweredBy";
import CustomButton from "@/src/components/button/CustomButton";
import CityStatsPopup from "./CityStatsPopup";
import Heading, { IHeadingTypes } from "@/src/components/heading/Heading";

const HomeHeroSection = () => {
  const [hoveredCity, setHoveredCity] = React.useState<string | null>(null);
  const [popupPosition, setPopupPosition] = React.useState<{
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
  }>({});
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (city: string, position: any) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCity(city);
    setPopupPosition(position);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCity(null);
    }, 200); // Small delay to move to popup
  };

  const handlePopupEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  return (
    <section className="xl:max-w-screen-2xl mx-auto xl:px-0 md:px-13 px-6 flex flex-col gap-y-8 xl:flex-row xl:flex-nowrap justify-between relative h-auto overflow-x-clip bg-background">
      <div className="flex flex-col h-auto xl:w-[42%] xl:pl-16 w-full lg:pt-49.5 pt-31.5">
        <h1 className="xl:text-6xl xl:leading-17 md:text-5xl md:leading-14 text-[40px] leading-12 whitespace-break-spaces md:text-start text-center font-bold self-stretch">
          {`Search BC Real Estate Market\nwith Better`}
          <span className="text-primary"> Local</span>{" "}
          <span className="text-secondary">Insights</span>
        </h1>
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading16}
          customClasses="md:text-start text-center md:mt-5 mt-2.5 w-full md:whitespace-break-spaces font-normal!"
          content={`Don’t just browse listings. See price trends in each neighbourhood,\nexplore past sales, and find your perfect home with up-to-date \nMLS listings.`}
        />
        <div className="w-full xl:mt-8 md:mt-6 mt-5 relative">
          <SearchPropertyTab />
        </div>
      </div>
      <div className="xl:w-[58.5%] bg-gray h-auto xl:rounded-bl-[124px] md:rounded-bl-[108px] rounded-bl-3xl z-10 xl:p-[120px_48px_21px_65px] md:px-12 md:py-8 p-5 flex flex-col items-end gap-1">
        <div className="w-full xl:h-155.5 md:h-128.5 h-66.25 relative">
          <Image
            src={Icons.heroMapVector}
            alt="Map Vector"
            width={400}
            height={400}
            className="w-full xl:h-155.5 md:h-128.5 h-66.25 relative object-fill"
          />

          <CustomButton
            startIcon={Icons.grahp}
            label="Langley"
            buttonType="secondary"
            customClasses="absolute lg:top-25 lg:left-[255px] md:top-20 md:left-56 top-4 left-30 flex flex-row gap-0.5 items-center rounded-full! px-4! py-2! z-20"
            onMouseEnter={() =>
              handleMouseEnter("Langley", { top: "50px", left: "140px" })
            }
            onMouseLeave={handleMouseLeave}
          />
          <CustomButton
            startIcon={Icons.grahp}
            label="Surrey"
            buttonType="secondary"
            customClasses="absolute lg:top-[224px] lg:left-[65px] md:top-50 md:left-16 top-23 left-6 flex flex-row gap-0.5 items-center rounded-full! px-4! py-2! z-20 "
            onMouseEnter={() =>
              handleMouseEnter("Surrey", { top: "100px", left: "160px" })
            }
            onMouseLeave={handleMouseLeave}
          />
          <CustomButton
            startIcon={Icons.grahp}
            label="Vancouver"
            buttonType="secondary"
            customClasses="absolute lg:top-[294px] lg:left-[304px] md:top-62 md:left-76 top-30 left-40 flex flex-row gap-0.5 items-center rounded-full! px-4! py-2! z-20"
            onMouseEnter={() =>
              handleMouseEnter("Vancouver", { top: "170px", left: "240px" })
            }
            onMouseLeave={handleMouseLeave}
          />
          {/* <CustomButton
            startIcon={Icons.grahp}
            label="Victoria"
            buttonType="secondary"
            customClasses="absolute lg:bottom-[77px] lg:left-[227px] md:bottom-30 md:left-26 bottom-15 left-13 flex flex-row gap-0.5 items-center rounded-full! px-4! py-2! z-20"
            onMouseEnter={() =>
              handleMouseEnter("Victoria", { bottom: "-60px", left: "200px" })
            }
            onMouseLeave={handleMouseLeave}
          /> */}
          {/* <CustomButton
            startIcon={Icons.grahp}
            label="Kelowna"
            buttonType="secondary"
            customClasses="absolute lg:bottom-[63px] lg:right-20 md:bottom-10 md:right-36 bottom-6 right-16 flex flex-row gap-0.5 items-center rounded-full! px-4! py-2! z-20"
            onMouseEnter={() =>
              handleMouseEnter("Kelowna", { bottom: "-10px", right: "120px" })
            }
            onMouseLeave={handleMouseLeave}
          /> */}

          <CityStatsPopup
            city={hoveredCity || ""}
            isVisible={!!hoveredCity}
            position={popupPosition}
            onMouseEnter={handlePopupEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
        <PoweredBy className="justify-end" />
      </div>
      <Image
        src={Icons.bgWaveLine}
        alt="Wave line"
        className="w-full h-auto absolute object-cover bottom-0 z-0 xl:block hidden"
        width={100}
        height={100}
      />
    </section>
  );
};

export default HomeHeroSection;
