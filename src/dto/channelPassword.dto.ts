import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelPasswordDTO {
  @IsNotEmpty()
  @IsString()
  channel: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
