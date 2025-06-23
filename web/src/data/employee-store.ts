import { Activity, Employee } from "@/types/employee.types";
import { create } from "zustand";

interface EmployeeState {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  employee: Employee;
  setEmployee: (employee: Employee) => void;
  currentActivity: Activity | null;
  setCurrentActivity: (currentActivity: Activity | null) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [] as Employee[],
  setEmployees: (employees: Employee[]) => set({ employees }),
  employee: {} as Employee,
  setEmployee: (employee: Employee) => set({ employee }),
  currentActivity: null,
  setCurrentActivity: (currentActivity: Activity | null) =>
    set({ currentActivity }),
}));
