"use client";

import { useState, useEffect } from "react";
import { type Employee, type Activity } from "@/types/employee.types";
import ApiClient from "@/api";
import { useEmployeeStore } from "@/data/employee-store";
import { toast } from "sonner";

const apiClient = new ApiClient();

export const useTimeTracking = (initialEmployee: Employee) => {
  const [employee, setEmployee] = useState<Employee>(initialEmployee);
  const { currentActivity, setCurrentActivity } = useEmployeeStore();
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

  return {
    employee,
    currentTime,
    currentActivity,
    elapsedTime,
    startActivity,
    stopActivity,
    getTodayActivities,
  };
};
