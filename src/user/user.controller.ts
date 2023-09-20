import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user data' })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Edit user data' })
  @ApiBody({ type: UpdateUserDto })
  updateUser(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.userService.updateUser(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remove user' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
