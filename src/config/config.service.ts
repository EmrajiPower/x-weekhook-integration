import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ConfigService {
  get twitterConsumerSecret(): string {
    return process.env.X_API_SECRET!;
  }
  get notionToken(): string {
    return process.env.NOTION_TOKEN!;
  }
  get notionDatabaseId(): string {
    return process.env.NOTION_DB_ID!;
  }
}