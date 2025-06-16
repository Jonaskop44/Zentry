import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StartActivityDto } from './dto/activity.dto';

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
}
