import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prsima.service';
import PrismaHelper from 'src/shared/prisma.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import JwtUser from './entities/jwt-user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, username, phoneNumber } = createUserDto;
    //Check if user already exists
    const _users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
          {
            phoneNumber,
          },
        ],
      },
    });
    const existedError = {
      statusCode: 400,
      message: 'User already exists',
    };
    if (_users.length > 0) {
      throw new HttpException({ existedError }, 400);
    }

    //TODO: add salt and hash password
    const hashedPassword = await argon2.hash(createUserDto.password);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    PrismaHelper.exclude(user, [
      'password',
      'emailConfirmed',
      'emailConfirmCode',
      'resetPasswordCode',
      'phoneNumberConfirmCode',
    ]);
    return { user };
  }

  async findAll(): Promise<any[]> {
    const users: User[] = await this.prisma.user.findMany({});

    PrismaHelper.exclude<User, keyof User>(users, [
      'password',
      'resetPasswordCode',
      'emailConfirmCode',
      'phoneNumberConfirmCode',
    ]);

    return users;
  }

  async findMany(username: string, filter: Prisma.UserFindManyArgs) {
    filter.take = filter.take || 10;
    const users = await this.prisma.user.findMany({
      ...filter,
    });

    PrismaHelper.exclude<User, keyof User>(users, [
      'password',
      'emailConfirmed',
      'emailConfirmCode',
      'resetPasswordCode',
      'phoneNumberConfirmCode',
    ]);

    return {
      users,
      metadata: {
        total: users.length,
        offset: filter.skip,
        limit: filter.take,
      },
    };
  }

  async login(payload: LoginUserDto): Promise<any> {
    const { username, password } = payload;
    const _user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    const error = {
      statusCode: 401,
      message: 'Invalid username or password',
    };
    if (!_user) {
      throw new HttpException({ error }, 401);
    }
    const isAuthorized = await argon2.verify(_user.password, password);

    if (isAuthorized) {
      //TODO: use jwt to generate token
      PrismaHelper.exclude(_user, [
        'password',
        'emailConfirmed',
        'emailConfirmCode',
        'resetPasswordCode',
        'phoneNumberConfirmCode',
      ]);

      return {
        user: _user,
      };
    }
    throw new HttpException({ error }, 401);
  }

  async getUserFullInfo(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        User_Group: {
          select: {
            group: true,
          },
        },
        UserWorkPlaceDetails: {
          include: {
            department: true,
            organization: true,
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    } else {
      PrismaHelper.exclude<User, keyof User>(user, [
        'password',
        'emailConfirmed',
        'emailConfirmCode',
        'resetPasswordCode',
        'phoneNumberConfirmCode',
      ]);

      return user;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async findByEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    PrismaHelper.exclude<User, keyof User>(user, [
      'password',
      'emailConfirmed',
      'emailConfirmCode',
      'resetPasswordCode',
      'phoneNumberConfirmCode',
    ]);

    return { user };
  }

  getJWToken(user: JwtUser) {
    const payload = { ...user };
    return this.jwtService.sign(payload);
  }
}
