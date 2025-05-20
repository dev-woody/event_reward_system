// apps/event/src/events/events.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private model: Model<EventDocument>) {}

  create(dto: Partial<Event>): Promise<Event> {
    return this.model.create(dto);
  }

  findAll(): Promise<Event[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Event> {
    const ev = await this.model.findById(id).exec();
    if (!ev) throw new NotFoundException('Event not found');
    return ev;
  }
}
