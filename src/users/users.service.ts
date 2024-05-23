import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from 'typeorm';
import { ConflictException } from '@nestjs/common';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hash = await bcrypt.hash(password, 10);
    try {
      const newUser = await this.userRepository.save({
        ...createUserDto,
        password: hash,
      });
      delete newUser.password;
      return newUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username существует',
          );
        }
      }
    }
  }

  async getWishesWithUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    return user.wishes;
  }
  async findOne(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }
  async getWishes(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    return user.wishes;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  async findMany(str: string) {
    return await this.userRepository.find({
      where: [{ username: str } || { email: str }],
    });
  }
  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    return user;
  }
}
