import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  IsAlphanumeric,
  MaxLength,
} from 'class-validator';

export class UserDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MaxLength(10)
  nickname: string;

  @IsOptional()
  @IsBoolean()
  twofa_enabled: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  twofa_secret: string;

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

export class Usersocket {
  nickname: string;
  socketid: string;
}
