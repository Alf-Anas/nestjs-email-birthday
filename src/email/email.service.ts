import { Injectable, Logger } from '@nestjs/common';
import { AppDataSource } from 'config/typeorm.config';
import { User } from 'src/user/entity/user.entity';
import axios from 'axios';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { SchedulerManager } from 'src/scheduler/scheduler.manager';
import { utcToCron } from 'utils';

const SEND_EMAIL_URL =
  'https://email-service.digitalenvision.com.au/send-email';
export const EMAIL_TARGET = 'test@digitalenvision.com.au';

@Injectable()
export class EmailService {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly schedulerManager: SchedulerManager,
  ) {}
  private readonly logger = new Logger(EmailService.name);

  createScheduler(id: string, cronTime: string, task: () => void) {
    const cronJob = this.schedulerService.addCronJob(id, cronTime, async () =>
      task(),
    );
    this.schedulerManager.addScheduler(id, cronJob);
    this.logger.log(
      `Send email birthday for ID ${id} scheduled at ${cronTime}.`,
    );
  }

  async getListTodayBirthday() {
    const currentDate = new Date();
    const query = AppDataSource.createQueryBuilder()
      .select()
      .from(User, 'user')
      .where(
        `EXTRACT(MONTH FROM reminder_time) = :currentMonth AND EXTRACT(DAY FROM reminder_time) = :currentDay`,
        {
          currentMonth: currentDate.getUTCMonth() + 1,
          currentDay: currentDate.getUTCDate(),
        },
      );
    const users: User[] = await query.getRawMany();
    this.logger.log('Get list all today birthday!');
    return users;
  }

  async sendEmailBirthday(email: string, user: User) {
    try {
      const body = {
        email,
        message: `Hey, ${user.first_name} ${user.last_name} it's your birthday`,
      };
      this.logger.log(`Send email to ${user.first_name} ${user.last_name}...`);
      const response = await axios.post(SEND_EMAIL_URL, body);
      const data = response.data;
      this.logger.log(
        `Send email to ${user.first_name} ${user.last_name} success!`,
      );
      this.schedulerManager.removeScheduler(user.id);
      this.schedulerService.removeCronJob(user.id);
      return data;
    } catch (error) {
      this.logger.error(error);
      const currentTime = new Date();
      const fiveMinutesLater = new Date(currentTime.getTime() + 5 * 60 * 1000);
      const cronTime = utcToCron(fiveMinutesLater.toUTCString());

      const sendEmailFunction = () => {
        this.sendEmailBirthday(EMAIL_TARGET, user);
      };
      this.createScheduler(user.id, cronTime, sendEmailFunction);
      this.logger.log(
        `Failed to send email to ${user.first_name} ${user.last_name},  Will Try Again in 5 minutes!`,
      );
    }
  }

  async runEmailBirthday() {
    const listUser = await this.getListTodayBirthday();
    const currentTime = new Date();
    this.logger.log(`currentTime: ${currentTime}`);

    listUser.forEach((user) => {
      const userTime = new Date(user.reminder_time);
      userTime.setUTCFullYear(currentTime.getUTCFullYear());
      if (userTime > currentTime) {
        const cronTime = utcToCron(userTime.toUTCString());
        const sendEmailFunction = () => {
          this.sendEmailBirthday(EMAIL_TARGET, user);
        };
        this.createScheduler(user.id, cronTime, sendEmailFunction);
      }
    });
  }
}
