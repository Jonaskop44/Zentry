import { ConflictException, Injectable } from '@nestjs/common';
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
        userId: userId,
      },
    });
  }
}
