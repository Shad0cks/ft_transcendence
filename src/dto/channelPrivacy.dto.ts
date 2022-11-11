import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChannelPrivacyType } from 'src/entities/channel.entity';

export class ChannelPrivacyDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['public', 'protected', 'private'])
  privacy: ChannelPrivacyType;

  @IsOptional()
  @IsString()
  password: string;
}
