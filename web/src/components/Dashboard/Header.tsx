"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { type Employee, Gender } from "@/types/employee.types";
import { FC } from "react";

interface EmployeeHeaderProps {
  employee: Employee;
  currentTime: Date;
}

const DashboardHeader: FC<EmployeeHeaderProps> = ({
  employee,
  currentTime,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full ${
              employee.gender === Gender.MALE ? "bg-blue-500" : "bg-pink-500"
            } flex items-center justify-center border-4 border-white/20`}
          >
            <Icon
              icon={
                employee.gender === Gender.MALE
                  ? "mdi:account"
                  : "mdi:account-outline"
              }
              className="text-white text-2xl"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {employee.firstName}
            </h1>
            <p className="text-gray-400">
              Manage your working time and activities
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {currentTime.toLocaleTimeString("de-DE")}
          </p>
          <p className="text-gray-400">
            {currentTime.toLocaleDateString("de-DE")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
