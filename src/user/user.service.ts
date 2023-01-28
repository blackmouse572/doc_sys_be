import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prsima.service';
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

    delete user.password;
    return { user };
  }

  async findAll(): Promise<any[]> {
    return await this.prisma.user.findMany({
      select: {
        password: false,
      },
    });
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
    //TODO: verify password with salt

    const isAuthorized = argon2.verify(_user.password, password);
    delete _user.password;
    if (isAuthorized) {
      //TODO: use jwt to generate token
      return {
        user: _user,
      };
    }
    throw new HttpException({ error }, 401);
  }

  async getUserFullInfo(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
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
    delete user.password;
    return { user };
  }

  getJWToken(user: JwtUser) {
    const payload = { ...user };
    return this.jwtService.sign(payload);
  }
}
