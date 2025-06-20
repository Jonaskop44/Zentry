import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StartActivityDto, UpdateActivityDto } from './dto/activity.dto';
import * as ExcelJS from 'exceljs';
import { format } from 'date-fns';

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
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });
  }

  async exportActivitiesExcel(employeeId: number | null, userId: number) {
    const activities = await this.prisma.activity.findMany({
      where: {
        employee: {
          userId: userId,
        },
        ...(employeeId ? { employeeId } : {}),
      },
      include: {
        employee: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    if (!activities.length) throw new NotFoundException('No activities found');

    const activityTypeTranslations: Record<string, string> = {
      WORK: 'Arbeit',
      BREAK: 'Pause',
      WC: 'WC',
      SMOKE: 'Raucherpause',
      FREE: 'Frei',
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Activities');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Typ', key: 'type', width: 15 },
      { header: 'Start', key: 'startTime', width: 25 },
      { header: 'Ende', key: 'endTime', width: 25 },
      { header: 'Dauer (Minuten)', key: 'duration', width: 20 },
    ];

    const totalMinutesByEmployee: Record<string, number> = {};

    activities.forEach((entry) => {
      const start = new Date(entry.startTime);
      const end = entry.endTime ? new Date(entry.endTime) : new Date();

      const durationMs = end.getTime() - start.getTime();
      const duration = parseFloat((durationMs / 60000).toFixed(2));

      const name = `${entry.employee.firstName} ${entry.employee.lastName}`;
      totalMinutesByEmployee[name] =
        (totalMinutesByEmployee[name] || 0) + duration;

      worksheet.addRow({
        name,
        type: activityTypeTranslations[entry.type] ?? entry.type,
        startTime: format(start, 'yyyy-MM-dd HH:mm:ss'),
        endTime: entry.endTime ? format(end, 'yyyy-MM-dd HH:mm:ss') : '',
        duration: duration,
      });
    });

    worksheet.addRow({});
    Object.entries(totalMinutesByEmployee).forEach(([name, minutes]) => {
      worksheet.addRow({
        name: `Total für ${name}`,
        duration: `${minutes.toFixed(2)} Minuten`,
      });
    });

    const bufferData = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.isBuffer(bufferData)
      ? bufferData
      : Buffer.from(bufferData);
    return buffer;
  }
}
