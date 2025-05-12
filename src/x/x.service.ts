import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { ConfigService } from '../config/config.service';
import { NotionService } from '../notion/notion.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);

  constructor(
    private config: ConfigService,
    private notion: NotionService,
  ) {}

  // Runs cron task every 10 minutes
  @Cron(CronExpression.EVERY_10_MINUTES)
  async pollUserTweets() {
    try {
      const tweets = await this.fetchUserTweets('NatGeo');
      console.log('Tweets fetched on interval:', tweets);
    } catch (err) {
      console.error('Error during scheduled tweet fetch:', err.message);
    }
  }

  validateCrc(crcToken: string) {
    const hmac = crypto.createHmac('sha256', this.config.twitterConsumerSecret)
      .update(crcToken)
      .digest('base64');
    return `sha256=${hmac}`;
  }

  async fetchUserTweets(username: string): Promise<any> {  
    try {
      const tweetsResponse = await axios.get(
        `https://api.twitter.com/2/users/17471979/tweets?tweet.fields=created_at`,{
            headers: {
              Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAAHeY0wEAAAAALCrNC6CLyu7UCmlwRr5BaNNZmSY%3DVMjvBvAbWjiTP0SQWowo8ApDabWb4ndSs2A9zE3IYtyZhklrKM`,
            }            
          },
      );

      this.logger.log(`Fetched tweets for user ${username}:`, tweetsResponse.data);
      return tweetsResponse.data;
    } catch (error) {
      this.logger.error('Error fetching user tweets:', error.response?.data || error.message);
      throw error;
    }
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