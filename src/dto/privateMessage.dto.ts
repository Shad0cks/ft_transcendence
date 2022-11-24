import { IsNotEmpty, IsString } from 'class-validator';

export class PrivateMessageDTO{
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  receiverNickname: string;

  @IsNotEmpty()
  @IsString()
  senderNickname: string;
}
