import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from './email.service';

@Injectable()
export class EmailDailyScheduler implements OnApplicationBootstrap {
  constructor(private readonly emailService: EmailService) {}
  private readonly logger = new Logger(EmailDailyScheduler.name);

  async onApplicationBootstrap() {
    // Wait about 30 seconds to make sure everything ready
    setTimeout(async () => {
      await this.handleCron();
      this.logger.log('Trigger cron when the application start!');
    }, 30000);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.emailService.runEmailBirthday();
    this.logger.log('Running daily task at 00:00 AM UTC!');
  }
}
