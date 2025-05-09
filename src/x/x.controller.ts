import { Controller, Get, Post, Query, Body, HttpCode } from '@nestjs/common';
import { TwitterService } from './x.service';
import { CrcDto } from './dto/crc.dto';

@Controller('webhook/x')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get()
  @HttpCode(200)
  healthCheck(@Query() query: CrcDto) {
    console.log('CRC called with:', query.crc_token);
    return this.twitterService.validateCrc(query.crc_token);
  }

  @Post()
  @HttpCode(200)
  async handleEvent(@Body() payload: any) {
    await this.twitterService.processEvent(payload);
    console.log('[Body]:', JSON.stringify(payload, null, 2));
    return 'OK';
  }
}