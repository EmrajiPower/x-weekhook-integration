import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { ConfigService } from '../config/config.service';
import { NotionService } from '../notion/notion.service';
import { Cron } from '@nestjs/schedule';
import { NATGEO } from '../common/constants';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);

  constructor(
    private config: ConfigService,
    private notion: NotionService,
  ) {}

  // Runs cron task every 10 minutes
  @Cron('0 */10 * * * *')
  async pollUserTweets() {
    try {
      const tweets = await this.fetchUserTweets(NATGEO);
      console.log('[Tweets Cron]:', tweets);
      await this.processEvent(tweets)
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

  async fetchUserTweets(xUser: string): Promise<any> {  
    try {
      const tweetsResponse = await axios.get(
        `https://api.twitter.com/2/users/${xUser}/tweets?tweet.fields=created_at&expansions=author_id&user.fields=name,username`,{
            headers: {
              Authorization: `Bearer ${process.env.X_API_TOKEN}`,
            }            
          },
      );

      this.logger.log(`Fetched tweets for user ${xUser}:`, tweetsResponse.data);
      return tweetsResponse.data;
    } catch (error) {
      this.logger.error('Error fetching user tweets:', error.response?.data || error.message);
      throw error;
    }
  }

  async processEvent(payload: any) {
    const tweets = payload.data;
    console.log("[Step 2]",tweets)
    if (Array.isArray(tweets) && tweets.length > 0) {
      await Promise.all(
        tweets.map(async (tweet) => {
          const data = {
            text: tweet.text || "empty",
            username: NATGEO || "empty",
            url: `https://twitter.com/${NATGEO}/status/${tweet.edit_history_tweet_ids[0]||0}`,
            created_at: tweet.created_at,
          };
  
          try {
            await this.notion.createPage(data);
          } catch (err) {
            this.logger.error('Notion API error', err);
          }
        }),
      );
    }
  }
}