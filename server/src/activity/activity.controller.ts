import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  Get,
  Delete,
  Patch,
  Query,
  Response,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { StartActivityDto, UpdateActivityDto } from './dto/activity.dto';

@UseGuards(JwtAuthGuard)
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('start')
  async startActivity(@Body() dto: StartActivityDto, @Request() request) {
    const userId = request.user.id;
    return this.activityService.startActivity(dto, userId);
  }

  @Post('end/:activityId')
  async endActivity(
    @Param('activityId') activityId: string,
    @Request() request,
  ) {
    const userId = request.user.id;
    return this.activityService.endActivity(Number(activityId), userId);
  }

  @Get('all')
  async getAllActivities(@Request() request) {
    const userId = request.user.id;
    return this.activityService.getAllActivities(userId);
  }

  @Get(':employeeId')
  async getEmployeeActivities(
    @Param('employeeId') employeeId: string,
    @Request() request,
  ) {
    const userId = request.user.id;
    return this.activityService.getAllActivitiesByEmployeeId(
      Number(employeeId),
      userId,
    );
  }

  @Delete(':activityId')
  async deleteActivity(
    @Param('activityId') activityId: string,
    @Request() request,
  ) {
    const userId = request.user.id;
    return this.activityService.deleteActivity(Number(activityId), userId);
  }

  @Patch(':activityId')
  async updateActivity(
    @Param('activityId') activityId: string,
    @Body() dto: UpdateActivityDto,
    @Request() request,
  ) {
    const userId = request.user.id;
    return this.activityService.updateActivity(Number(activityId), dto, userId);
  }

  @Get('statistics/daily')
  async getDailyOverview(@Request() request, @Query('date') date?: string) {
    const userId = request.user.id;
    return this.activityService.getDailyOverview(userId, date);
  }

  @Get('statistics/weekly')
  async getWeeklyOverview(
    @Request() request,
    @Query('startDate') startDate?: string,
  ) {
    const userId = request.user.id;
    return this.activityService.getWeeklyOverview(userId, startDate);
  }

  @Get('statistics/:employeeId/export')
  async exportActivitiesExcel(
    @Request() request,
    @Param('employeeId') employeeId: string,
    @Response() response,
  ) {
    const userId = request.user.id;
    const buffer = await this.activityService.exportActivitiesExcel(
      Number(employeeId),
      userId,
    );

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename=activities.xlsx',
    );
    response.send(buffer);
  }
}
