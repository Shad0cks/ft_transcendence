import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ChannelPrivacyType } from 'src/entities/channel.entity';

export class ChannelDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['public', 'protected', 'private'])
  privacy: ChannelPrivacyType;
}
