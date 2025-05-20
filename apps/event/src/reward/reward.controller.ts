// apps/event/src/rewards/rewards.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RewardService } from './reward.service';
import { Reward } from './schemas/reward.schema';

@Controller('events/:eventId/rewards')
export class RewardController {
  constructor(private readonly svc: RewardService) {}

  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() dto: Partial<Reward>,
  ) {
    return this.svc.create(eventId, dto);
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.svc.findByEvent(eventId);
  }
}
