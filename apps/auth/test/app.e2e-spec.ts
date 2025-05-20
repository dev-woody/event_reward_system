import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('회원가입 → 로그인 → JWT 발급', async () => {
    const user = { username: 'e2euser', password: '1234' };

    const signup = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user);
    expect(signup.status).toBe(201);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user);
    expect(login.status).toBe(201);
    expect(login.body.access_token).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
