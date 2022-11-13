import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  IsAlphanumeric,
} from 'class-validator';

export class UserDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  nickname: string;

  @IsOptional()
  @IsBoolean()
  twofa_enabled: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @Min(0)
  wins: number;

  @IsOptional()
  @Min(0)
  losses: number;
}

export class Usersocket{
  nickname: string;
  socketid: string;
}