import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Request, RequestSchema } from './schemas/request.schema';
import { EventModule } from '../event/event.module';
import { RewardModule } from '../reward/reward.module';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    EventModule,
    RewardModule,  // RewardsService export 포함된 모듈
    HistoryModule,  
  ],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
