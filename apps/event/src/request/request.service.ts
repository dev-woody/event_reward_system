import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Request, RequestDocument } from './schemas/request.schema';
import { EventService } from '../event/event.service';
import { RewardService } from '../reward/reward.service';
import { HistoryService } from '../history/history.service';

@Injectable()
export class RequestService {  
  async findByUser(userId: string): Promise<Request[]> {
    return this.model.find({ userId }).exec();
  }

  constructor(
    @InjectModel(Request.name) private model: Model<RequestDocument>,
    private eventSvc: EventService,
    private rewardSvc: RewardService,
    private historySvc: HistoryService,

  ) {}

  async create(eventId: string, userId: string): Promise<Request> {
    await this.eventSvc.findOne(eventId);
    const existing = await this.model.findOne({ event: eventId, userId });
    if (existing) throw new BadRequestException('이미 요청된 이벤트입니다.');
    return this.model.create({ event: new Types.ObjectId(eventId), userId });
  }

  async findAll(): Promise<Request[]> {
    return this.model.find().exec();
  }

  async approve(id: string, autoIssue = false): Promise<Request> {
    const req = await this.model.findById(id);
    if (!req) throw new NotFoundException();

    req.status = 'APPROVED';
    await req.save();

    if (autoIssue) {
      const rewards = await this.rewardSvc.findByEvent(req.event.toString());
      const types = rewards.map(r => r.type);
      const amounts = rewards.map(r => r.amount);

      await this.historySvc.create({
        userId: req.userId,
        event: req.event,
        rewardTypes: types,
        rewardAmounts: amounts,
      });
    }

    return req;
  }

  async reject(id: string): Promise<Request> {
    const req = await this.model.findById(id);
    if (!req) throw new NotFoundException();
    req.status = 'REJECTED';
    await req.save();
    return req;
  }
}
