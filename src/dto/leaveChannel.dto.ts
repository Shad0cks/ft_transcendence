import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveChannelDTO {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  userNickname: string;
}
