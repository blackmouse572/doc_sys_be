import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { DirectFilterPipe, FilterDto } from 'src/shared';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll() {
    return this.userService.findAll();
  }
  @Get('/find')
  @UseGuards(JwtGuard)
  findUsers(
    @Req() req,
    @Query(new DirectFilterPipe<User, Prisma.UserWhereInput>(['email']))
    filter: FilterDto<Prisma.UserWhereInput>,
  ) {
    const { username } = req.user;
    return this.userService.findMany(username, filter.findOptions);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string, @Req() req) {
    if (id === 'me') {
      return this.userService.getUserFullInfo(req.user.username);
    }
    return this.userService.getUserFullInfo(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
