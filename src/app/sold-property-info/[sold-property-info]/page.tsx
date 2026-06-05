import SoldPropertyInfo from "@/src/mainComponents/soldPropertyInfo/SoldPropertyInfo";

interface Params {
  "sold-property-info": string;
}

const page = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params;
  const paramsId = resolvedParams["sold-property-info"];
  return <SoldPropertyInfo paramsId={paramsId} />;
};

export default page;
