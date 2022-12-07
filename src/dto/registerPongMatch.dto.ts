import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterPongMatchDTO {
  @IsNotEmpty()
  @IsString()
  user1Nickname: string;

  @IsNotEmpty()
  @IsString()
  user2Nickname: string;

  @IsNotEmpty()
  @IsNumber()
  user1Score: number;

  @IsNotEmpty()
  @IsNumber()
  user2Score: number;
}
