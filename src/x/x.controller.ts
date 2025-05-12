import { Controller, Get, Post, Query, Body, HttpCode } from '@nestjs/common';
import { TwitterService } from './x.service';
import { CrcDto } from './dto/crc.dto';
import { NATGEO } from 'src/common/constants';

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
    // Fetch tweets directly from a user:
    const data = await this.twitterService.fetchUserTweets(NATGEO);
    console.log("[Step 1]",data)
    // Process the event payload
    await this.twitterService.processEvent(data);
    return { status: 'OK', message: 'Event processed successfully' };
  }
}
