import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { StartActivityDto } from './dto/activity.dto';

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
}
