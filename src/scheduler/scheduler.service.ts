import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob(
    id: string,
    cronExpression: string,
    callback: () => Promise<void>,
  ) {
    const job = new CronJob(
      cronExpression,
      async () => {
        await callback();
      },
      null,
      false,
      'UTC',
    );

    this.schedulerRegistry.addCronJob(id, job);
    job.start();
    return job;
  }

  removeCronJob(id: string) {
    const job = this.schedulerRegistry.getCronJob(id);
    if (job) {
      job.stop();
      this.schedulerRegistry.deleteCronJob(id);
    }
  }
}
