import GetInTouch from "@/src/mainComponents/getInTouch/GetInTouch";
import HomeHeroSection from "@/src/mainComponents/home/HomeHeroSection";
import OurProperty from "@/src/mainComponents/home/OurProperty";
import HomePropertiesSold from "../mainComponents/home/HomePropertiesSold";
import HomeSellingTrends from "../mainComponents/home/HomeSellingTrends";

export default function Home() {
  return (
    <>
      <HomeHeroSection />
      <HomePropertiesSold />
      <HomeSellingTrends />
      <OurProperty />
      <GetInTouch />
    </>
  );
}
