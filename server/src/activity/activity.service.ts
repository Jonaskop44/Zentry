import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StartActivityDto, UpdateActivityDto } from './dto/activity.dto';
import * as ExcelJS from 'exceljs';
import { format, differenceInMinutes } from 'date-fns';
import { groupBy } from 'lodash';
import { secondsToHHMMSS } from './activity.helper';

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
    });

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
    const workbook = new ExcelJS.Workbook();

    // Set workbook properties
    const employeesGrouped = employeeId
      ? {
          [`${activities[0].employee.firstName} ${activities[0].employee.lastName}`]:
            activities,
        }
      : activities.reduce(
          (acc, activity) => {
            const name = `${activity.employee.firstName} ${activity.employee.lastName}`;
            if (!acc[name]) acc[name] = [];
            acc[name].push(activity);
            return acc;
          },
          {} as Record<string, typeof activities>,
        );

    for (const [employeeName, employeeActivities] of Object.entries(
      employeesGrouped,
    )) {
      const groupedByDay = employeeActivities.reduce(
        (acc, a) => {
          const date = format(new Date(a.startTime), 'yyyy-MM-dd');
          if (!acc[date]) acc[date] = [];
          acc[date].push(a);
          return acc;
        },
        {} as Record<string, typeof activities>,
      );

      const worksheet = workbook.addWorksheet(employeeName);

      worksheet.columns = [
        { header: 'Tag', key: 'day', width: 20 },
        { header: 'Arbeit (hh:mm:ss)', key: 'work', width: 18 },
        { header: 'Pause (hh:mm:ss)', key: 'break', width: 18 },
        { header: 'Raucherpause (hh:mm:ss)', key: 'smoke', width: 20 },
        { header: 'WC (hh:mm:ss)', key: 'wc', width: 18 },
        { header: 'Frei (hh:mm:ss)', key: 'free', width: 18 },
        { header: 'Nettoarbeit (hh:mm:ss)', key: 'netto', width: 22 },
      ];

      const monthlyTotals = {
        work: 0,
        break: 0,
        smoke: 0,
        wc: 0,
        free: 0,
        netto: 0,
      };

      Object.entries(groupedByDay).forEach(([day, entries], index) => {
        const sum = {
          work: 0,
          break: 0,
          smoke: 0,
          wc: 0,
          free: 0,
        };

        entries.forEach((entry) => {
          const start = new Date(entry.startTime);
          const end = entry.endTime ? new Date(entry.endTime) : new Date();
          const seconds = Math.round((end.getTime() - start.getTime()) / 1000);

          switch (entry.type) {
            case 'WORK':
              sum.work += seconds;
              break;
            case 'BREAK':
              sum.break += seconds;
              break;
            case 'SMOKE':
              sum.smoke += seconds;
              break;
            case 'WC':
              sum.wc += seconds;
              break;
            case 'FREE':
              sum.free += seconds;
              break;
          }
        });

        const netto = sum.work - (sum.break + sum.smoke + sum.wc);

        worksheet.addRow({
          day: `Tag ${index + 1} (${day})`,
          work: secondsToHHMMSS(sum.work),
          break: secondsToHHMMSS(sum.break),
          smoke: secondsToHHMMSS(sum.smoke),
          wc: secondsToHHMMSS(sum.wc),
          free: secondsToHHMMSS(sum.free),
          netto: secondsToHHMMSS(netto),
        });

        monthlyTotals.work += sum.work;
        monthlyTotals.break += sum.break;
        monthlyTotals.smoke += sum.smoke;
        monthlyTotals.wc += sum.wc;
        monthlyTotals.free += sum.free;
        monthlyTotals.netto += netto;
      });

      worksheet.addRow({});
      worksheet.addRow({
        day: 'Gesamt',
        work: secondsToHHMMSS(monthlyTotals.work),
        break: secondsToHHMMSS(monthlyTotals.break),
        smoke: secondsToHHMMSS(monthlyTotals.smoke),
        wc: secondsToHHMMSS(monthlyTotals.wc),
        free: secondsToHHMMSS(monthlyTotals.free),
        netto: secondsToHHMMSS(monthlyTotals.netto),
      });
    }

    const bufferData = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.isBuffer(bufferData)
      ? bufferData
      : Buffer.from(bufferData);
    return buffer;
  }
}
