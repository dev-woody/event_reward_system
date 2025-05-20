// apps/auth/test/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn().mockResolvedValue({ username: 'test', password: 'hashed', role: 'USER' }),
      findByUsername: jest.fn().mockResolvedValue({ username: 'test', password: '$2b$10$HashedPassword', role: 'USER', _id: '123' }),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('회원가입 성공', async () => {
    const user = await authService.signUp('test', 'password');
    expect(user).toBeDefined();
    expect(usersService.create).toHaveBeenCalled();
  });

  it('로그인 성공 → JWT 반환', async () => {
    const result = await authService.login('test', 'password');
    expect(result.access_token).toBe('fake-jwt-token');
  });
});
