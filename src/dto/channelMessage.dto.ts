import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChannelMessageDTO {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  senderNickname: string;

  @IsOptional()
  sent_at: Date;
}
