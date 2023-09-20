import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule, SchedulerModule, EmailModule],
})
export class AppModule {}
