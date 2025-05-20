import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RequestDocument = Request & Document;

@Schema({ timestamps: true })
export class Request {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const RequestSchema = SchemaFactory.createForClass(Request);
