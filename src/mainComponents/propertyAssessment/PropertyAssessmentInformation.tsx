import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import Description, {
  IDescriptionTypes,
} from "@/src/components/description/Description";
import React from "react";
import { propertyDetails } from "../dummyData";

const PropertyAssessmentInformation = () => {
  return (
    <div className="flex xl:flex-row xl:flex-nowrap flex-col gap-x-6 md:gap-y-5 gap-y-6 justify-between bg-gray md:p-6 p-4 rounded-xl w-full min-h-4 h-full">
      {/* Property Information */}
      <div className="xl:w-3/5 w-full flex flex-col md:gap-y-6 gap-y-4">
        <h2 className="text-2xl font-bold">Property Information</h2>
        <div className="flex flex-col gap-y-4 w-full">
          {Object.entries(propertyDetails).map(([key, item], index, array) => (
            <React.Fragment key={key}>
              <div className="flex flex-nowrap justify-between w-full">
                <Description
                  type={IDescriptionTypes.dec1614}
                  content={item.label}
                />
                <Description
                  type={IDescriptionTypes.dec1614}
                  content={`$${item.value.toLocaleString()}`}
                  customClasses="text-primary"
                />
              </div>
              {/* Show divider except last item */}
              {index !== array.length - 1 && (
                <LineGradient customClasses="my-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <LineGradient vr customClasses="h-auto xl:block hidden" />
      <LineGradient customClasses="w-full block xl:hidden" />
      {/* Legal description */}
      <div className="flex flex-col xl:justify-between md:gap-y-6 gap-y-4 xl:w-[40%] w-full">
        <div className="bg-background p-6 rounded-xl flex flex-col gap-y-4 w-full ">
          <Description
            type={IDescriptionTypes.dec18}
            content="Legal description and parcel ID"
            customClasses="font-medium"
          />
          <Description
            type={IDescriptionTypes.dec1614}
            content="LOT B, PLAN NEP4210, DISTRICT LOT 4596, KOOTENAY LAND DISTRICT, MANUFACTRED HOME REG.# 190009"
          />
        </div>
        <div className="bg-background p-6 rounded-xl flex flex-col gap-y-4 w-full ">
          <Description
            type={IDescriptionTypes.dec18}
            content="Sale History (Last 3 full calendar years)"
            customClasses="font-medium"
          />
          <Description
            type={IDescriptionTypes.dec1614}
            content="No sales hsitory for the last 3 full calendar years"
          />
        </div>
        <div className="bg-background p-6 rounded-xl flex flex-col gap-y-4 w-full ">
          <Description
            type={IDescriptionTypes.dec18}
            content="Manufactured home"
            customClasses="font-medium"
          />
          <div className="w-full flex flex-row flex-nowrap justify-between items-center">
            <Description type={IDescriptionTypes.dec1614} content="Width" />
            <Description type={IDescriptionTypes.dec1614} content="12 Ft" />
          </div>
          <div className="w-full flex flex-row flex-nowrap justify-between items-center">
            <Description type={IDescriptionTypes.dec1614} content="Length" />
            <Description type={IDescriptionTypes.dec1614} content="44 Ft" />
          </div>
          <div className="w-full flex flex-row flex-nowrap justify-between items-center">
            <Description
              type={IDescriptionTypes.dec1614}
              content="Total area"
            />
            <Description type={IDescriptionTypes.dec1614} content="528 sqFt" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAssessmentInformation;
