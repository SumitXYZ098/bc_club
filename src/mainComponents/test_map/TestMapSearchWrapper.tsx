"use client";

import dynamic from "next/dynamic";
import MapLoading from "../maps/google_map/MapLoading";

const TestMapSearch = dynamic(() => import("./TestMapSearch"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export default TestMapSearch;
