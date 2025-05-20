import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export type RoleType = 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';


@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'USER', enum: ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'] })
  role: RoleType;
}

export const UserSchema = SchemaFactory.createForClass(User);
