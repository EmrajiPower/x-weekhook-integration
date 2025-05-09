import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '../config/config.service';
import { NotionService } from '../notion/notion.service';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);

  constructor(
    private config: ConfigService,
    private notion: NotionService,
  ) {}

  validateCrc(crcToken: string): { response_token: string } {
    const hmac = crypto.createHmac('sha256', this.config.twitterConsumerSecret)
      .update(crcToken)
      .digest('base64');
    return { response_token: `sha256=${hmac}` };
  }

  async processEvent(payload: any) {
    const tweet = payload.tweet_create_events?.[0];
    if (!tweet || tweet.retweeted_status_id) return;
    const keywords = ['#nestjs', '#notion'];
    if (!keywords.some(k => tweet.text.includes(k))) return;

    const data = {
      text: tweet.text,
      username: tweet.user.screen_name,
      url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
      created_at: tweet.created_at,
    };

    try {
      await this.notion.createPage(data);
    } catch (err) {
      this.logger.error('Notion API error', err);
    }
  }
}