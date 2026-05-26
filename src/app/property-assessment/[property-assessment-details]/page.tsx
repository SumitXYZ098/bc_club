import PropertiesAssessmentDetails from "@/src/mainComponents/propertyAssessment/PropertiesAssessmentDetails";
interface Params {
  "property-assessment-details": string;
}

const page = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params;
  const assessmentId = resolvedParams["property-assessment-details"];

  return <PropertiesAssessmentDetails assessmentId={assessmentId} />;
};

export default page;
