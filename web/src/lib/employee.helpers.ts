import { Gender } from "@/types/employee.types";

export const getProfileColor = (gender: Gender) =>
  gender === "MALE" ? "bg-blue-500" : "bg-pink-500";

export const getProfileIcon = (gender: Gender) =>
  gender === "MALE" ? "mdi:account" : "mdi:account-outline";
