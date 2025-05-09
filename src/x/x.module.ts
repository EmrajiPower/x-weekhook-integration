import { Module } from '@nestjs/common';
import { TwitterController } from './x.controller';
import { TwitterService } from './x.service';
import { NotionModule } from '../notion/notion.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [NotionModule],
  controllers: [TwitterController],
  providers: [TwitterService, ConfigService],
})
export class TwitterModule {}
