import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ChannelMessageDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
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
