import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RoleType } from 'src/users/schemas/user.schema';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiBody({ schema: {
    example: { username: 'user1', password: '1234', role: 'USER' },
  }})
  async signUp(@Body() body: { username: string; password: string; role?: RoleType }) {
    return this.authService.signUp(body.username, body.password, body.role);
  }

  @Post('login')
  @ApiBody({ schema: {
    example: { username: 'user1', password: '1234' },
  }})
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }
}
