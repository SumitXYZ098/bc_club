/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomButton from "@/src/components/button/CustomButton";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import { Dialog } from "@mui/material";
import React from "react";

const EstimateCostDialog = ({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: any[];
}) => {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          padding: "24px 20px",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        },
      }}
    >
      <span className="text-2xl font-bold">Cost Estimates</span>
      {data.map((item, idx) => {
        const type = typeOfRenovationData.find(
          (type) => type.title === item.typeRenovation,
        );
        return (
          <div key={idx + 1} className="w-full flex flex-col gap-y-4">
            <LineGradient />
            {/* Select Area to Renovate */}
            <div className="flex flex-col gap-y-1.5">
              <label className="text-base opacity-50">
                Select Area to Renovate
              </label>
              <p className="w-full text-center py-3.5 bg-gray rounded-xl font-medium">
                {item.renovateArea || "Kitchen"}
              </p>
            </div>
            {/* Area Size */}
            <div className="flex flex-col gap-y-1.5">
              <label className="text-base opacity-50">Area Size</label>
              <div className="flex flex-row gap-x-4">
                <p className="w-full text-center py-3.5 bg-gray rounded-xl font-bold">
                  {item.areaSize[0] || "10"}{" "}
                  <span className="font-normal">sqft</span>
                </p>
                <p className="w-full text-center py-3.5 bg-gray rounded-xl font-bold">
                  {item.areaSize[1] || "530"}{" "}
                  <span className="font-normal">sqft</span>
                </p>
              </div>
            </div>
            {/* Type of Renovation */}
            <div className="flex flex-col gap-y-1.5">
              <label className="text-base opacity-50">Type of Renovation</label>
              <div
                className={`p-6 rounded-xl w-full flex flex-col gap-y-4 h-auto bg-gray`}
              >
                <span className="text-lg font-medium">
                  {type?.title || "Partial Renovation"}
                </span>
                <ul className="list-disc list-inside text-base">
                  {type?.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
                <p className="text-base">{type?.description}</p>
              </div>
            </div>
            {/* Scope of Work  */}
            <div className="flex flex-col gap-y-1.5">
              <label className="text-base opacity-50">Scope of Work</label>
              <div className="grid grid-cols-2 gap-4">
                {item.scopeOfWork.map((scope: any, idx: any) => (
                  <p
                    key={idx}
                    className="w-full text-center py-3.5 bg-gray rounded-xl font-medium capitalize"
                  >
                    {scope}
                  </p>
                ))}
              </div>
            </div>
            {/* Estimated Cost Range */}
            <div className="flex flex-col gap-y-1.5">
              <label className="text-base opacity-50">
                Estimated Cost Range
              </label>
              <div className="flex flex-row gap-x-4">
                <p className="w-full text-center py-3.5 bg-gray rounded-xl font-medium">
                  {"<$28,000"}
                </p>
                <p className="w-full text-center py-3.5 bg-gray rounded-xl font-medium">
                  {">$35,000"}
                </p>
              </div>
            </div>
            {/* Estimated Timeline */}
            <div className="flex flex-col gap-y-1.5">
              <label className="text-base opacity-50">Estimated Timeline</label>
              <p className="w-full text-center py-3.5 bg-gray rounded-xl font-medium">
                6–8 weeks 
              </p>
            </div>
          </div>
        );
      })}

      <CustomButton
        label="Get Estimated Cost"
        buttonType="primary"
        customClasses="w-full"
      />
    </Dialog>
  );
};

export default EstimateCostDialog;

const typeOfRenovationData = [
  {
    title: "Partial Renovation",
    points: ["Paint", "Fixtures", "Minor upgrades"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed placerat eros at orci faucibus, vitae rhoncus quam ornare. ",
  },
  {
    title: "Full Renovation",
    points: ["Demolition", "Plumbing", "Electrical", "New Finishes"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed placerat eros at orci faucibus, vitae rhoncus quam ornare. ",
  },
  {
    title: "High-End Renovation",
    points: ["Custom cabinetry", "Stone", "Premium Finishes"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed placerat eros at orci faucibus, vitae rhoncus quam ornare. ",
  },
];
