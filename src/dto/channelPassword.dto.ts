import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelPasswordDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
