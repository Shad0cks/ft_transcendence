import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChannelRestrictionType } from 'src/entities/channel.entity';

export class ChannelDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['public', 'protected', 'private'])
  restriction: ChannelRestrictionType;

  @IsOptional()
  @IsString()
  password: string;
}
