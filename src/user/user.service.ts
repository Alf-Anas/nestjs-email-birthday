import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { AppDataSource } from 'config/typeorm.config';
import * as dayjs from 'dayjs';
import { SchedulerManager } from 'src/scheduler/scheduler.manager';
import { utcToCron } from 'utils';
import { EMAIL_TARGET, EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    private readonly schedulerManager: SchedulerManager,
    private readonly emailService: EmailService,
  ) {}
  async getAllUsers(): Promise<User[]> {
    const users = AppDataSource.manager.find(User);
    return users;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { offset, date } = this.getUTCOffset(
      createUserDto.birthday,
      createUserDto.location,
    );

    const user = AppDataSource.manager.create(User, {
      ...createUserDto,
      offset,
      reminder_time: date,
    });

    await AppDataSource.manager.save(user);
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user: User = await AppDataSource.manager.findOne(User, {
      where: {
        id,
      },
    });
    if (user) {
      const { offset, date } = this.getUTCOffset(
        updateUserDto.birthday,
        updateUserDto.location,
      );
      const updatedObj = {
        ...updateUserDto,
        offset,
        reminder_time: date,
      };
      const updated = await AppDataSource.manager.update(User, id, updatedObj);
      if (updated.affected > 0) {
        // Remove if scheduler exist, and create new scheduler for new birthday
        this.schedulerManager.removeScheduler(id);
        const currentTime = new Date();
        const userTime = new Date(date);
        userTime.setUTCFullYear(currentTime.getUTCFullYear());
        if (userTime > currentTime) {
          const cronTime = utcToCron(userTime.toUTCString());
          const sendEmailFunction = () => {
            const mUser = { ...user, ...updatedObj };
            this.emailService.sendEmailBirthday(
              EMAIL_TARGET,
              mUser as unknown as User,
            );
          };
          this.emailService.createScheduler(
            user.id,
            cronTime,
            sendEmailFunction,
          );
        }
      }
      return updated;
    } else {
      throw new NotFoundException(`User with id ${id} is not found!`);
    }
  }

  getUTCOffset(birthday: string, location: string) {
    let UTC_OFFSET = 0;
    try {
      UTC_OFFSET = dayjs().tz(location).utcOffset();
    } catch (err) {
      // If location string not in IANA format, the utc offset will be 0, it means the location will be ignore and reminder will be set in UTC time
      console.error(err);
    }

    const utcDate = new Date(birthday);
    const TIMEZONE_OFFSET = -1 * UTC_OFFSET;
    const LOCAL_9_AM = 60 * 9;
    utcDate.setMinutes(utcDate.getMinutes() + TIMEZONE_OFFSET + LOCAL_9_AM);

    return { offset: UTC_OFFSET, date: utcDate };
  }

  async deleteUser(id: string) {
    const deleted = await AppDataSource.manager.delete(User, id);
    if (deleted.affected > 0) {
      this.schedulerManager.removeScheduler(id);
    }
    return deleted;
  }
}
