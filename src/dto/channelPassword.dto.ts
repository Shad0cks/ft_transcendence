import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChannelPasswordDTO {
  @IsNotEmpty()
  @IsString()
  channel: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  password: string;
}
