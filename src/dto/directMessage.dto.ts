import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class DirectMessageDTO {
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

  @IsOptional()
  sent_at: Date;
}
