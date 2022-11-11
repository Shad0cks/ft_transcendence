import { IsNotEmpty, IsString } from 'class-validator';

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
}
