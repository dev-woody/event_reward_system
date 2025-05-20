import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { RewardService } from './reward.service';
import { EventService } from 'src/event/event.service';

describe('RewardsService', () => {
  let service: RewardService;
  let rewardModel: Model<Reward>;

  const mockRewardModel = {
    create: jest.fn(),
    find: jest.fn(),
  };

  const mockEventsService = {
    findOne: jest.fn().mockResolvedValue({ _id: 'eventId' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardService,
        { provide: getModelToken(Reward.name), useValue: mockRewardModel },
        { provide: EventService, useValue: mockEventsService },
      ],
    }).compile();

    service = module.get<RewardService>(RewardService);
    rewardModel = module.get<Model<Reward>>(getModelToken(Reward.name));
  });

  afterEach(() => jest.clearAllMocks());

  it('보상 생성 성공', async () => {
    const dto = { type: 'POINT', amount: 100 };
    mockRewardModel.create.mockResolvedValue({ ...dto, event: new Types.ObjectId() });

    const result = await service.create('eventId', dto);
    expect(mockEventsService.findOne).toHaveBeenCalledWith('eventId');
    expect(mockRewardModel.create).toHaveBeenCalled();
    expect(result.type).toBe('POINT');
  });

  it('이벤트별 보상 조회', async () => {
    const mockResult = [{ type: 'COUPON', amount: 1 }];
    mockRewardModel.find.mockReturnValue({ exec: () => Promise.resolve(mockResult) });

    const result = await service.findByEvent('eventId');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('COUPON');
  });
});
