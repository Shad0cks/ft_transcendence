import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ChannelRestrictionDTO {
  @IsNotEmpty()
  @IsString()
  userNickname: string;

  @IsNotEmpty()
  @IsString()
  adminNickname: string;

  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  restriction: string;

  @IsNotEmpty()
  @IsDate()
  end: Date;
}
