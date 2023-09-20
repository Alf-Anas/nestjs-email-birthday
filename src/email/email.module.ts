import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { EmailDailyScheduler } from './email-daily-scheduler';

@Module({
  imports: [SchedulerModule],
  providers: [EmailService, EmailDailyScheduler],
  exports: [EmailService, EmailDailyScheduler],
})
export class EmailModule {}
