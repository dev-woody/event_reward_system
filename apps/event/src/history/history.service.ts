import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History, HistoryDocument } from './schemas/history.schema';

@Injectable()
export class HistoryService {
  constructor(@InjectModel(History.name) private historyModel: Model<HistoryDocument>) {}

  create(record: Partial<History>): Promise<History> {
    return this.historyModel.create(record);
  }
}
