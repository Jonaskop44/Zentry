import { Employee } from "@/types/employee.types";
import { create } from "zustand";

interface EmployeeState {
  employee: Employee;
  setEmployee: (employee: Employee) => void;
}

export const useUserStore = create<EmployeeState>((set) => ({
  employee: {} as Employee,
  setEmployee: (employee: Employee) => set({ employee }),
}));
