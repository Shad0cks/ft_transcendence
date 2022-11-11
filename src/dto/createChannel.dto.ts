import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChannelPrivacyType } from 'src/entities/channel.entity';

export class CreateChannelDTO {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  creatorNickname: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['public', 'protected', 'private'])
  privacy: ChannelPrivacyType;

  @IsOptional()
  @IsString()
  password: string;
}
