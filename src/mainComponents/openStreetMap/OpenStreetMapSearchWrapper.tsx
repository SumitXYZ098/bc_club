"use client";

import dynamic from "next/dynamic";
import MapLoading from "./MapLoading";

const OpenStreetMapSearchWrapper = dynamic(
  () => import("./OpenStreetMapSearch"),
  {
    ssr: false,
    loading: () => <MapLoading />,
  },
);

export default OpenStreetMapSearchWrapper;
