import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StartActivityDto, UpdateActivityDto } from './dto/activity.dto';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async startActivity(dto: StartActivityDto, userId: number) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: dto.employeeId,
        userId: userId,
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    return this.prisma.activity.create({
      data: {
        type: dto.activityType,
        employeeId: dto.employeeId,
      },
    });
  }

  async endActivity(activityId: number, userId: number) {
    const lastActivity = await this.prisma.activity.findUnique({
      where: {
        id: activityId,
        endTime: null,
        employee: {
          userId: userId,
        },
      },
    });

    if (!lastActivity)
      throw new NotFoundException('Activity not found or already ended');

    return this.prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        endTime: new Date(),
      },
    });
  }

  async getAllActivities(userId: number) {
    const activities = await this.prisma.activity.findMany({
      where: {
        employee: {
          userId: userId,
        },
      },
      orderBy: {
        startTime: 'desc',
      },
      include: {
        employee: true,
      },
    });

    if (!activities || activities.length === 0) {
      throw new NotFoundException('No activities found');
    }

    return activities;
  }

  async getAllActivitiesByEmployeeId(employeeId: number, userId: number) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: employeeId,
        userId: userId,
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const activities = await this.prisma.activity.findMany({
      where: {
        employeeId: employeeId,
      },
      orderBy: {
        startTime: 'desc',
      },
      include: {
        employee: true,
      },
    });

    if (!activities || activities.length === 0) {
      throw new NotFoundException('No activities found for this employee');
    }

    return activities;
  }

  async deleteActivity(activityId: number, userId: number) {
    const activity = await this.prisma.activity.findUnique({
      where: {
        id: activityId,
        employee: {
          userId: userId,
        },
      },
    });

    if (!activity) throw new NotFoundException('Activity not found');

    return this.prisma.activity.delete({
      where: {
        id: activityId,
      },
    });
  }

  async updateActivity(
    activityId: number,
    dto: UpdateActivityDto,
    userId: number,
  ) {
    const activity = await this.prisma.activity.findUnique({
      where: {
        id: activityId,
        employee: {
          userId: userId,
        },
      },
    });

    if (!activity) throw new NotFoundException('Activity not found');

    return this.prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        type: dto.activityType,
        employeeId: dto.employeeId,
      },
    });
  }

  async getDailyOverview(userId: number, dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const start = startOfDay(date);
    const end = endOfDay(date);

    const activities = await this.prisma.activity.findMany({
      where: {
        startTime: {
          gte: start,
          lte: end,
        },
        employee: {
          userId: userId,
        },
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.summarizeActivities(activities);
  }

  async getWeeklyOverview(userId: number, startStr?: string) {
    const now = startStr ? new Date(startStr) : new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });

    const activities = await this.prisma.activity.findMany({
      where: {
        startTime: {
          gte: start,
          lte: end,
        },
        employee: {
          userId: userId,
        },
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.summarizeActivities(activities);
  }

  private summarizeActivities(activities: any[]) {
    const result: Record<string, any> = {};

    for (const activity of activities) {
      const name = `${activity.employee.firstName} ${activity.employee.lastName}`;
      if (!result[name]) {
        result[name] = {
          totalMinutes: 0,
          byType: {} as Record<string, number>,
        };
      }

      const end = activity.endTime ? new Date(activity.endTime) : new Date();
      const start = new Date(activity.startTime);
      const duration = (end.getTime() - start.getTime()) / 60000;

      result[name].totalMinutes += duration;
      result[name].byType[activity.type] =
        (result[name].byType[activity.type] || 0) + duration;
    }

    return result;
  }

  async exportActivities(employeeId: number, userId: number) {
    const activities = await this.prisma.activity.findMany({
      where: {
        employeeId: employeeId,
        employee: {
          userId: userId,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    if (!activities.length) throw new NotFoundException('No activities found');

    const header = 'ID,Type,StartTime,EndTime,CreatedAt,UpdatedAt\n';
    const rows = activities
      .map((a) =>
        [
          a.id,
          a.type,
          a.startTime,
          a.endTime ?? '',
          a.createdAt,
          a.updatedAt,
        ].join(','),
      )
      .join('\n');
    return header + rows;
  }
}
