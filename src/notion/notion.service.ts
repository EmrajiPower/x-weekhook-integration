import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { ConfigService } from '../config/config.service';

@Injectable()
export class NotionService {
  private notion: Client;

  constructor(private config: ConfigService) {
    this.notion = new Client({ auth: this.config.notionToken });
  }

  async createPage({ text, username, url, timestamp }: any) {
    return this.notion.pages.create({
      parent: { database_id: this.config.notionDatabaseId },
      properties: {
        Title: { title: [{ text: { content: text } }] },
        Username: { rich_text: [{ text: { content: username } }] },
        URL: { url },
        "Date": { date: { start: new Date(timestamp).toISOString() } },
      },
    });
  }
}