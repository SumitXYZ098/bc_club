"use client";

import dynamic from "next/dynamic";

const OpenStreetMapSearch = dynamic(() => import("./OpenStreetMapSearch"), {
  ssr: false,
});

export default OpenStreetMapSearch;
