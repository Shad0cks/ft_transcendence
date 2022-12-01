import { IsNotEmpty, IsString } from 'class-validator';

export class BlockedDTO {
  @IsNotEmpty()
  @IsString()
  nickname: string;
}
