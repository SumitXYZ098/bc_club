/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState,useEffect } from "react";
import Image from "next/image";
import { Images } from "@/src/app/exports";
import Heading, { IHeadingTypes } from "@/src/components/heading/Heading";
import Description, {
  IDescriptionTypes,
} from "@/src/components/description/Description";
import { GitCompareArrows, Heart } from "lucide-react";
import { DocumentPrintFilled } from "@fluentui/react-icons";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import { FormControl, MenuItem, Select } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";

const useStyles = makeStyles(() => ({
  formControl: {
    "& .MuiInputBase-root": {
      borderColor: "#0F0F0F3D",
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: "100px",
      minWidth: "120px",
      justifyContent: "center",
    },
    "& .MuiSelect-select.MuiSelect-select": {
      paddingRight: "0px",
      paddingLeft: "16px",
      paddingBlock: "10px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  select: {
    borderRadius: 3,
    fontSize: "14px",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  selectIcon: {
    position: "relative",
    color: "#eea500",
    fontSize: "28px",
  },
  paper: {
    borderRadius: 12,
    marginTop: 8,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    "& li": {
      fontWeight: 500,
      paddingTop: 8,
      paddingBottom: 8,
      fontSize: "14px",
    },
    "& li.Mui-selected": {
      color: "white",
      background: "#22558b",
    },
    "& li.Mui-selected:hover": {
      background: "#22558b",
    },
  },
}));

const PropertyAssessmentTopSection = ({ data }: { data: any }) => {

  if (!data) {
  return (
    <div className="w-full flex flex-col xl:flex-row gap-6 mt-6 animate-pulse">

      
      <div className="xl:w-[56%] w-full">
        <div className="w-full xl:h-134 md:h-81 h-50.5 bg-gray-200 rounded-3xl" />
      </div>

      <div className="xl:w-[43%] w-full p-6 rounded-2xl bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.12)] flex flex-col gap-y-5">

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-40 bg-gray-200 rounded" />
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded-full" />
        </div>

        <div className="h-[1px] w-full bg-gray-200" />

        {[1, 2, 3, 4, 5].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        ))}

      </div>
    </div>
  );
}
  
  const classes = useStyles();
  
  const years: string[] = Array.isArray(data?.valueHistory)
  ? data.valueHistory.map((item: any) => item.year.toString())
  : [];
 const [val, setVal] = useState(
  data?.valueHistory?.[0]?.year?.toString() || ""
);

useEffect(() => {
  if (data?.valueHistory?.length) {
    setVal(data.valueHistory[0].year.toString());
  }
}, [data]);

  const handleChange = (event: any) => {
    setVal(event.target.value);
  };

  const selectedYearData = data?.valueHistory?.find(
  (item: any) => item.year.toString() === val
);

const selectedValue = selectedYearData?.value || data?.totalValue;

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex justify-between items-center-safe md:py-1">
        <div className="flex flex-col">
          <Heading
            tagType="h1"
            type={IHeadingTypes.heading24}
            content={data?.address}
          />
          <Description
            type={IDescriptionTypes.dec1614}
            content={data?.roll}
          />
        </div>
        <div className="md:flex gap-x-2.5 hidden">
          <Heart className="text-primary bg-primary/10 w-10.5 h-10.5 p-2.25 rounded-lg" />
          <GitCompareArrows className="text-primary bg-primary/10 w-10.5 h-10.5 p-2.25 rounded-lg" />
          <DocumentPrintFilled className="text-primary bg-primary/10 w-10.5 h-10.5 p-2.25 rounded-lg" />
        </div>
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-6 mt-6">

  {/* ================= LEFT - IMAGE ================= */}
  <div className="xl:w-[56%] w-full">
    <Image
      alt={data?.address || "property image"}
      src={data?.image}
      width={1020}
      height={400}
      className="w-full xl:h-134 md:h-81 h-50.5 object-cover md:rounded-3xl rounded-2xl"
    />
  </div>

  {/* ================= RIGHT ================= */}
  <div className="xl:w-[43%] w-full shadow-[0_0_20px_0_rgba(0,0,0,0.12)] p-6 rounded-2xl flex flex-col gap-y-5">

    <div className="flex items-center justify-between w-full">

      {/* TOTAL VALUE */}
      <div className="flex flex-col gap-y-1.5">
        <Description
          type={IDescriptionTypes.dec16}
          content="Total Value"
        />

        <div className="flex flex-col md:flex-row gap-1.5 md:items-end">
          <span className="md:text-[32px] md:leading-10 text-2xl text-primary font-bold">
            {selectedValue}
          </span>
        </div>
      </div>

      {/* YEAR */}
      <div className="flex flex-col">
        <span>Year</span>

        <FormControl className={classes.formControl}>
          <Select
            value={val}
            onChange={handleChange}
            IconComponent={ExpandMoreRounded}
            MenuProps={{
              classes: {
                list: classes.list,
                paper: classes.paper,
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "center",
              },
            }}
            classes={{
              select: classes.select,
              icon: classes.selectIcon,
            }}
          >
            {years.map((year, idx) => (
              <MenuItem key={idx} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>

    {/* CURRENT VALUES */}
    <div className="w-full flex justify-between md:text-lg text-base font-medium">
      <span>Land</span>
      <span className="text-primary">{data?.landValue}</span>
    </div>

    <div className="w-full flex justify-between md:text-lg text-base font-medium">
      <span>Buildings</span>
      <span className="text-primary">{data?.buildingValue}</span>
    </div>

    <LineGradient />

    {/* PREVIOUS VALUES */}
    <div className="w-full flex justify-between md:text-lg text-base font-medium">
      <span>Previous Year Value</span>
      <span className="text-primary">{data?.previousTotalValue}</span>
    </div>

    <div className="w-full flex justify-between md:text-lg text-base font-medium">
      <span>Land</span>
      <span className="text-primary">{data?.previousLandValue}</span>
    </div>

    <div className="w-full flex justify-between md:text-lg text-base font-medium">
      <span>Buildings</span>
      <span className="text-primary">{data?.previousBuildingValue}</span>
    </div>

  </div>

</div>
   
    </div>
  );
};

export default PropertyAssessmentTopSection;
