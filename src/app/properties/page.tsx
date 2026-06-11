import GetInTouch from "@/src/mainComponents/getInTouch/GetInTouch";
import PropertiesListingPage from "@/src/mainComponents/properties/PropertiesListingPage";
import { connection } from "next/server";

const page = async () => {
  await connection();
  return (
    <>
      <PropertiesListingPage />
      <GetInTouch />
    </>
  );
};

export default page;
