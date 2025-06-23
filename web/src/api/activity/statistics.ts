import { Employee } from "@/types/employee.types";
import api from "../axios";

export class Statistics {
  constructor() {}

  async getAllStatistics() {
    return api
      .get(`activity/statistics/export-all`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async getStatisticsByEmployeeId(employee: Employee) {
    return api
      .get(`activity/statistics/export/${employee.id}`, {
        responseType: "blob",
      })
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `activities_${employee.firstName}_${employee.lastName}.xlsx`
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }
}
