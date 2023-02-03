import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AuthGuard } from '@nestjs/passport/dist';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req, @Response({ passthrough: true }) res) {
    try {
      const user = await this.userService.getUserFullInfo(req.user.user.id);

      const { username, UserWorkPlaceDetails } = user;
      const { department, role, organization } = UserWorkPlaceDetails[0] || {};
      const token = this.userService.getJWToken({
        department,
        role,
        organization,
        username,
      });
      const secretData = {
        token,
        refreshToken: '',
      };

      res.cookie('auth-cookie', secretData, { httpOnly: true });
      console.log('Login with user:', user);
      console.log('Login with token:', token);

      return { user };
    } catch (e) {
      console.log(e);
    }
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) user: CreateUserDto) {
    return await this.userService.create(user);
  }
}
