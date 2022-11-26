import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFAtokenDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}
