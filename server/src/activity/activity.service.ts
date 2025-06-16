import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StartActivityDto, UpdateActivityDto } from './dto/activity.dto';

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
}
