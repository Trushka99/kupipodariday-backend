import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find')
  findMany(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
  @Get('me/wishes')
  getMyrWishes(@Req() req) {
    return this.usersService.getWishes(req.user.id);
  }
  @Get(':username/wishes')
  getWishesWithUsername(@Param('username') username: string) {
    return this.usersService.getWishesWithUsername(username);
  }
  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @Get('me')
  getCurrentUser(@Req() req): Promise<User> {
    return this.usersService.findOne(req.user.id);
  }
}
