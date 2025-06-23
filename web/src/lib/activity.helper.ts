import { ActivityType } from "@/types/employee.types";

export const formatDuration = (milliseconds: number) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case ActivityType.WORK:
      return "solar:case-minimalistic-bold-duotone";
    case ActivityType.BREAK:
      return "ph:coffee-duotone";
    case ActivityType.WC:
      return "mdi:human-male-female";
    case ActivityType.SMOKE:
      return "mdi:smoking";
    case ActivityType.FREE:
      return "solar:clock-circle-broken";
    default:
      return "mdi:help-circle";
  }
};

export const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case ActivityType.WORK:
      return "success";
    case ActivityType.BREAK:
      return "warning";
    case ActivityType.WC:
      return "secondary";
    case ActivityType.SMOKE:
      return "danger";
    case ActivityType.FREE:
      return "primary";
    default:
      return "default";
  }
};

export const getActivityLabel = (type: ActivityType) => {
  switch (type) {
    case ActivityType.WORK:
      return "Work";
    case ActivityType.BREAK:
      return "Break";
    case ActivityType.WC:
      return "WC";
    case ActivityType.SMOKE:
      return "Smoking";
    case ActivityType.FREE:
      return "Free time";
    default:
      return "Unknown";
  }
};
