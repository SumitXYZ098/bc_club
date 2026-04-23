export const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
};

import dayjs from "dayjs";

type TimeFormatMode = "short" | "long";

export const getTime = (
  timestamp: string | number | Date,
  mode: TimeFormatMode = "long"
): string => {
  const now = dayjs();
  const target = dayjs(timestamp);

  const minutes = now.diff(target, "minute");
  const hours = now.diff(target, "hour");
  const days = now.diff(target, "day");
  const months = now.diff(target, "month");
  const years = now.diff(target, "year");

  if (mode === "short") {
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}H`;
    if (days < 30) return `${days}D`;
    if (months < 12) return `${months}M`;
    return `${years}Y`;
  }

  // long mode (time ago)
  if (minutes < 60)
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  if (hours < 24)
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  if (days < 30)
    return `${days} day${days !== 1 ? "s" : ""} ago`;

  if (months < 12)
    return `${months} month${months !== 1 ? "s" : ""} ago`;

  return `${years} year${years !== 1 ? "s" : ""} ago`;
};
