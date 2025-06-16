import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
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

  @Get('employee/:id')
  async getEmployeeById(@Param('id') employeeId: number, @Request() request) {
    const userId = request.user.id;
    return this.adminService.getEmployeeById(employeeId, userId);
  }

  @Post('employee')
  async createEmployee(@Body() dto: CreateEmployeeDto, @Request() request) {
    const userId = request.user.id;
    return this.adminService.createEmployee(dto, userId);
  }

  @Patch('employee/:id')
  async updateEmployee(
    @Param('id') employeeId: number,
    @Body() dto: CreateEmployeeDto,
    @Request() request,
  ) {
    const userId = request.user.id;
    return this.adminService.updateEmployee(employeeId, dto, userId);
  }

  @Delete('employee/:id')
  async deleteEmployee(@Param('id') employeeId: number, @Request() request) {
    const userId = request.user.id;
    return this.adminService.deleteEmployee(employeeId, userId);
  }
}
