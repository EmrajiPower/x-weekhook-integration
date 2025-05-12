import { TwitterService } from './x/x.service';
import { ConfigService } from './config/config.service';
import * as crypto from 'crypto';

describe('TwitterService Test', () => {
  let service: TwitterService;

  beforeEach(() => {
    const mockConfigService = {
      twitterConsumerSecret: process.env.X_API_SECRET!,
    } as ConfigService;

    service = new TwitterService(mockConfigService, {} as any);
  });

  it('should generate valid CRC response token', () => {
    const crcToken = 'test_token';

    const expectedHmac = crypto.createHmac('sha256', process.env.X_API_SECRET!)
      .update(crcToken)
      .digest('base64');

    const expectedResponse = `sha256=${expectedHmac}`;

    const result = service.validateCrc(crcToken);
    expect(result).toBe(expectedResponse);
  });
});
