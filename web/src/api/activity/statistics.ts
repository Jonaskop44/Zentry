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

  async getStatisticsByEmployeeId(employeeId: string) {
    return api
      .get(`activity/statistics/export/${employeeId}`)
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
