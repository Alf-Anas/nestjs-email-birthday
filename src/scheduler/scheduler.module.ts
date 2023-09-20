import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerManager } from './scheduler.manager';

@Module({
  providers: [SchedulerService, SchedulerManager],
  exports: [SchedulerService, SchedulerManager],
})
export class SchedulerModule {}
