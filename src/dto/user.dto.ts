import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class UserDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
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
