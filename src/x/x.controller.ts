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
    const crcResponse = this.twitterService.validateCrc(query.crc_token);
    return crcResponse;
  }

  @Post()
  @HttpCode(200)
  async handleEvent(@Body() payload: any) {
    // console.log('[Received Payload]:', JSON.stringify(payload, null, 2));

    // Process the event payload
    await this.twitterService.processEvent(payload);

    // Fetch tweets directly from a user, for example:
   await this.twitterService.fetchUserTweets('NatGeo');

    return { status: 'OK', message: 'Event processed successfully' };
  }
}
