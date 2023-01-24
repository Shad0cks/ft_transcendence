import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsAlphanumeric,
  MaxLength,
} from 'class-validator';
import { ChannelPrivacyType } from 'src/entities/channel.entity';

export class CreateChannelDTO {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MaxLength(10)
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
