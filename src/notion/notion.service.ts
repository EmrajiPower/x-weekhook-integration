import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { ConfigService } from '../config/config.service';

@Injectable()
export class NotionService {
  private notion: Client;

  constructor(private config: ConfigService) {
    this.notion = new Client({ auth: this.config.notionToken });
  }

  async createPage({ text, username, url, created_at }: any) {
    console.log("[Step 3]",{ text, username, url, created_at })
    return this.notion.pages.create({
      parent: { database_id: this.config.notionDatabaseId },
      properties: {
        title: { title: [{ text: { content: text } }] },
        username: { rich_text: [{ text: { content: username } }] },
        url: { url },
        "created_at": { date: { start: new Date(created_at).toISOString() } },
      },
    });
  }
}