import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import Description, {
  IDescriptionTypes,
} from "@/src/components/description/Description";
import React from "react";

interface Props {
  data: any;
}

const PropertyAssessmentInformation = ({ data }: Props) => {
  
  if (!data) {
  return (
    <div className="flex xl:flex-row xl:flex-nowrap flex-col gap-x-6 md:gap-y-5 gap-y-6 justify-between bg-gray md:p-6 p-4 rounded-xl w-full animate-pulse">

      <div className="xl:w-3/5 w-full flex flex-col md:gap-y-6 gap-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded" />

        <div className="flex flex-col gap-y-4 w-full">
          {[1,2,3,4,5,6,7].map((_, i) => (
            <div key={i}>
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-[1px] bg-gray-200 mt-2" />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden xl:block w-[1px] bg-gray-200" />

      <div className="xl:w-[40%] w-full flex flex-col gap-y-6">

        {[1,2,3].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl flex flex-col gap-y-4">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        ))}

      </div>
    </div>
  );
}
  
   const propertyDetails = {
  land: { label: "Land", value: data?.landValue||"N/A"},
  description: { label: "Description", value: data?.propertyInfo["Description"] || "N/A" },
  bedrooms: { label: "Bedrooms", value: data?.propertyInfo["Bedrooms"] || "N/A" },
  baths: { label: "Baths", value: data?.propertyInfo["Baths"] || "N/A" },
  carports: { label: "Carports", value: data?.propertyInfo["Carports"] || "N/A" },
  garages: { label: "Garages", value: data?.propertyInfo["Garages"] || "N/A" },
  landSize: { label: "Land Size", value: data?.propertyInfo["Land size"] || "N/A"  },
  firstFloorArea: { label: "First Floor Area", value: data?.propertyInfo["First floor area"] || "N/A" },
  secondFloorArea: { label: "Second Floor Area", value: data?.propertyInfo["Second floor area"] || "N/A" },
  basementFinishArea: { label: "Basement Finish Area", value: data?.propertyInfo["Basement finish area"] || "N/A" },
  buildingStoreys: { label: "Building Storeys", value: data?.propertyInfo["Building storeys"] || "N/A" },
  grossLeasableArea: { label: "Gross Leasable Area", value: data?.propertyInfo["Gross leasable area"] || "N/A" },
  netLeasableArea: { label: "Net Leasable Area", value: data?.propertyInfo["Net leasable area"] || "N/A" },
  numberOfApartmentUnits: { label: "No. of Apartment Units", value: data?.propertyInfo["No. of apartment units"] || "N/A" },
};

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
                  content={`${item.value.toLocaleString()}`}
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
            content={data?.legal?.[0]?.description}
          />
            <Description
            type={IDescriptionTypes.dec18}
            content={`PID : ${data?.legal?.[0]?.pid}`}
            customClasses="font-sm"
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
            content={data?.salesHistory}
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
            <Description type={IDescriptionTypes.dec1614} content={data?.manufacturedHome?.width || "N/A"} />
          </div>
          <div className="w-full flex flex-row flex-nowrap justify-between items-center">
            <Description type={IDescriptionTypes.dec1614} content="Length" />
            <Description type={IDescriptionTypes.dec1614} content={data?.manufacturedHome?.length || "N/A"} />
          </div>
          <div className="w-full flex flex-row flex-nowrap justify-between items-center">
            <Description
              type={IDescriptionTypes.dec1614}
              content="Total area"
            />
            <Description type={IDescriptionTypes.dec1614} content={data?.manufacturedHome?.totalArea || "N/A"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAssessmentInformation;
