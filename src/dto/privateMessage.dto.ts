import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PrivateMessageDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  message: string;

  @IsNotEmpty()
  @IsString()
  receiverNickname: string;

  @IsNotEmpty()
  @IsString()
  senderNickname: string;
}
