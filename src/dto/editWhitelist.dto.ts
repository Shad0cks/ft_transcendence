import { IsNotEmpty, IsString } from 'class-validator';

export class EditWhitelistDTO {
  @IsNotEmpty()
  @IsString()
  userNickname: string;

  @IsNotEmpty()
  @IsString()
  channelName: string;
}
