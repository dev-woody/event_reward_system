import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventService } from '../event/event.service';
import { Reward, RewardDocument } from './schemas/reward.schema';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private model: Model<RewardDocument>,
    private eventsSvc: EventService,
  ) {}

  async create(eventId: string, dto: Partial<Reward>): Promise<Reward> {
    await this.eventsSvc.findOne(eventId);
    return this.model.create({ ...dto, event: new Types.ObjectId(eventId) });
  }

  findByEvent(eventId: string): Promise<Reward[]> {
    return this.model.find({ event: eventId }).exec();
  }
}
