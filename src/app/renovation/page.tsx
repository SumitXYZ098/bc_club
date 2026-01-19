import GetInTouch from "@/src/mainComponents/getInTouch/GetInTouch";
import EstimateCostForm from "@/src/mainComponents/renovation/EstimateCostForm";
import RenovationHeaderSection from "@/src/mainComponents/renovation/RenovationHeaderSection";

const page = () => {
  return (
    <>
      <RenovationHeaderSection />
      <EstimateCostForm/>
      <GetInTouch />
    </>
  );
};

export default page;
