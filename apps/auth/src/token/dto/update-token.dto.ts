import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
    @ApiProperty({ description: 'Идентификатор пользователя', type: 'number', example: 1 })
    user_id: number;

    @ApiProperty({ description: 'Токен обновления', type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' })
    refreshToken: string;
}
