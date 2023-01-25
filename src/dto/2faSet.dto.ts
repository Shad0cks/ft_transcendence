import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FaSetDTO {
  @IsBoolean()
  stat: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  data: string;
}
