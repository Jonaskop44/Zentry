import { Employee } from "@/types/employee.types";
import { create } from "zustand";

interface EmployeeState {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [] as Employee[],
  setEmployees: (employees: Employee[]) => set({ employees }),
}));
