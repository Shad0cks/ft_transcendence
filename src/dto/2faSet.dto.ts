import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class FaSetDTO {
  @IsBoolean()
  stat: boolean;

  @IsNotEmpty()
  @IsString()
  data: string;
}
