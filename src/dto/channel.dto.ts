import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChannelDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['public', 'protected', 'private'])
  restriction: string;

  @IsOptional()
  @IsString()
  password: string;
}
