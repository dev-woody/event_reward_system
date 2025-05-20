// apps/event/src/requests/requests.controller.ts
import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
import { RequestService } from './request.service';
import { Request as ReqEntity } from './schemas/request.schema';

@Controller('requests')
export class RequestController {
  constructor(private readonly svc: RequestService) {}

  @Post()
  create(@Body() body: { eventId: string; userId: string }): Promise<ReqEntity> {
    return this.svc.create(body.eventId, body.userId);
  }

  @Get()
  findAll(@Req() req): Promise<ReqEntity[]> {
    return this.svc.findAll();
  }

  @Post(':id/approve')
  approve(@Param('id') id: string): Promise<ReqEntity> {
    return this.svc.approve(id, true);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string): Promise<ReqEntity> {
    return this.svc.reject(id);
  }
}
