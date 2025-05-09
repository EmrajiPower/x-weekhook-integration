import { Module } from '@nestjs/common';
import { NotionService } from './notion.service';
import { ConfigService } from '../config/config.service';

@Module({
  providers: [NotionService, ConfigService],
  exports: [NotionService],
})
export class NotionModule {}
