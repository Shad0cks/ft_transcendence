import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DirectMessageDTO {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  receiverNickname: string;

  @IsNotEmpty()
  @IsString()
  senderNickname: string;

  @IsOptional()
  sent_at: Date;
}
