import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
    @ApiProperty({ description: 'Email пользователя', type: 'string', example: 'john.doe@example.com' })
    email: string;

    @ApiProperty({ description: 'Пароль пользователя', type: 'string', example: 'password123' })
    password: string;
}
