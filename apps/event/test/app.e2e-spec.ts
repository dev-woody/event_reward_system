import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Event e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let createdEventId: string;

  it('이벤트 등록', async () => {
    const res = await request(app.getHttpServer())
      .post('/events')
      .send({
        name: '출석이벤트',
        condition: 'login_3days',
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
    expect(res.status).toBe(201);
    createdEventId = res.body._id;
  });

  it('보상 등록', async () => {
    const res = await request(app.getHttpServer())
      .post(`/events/${createdEventId}/rewards`)
      .send({
        type: 'POINT',
        amount: 100,
      });
    expect(res.status).toBe(201);
    expect(res.body.type).toBe('POINT');
  });

  afterAll(async () => {
    await app.close();
  });
});
