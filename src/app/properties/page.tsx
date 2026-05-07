import GetInTouch from "@/src/mainComponents/getInTouch/GetInTouch";
import PropertiesListingPage from "@/src/mainComponents/properties/PropertiesListingPage";
import { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense fallback={null}>
        <PropertiesListingPage />
        <GetInTouch />
      </Suspense>
    </>
  );
};

export default page;
