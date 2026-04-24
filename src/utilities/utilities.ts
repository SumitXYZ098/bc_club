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

  // ❗ invalid date handle
  if (!target.isValid()) return "";

  let minutes = now.diff(target, "minute");
  let hours = now.diff(target, "hour");
  let days = now.diff(target, "day");

  // ❗ future date fix
  if (minutes < 0) return "just now";

  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // ✅ SHORT MODE
  if (mode === "short") {
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 30) return `${days}d`;
    if (months < 12) return `${months}mo`;
    return `${years}y`;
  }

  // ✅ LONG MODE (natural language)

  if (minutes < 1) return "just now";

  if (minutes < 60)
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  if (hours < 24)
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  // 👇 special case
  if (days === 1) return "yesterday";

  if (days < 30)
    return `${days} day${days !== 1 ? "s" : ""} ago`;

  if (months < 12)
    return `${months} month${months !== 1 ? "s" : ""} ago`;

  return `${years} year${years !== 1 ? "s" : ""} ago`;
};