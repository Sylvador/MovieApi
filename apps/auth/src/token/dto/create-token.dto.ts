import { ApiProperty } from "@nestjs/swagger";

export class CreateTokenDto {
    @ApiProperty({ description: 'Идентификатор пользователя', type: 'number', example: 1 })
    userId: number;

    @ApiProperty({ description: 'Email пользователя', type: 'string', example: 'john.doe@example.com' })
    email: string;

    @ApiProperty({ description: 'Имя пользователя', type: 'string', example: 'John Doe' })
    username: string;

    @ApiProperty({ description: 'Флаг, указывающий, является ли пользователь администратором', type: 'boolean', example: false })
    isAdmin: boolean;
}
