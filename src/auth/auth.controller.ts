import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AuthGuard } from '@nestjs/passport/dist';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.getUserFullInfo(req.user.user.username);

    const { username, UserWorkPlaceDetails, email } = user;
    const { department, role, organization } = UserWorkPlaceDetails[0] || {};
    const token = this.userService.getJWToken({
      department,
      role,
      organization,
      username,
      email,
    });
    const secretData = {
      token,
      refreshToken: '',
    };
    //Set cookie and auth header
    res.cookie('auth-cookie', secretData, { httpOnly: true });
    res.setHeader('Authorization', `Bearer ${token}`);
    console.log('Set cookie and auth header', res.getHeader('Authorization'));

    return { user };
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @Get('token')
  @UseGuards(JwtGuard)
  async getTokenData(@Request() r, @Res({ passthrough: true }) res: Response) {
    //return user token and refresh token

    const user = await this.userService.getUserFullInfo(r.user.username);
    const { username, UserWorkPlaceDetails, email } = user;
    const { department, role, organization } = UserWorkPlaceDetails[0] || {};
    const token = this.userService.getJWToken({
      department,
      role,
      organization,
      username,
      email,
    });

    const secretData = {
      token,
      refreshToken: '',
    };

    return secretData;
  }
}
