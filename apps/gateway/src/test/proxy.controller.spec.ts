import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ProxyController } from 'src/proxy/proxy.controller';

describe('ProxyController', () => {
  let controller: ProxyController;
  let httpService: HttpService;

  const mockHttpService = {
    request: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProxyController],
      providers: [{ provide: HttpService, useValue: mockHttpService }],
    }).compile();

    controller = module.get<ProxyController>(ProxyController);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should proxy auth route', async () => {
    const mockReq: any = {
      method: 'POST',
      originalUrl: '/auth/signup',
      body: { username: 'test' },
      headers: {},
    };
    const mockRes: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    mockHttpService.request.mockReturnValueOnce(of({ status: 201, data: { ok: true } }));

    await controller.proxyToAuth(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.send).toHaveBeenCalledWith({ ok: true });
  });

  it('should proxy event route with guards (bypassed here)', async () => {
    const mockReq: any = {
      method: 'GET',
      originalUrl: '/event/events',
      body: {},
      headers: {},
    };
    const mockRes: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    mockHttpService.request.mockReturnValueOnce(of({ status: 200, data: [{ id: 1 }] }));

    await controller.proxyToEvent(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith([{ id: 1 }]);
  });
});
