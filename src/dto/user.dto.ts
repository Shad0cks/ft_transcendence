import {
  IsBase64,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
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
  @IsBase64()
  avatar: string;

  @IsOptional()
  @Min(0)
  wins: number;

  @IsOptional()
  @Min(0)
  losses: number;
}
