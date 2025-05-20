// apps/event/src/history/history.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from './schemas/history.schema';
import { HistoryService } from './history.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }])],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
