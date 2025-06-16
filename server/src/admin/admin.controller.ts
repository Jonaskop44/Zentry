import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { CreateEmployeeDto } from './dto/admin.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('employees')
  async getAllEmployees(@Request() request) {
    const userId = request.user.id;
    return this.adminService.getAllEmployees(userId);
  }

  @Post('employee')
  async createEmployee(@Body() dto: CreateEmployeeDto, @Request() request) {
    const userId = request.user.id;
    return this.adminService.createEmployee(dto, userId);
  }
}
