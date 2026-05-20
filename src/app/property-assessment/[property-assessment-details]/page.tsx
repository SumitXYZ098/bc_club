import GetInTouch from "@/src/mainComponents/getInTouch/GetInTouch";
import AssessmentPropertySimilarAndSoldListing from "@/src/mainComponents/propertyAssessment/AssessmentPropertySimilarAndSoldListing";
import PropertyAssessmentInformation from "@/src/mainComponents/propertyAssessment/PropertyAssessmentInformation";
import PropertyAssessmentTopSection from "@/src/mainComponents/propertyAssessment/PropertyAssessmentTopSection";
import axios from "axios";


interface Params {
  "property-assessment-details": string;
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params;
  const assessmentId = resolvedParams["property-assessment-details"];

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/property-assignment-lists/${assessmentId}`,

  );
  const json = await res.data
    ;
  const property = json?.data;

  return (
    <>
      <section className="xl:max-w-screen-2xl mx-auto w-full flex flex-col xl:gap-y-13 md:gap-y-10 gap-y-7 xl:px-16 md:px-13 px-6 xl:pt-35.5 xl:pb-38 md:pt-28 md:pb-31 pt-21 pb-13 ">
        <PropertyAssessmentTopSection data={property} />
        <PropertyAssessmentInformation data={property} />
      </section>
      <AssessmentPropertySimilarAndSoldListing propertyId={property.documentId} />

      <GetInTouch />
    </>
  );
};

export default Page;
