import { Activity } from "@/types/employee.types";
import api from "../axios";

export class Helper {
  constructor() {}

  async startActivity(activity: Activity) {
    return api
      .post("activity/start", {
        activityType: activity.type,
        employeeId: activity.employeeId,
      })
      .then((response) => {
        if (response.status !== 201) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async stopActivity(activityId: number) {
    return api
      .post(`activity/end/${activityId}`)
      .then((response) => {
        if (response.status !== 201) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async getAllActivities() {
    return api
      .get("activity/all")
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async getActivityByEmployeeId(employeeId: number) {
    return api
      .get(`activity/${employeeId}`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async deleteActivity(activityId: number) {
    return api
      .delete(`activity/${activityId}`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async updateActivity(activity: Activity) {
    return api
      .patch(`activity/${activity.id}`, {
        type: activity.type,
        startTime: activity.startTime,
        endTime: activity.endTime,
        employeeId: activity.employeeId,
      })
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }
}
