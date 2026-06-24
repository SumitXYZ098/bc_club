"use client";

import React, { useMemo } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { MdApartment, MdEmojiEvents, MdMap, MdSchool, MdStar } from "react-icons/md";

export type SchoolType = "Elementary" | "Secondary" | "All";

export type SchoolItem = {
  id: string;
  school_name: string;
  school_type: SchoolType;
  city?: string;
  rating?: number | string;
  rank?: number;
  address?: string;
  latitude: number;
  longitude: number;
};

/**
 * Renders a specialized school marker with a detailed information popup,
 * showing Fraser Institute rating, rank, and address.
 */
export default function TestMapSchoolMarker({ school }: { school: SchoolItem }) {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: "bc-osm-marker",
        html: `<div class="bc-osm-school"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="22" width="22" xmlns="http://www.w3.org/2000/svg"><path d="M256 32 20 160l236 128 192-104v104h44V160L256 32zM108 247.3V336c0 48.6 66.3 88 148 88s148-39.4 148-88v-88.7L256 328 108 247.3z"></path></svg></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    [],
  );

  return (
    <Marker position={[school.latitude, school.longitude]} icon={icon}>
      <Popup className="school-popup w-[350px]">
        <div className="w-[350px] overflow-hidden rounded-2xl bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
              <MdSchool className="h-6 w-6 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold leading-snug text-[#15376b]">
                {school.school_name || "-"}
              </h3>

              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
                <MdApartment className="h-3.5 w-3.5" />
                {school.school_type || "-"}
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-dashed border-gray-200" />

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-50">
                <MdStar className="h-5 w-5 text-yellow-500" />
              </div>
              <span className="font-medium text-gray-600">Rating</span>
              <span className="ml-auto font-bold text-primary">
                {school.rating || "-"} / 10
              </span>
            </div>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50">
                <MdEmojiEvents className="h-5 w-5 text-purple-600" />
              </div>
              <span className="font-medium text-gray-600">Rank</span>
              <span className="ml-auto font-bold text-purple-600">
                {school.rank || "-"}
              </span>
            </div>

            <div className="flex items-start gap-3 border-b border-gray-100 pb-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <MdMap className="h-5 w-5 text-blue-500" />
              </div>
              <span className="font-medium text-gray-600">Address</span>
              <span className="ml-auto max-w-[150px] text-right font-semibold leading-snug text-gray-800">
                {school.address || "-"}
              </span>
            </div>
            <span className="text-right text-[10px] font-medium text-gray-400">
              Data Source: Fraser Institute
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
