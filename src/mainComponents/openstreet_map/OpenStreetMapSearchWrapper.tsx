"use client";

import dynamic from "next/dynamic";
import MapLoading from "../maps/google_map/MapLoading";

const OpenStreetMapSearch = dynamic(() => import("./OpenStreetMapSearch"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export default OpenStreetMapSearch;
