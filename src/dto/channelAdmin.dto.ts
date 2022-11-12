import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelAdminDTO {
  @IsNotEmpty()
  @IsString()
  userNickname: string;

  @IsNotEmpty()
  @IsString()
  channelName: string;
}
