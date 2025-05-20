import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RequestService } from './request.service';
import { Model } from 'mongoose';
import { EventService } from 'src/event/event.service';
import { RewardService } from 'src/reward/reward.service';

describe('RequestsService', () => {
  let service: RequestService;
  let model: Model<Request>;

  const mockRequestModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  };

  const mockEventsService = {
    findOne: jest.fn().mockResolvedValue({ _id: 'eventId' }),
  };

  const mockRewardsService = {
    findByEvent: jest.fn().mockResolvedValue([{ type: 'POINT', amount: 100 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        { provide: getModelToken(Request.name), useValue: mockRequestModel },
        { provide: EventService, useValue: mockEventsService },
        { provide: RewardService, useValue: mockRewardsService },
      ],
    }).compile();

    service = module.get<RequestService>(RequestService);
    model = module.get<Model<Request>>(getModelToken(Request.name));
  });

  afterEach(() => jest.clearAllMocks());

  it('보상 요청 성공', async () => {
    mockRequestModel.findOne.mockResolvedValue(null);
    mockRequestModel.create.mockResolvedValue({
      event: 'eventId',
      userId: 'user123',
      status: 'PENDING',
    });

    const result = await service.create('eventId', 'user123');

    expect(mockEventsService.findOne).toHaveBeenCalledWith('eventId');
    expect(mockRequestModel.create).toHaveBeenCalled();
    expect(result.status).toBe('PENDING');
  });

  it('중복 요청 시 예외 발생', async () => {
    mockRequestModel.findOne.mockResolvedValue({ event: 'eventId', userId: 'user123' });

    await expect(service.create('eventId', 'user123')).rejects.toThrow('이미 요청된 이벤트입니다.');
  });

  it('전체 요청 조회', async () => {
    mockRequestModel.find.mockReturnValue({ exec: () => Promise.resolve([{ id: '1' }]) });

    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });

  it('요청 승인', async () => {
    const mockRequest = { status: 'PENDING', save: jest.fn(), event: 'eventId', userId: 'user123' };
    mockRequestModel.findById.mockResolvedValue(mockRequest);

    const result = await service.approve('id123');
    expect(mockRequest.save).toHaveBeenCalled();
    expect(result.status).toBe('APPROVED');
  });

  it('요청 거절', async () => {
    const mockRequest = { status: 'PENDING', save: jest.fn(), event: 'eventId', userId: 'user123' };
    mockRequestModel.findById.mockResolvedValue(mockRequest);

    const result = await service.reject('id123');
    expect(mockRequest.save).toHaveBeenCalled();
    expect(result.status).toBe('REJECTED');
  });
});
