import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllEmployees(userId: number) {
    return this.prisma.employee.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getEmployeeById(employeeId: number, userId: number) {
    const employee = await this.prisma.employee.findFirst({
      where: {
        id: employeeId,
        userId: userId,
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    return employee;
  }

  async createEmployee(dto: CreateEmployeeDto, userId: number) {
    const existingEmployee = await this.prisma.employee.findFirst({
      where: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    if (existingEmployee)
      throw new ConflictException('Employee already exists');

    return this.prisma.employee.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        userId: userId,
      },
    });
  }

  async updateEmployee(
    employeeId: number,
    dto: CreateEmployeeDto,
    userId: number,
  ) {
    const employee = await this.getEmployeeById(employeeId, userId);
    if (!employee) throw new NotFoundException('Employee not found');

    if (
      dto.firstName === employee.firstName &&
      dto.lastName === employee.lastName &&
      dto.gender === employee.gender
    )
      throw new ConflictException('No changes detected');

    const existingEmployee = await this.prisma.employee.findFirst({
      where: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    if (existingEmployee && existingEmployee.id !== employee.id)
      throw new ConflictException('Employee with this name already exists');

    return this.prisma.employee.update({
      where: {
        id: employee.id,
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
      },
    });
  }

  async deleteEmployee(employeeId: number, userId: number) {
    const employee = await this.getEmployeeById(employeeId, userId);

    if (!employee) throw new NotFoundException('Employee not found');

    return this.prisma.employee.delete({
      where: {
        id: employee.id,
      },
    });
  }
}
