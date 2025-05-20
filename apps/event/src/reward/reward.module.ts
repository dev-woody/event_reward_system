import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { EventModule } from '../event/event.module';
import { Reward, RewardSchema } from './schemas/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    EventModule,
  ],
  providers: [RewardService],
  controllers: [RewardController],
  exports: [RewardService],

})
export class RewardModule {}
