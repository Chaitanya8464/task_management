import {
  IsHexColor,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  color!: string;
}