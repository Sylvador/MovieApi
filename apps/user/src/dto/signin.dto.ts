import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
    @ApiProperty({ description: 'Email пользователя', type: 'string', example: 'john.doe@example.com' })
    readonly email: string;

    @ApiProperty({ description: 'Пароль пользователя', type: 'string', example: 'password123' })
    readonly password: string;
}
