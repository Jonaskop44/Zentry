import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UserModule, AuthModule, AdminModule, ActivityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
