
import PropertyInfo from "@/src/mainComponents/propertyInfo/PropertyInfo";

interface Params {
  "property-info": string;
}

const page = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params;
  const paramsId = resolvedParams["property-info"];
  return (
    <PropertyInfo paramsId={paramsId} />
    // <>
    //   <section className="xl:max-w-screen-2xl mx-auto w-full bg-background flex flex-col xl:px-16 md:px-13 px-6 xl:pt-35.5 xl:pb-28.25 md:pt-28 md:pb-25 pt-21 pb-13 ">
    //     <PropertyTopAddressSection property={data} />
    //     <PropertyGallery images={propertyImages} />
    //     <PropertyInformation property={data} />
    //   </section>
    //   <GetInTouch />
    // </>
  );
};

export default page;
