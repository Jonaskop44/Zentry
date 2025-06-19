import { Employee } from "@/types/employee.types";
import api from "../axios";

export class Helper {
  constructor() {}

  async getAllEmployees() {
    return api
      .get("admin/employees")
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async getEmployeeById(id: string) {
    return api
      .get(`admin/employee/${id}`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async createEmployee(employee: Employee) {
    return api
      .post("admin/employee", {
        firstName: employee.firstName,
        lastName: employee.lastName,
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

  async updateEmployee(employee: Employee) {
    return api
      .patch(`admin/employee/${employee.id}`, {
        firstName: employee.firstName,
        lastName: employee.lastName,
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

  async deleteEmployee(id: string) {
    return api
      .delete(`admin/employee/${id}`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        return { data: null, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }
}
