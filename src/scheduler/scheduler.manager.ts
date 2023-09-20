import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerManager {
  private dynamicSchedulers: Map<string, CronJob> = new Map();

  addScheduler(id: string, cronJob: CronJob) {
    this.dynamicSchedulers.set(id, cronJob);
  }

  removeScheduler(id: string) {
    const cronJob = this.dynamicSchedulers.get(id);
    if (cronJob) {
      cronJob.stop();
    }
    this.dynamicSchedulers.delete(id);
  }

  getScheduler(id: string): CronJob | undefined {
    return this.dynamicSchedulers.get(id);
  }

  getAllSchedulers(): Map<string, CronJob> {
    return this.dynamicSchedulers;
  }
}
