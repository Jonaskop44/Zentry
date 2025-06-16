import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { compare } from 'bcrypt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new NotFoundException('User not found!');
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials!');

    return { id: user.id };
  }

  async generateTokens(user: User) {
    const payload: AuthJwtPayload = {
      id: user.id,
      sub: { username: user.username },
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.getUserByUsername(dto.username);
    if (!user) throw new NotFoundException('User not found!');
    const { accessToken, refreshToken } = await this.generateTokens(user);

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(user: User) {
    const userFromDb = await this.userService.getUserById(user.id);
    if (!userFromDb) throw new NotFoundException('User not found!');

    const { accessToken, refreshToken } = await this.generateTokens(userFromDb);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(userId: number, token: string) {
    const userFromDb = await this.userService.getUserById(userId);
    if (userFromDb) {
      const isTokenValid = await this.jwtService.verifyAsync(token, {
        secret: this.refreshTokenConfig.secret,
      });
      if (!isTokenValid) throw new UnauthorizedException('Invalid token');

      return userFromDb;
    }
  }
}
