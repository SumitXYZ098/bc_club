import GetInTouch from "@/src/mainComponents/getInTouch/GetInTouch";
import MapTapSection from "@/src/mainComponents/propertyAssessment/MapTapSection";
import PropertyAssessmentInformation from "@/src/mainComponents/propertyAssessment/PropertyAssessmentInformation";
import PropertyAssessmentTopSection from "@/src/mainComponents/propertyAssessment/PropertyAssessmentTopSection";
import RegisterWithBC from "@/src/mainComponents/propertyAssessment/RegisterWithBC";
import { Endpoints } from "@/src/api/endpoints";

 
interface Params {
  "property-assessment-details": string;
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params;
  const assessmentId = resolvedParams["property-assessment-details"];

 const res = await fetch(
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/property-assignment-lists/${assessmentId}`,
  { cache: "no-store" }
);
  const json = await res.json();
  const property = json?.data;

  return (
    <>
      <section className="xl:max-w-screen-2xl mx-auto w-full flex flex-col xl:gap-y-13 md:gap-y-10 gap-y-7 xl:px-16 md:px-13 px-6 xl:pt-35.5 xl:pb-38 md:pt-28 md:pb-31 pt-21 pb-13 ">
        <PropertyAssessmentTopSection data={property} />
        <PropertyAssessmentInformation data={property} />
        <RegisterWithBC />
        <MapTapSection />
      </section>
    
      <GetInTouch />
    </>
  );
};

export default Page;
