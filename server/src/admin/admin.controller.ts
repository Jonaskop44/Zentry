import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('employees')
  async getAllEmployees(@Request() request) {
    const userId = request.user.id;
    return this.adminService.getAllEmployees(userId);
  }
}
