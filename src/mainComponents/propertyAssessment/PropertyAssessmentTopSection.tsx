/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { dummyListings } from "../dummyData";
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
  const classes = useStyles();
  const address = dummyListings.find((list) => list.id === Number(data));
  const years = ["2025", "2024", "2023", "2022", "2021", "2020", "2019"];
  const [val, setVal] = useState(years[0]);
  const handleChange = (event: any) => {
    setVal(event.target.value);
  };
  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex justify-between items-center-safe md:py-1">
        <div className="flex flex-col">
          <Heading
            tagType="h1"
            type={IHeadingTypes.heading24}
            content={address?.address}
          />
          <Description
            type={IDescriptionTypes.dec1614}
            content="Area-Jurisdiction-Roll: 22-205-00991.000"
          />
        </div>
        <div className="md:flex gap-x-2.5 hidden">
          <Heart className="text-primary bg-primary/10 w-10.5 h-10.5 p-2.25 rounded-lg" />
          <GitCompareArrows className="text-primary bg-primary/10 w-10.5 h-10.5 p-2.25 rounded-lg" />
          <DocumentPrintFilled className="text-primary bg-primary/10 w-10.5 h-10.5 p-2.25 rounded-lg" />
        </div>
      </div>
      <Image
        alt={address?.address || "property image"}
        src={Images.assessment}
        width={1020}
        height={400}
        className="w-full xl:h-134 md:h-81 h-50.5 object-cover md:rounded-3xl rounded-2xl xl:mt-4 md:mb-8 mt-6 mb-4"
      />
      <div className="flex w-full flex-row flex-wrap items-start justify-between gap-y-5">
        <div className="xl:w-[56%] w-full flex flex-col gap-y-4">
          <div className="flex items-center justify-between flex-nowrap w-full">
            <div className="flex flex-col gap-y-1.5">
              <Description
                type={IDescriptionTypes.dec16}
                content="Total Value"
                customClasses=""
              />
              <div className="flex flex-col md:flex-row gap-1.5 md:items-end">
                <span className="md:text-[32px] md:leading-10 text-2xl text-primary font-bold">
                  $327,000
                </span>
                <span className="md:text-sm text-xs">{`(2025 assessment as of July 1,2024)`}</span>
              </div>
            </div>
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

          <Description
            type={IDescriptionTypes.dec16}
            customClasses="text-black70 opacity-80"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc placerat odio enim, eu pellentesque libero tempus ac. Praesent tempor, tellus sed ullamcorper interdum, orci metus luctus enim, in laoreet ipsum ipsum ac eros. Pellentesque a risus sapien. Morbi nisi justo, semper auctor auctor eu, pharetra non velit. Quisque eu tincidunt dolor. Phasellus tempor, lorem ut pharetra porttitor, est augue convallis tortor, a pellentesque sem leo aliquam tellus. In at sapien id dolor iaculis scelerisque nec nec felis."
          />
        </div>
        <div className="xl:w-[43%] w-full shadow-[0_0_20px_0_rgba(0,0,0,0.12)] p-6 rounded-2xl flex flex-col gap-y-4">
          <div className="w-full flex justify-between items-start md:text-lg text-base font-medium">
            <span>Land</span>
            <span className="text-primary">$103,000</span>
          </div>
          <div className="w-full flex justify-between items-start md:text-lg text-base font-medium">
            <span>Buildings</span>
            <span className="text-primary">$224,000</span>
          </div>
          <LineGradient />
          <div className="w-full flex justify-between items-start md:text-lg text-base font-medium">
            <span>Previous Year Value</span>
            <span className="text-primary">$287,100</span>
          </div>
          <div className="w-full flex justify-between items-start md:text-lg text-base font-medium">
            <span>Land</span>
            <span className="text-primary">$89,100</span>
          </div>
          <div className="w-full flex justify-between items-start md:text-lg text-base font-medium">
            <span>Buildings</span>
            <span className="text-primary">$198,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAssessmentTopSection;
