import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почтовый адрес' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @ApiProperty({ example: '1234', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, { message: 'Минимальная длина пароля - 4 символа. Максимальная - 16.' })
  readonly password: string;

  @ApiProperty({ example: 'ivan', description: 'Псевдоним' })
  @IsString({ message: 'Должно быть строкой' })
  readonly username: string;
}