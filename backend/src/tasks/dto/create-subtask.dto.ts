import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateSubtaskDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}