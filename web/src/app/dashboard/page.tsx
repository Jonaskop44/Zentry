"use client";

import { useEffect } from "react";
import { Spinner } from "@heroui/react";
import DashboardHeader from "@/components/Dashboard/Header";
import { useEmployeeStore } from "@/data/employee-store";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useRouter } from "next/navigation";
import CurrentActivityStatus from "@/components/Dashboard/CurrentActivityStatus";
import { motion } from "framer-motion";
import ActivityButtons from "@/components/Dashboard/ActivityButtons";
import { ActivityType } from "@/types/employee.types";
import TodayActivities from "@/components/Dashboard/TodayActivities";
import DailyStatistics from "@/components/Dashboard/DailyStatistics";

const DashboardPage = () => {
  const { employee } = useEmployeeStore();
  const {
    currentTime,
    currentActivity,
    elapsedTime,
    stopActivity,
    startActivity,
    getTodayActivities,
    dailyStats,
  } = useTimeTracking();
  const { setCurrentActivity } = useEmployeeStore();
  const router = useRouter();

  const handleStartActivity = (type: ActivityType) => {
    if (!employee.id) return;
    const newActivity = {
      type,
      employeeId: employee.id,
    };
    startActivity(newActivity);
  };

  const handleStopActivity = (activityId: number) => {
    if (!employee.id) return;
    stopActivity(activityId);
  };

  useEffect(() => {
    if (!employee.id) {
      router.push("/select-profile");
    } else {
      if (employee.activities && employee.activities.length > 0) {
        const activeActivity = employee.activities.find(
          (activity) => activity.endTime === null
        );

        if (activeActivity) {
          setCurrentActivity(activeActivity);
        }
      }
    }
  }, [employee.activities, employee.id, router, setCurrentActivity]);

  if (!employee.id) {
    return (
      <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Spinner
          size="lg"
          label="Loading..."
          variant="gradient"
          classNames={{
            label: "text-white font-semibold",
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <DashboardHeader employee={employee} currentTime={currentTime} />

      <CurrentActivityStatus
        currentActivity={currentActivity}
        elapsedTime={elapsedTime}
        onStopActivity={handleStopActivity}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <ActivityButtons
            currentActivity={currentActivity}
            onStartActivity={handleStartActivity}
          />

          <TodayActivities activities={getTodayActivities()} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <DailyStatistics stats={dailyStats} />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
