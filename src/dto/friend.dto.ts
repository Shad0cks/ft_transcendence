import { IsNotEmpty, IsString } from 'class-validator';

export class FriendDTO {
  @IsNotEmpty()
  @IsString()
  nickname: string;
}
