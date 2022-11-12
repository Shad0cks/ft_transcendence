import { IsIn, IsNotEmpty, IsOptional, IsString, IsAlphanumeric } from 'class-validator';
import { ChannelPrivacyType } from 'src/entities/channel.entity';

export class CreateChannelDTO {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  creatorNickname: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['public', 'protected', 'private'])
  privacy: ChannelPrivacyType;

  @IsOptional()
  @IsString()
  password: string;
}
