"use client";

import { useState, useEffect, useMemo } from "react";
import { type Activity, ActivityType } from "@/types/employee.types";
import ApiClient from "@/api";
import { useEmployeeStore } from "@/data/employee-store";
import { toast } from "sonner";

const apiClient = new ApiClient();

export const useTimeTracking = () => {
  const { currentActivity, setCurrentActivity, employee, setEmployee } =
    useEmployeeStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update elapsed time for current activity
  useEffect(() => {
    if (currentActivity?.startTime) {
      const timer = setInterval(() => {
        const elapsed =
          Date.now() - new Date(currentActivity.startTime!).getTime();
        setElapsedTime(elapsed);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentActivity]);

  const startActivity = async (activity: Activity) => {
    await apiClient.activity.helper.startActivity(activity).then((response) => {
      if (response.status) {
        setCurrentActivity(response.data);
      } else {
        toast.error("There was an error starting the activity.");
      }
    });
  };

  const stopActivity = async (activityId: number) => {
    if (currentActivity && currentActivity.employeeId === employee.id) {
      await apiClient.activity.helper
        .stopActivity(activityId)
        .then((response) => {
          if (response.status) {
            setCurrentActivity(null);
            setElapsedTime(0);
            const updated =
              employee.activities?.filter((a) => a.id !== response.data.id) ??
              [];
            setEmployee({
              ...employee,
              activities: [...updated, response.data],
            });

            toast.success("Activity stopped successfully.");
          }
        });
    }
  };

  const getTodayActivities = () => {
    const today = new Date().toDateString();
    return (
      employee.activities?.filter(
        (activity) =>
          activity.startTime &&
          new Date(activity.startTime).toDateString() === today
      ) || []
    );
  };

  const dailyStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayActivities =
      employee.activities?.filter(
        (activity) =>
          activity.startTime &&
          new Date(activity.startTime).toDateString() === today
      ) || [];

    const stats = {
      totalWork: 0,
      totalBreak: 0,
      totalWC: 0,
      totalSmoke: 0,
      totalFree: 0,
      totalActivities: todayActivities.length,
    };

    todayActivities.forEach((activity) => {
      if (activity.startTime && activity.endTime) {
        const duration =
          new Date(activity.endTime).getTime() -
          new Date(activity.startTime).getTime();

        switch (activity.type) {
          case ActivityType.WORK:
            stats.totalWork += duration;
            break;
          case ActivityType.BREAK:
            stats.totalBreak += duration;
            break;
          case ActivityType.WC:
            stats.totalWC += duration;
            break;
          case ActivityType.SMOKE:
            stats.totalSmoke += duration;
            break;
          case ActivityType.FREE:
            stats.totalFree += duration;
            break;
        }
      }
    });

    return stats;
  }, [employee.activities]);

  return {
    employee,
    currentTime,
    currentActivity,
    elapsedTime,
    startActivity,
    stopActivity,
    getTodayActivities,
    dailyStats,
  };
};
