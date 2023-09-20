import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [SchedulerModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
