import { IsString } from 'class-validator';

export class CrcDto {
  @IsString()
  crc_token: string;
}