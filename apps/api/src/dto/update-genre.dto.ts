import { ApiProperty } from "@nestjs/swagger";

export class UpdateGenreDto {
    @ApiProperty({ description: 'Идентификатор жанра', type: 'number', example: 1 })
    id: number;

    @ApiProperty({ description: 'Название жанра', type: 'string', example: 'Action' })
    name: string;
}
