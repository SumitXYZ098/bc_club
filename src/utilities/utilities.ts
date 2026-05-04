export const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
};

import dayjs from "dayjs";

type TimeFormatMode = "short" | "long";

export const getTime = (
  timestamp: string | number | Date,
  mode: TimeFormatMode = "long",
): string => {
  const now = dayjs();
  const target = dayjs(timestamp);

  if (!target.isValid()) return "";

  const seconds = now.diff(target, "second");

  // future date
  if (seconds < 0) return "just now";

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);

  // ✅ SHORT MODE
  if (mode === "short") {
    if (seconds < 60) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 30) return `${days}d`;

    const months = now.diff(target, "month");
    if (months < 12) return `${months}mo`;

    const years = now.diff(target, "year");
    return `${years}y`;
  }

  // ✅ LONG MODE
  if (seconds < 60) return "just now";

  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  if (days === 1) return "yesterday";

  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

  const months = now.diff(target, "month");
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

  const years = now.diff(target, "year");
  return `${years} year${years !== 1 ? "s" : ""} ago`;
};

export const getOfficeName = (listing: any): string => {
  const values = [
    listing?.office_name,
    listing?.OFFICE_NAME,
    listing?.OfficeName,
    listing?.officeName,
    listing?.office_data?.OfficeName,
    listing?.office_data?.name,
    listing?.brokerage,
    listing?.realtor_name,
    listing?.raw_data?.ListOfficeName,
    listing?.raw_data?.OfficeName,
  ];

  for (const val of values) {
    if (!val || typeof val !== "string") continue;

    const clean = val.trim();
    const lower = clean.toLowerCase();

    if (
      clean &&
      !["pending office name", "unknown office", "unknown", ""].includes(lower)
    ) {
      return clean;
    }
  }

  return "Office Not Available";
};

export function getDisplayPropertyType(listing: any): string {
  if (!listing) return "Property";

  const status = (listing?.standard_status || "Active").trim().toLowerCase();
  const isActive = status === "active" || status === "for sale";

  const rawType = (
    listing?.property_sub_type ||
    listing?.PropertySubType ||
    listing?.raw_data?.PropertySubType ||
    ""
  )
    .trim()
    .toLowerCase();

  if (!rawType) return "Property";

  if (isActive) {
    if (rawType.includes("single family") || rawType.includes("single-family"))
      return "Single-Family";
    if (rawType.includes("multi family") || rawType.includes("multi-family"))
      return "Multi-Family";
    if (rawType.includes("office")) return "Office";
    if (rawType.includes("business") || rawType.includes("commercial"))
      return "Business";
    if (rawType.includes("agriculture") || rawType.includes("farm"))
      return "Agriculture";
    if (rawType.includes("vacant land") || rawType.includes("land"))
      return "Vacant Land";

    return rawType
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (rawType.includes("condo") || rawType.includes("apartment"))
    return "Apartment/Condo";
  if (
    rawType.includes("single family") ||
    rawType.includes("house") ||
    rawType.includes("single family residence")
  )
    return "Single Family Residence";
  if (rawType.includes("half duplex") || rawType.includes("duplex"))
    return "Half Duplex";
  if (rawType.includes("row house") || rawType.includes("row"))
    return "Row House (Non-Strata)";
  if (rawType.includes("townhouse") || rawType.includes("townhome"))
    return "Townhouse";

  return "Property";
}

export function matchesPropertyFilter(
  listing: any,
  selectedType: string,
): boolean {
  if (!selectedType || selectedType.toLowerCase() === "any") return true;
  return (
    getDisplayPropertyType(listing).toLowerCase() ===
    selectedType.trim().toLowerCase()
  );
}
