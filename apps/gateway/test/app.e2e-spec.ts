import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Gateway e2e', () => {
  let app: INestApplication;

  const user = { username: 'flowuser', password: '1111' };
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('auth → 회원가입 및 로그인 → 토큰 발급', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send(user);

    const login = await request(app.getHttpServer()).post('/auth/login').send(user);
    token = login.body.access_token;
    expect(token).toBeDefined();
  });

  it('event → 요청 시 JWT 없으면 401', async () => {
    const res = await request(app.getHttpServer()).get('/event/events');
    expect(res.status).toBe(401);
  });

  it('event → JWT 포함 요청 시 성공', async () => {
    const res = await request(app.getHttpServer())
      .get('/event/events')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
