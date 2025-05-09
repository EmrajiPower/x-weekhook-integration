import { Controller, Get, Post, Query, Body, HttpCode } from '@nestjs/common';
import { TwitterService } from './x.service';
import { CrcDto } from './dto/crc.dto';

@Controller('webhook/x.service')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get()
  @HttpCode(200)
  healthCheck(@Query() query: CrcDto) {
    return this.twitterService.validateCrc(query.crc_token);
  }

  @Post()
  @HttpCode(200)
  async handleEvent(@Body() payload: any) {
    await this.twitterService.processEvent(payload);
    return 'OK';
  }
}