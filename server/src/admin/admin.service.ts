import { Injectable } from '@nestjs/common';
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

  async createEmployee(dto: CreateEmployeeDto) {
    
  }

}
