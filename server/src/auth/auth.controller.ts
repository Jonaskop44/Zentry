import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { LoginDto } from './dto/auth.dto';
import { LoacalAuthGuard } from 'src/guard/local-auth.guard';
import { RefreshAuthGuard } from 'src/guard/refresh-jwt-auth.guard';
import { Response as ExpressResponse } from 'express';
import * as ms from 'ms';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LoacalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    const { user, tokens } = await this.authService.login(dto);

    const accessTokenExpiry = ms(
      process.env.JWT_EXPIRES_IN as unknown as number,
    );
    const refreshTokenExpiry = ms(
      process.env.REFRESH_EXPIRES_IN as unknown as number,
    );

    //Set Cookies
    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(accessTokenExpiry),
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(refreshTokenExpiry),
    });

    return user;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Response({ passthrough: true }) reponse: ExpressResponse) {
    reponse.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    reponse.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { success: true };
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(200)
  async refreshToken(
    @Request() request,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    const tokens = await this.authService.refreshToken(request.user);

    const accessTokenExpiry = ms(
      process.env.JWT_EXPIRES_IN as unknown as number,
    );
    const refreshTokenExpiry = ms(
      process.env.REFRESH_EXPIRES_IN as unknown as number,
    );

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(accessTokenExpiry),
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(refreshTokenExpiry),
    });

    return { success: true };
  }
}
