import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HandleException } from 'src/utils/exceptions/exceptionsHelper';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.create(createUserDto);
    } catch (err) {
      HandleException(err);
      throw new BadRequestException(err.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/all')
  async findAllUsers() {
    try {
      return this.userService.findAll();
    } catch (err) {
      throw err;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/find/:userId')
  async findUserById(@Param('userId') userId: string) {
    try {
      return this.userService.findOne(userId);
    } catch (err) {
      throw err;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Patch('/update')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    try {
      return this.userService.update(updateUserDto);
    } catch (err) {
      throw err;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete('delete/:userId')
  async deleteUser(@Param('userId') userId: string) {
    try {
      return this.userService.remove(userId);
    } catch (err) {
      throw err;
    }
  }
}
