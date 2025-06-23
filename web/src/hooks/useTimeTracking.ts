"use client";

import { useState, useEffect, useMemo } from "react";
import {
  type Employee,
  type Activity,
  ActivityType,
} from "@/types/employee.types";

export const useTimeTracking = (initialEmployee: Employee) => {
  const [employee, setEmployee] = useState<Employee>(initialEmployee);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
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

  // Calculate daily statistics
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

  const startActivity = (type: ActivityType) => {
    const newActivity: Activity = {
      id: Date.now(),
      type,
      startTime: new Date(),
      endTime: null,
      employeeId: employee.id!,
    };

    setCurrentActivity(newActivity);
    setEmployee((prev) => ({
      ...prev,
      activities: [...(prev.activities || []), newActivity],
    }));
  };

  const stopActivity = () => {
    if (currentActivity) {
      const updatedActivity = {
        ...currentActivity,
        endTime: new Date(),
      };

      setEmployee((prev) => ({
        ...prev,
        activities:
          prev.activities?.map((act) =>
            act.id === currentActivity.id ? updatedActivity : act
          ) || [],
      }));

      setCurrentActivity(null);
      setElapsedTime(0);
    }
  };

  return {
    employee,
    currentTime,
    currentActivity,
    elapsedTime,
    dailyStats,
    getTodayActivities,
    startActivity,
    stopActivity,
  };
};
