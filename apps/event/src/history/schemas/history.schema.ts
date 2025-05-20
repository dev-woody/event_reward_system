import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HistoryDocument = History & Document;

@Schema({ timestamps: true })
export class History {
  @Prop({ required: true }) userId: string;
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true }) event: Types.ObjectId;
  @Prop([{ type: String }]) rewardTypes: string[];
  @Prop([{ type: Number }]) rewardAmounts: number[];
}

export const HistorySchema = SchemaFactory.createForClass(History);
