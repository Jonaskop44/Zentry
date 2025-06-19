export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  activities?: Activity[];
}

export interface Activity {
  id?: number;
  type: ActivityType;
  startTime?: Date;
  endTime?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  employeeId: number;
}

export enum ActivityType {
  WORK = "WORK",
  BREAK = "BREAK",
  WC = "WC",
  SMOKE = "SMOKE",
  FREE = "FREE",
}
