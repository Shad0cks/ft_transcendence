import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinChannelDTO {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  userNickname: string;

  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;

  @IsOptional()
  @IsString()
  password: string;
}
