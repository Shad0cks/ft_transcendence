import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Channel, ChannelRestrictionType } from 'src/entities/channel.entity';
import { User } from 'src/entities/user.entity';

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

export class channelMessageDTO {
  id: number;
  message: string;
  sender: User;
  channel: Channel;
  created_at: Date;
}